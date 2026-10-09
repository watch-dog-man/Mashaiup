"""
Transition planning: for an ordered pair (A -> B) decide *how* to move between
them — where A leaves, where B enters, how long the blend is, whether a clean
beatmatch is possible, how to phase-align on beats/phrases, and which effects
serve the transition.

Quality principles baked in here:
  * Only stretch B's short overlap head, and only within the allowed limit — the
    bodies of tracks stay at native tempo (preserves quality/pitch).
  * Snap the exit and entry to phrase (8-bar) boundaries so blends are musical.
  * If a clean beatmatch isn't possible, don't force a bad time-stretch — fall
    back to a filter/echo transition on a phrase boundary.
  * Never overlap two full-energy bass sections (the EQ engine bass-swaps).
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Optional

import numpy as np

from .analyzer import TrackAnalysis
from .beatgrid import nearest_beat, nearest_phrase
from .config import MixSettings
from .key_detection import camelot_compatibility, semitone_distance
from .utils import clamp, get_logger, safe_float

log = get_logger()


@dataclass
class TransitionPlan:
    # indices are into the ordered analyses list (pos, pos+1)
    from_title: str
    to_title: str
    technique: str                 # harmonic_blend | eq_blend | creative_cut | quick_cut
    out_start: float               # time in A where the blend begins (s)
    overlap: float                 # blend length (s)
    in_start: float                # time in B first heard (s, its mix-in)
    in_body_start: float           # time in B where solo body continues after blend
    stretch_ratio: float           # multiply B's head by this to beatmatch A (1.0 = none)
    beatmatched: bool
    align_offset: float            # fine offset (s) to phase-align B under A
    target_bpm: float              # tempo of the blend region
    key_compat: float
    semitone_hint: int
    effects: dict = field(default_factory=dict)
    reason: str = ""

    def to_dict(self) -> dict:
        return {
            "from": self.from_title, "to": self.to_title,
            "technique": self.technique,
            "out_start": round(safe_float(self.out_start), 2),
            "overlap": round(safe_float(self.overlap), 2),
            "in_start": round(safe_float(self.in_start), 2),
            "in_body_start": round(safe_float(self.in_body_start), 2),
            "stretch_ratio": round(safe_float(self.stretch_ratio), 4),
            "beatmatched": self.beatmatched,
            "target_bpm": round(safe_float(self.target_bpm), 1),
            "key_compat": round(safe_float(self.key_compat), 2),
            "effects": self.effects,
            "reason": self.reason,
        }


def _in_vocal_region(t: float, regions: list, margin: float = 1.0) -> bool:
    """Check if time t falls inside any vocal region (with margin)."""
    for r in regions:
        if r[0] - margin <= t <= r[1] + margin:
            return True
    return False


def _energy_at(t: float, energy_curve: np.ndarray, duration: float) -> float:
    """Sample the energy curve at time t (0..1)."""
    if duration <= 0 or len(energy_curve) == 0:
        return 0.5
    idx = t / duration * (len(energy_curve) - 1)
    idx = clamp(idx, 0, len(energy_curve) - 1)
    lo = int(idx)
    hi = min(lo + 1, len(energy_curve) - 1)
    frac = idx - lo
    return float(energy_curve[lo] * (1 - frac) + energy_curve[hi] * frac)


def _avoid_vocal_region(
    t: float, regions: list, phrase_times: np.ndarray,
    min_t: float, max_t: float, direction: str = "before",
) -> float:
    """If t is inside a vocal region, try nearby phrase boundaries that aren't."""
    if not regions or not _in_vocal_region(t, regions):
        return t
    candidates = []
    for pt in phrase_times:
        if min_t <= pt <= max_t and not _in_vocal_region(pt, regions):
            candidates.append((abs(pt - t), pt))
    if candidates:
        candidates.sort()
        return float(candidates[0][1])
    return t


def _is_sustained_vocal(t: float, regions: list, min_len: float = 5.0) -> bool:
    """Check if t is inside a long vocal region (sustained singing, not just ad-libs)."""
    for r in regions:
        if r[0] - 1.0 <= t <= r[1] + 1.0 and (r[1] - r[0]) >= min_len:
            return True
    return False


def _energy_gradient(t: float, energy_curve: np.ndarray, duration: float) -> float:
    """Positive = energy rising (building up), negative = energy falling (post-drop)."""
    if duration <= 0 or len(energy_curve) < 3:
        return 0.0
    dt = duration * 0.02  # ~2% of track for gradient window
    e_before = _energy_at(max(0, t - dt), energy_curve, duration)
    e_after = _energy_at(min(duration, t + dt), energy_curve, duration)
    return e_after - e_before


def _near_vocal_end(t: float, regions: list, margin: float = 4.0) -> bool:
    """True if t falls just after a vocal region ends (ideal for transition)."""
    for r in regions:
        if r[1] <= t <= r[1] + margin:
            return True
    return False


def _vocal_depth(t: float, regions: list) -> float:
    """How deep into a vocal region t is: 0 if not in any, 0..1 based on
    position within the region (0.5 = dead center = worst)."""
    for r in regions:
        if r[0] <= t <= r[1]:
            length = r[1] - r[0]
            if length < 1:
                return 0.2
            pos = (t - r[0]) / length
            return 1.0 - 2 * abs(pos - 0.5)  # peaks at center
    return 0.0


def _best_exit_candidate(
    candidates: list[float],
    vocal_regions: list,
    energy_curve: np.ndarray,
    duration: float,
    ideal: float = 0.0,
    tight: bool = False,
) -> float:
    """Pick the best exit point for a smooth DJ transition.

    When tight=True (half-track mode), musical quality factors (energy dip,
    vocal avoidance, falling gradient) have significant weight alongside
    distance.  When tight=False, vocal/energy avoidance dominates.
    """
    if not candidates:
        return 0.0
    scored = []
    window = max(1.0, max(abs(pt - ideal) for pt in candidates)) if ideal > 0 else 1.0
    for pt in candidates:
        energy = _energy_at(pt, energy_curve, duration)
        grad = _energy_gradient(pt, energy_curve, duration)
        near_end = _near_vocal_end(pt, vocal_regions)
        v_depth = _vocal_depth(pt, vocal_regions)
        s = 0.0
        if tight and ideal > 0:
            norm_dist = abs(pt - ideal) / window
            s += norm_dist ** 2 * 5.0
            s += 2.0 if energy > 0.75 else (energy * 0.8)
            if near_end:
                s -= 0.8
            else:
                s += v_depth * 1.5
            s += clamp(grad, 0, 1) * 2.0
            s -= clamp(-grad, 0, 1) * 1.0
        else:
            if ideal > 0:
                s += (abs(pt - ideal) / duration) * 6.0
            s += 2.5 if energy > 0.7 else (energy * 1.0)
            if near_end:
                s -= 0.5
            else:
                s += v_depth * 2.0
            s += clamp(grad, 0, 1) * 2.0
            s -= clamp(-grad, 0, 1) * 0.3
        scored.append((s, pt))
    scored.sort()
    log.debug("exit-candidates ideal=%.1f tight=%s winner=%.1f (of %d)",
              ideal, tight, scored[0][1], len(scored))
    return float(scored[0][1])


def _phrase_exit(a: TrackAnalysis, min_tail: float, use_half: bool = False) -> float:
    """
    Choose where A starts leaving: near its mix-out point, snapped to a phrase
    boundary, guaranteeing at least `min_tail` seconds remain before the track
    ends so the whole blend has material.

    When use_half=True and the track has a repeating structure, exit near
    the half-point instead of the outro — the DJ plays only the first pass
    of the repeated material.
    """
    dur = a.duration
    vocals = a.features.vocal_regions or []
    ecurve = a.features.energy_curve

    if use_half and a.features.has_repeat and a.features.half_point > 0:
        ideal = a.features.half_point
        ideal = max(ideal, min_tail + 2.0)
        min_exit = min_tail + 2.0
        max_exit = dur - min_tail
        # collect phrase boundaries near half-point, plus downbeats at vocal region ends
        window = dur * 0.15  # wider window for better musical exit candidates
        candidates = set()
        for pt in a.beatgrid.phrase_times:
            if min_exit <= pt <= max_exit and abs(pt - ideal) <= window:
                candidates.add(float(pt))
        for vr in vocals:
            for boundary in (vr[0], vr[1]):
                if abs(boundary - ideal) <= window and min_exit <= boundary <= max_exit:
                    bt = nearest_beat(a.beatgrid.downbeat_times, boundary)
                    if min_exit <= bt <= max_exit:
                        candidates.add(float(bt))
        candidates = list(candidates)
        if not candidates:
            candidates.append(float(nearest_phrase(
                a.beatgrid.phrase_times, ideal, prefer="before")))
        log.debug("half-exit %s ideal=%.1f window=%.1f cands=%d",
                  a.title[:30], ideal, window, len(candidates))
        if vocals or len(ecurve) > 0:
            exit_t = _best_exit_candidate(candidates, vocals, ecurve, dur,
                                          ideal=ideal, tight=True)
        else:
            exit_t = min(candidates, key=lambda p: abs(p - ideal))
        if exit_t + min_tail > dur or exit_t <= 0:
            exit_t = max(0.0, ideal - 0.5)
        return float(exit_t)

    ideal = min(a.features.mix_out_point, dur - min_tail - 0.5)
    ideal = max(ideal, dur * 0.4)                      # don't leave absurdly early
    exit_t = nearest_phrase(a.beatgrid.phrase_times, ideal, prefer="before")
    if exit_t + min_tail > dur:                        # not enough tail -> pull back
        exit_t = nearest_phrase(a.beatgrid.phrase_times, dur - min_tail - 0.5, prefer="before")
    if exit_t + min_tail > dur or exit_t <= 0:         # phrase grid unusable -> raw
        exit_t = max(0.0, dur - min_tail - 0.5)
    # vocal & energy avoidance: slide away from vocal/climax sections
    if vocals:
        min_t = dur * 0.4
        max_t = dur - min_tail
        candidates = [float(pt) for pt in a.beatgrid.phrase_times
                      if min_t <= pt <= max_t]
        if candidates and len(ecurve) > 0:
            exit_t = _best_exit_candidate(candidates, vocals, ecurve, dur, ideal=ideal)
        else:
            exit_t = _avoid_vocal_region(
                exit_t, vocals, a.beatgrid.phrase_times,
                min_t=min_t, max_t=max_t,
            )
    return float(exit_t)


def _phrase_entry(b: TrackAnalysis) -> float:
    """Where B is first brought in: its mix-in point snapped to a phrase/downbeat."""
    entry = b.features.mix_in_point
    snapped = nearest_phrase(b.beatgrid.phrase_times, entry, prefer="after")
    if snapped <= 0 or snapped > b.duration * 0.4:
        snapped = nearest_beat(b.beatgrid.downbeat_times, entry) if len(b.beatgrid.downbeat_times) else entry
    snapped = float(max(0.0, snapped))
    vocals = b.features.vocal_regions or []
    ecurve = b.features.energy_curve
    if vocals:
        candidates = [float(pt) for pt in b.beatgrid.phrase_times
                      if 0.0 <= pt <= b.duration * 0.4]
        if candidates and len(ecurve) > 0:
            snapped = _best_exit_candidate(candidates, vocals, ecurve, b.duration, ideal=entry)
        else:
            snapped = _avoid_vocal_region(
                snapped, vocals, b.beatgrid.phrase_times,
                min_t=0.0, max_t=b.duration * 0.4, direction="after",
            )
    return snapped


def compute_deck_rates(ordered: list[TrackAnalysis], settings: MixSettings) -> list[float]:
    """
    Chained constant-rate beatmatch: pick a whole-track playback rate for each
    track so consecutive tracks share a tempo where possible, keeping every rate
    within the allowed stretch of the track's native tempo (so quality holds and
    there are never mid-track tempo jumps).  Octave (half/double) matches allowed.
    """
    settings = settings.resolved()
    maxs = settings.max_tempo_stretch
    n = len(ordered)
    if n == 0:
        return []
    rates = [1.0] * n

    if settings.target_bpm > 0:
        target = settings.target_bpm
        for i in range(n):
            b_bpm = max(1e-6, ordered[i].bpm)
            best_r, best_dev = 1.0, 1e9
            for factor in (0.5, 1.0, 2.0):
                r = (target * factor) / b_bpm
                dev = abs(np.log2(max(r, 1e-6)))
                if dev < best_dev:
                    best_dev, best_r = dev, r
            rates[i] = float(best_r)
        return rates

    for i in range(1, n):
        a_eff = ordered[i - 1].bpm * rates[i - 1]
        b_bpm = max(1e-6, ordered[i].bpm)
        best_r, best_dev = 1.0, 1e9
        for factor in (0.5, 1.0, 2.0):
            r = (a_eff * factor) / b_bpm
            dev = abs(np.log2(max(r, 1e-6)))
            if dev < best_dev:
                best_dev, best_r = dev, r
        rates[i] = float(np.clip(best_r, 1.0 - maxs, 1.0 + maxs))
    return rates


def plan_transition(
    a: TrackAnalysis,
    b: TrackAnalysis,
    settings: MixSettings,
    a_eff_bpm: float | None = None,
    b_eff_bpm: float | None = None,
    use_half: bool = False,
) -> TransitionPlan:
    settings = settings.resolved()
    a_eff_bpm = a_eff_bpm if a_eff_bpm else a.bpm
    b_eff_bpm = b_eff_bpm if b_eff_bpm else b.bpm

    # --- overlap length in beats -> seconds at A's effective tempo -------
    base_beats = settings.crossfade_beats
    beats = int(round(base_beats * (0.5 + settings.transition_intensity)))
    beats = int(clamp(beats, 8, 64))
    a_beat = 60.0 / max(a_eff_bpm, 60.0)
    overlap = beats * a_beat
    # keep overlap sane vs track lengths
    overlap = float(clamp(overlap, 4.0, min(a.duration * 0.5, b.duration * 0.5, 45.0)))

    out_start = _phrase_exit(a, min_tail=overlap, use_half=use_half)
    if use_half:
        pts = b.beatgrid.phrase_times
        in_start = float(pts[0]) if len(pts) and pts[0] > 0 else 0.0
    else:
        in_start = _phrase_entry(b)

    # --- beatmatch feasibility (using chained effective tempos) ----------
    # The render pre-stretches whole decks to these effective tempos, so no extra
    # stretch happens inside the blend.  Tracks are "beatmatched" when their
    # effective tempos already coincide (within ~2%) at some octave.
    octave_dev = min(abs(np.log2(max((a_eff_bpm * f) / max(b_eff_bpm, 1e-6), 1e-6)))
                     for f in (0.5, 1.0, 2.0))
    beatmatched = bool(octave_dev <= np.log2(1.02))
    stretch_ratio = 1.0                    # deck-level stretch already applied
    target_bpm = a_eff_bpm

    key_compat = camelot_compatibility(a.key.camelot, b.key.camelot)
    semitone_hint = semitone_distance(a.key.key, b.key.key)

    # --- fine phase alignment (align a B downbeat under an A beat) -------
    # after stretching, B's head beat period == a_beat; align first B downbeat
    # (>= in_start) so it lands exactly on A's beat at the blend start.
    align_offset = 0.0
    if beatmatched and len(b.beatgrid.downbeat_times):
        db = b.beatgrid.downbeat_times
        cand = db[db >= in_start]
        if len(cand):
            in_start = float(cand[0])

    # --- technique + effects selection ----------------------------------
    fx_amt = settings.effect_intensity
    effects: dict = {"eq_bass_swap": True}
    if beatmatched and key_compat >= 0.7:
        technique = "harmonic_blend"
        reason = f"Beatmatched harmonic blend over {beats} beats ({a.key.camelot}→{b.key.camelot})."
        if fx_amt > 0.5:
            effects["reverb_tail"] = {"decay": 1.2, "wet": 0.15 * fx_amt}
    elif beatmatched:
        technique = "eq_blend"
        overlap *= 0.85
        reason = f"Beatmatched EQ blend with extra low/mid separation (keys {a.key.camelot}/{b.key.camelot})."
        effects["outgoing_lowpass_sweep"] = {"f_start": 20000, "f_end": 400}
        if fx_amt > 0.4:
            effects["echo_throw"] = {"beats": 1, "feedback": 0.35, "wet": 0.3 * fx_amt}
    else:
        # tempo too far apart to beatmatch cleanly -> creative phrase transition
        overlap = float(clamp(overlap * 0.5, 3.0, 12.0))
        if settings.aggressive or fx_amt < 0.3:
            technique = "quick_cut"
            reason = "Tempos incompatible — clean cut on a phrase boundary."
        else:
            technique = "creative_cut"
            reason = "Tempos incompatible — filter-sweep + echo throw over a phrase boundary."
            effects["outgoing_lowpass_sweep"] = {"f_start": 18000, "f_end": 250}
            effects["echo_throw"] = {"beats": 2, "feedback": 0.45, "wet": 0.4 + 0.3 * fx_amt}
            effects["reverb_tail"] = {"decay": 1.4, "wet": 0.2 + 0.2 * fx_amt}
        # re-snap exit with the shorter tail requirement
        out_start = _phrase_exit(a, min_tail=overlap, use_half=use_half)

    if settings.effect_intensity > 0.6 and technique in ("harmonic_blend", "eq_blend"):
        effects["stereo_glue"] = True

    in_body_start = in_start + overlap / max(stretch_ratio, 1e-6)

    return TransitionPlan(
        from_title=a.title, to_title=b.title, technique=technique,
        out_start=out_start, overlap=overlap, in_start=in_start,
        in_body_start=in_body_start, stretch_ratio=stretch_ratio,
        beatmatched=beatmatched, align_offset=align_offset, target_bpm=target_bpm,
        key_compat=key_compat, semitone_hint=semitone_hint, effects=effects,
        reason=reason,
    )


def plan_all_transitions(
    ordered: list[TrackAnalysis], settings: MixSettings
) -> tuple[list[TransitionPlan], list[float]]:
    """Return (transition_plans, deck_rates) for an ordered set."""
    deck_rates = compute_deck_rates(ordered, settings)
    plans = []
    for i in range(len(ordered) - 1):
        a = ordered[i]
        use_half = (settings.is_half_track(a.path)
                    and a.features.has_repeat and a.features.half_point > 0)
        a_eff = a.bpm * deck_rates[i]
        b_eff = ordered[i + 1].bpm * deck_rates[i + 1]
        plans.append(plan_transition(a, ordered[i + 1], settings,
                                     a_eff_bpm=a_eff, b_eff_bpm=b_eff,
                                     use_half=use_half))
    return plans, deck_rates
