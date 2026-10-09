"""
Synthesised transition FX: risers, downlifters, impacts, reverse crashes and
sub drops — generated from pure math (no sample packs required).

Each generator returns a (2, n) float32 stereo array at the requested sample
rate, ready to be summed onto the crossfade region of the timeline.

The public entry point is `select_and_render_fx()`: given a TransitionPlan and
the two tracks' analyses it picks FX that complement the energy / style of the
transition and returns a list of (offset_samples, audio) tuples to layer in.
"""
from __future__ import annotations

import numpy as np
from scipy import signal as sig

from .utils import clamp, get_logger

log = get_logger()

EPS = 1e-9


# ---------------------------------------------------------------------------
# low-level generators
# ---------------------------------------------------------------------------

def _noise(n: int, stereo: bool = True, seed: int = 42) -> np.ndarray:
    rng = np.random.default_rng(seed)
    if stereo:
        return rng.standard_normal((2, n)).astype(np.float32)
    return rng.standard_normal(n).astype(np.float32)


def _sine(freq: float, n: int, sr: int, phase: float = 0.0) -> np.ndarray:
    t = np.arange(n, dtype=np.float64) / sr
    return np.sin(2 * np.pi * freq * t + phase).astype(np.float32)


def _sweep_sine(f0: float, f1: float, n: int, sr: int) -> np.ndarray:
    t = np.arange(n, dtype=np.float64) / sr
    dur = n / sr
    return sig.chirp(t, f0, dur, f1, method="logarithmic").astype(np.float32)


def _apply_lp(x: np.ndarray, cutoff: float, sr: int, order: int = 4) -> np.ndarray:
    nyq = sr / 2.0
    wn = float(np.clip(cutoff / nyq, 1e-4, 0.999))
    sos = sig.butter(order, wn, btype="low", output="sos")
    if x.ndim == 2:
        return np.stack([
            sig.sosfilt(sos, x[0]).astype(np.float32),
            sig.sosfilt(sos, x[1]).astype(np.float32),
        ])
    return sig.sosfilt(sos, x).astype(np.float32)


def _apply_hp(x: np.ndarray, cutoff: float, sr: int, order: int = 4) -> np.ndarray:
    nyq = sr / 2.0
    wn = float(np.clip(cutoff / nyq, 1e-4, 0.999))
    sos = sig.butter(order, wn, btype="high", output="sos")
    if x.ndim == 2:
        return np.stack([
            sig.sosfilt(sos, x[0]).astype(np.float32),
            sig.sosfilt(sos, x[1]).astype(np.float32),
        ])
    return sig.sosfilt(sos, x).astype(np.float32)


def _to_stereo(x: np.ndarray, width: float = 0.3) -> np.ndarray:
    if x.ndim == 2:
        return x
    L = x
    R = np.roll(x, int(len(x) * 0.002))
    mid = (L + R) * 0.5
    side = (L - R) * 0.5 * width
    return np.stack([mid + side, mid - side]).astype(np.float32)


def _normalize(x: np.ndarray, peak: float = 0.9) -> np.ndarray:
    mx = np.max(np.abs(x)) + EPS
    return (x * (peak / mx)).astype(np.float32)


# ---------------------------------------------------------------------------
# FX generators — each returns (2, n) float32
# ---------------------------------------------------------------------------

def gen_riser(duration_s: float, sr: int, intensity: float = 0.7) -> np.ndarray:
    """White noise filtered through a rising LPF sweep — builds tension."""
    n = int(duration_s * sr)
    noise = _noise(n, stereo=True, seed=17)
    block = max(256, sr // 20)
    n_blocks = max(1, n // block)
    f_start = 200.0
    f_end = clamp(2000 + 8000 * intensity, 2000, 14000)
    freqs = np.geomspace(f_start, f_end, n_blocks)
    out = np.zeros_like(noise)
    nyq = sr / 2.0
    zi = [None, None]
    for bi in range(n_blocks):
        s, e = bi * block, min(n, (bi + 1) * block)
        wn = float(np.clip(freqs[bi] / nyq, 1e-4, 0.999))
        sos = sig.butter(4, wn, btype="low", output="sos")
        for ch in range(2):
            if zi[ch] is None:
                zi[ch] = sig.sosfilt_zi(sos) * noise[ch, s]
            y, zi[ch] = sig.sosfilt(sos, noise[ch, s:e], zi=zi[ch])
            out[ch, s:e] = y
    # volume envelope: gradual build
    env = np.linspace(0.0, 1.0, n, dtype=np.float32) ** 1.5
    out *= env[None, :]
    # add pitched tonal component for "whoosh" feel
    tone = _sweep_sine(80, 400 + 600 * intensity, n, sr)
    tone *= env * 0.3
    out += _to_stereo(tone, width=0.2)
    return _normalize(out, peak=0.85 * intensity)


def gen_downlifter(duration_s: float, sr: int, intensity: float = 0.6) -> np.ndarray:
    """Descending filtered noise + pitch sweep — releases energy."""
    n = int(duration_s * sr)
    noise = _noise(n, stereo=True, seed=31)
    block = max(256, sr // 20)
    n_blocks = max(1, n // block)
    f_start = clamp(4000 + 8000 * intensity, 4000, 14000)
    f_end = 150.0
    freqs = np.geomspace(f_start, f_end, n_blocks)
    out = np.zeros_like(noise)
    nyq = sr / 2.0
    zi = [None, None]
    for bi in range(n_blocks):
        s, e = bi * block, min(n, (bi + 1) * block)
        wn = float(np.clip(freqs[bi] / nyq, 1e-4, 0.999))
        sos = sig.butter(4, wn, btype="low", output="sos")
        for ch in range(2):
            if zi[ch] is None:
                zi[ch] = sig.sosfilt_zi(sos) * noise[ch, s]
            y, zi[ch] = sig.sosfilt(sos, noise[ch, s:e], zi=zi[ch])
            out[ch, s:e] = y
    # fade out envelope
    env = np.linspace(1.0, 0.0, n, dtype=np.float32) ** 1.2
    out *= env[None, :]
    # descending tone
    tone = _sweep_sine(500 + 300 * intensity, 40, n, sr)
    tone *= env * 0.4
    out += _to_stereo(tone, width=0.4)
    return _normalize(out, peak=0.8 * intensity)


def gen_impact(sr: int, intensity: float = 0.7) -> np.ndarray:
    """Short thump + reverb tail to punctuate a transition moment."""
    dur = 0.8 + 0.4 * intensity
    n = int(dur * sr)
    # sub thump: short sine burst at ~50 Hz
    thump_n = int(0.15 * sr)
    thump = _sine(50.0, thump_n, sr)
    thump_env = np.exp(-np.linspace(0, 8, thump_n))
    thump *= thump_env * 0.9
    # noise burst for attack click
    click_n = int(0.03 * sr)
    click = _noise(click_n, stereo=False, seed=55)
    click *= np.exp(-np.linspace(0, 12, click_n)) * 0.5
    # combine into mono then reverb
    mono = np.zeros(n, dtype=np.float32)
    mono[:thump_n] += thump[:min(thump_n, n)]
    mono[:click_n] += click[:min(click_n, n)]
    # simple convolution reverb
    ir_n = int(0.5 * sr)
    rng = np.random.default_rng(77)
    ir = rng.standard_normal(ir_n).astype(np.float32)
    ir *= np.exp(-np.linspace(0, 6, ir_n))
    ir[0] = 1.0
    wet = sig.fftconvolve(mono, ir)[:n]
    mono = mono + 0.3 * wet[:len(mono)]
    out = _to_stereo(mono, width=0.5)
    return _normalize(out, peak=0.8 * intensity)


def gen_reverse_crash(duration_s: float, sr: int, intensity: float = 0.7) -> np.ndarray:
    """Synthesised reverse cymbal: filtered noise with reversed exponential envelope."""
    n = int(duration_s * sr)
    noise = _noise(n, stereo=True, seed=63)
    # bandpass 3k–14k for cymbal-like spectrum
    noise = _apply_hp(noise, 3000.0, sr, order=3)
    noise = _apply_lp(noise, 14000.0, sr, order=3)
    # reverse exponential: quiet -> loud (like a reversed cymbal hit)
    env = np.exp(np.linspace(-6, 0, n)).astype(np.float32)
    # soft onset
    onset = min(int(0.05 * sr), n)
    env[:onset] *= np.linspace(0, 1, onset).astype(np.float32)
    noise *= env[None, :]
    return _normalize(noise, peak=0.75 * intensity)


def gen_sub_drop(duration_s: float, sr: int, intensity: float = 0.6) -> np.ndarray:
    """Low-frequency sine sweep: a bass "boom" that slides down."""
    n = int(duration_s * sr)
    sweep = _sweep_sine(120 + 80 * intensity, 30, n, sr)
    # punch envelope: sharp attack, medium decay
    env = np.exp(-np.linspace(0, 4, n)).astype(np.float32)
    # keep first 30% at full level for weight
    hold = int(n * 0.3)
    env[:hold] = np.maximum(env[:hold], 0.7)
    sweep *= env
    out = _to_stereo(sweep, width=0.1)
    return _normalize(out, peak=0.7 * intensity)


# ---------------------------------------------------------------------------
# FX selection & placement
# ---------------------------------------------------------------------------

def _energy_gap(a_energy: float, b_energy: float) -> float:
    return b_energy - a_energy


def select_and_render_fx(
    plan,
    a,
    b,
    sr: int,
    effect_intensity: float = 0.5,
) -> list[tuple[int, np.ndarray]]:
    """Pick and render transition FX based on the musical context.

    Returns a list of (offset_samples, audio_2xN) tuples.  offset_samples is
    relative to the start of the overlap region on the timeline.
    """
    if effect_intensity < 0.1:
        return []

    overlap_s = plan.overlap
    overlap_n = int(overlap_s * sr)
    if overlap_n < sr:
        return []

    e_gap = _energy_gap(a.features.energy, b.features.energy)
    technique = plan.technique
    intensity = clamp(effect_intensity, 0.2, 1.0)

    layers: list[tuple[int, np.ndarray]] = []

    # --- riser: when energy is rising or tracks are beatmatched -----------
    if e_gap > -0.05 and technique in ("harmonic_blend", "eq_blend"):
        riser_dur = clamp(overlap_s * 0.7, 2.0, 8.0)
        riser_n = int(riser_dur * sr)
        riser = gen_riser(riser_dur, sr, intensity)
        # place riser so it peaks right at the crossover midpoint
        offset = max(0, overlap_n // 2 - riser_n)
        layers.append((offset, riser))

    # --- downlifter: when energy drops or we're doing a creative cut -----
    if e_gap < 0.05 or technique in ("creative_cut", "quick_cut"):
        dl_dur = clamp(overlap_s * 0.6, 1.5, 6.0)
        dl = gen_downlifter(dl_dur, sr, intensity * 0.9)
        layers.append((0, dl))

    # --- reverse crash: builds into the incoming track -------------------
    if technique in ("harmonic_blend", "eq_blend") and intensity > 0.3:
        rc_dur = clamp(overlap_s * 0.5, 1.5, 5.0)
        rc = gen_reverse_crash(rc_dur, sr, intensity * 0.85)
        rc_n = rc.shape[1]
        # peaks at the midpoint of the overlap
        offset = max(0, overlap_n // 2 - rc_n)
        layers.append((offset, rc))

    # --- impact: punctuates the moment the new track takes over ----------
    if intensity > 0.35:
        impact = gen_impact(sr, intensity * 0.75)
        # place at ~60% of overlap (where the new track becomes dominant)
        offset = int(overlap_n * 0.6)
        layers.append((offset, impact))

    # --- sub drop: for energy-lifting transitions with enough bass -------
    if e_gap > 0.08 and technique != "quick_cut" and intensity > 0.4:
        sd_dur = clamp(overlap_s * 0.3, 0.5, 2.0)
        sd = gen_sub_drop(sd_dur, sr, intensity * 0.8)
        offset = int(overlap_n * 0.55)
        layers.append((offset, sd))

    # scale all FX by a master gain so they sit behind the music
    master_gain = 0.55 + 0.35 * intensity  # 0.55–0.90 range
    scaled = []
    for off, audio in layers:
        scaled.append((off, (audio * master_gain).astype(np.float32)))

    log.debug("transition FX: %d layers for %s→%s (gap=%.2f tech=%s int=%.2f)",
              len(scaled), a.title[:20], b.title[:20], e_gap, technique, intensity)
    return scaled
