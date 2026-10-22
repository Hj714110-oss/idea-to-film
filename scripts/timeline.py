#!/usr/bin/env python3
"""script.json -> timeline.js: scene start bars + per-line subtitle windows sized by reading speed.
python3 timeline.py script.json BPM   (writes timeline.json / timeline.js; scenes read window.TL)
script.json: {"title": [zh, en], "speakers": {KEY: [label, "#hex"]}, "scenes": [{"name", "plate"|"clip", "min": bars, "start_pad", "end_pad", "chap": [..], "lines": [[SPEAKER|null, zh, en], ...]}]}
Reading time per line: 0.8 s + 0.112 s per Chinese character (1.8–5.6 s), 0.26 s gaps; scenes round up to whole bars and lines stretch (≤1.35×) to fill."""
import json, math, re, sys
S = json.load(open(sys.argv[1])); BPM = float(sys.argv[2]) if len(sys.argv) > 2 else 92; BAR = 240 / BPM
def need(zh): c = len(re.sub(r'[A-Za-z0-9 .,·…]+', 'x', zh)); return min(5.6, max(1.8, 0.8 + c * 0.112))
bar = 0; out = []
for sc in S['scenes']:
    pad0, pad1, gap = sc.get('start_pad', 0.6), sc.get('end_pad', 0.7), 0.26
    ds = [need(l[1]) for l in sc['lines']] or [1]; tot = pad0 + sum(ds) + gap * (len(ds) - 1) + pad1
    nb = max(sc.get('min', 4), math.ceil(tot / BAR - 0.08)); L = nb * BAR
    k = min(1.35, (L - pad0 - pad1 - gap * (len(ds) - 1)) / sum(ds)); t = pad0; subs = []
    for d, l in zip(ds, sc['lines']): subs.append([round(t, 2), round(t + d * k, 2), l[1], l[2], l[0]]); t += d * k + gap
    out.append(dict(sc, bar=bar, bars=nb, subs=subs)); bar += nb
    print(f"{sc['name']:10s} bar {out[-1]['bar']:3d} +{nb:2d}  {out[-1]['bar'] * BAR:6.1f}s  need {tot:5.1f}s  have {L:5.1f}s")
print('total bars', bar, '=', round(bar * BAR, 1), 's  (too long? cut lines, not reading time)')
TL = {'bpm': BPM, 'bars': bar, 'scenes': out, 'title': S.get('title'), 'speakers': S.get('speakers', {})}
json.dump(TL, open('timeline.json', 'w'), ensure_ascii=False, indent=0); open('timeline.js', 'w').write('window.TL=' + json.dumps(TL, ensure_ascii=False) + ';')
