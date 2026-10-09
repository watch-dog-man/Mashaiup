"""
Structural repetition analysis: detect repeated sections within a single track
and find the optimal "half point" where a DJ can exit mid-song.

Many songs follow an A-B-A-B pattern (verse-chorus-verse-chorus) where the
second half mirrors the first.  This module identifies that repetition so the
planner can choose to play only the first half and transition out early.

Algorithm:
  1. Build a self-similarity matrix from beat-synchronous chroma + MFCC features.
  2. Detect repeated blocks via recurrence matrix analysis.
  3. Score candidate cut points (phrase boundaries near the structural midpoint)
     by how much of the remaining material is a repeat of earlier material.
  4. Return the best half-point snapped to a phrase boundary.
"""
from __future__ import annotations

import numpy as np

from .config import ANALYSIS_SR, HOP_LENGTH, N_MELS
from .utils import get_logger

log = get_logger()

try:
    import librosa
except Exception as e:  # pragma: no cover
    raise RuntimeError("librosa is required for structure analysis") from e


def _beat_sync_features(y: np.ndarray, sr: int) -> tuple[np.ndarray, np.ndarray]:
    """
    Compute beat-synchronous features: chroma (12-d) + MFCC (13-d) = 25-d,
    averaged per beat for a compact, musically meaningful representation.
    Returns (features (25, n_beats), beat_times).
    """
    onset_env = librosa.onset.onset_strength(y=y, sr=sr, hop_length=HOP_LENGTH)
    _, beat_frames = librosa.beat.beat_track(
        onset_envelope=onset_env, sr=sr, hop_length=HOP_LENGTH, trim=False
    )
    beat_times = librosa.frames_to_time(beat_frames, sr=sr, hop_length=HOP_LENGTH)
    if len(beat_frames) < 8:
        return np.array([]), beat_times

    chroma = librosa.feature.chroma_cqt(y=y, sr=sr, hop_length=HOP_LENGTH)
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13, hop_length=HOP_LENGTH)

    chroma_sync = librosa.util.sync(chroma, beat_frames, aggregate=np.median)
    mfcc_sync = librosa.util.sync(mfcc, beat_frames, aggregate=np.median)

    feat = np.vstack([
        librosa.util.normalize(chroma_sync, axis=0),
        librosa.util.normalize(mfcc_sync, axis=0),
    ])
    return feat, beat_times


def _self_similarity(feat: np.ndarray) -> np.ndarray:
    """Cosine self-similarity matrix from (d, n) feature matrix."""
    norms = np.linalg.norm(feat, axis=0, keepdims=True) + 1e-9
    normed = feat / norms
    return normed.T @ normed


def _recurrence_matrix(sim: np.ndarray, k: int = 5) -> np.ndarray:
    """
    Binary recurrence matrix: entry (i,j) is True when beat j is among the
    k nearest neighbours of beat i (excluding a diagonal band to ignore
    trivial self-matches).
    """
    n = sim.shape[0]
    band = max(4, n // 8)
    masked = sim.copy()
    for i in range(n):
        lo, hi = max(0, i - band), min(n, i + band + 1)
        masked[i, lo:hi] = -1.0
    rec = np.zeros((n, n), dtype=bool)
    for i in range(n):
        row = masked[i]
        if np.all(row < 0):
            continue
        thresh = np.partition(row, -min(k, n - 1))[-min(k, n - 1)]
        rec[i] = row >= max(thresh, 0.3)
    return rec


def _block_repetition_score(rec: np.ndarray, start: int, length: int) -> float:
    """
    Score how well beats [start : start+length] repeat beats [0 : length].
    Returns fraction of beats in the second block that have a recurrence match
    in the first block.
    """
    n = rec.shape[0]
    if start + length > n or length < 4:
        return 0.0
    matches = 0
    for i in range(length):
        src = start + i
        if np.any(rec[src, :start]):
            matches += 1
    return matches / length


def detect_structure(
    y: np.ndarray,
    sr: int,
    phrase_times: np.ndarray,
    duration: float,
) -> dict:
    """
    Analyse a track for structural repetition.

    Returns:
      {
        "has_repeat": bool,       -- song has a repeating structure
        "half_point": float,      -- best exit time (s), snapped to phrase boundary
        "repeat_score": float,    -- 0..1 confidence that the second half repeats
        "repeat_map": list,       -- per-section repeat scores (for UI display)
      }
    """
    result = {
        "has_repeat": False,
        "half_point": duration * 0.5,
        "repeat_score": 0.0,
        "repeat_map": [],
    }

    try:
        feat, beat_times = _beat_sync_features(y, sr)
    except Exception as e:
        log.debug("structure: feature extraction failed: %s", e)
        return result

    if feat.size == 0 or len(beat_times) < 16:
        return result

    n_beats = feat.shape[1]
    sim = _self_similarity(feat)
    rec = _recurrence_matrix(sim, k=max(3, n_beats // 20))

    # Score candidate half-points: each phrase boundary in the middle third
    # of the song is a candidate.  For each, measure how much the material
    # after the cut repeats material before it.
    candidates = []
    for pt in phrase_times:
        frac = pt / duration
        if frac < 0.35 or frac > 0.65:
            continue
        cut_beat = int(np.searchsorted(beat_times, pt))
        if cut_beat < 8 or cut_beat > n_beats - 8:
            continue
        remaining = n_beats - cut_beat
        score = _block_repetition_score(rec, cut_beat, min(remaining, cut_beat))
        candidates.append((pt, score, cut_beat))

    if not candidates:
        # no phrase boundary in the middle -> try the raw midpoint
        mid_t = duration * 0.5
        cut_beat = int(np.searchsorted(beat_times, mid_t))
        if 8 <= cut_beat <= n_beats - 8:
            remaining = n_beats - cut_beat
            score = _block_repetition_score(rec, cut_beat, min(remaining, cut_beat))
            candidates.append((mid_t, score, cut_beat))

    if not candidates:
        return result

    # pick the candidate with the highest repetition score
    best = max(candidates, key=lambda c: c[1])
    half_point, repeat_score, _ = best

    # build a coarse repeat map (score per section) for UI
    n_sections = max(4, min(8, len(phrase_times)))
    section_len = n_beats // n_sections
    repeat_map = []
    for si in range(n_sections):
        s = si * section_len
        e = min(s + section_len, n_beats)
        if s >= n_beats // 2:
            sc = _block_repetition_score(rec, s, e - s)
        else:
            sc = 0.0
        repeat_map.append(round(float(sc), 3))

    result["has_repeat"] = repeat_score >= 0.35
    result["half_point"] = float(half_point)
    result["repeat_score"] = round(float(repeat_score), 3)
    result["repeat_map"] = repeat_map

    if result["has_repeat"]:
        log.info("structure: repeat detected at %.1fs (score=%.2f)", half_point, repeat_score)

    return result
