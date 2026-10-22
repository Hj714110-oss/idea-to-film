#!/usr/bin/env python3
"""Re-arrange a beat on bar lines so the groove never skips.
python3 arrange.py in.wav out.wav --b0 0.1802 --bar 1.494316 --seg 0-16,16-48,48-64,64-80,56-64,80-end
Read the sections first (kick/hat/mid energy per bar: see SKILL.md §3), then repeat or drop whole 8-bar phrases.
Joins use a 12 ms equal-gain crossfade. Prints where each source section lands in the new track."""
import sys, argparse, numpy as np, soundfile as sf
ap = argparse.ArgumentParser(); ap.add_argument('inp'); ap.add_argument('out'); ap.add_argument('--b0', type=float, required=True)
ap.add_argument('--bar', type=float, required=True); ap.add_argument('--seg', required=True); A = ap.parse_args()
y, sr = sf.read(A.inp); xf = int(sr * .012); nbars = int((len(y) / sr - A.b0) / A.bar)
segs = [(int(a), None if b == 'end' else int(b)) for a, b in (s.split('-') for s in A.seg.split(','))]
res = y[:int(A.b0 * sr)]; k = 0
for a, b in segs:
    s = int((A.b0 + a * A.bar) * sr); e = len(y) if b is None else int((A.b0 + b * A.bar) * sr); p = y[s:e]
    r = np.linspace(0, 1, xf)[:, None] if y.ndim > 1 else np.linspace(0, 1, xf)
    res = np.concatenate([res[:-xf], res[-xf:] * (1 - r) + p[:xf] * r, p[xf:]]) if len(res) >= xf else np.concatenate([res, p])
    n = (nbars if b is None else b) - a; print(f'src bars {a:3d}-{(b if b is not None else nbars):3d} -> new bar {k:3d} ({A.b0 + k * A.bar:6.1f}s)'); k += n
sf.write(A.out, res, sr); print('dur', round(len(res) / sr, 2), 's · grid unchanged: --grid', A.b0, round(A.bar / 4, 6))
