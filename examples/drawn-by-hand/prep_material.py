#!/usr/bin/env python3
"""Turn a brand-asset archive into film-ready material for this example.
usage: python3 prep_material.py ARCHIVE_DIR FILM_DIR
  ARCHIVE_DIR  unpacked archive with assets.json (id, category, file_in_this_package, date, name)
  FILM_DIR     the film folder (writes img/k, img/cov, img/g, learn.js, assets.js)
What it does:
  * flat-colour illustrations (clay background) -> keyed RGBA cut-outs, colour un-premultiplied
  * dated article covers -> 720 px JPGs sorted by date (the depth-tunnel chapter)
  * vector line drawings (Learn/*.svg) -> learn.js: path data + fill per path, drawn stroke by stroke by inkDraw()
Bring your own material; nothing from the original archive ships with this repo."""
import os, re, sys, glob, json, numpy as np
from PIL import Image, ImageOps
S, D = sys.argv[1], sys.argv[2]
for d in ('img/k', 'img/cov', 'img/g'): os.makedirs(os.path.join(D, d), exist_ok=True)
def key(src, dst, maxs=900):
    im = np.asarray(Image.open(src).convert('RGB')).astype(float); h, w, _ = im.shape
    edge = np.concatenate([im[:8].reshape(-1, 3), im[-8:].reshape(-1, 3), im[:, :8].reshape(-1, 3), im[:, -8:].reshape(-1, 3)])
    c = np.median(edge, 0); d = np.sqrt(((im - c) ** 2).sum(2)); a = np.clip((d - 28) / 42, 0, 1)
    ys, xs = np.where(a > .1)
    if not len(ys): return None
    y0, y1, x0, x1 = max(0, ys.min() - 6), min(h, ys.max() + 7), max(0, xs.min() - 6), min(w, xs.max() + 7)
    aa = np.maximum(a, 1e-3)[..., None]; rgb = np.clip((im - c * (1 - aa)) / aa, 0, 255)
    o = Image.fromarray(np.dstack([rgb, a * 255]).astype(np.uint8)[y0:y1, x0:x1], 'RGBA'); o.thumbnail((maxs, maxs), Image.LANCZOS); o.save(dst)
    return o.size
A = json.load(open(os.path.join(S, 'assets.json'))); K = {}; cov = []
for x in A:
    f = x.get('file_in_this_package'); cat = x.get('category', '')
    if not f or f.endswith('.svg'): continue
    p = os.path.join(S, f)
    if re.match(r'(HAND|OBJECT|NODE)-\d+', x['id']):
        sz = key(p, os.path.join(D, 'img/k', x['id'] + '.png'))
        if sz: K[x['id']] = sz
    elif cat == 'History':
        im = Image.open(p).convert('RGB'); im.thumbnail((720, 720), Image.LANCZOS); fn = x['id'] + '.jpg'
        im.save(os.path.join(D, 'img/cov', fn), quality=88); cov.append([fn, (x.get('date') or '')[:10], x['name'], *im.size])
cov.sort(key=lambda r: r[1])
learn = {}
for f in sorted(glob.glob(os.path.join(S, 'originals/Learn/*.svg'))):
    s = open(f).read(); vb = [float(v) for v in re.search(r'viewBox="([^"]+)"', s).group(1).split()]; ps = []
    for m in re.finditer(r'<path([^>]*)>', s):
        dd = re.search(r'\sd="([^"]+)"', m.group(1)); fl = re.search(r'fill="([^"]+)"', m.group(1))
        if dd: ps.append([dd.group(1), fl.group(1) if fl else '#141413'])
    learn[os.path.basename(f)[:-4]] = {'vb': vb, 'p': ps}
open(os.path.join(D, 'learn.js'), 'w').write('window.LEARN=' + json.dumps(learn, separators=(',', ':')) + ';')
g = sorted(os.listdir(os.path.join(D, 'img/g')))   # put hand-picked photos/screens here yourself (g01.jpg, o22.jpg, GEIST-04.png ...)
open(os.path.join(D, 'assets.js'), 'w').write('window.ASSETS=' + json.dumps({'cov': cov, 'k': K, 'g': g}) + ';')
print(len(K), 'cut-outs,', len(cov), 'covers,', len(learn), 'vector drawings,', len(g), 'photos')
