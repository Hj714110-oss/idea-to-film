'use strict';
/* engine_core.js — atmosphere-brand-film engine, ivory/ink edition (light paper + dark turn) */
const W = 1920, H = 1080, WH = W * H, N = 14000;
const DUR = AUDIO.dur;
const cv = document.getElementById('c'); const ctx = cv.getContext('2d');

/* ---------- utils ---------- */
function mulberry(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
let R = mulberry(1);
function gauss() { let u = 0; while (u === 0) u = R(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(6.283185307 * R()); }
const clamp = (x, a = 0, b = 1) => x < a ? a : x > b ? b : x;
const smooth = x => { x = clamp(x); return x * x * (3 - 2 * x); };
const ease = x => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const easeSine = x => { x = clamp(x); return -(Math.cos(Math.PI * x) - 1) / 2; };
const easeOut = x => { x = clamp(x); return 1 - Math.pow(1 - x, 3); };
const easeOut5 = x => { x = clamp(x); return 1 - Math.pow(1 - x, 5); };
const easeIn = x => { x = clamp(x); return x * x * x; };
const easeBack = x => { x = clamp(x); const c = 1.6; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
const lerp = (a, b, t) => a + (b - a) * t;
const win = (t, a, b, fi = .6, fo = .6) => smooth((t - a) / fi) * smooth((b - t) / fo);
const mixc = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
const fmt = n => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const hash = n => { n = Math.imul(n ^ 0x9e3779b9, 0x85ebca6b); n ^= n >>> 13; n = Math.imul(n, 0xc2b2ae35); n ^= n >>> 16; return (n >>> 0) / 4294967296; };

/* ---------- music grid ---------- */
const BE = AUDIO.beats; let BP, B0;
{ let n = BE.length, sx = 0, sy = 0, sxx = 0, sxy = 0; for (let i = 0; i < n; i++) { sx += i; sy += BE[i]; sxx += i * i; sxy += i * BE[i]; } BP = (n * sxy - sx * sy) / (n * sxx - sx * sx); B0 = (sy - BP * sx) / n; }
const bar = k => B0 + k * 4 * BP;
function since(t, len) { const x = (t - B0) / len; if (x < 0) return 99; return (x - Math.floor(x)) * len; }
const beatPulse = (t, d = .18) => Math.exp(-since(t, BP) / d);
const barPulse = (t, d = .3) => Math.exp(-since(t, 4 * BP) / d);
const loud = t => { const r = AUDIO.rms[clamp(Math.floor(t * 4), 0, AUDIO.rms.length - 1)]; return clamp((r - .22) / .3); };
const bt = k => B0 + k * BP;
const BPr = k => k * BP;

/* ---------- palette (Geist/Anthropic system) ---------- */
const IVORY = '#F0F0EB', IVL = '#FAFAF7', IVD = '#E5E4DF', SLATE = '#191919', SLM = '#262625', CLOUD = '#91918D', CLOUDD = '#666663', CLAY = '#CC785C', CLAYD = '#B5603F', CLAYP = '#D97757', KRAFT = '#D4A27F', MANILLA = '#EBDBBC', FOCUS = '#61AAF2', INK = '#141413';
const COL = { ink: [.08, .08, .075], clay: [.8, .47, .36], kraft: [.83, .64, .5], cloud: [.57, .57, .55], ivory: [.97, .96, .92], blue: [.28, .75, 1], cyan: [.45, .85, 1], white: [1, 1, 1] };
let DARK = 0;  // set per frame by compositor (0 ivory, 1 slate)
const HXL = { r: '#B5603F', a: '#3E86C9', g: '#9A6A3E', p: '#B5603F' };
const HXD = { r: '#E08E70', a: '#7CC4FF', g: '#E8C08F', p: '#F0B79A' };
const HX = () => DARK > .5 ? HXD : HXL;

/* ---------- text helpers ---------- */
const POOL = '线手纸想光心画笔点节形字';
const POOLA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ\\/#';
const POOLH = '0123456789ABCDEF';
function scramble(str, t, t0, per = .3, pool = POOLA, rate = 18) { let o = ''; for (let i = 0; i < str.length; i++) { const lock = t0 + i * per; if (str[i] === ' ' || t >= lock) o += str[i]; else if (t < t0 - .2) o += ' '; else o += pool[Math.floor(hash(i * 131 + Math.floor(t * rate)) * pool.length)]; } return o; }
function rr2(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
const rr = (x, y, w, h, r) => rr2(ctx, x, y, w, h, r);
function T(str, x, y, font, color, a = 1, align = 'left', ls = 0) { if (a < .005) return; ctx.globalAlpha = a; ctx.font = font; ctx.fillStyle = color; ctx.textAlign = align; ctx.letterSpacing = ls + 'px'; ctx.fillText(str, x, y); ctx.letterSpacing = '0px'; ctx.globalAlpha = 1; }
function parseRich(s) { const out = []; let col = null; for (let i = 0; i < s.length; i++) { if (s[i] === '<') { const e = s.indexOf('>', i), tag = s.slice(i + 1, e); col = tag[0] === '/' ? null : tag; i = e; continue; } out.push([s[i], col]); } return out; }
function drawRich(str, x, y, font, t, t0, a = 1, per = .045, align = 'center', ls = 4, base = null, pool = null, glow = false) {
  if (a < .005 || t < t0 - .1) return; const ch = parseRich(str); ctx.font = font; ctx.textAlign = 'left'; ctx.letterSpacing = '0px';
  base = base || (DARK > .5 ? IVORY : INK); const hx = HX();
  const ws = ch.map(c => ctx.measureText(c[0]).width + ls), tot = ws.reduce((p, q) => p + q, 0) - ls; let xx = align === 'center' ? x - tot / 2 : align === 'right' ? x - tot : x;
  ch.forEach(([c, col], k) => {
    const lt = t0 + k * per, aa = smooth((t - lt) / .35) * a; if (aa > .003) {
      let g = c; if (pool && t < lt + .45) g = pool[Math.floor(hash(k * 97 + Math.floor(t * 22)) * pool.length)];
      ctx.fillStyle = col ? hx[col] : base; ctx.globalAlpha = aa; if (glow && col) { ctx.shadowColor = hx[col]; ctx.shadowBlur = 20; }
      ctx.fillText(g, xx, y + (1 - aa) * 10); ctx.shadowBlur = 0;
    }
    xx += ws[k];
  });
  ctx.globalAlpha = 1;
}

/* ---------- images ---------- */
const IM = {};
function loadImg(src) { return new Promise(res => { const im = new Image(); im.onload = () => res(im); im.onerror = () => { console.log('IMGERR ' + src); res(null); }; im.src = src; }); }
async function loadAll() {
  const jobs = [];
  for (const k in ASSETS.k) jobs.push(loadImg('img/k/' + k + '.png').then(i => IM[k] = i));
  for (const c of ASSETS.cov) jobs.push(loadImg('img/cov/' + c[0]).then(i => IM['cov/' + c[0]] = i));
  for (const g of ASSETS.g) jobs.push(loadImg('img/g/' + g).then(i => IM[g.replace(/\.(jpg|png)$/, '')] = i));
  await Promise.all(jobs);
}
/* draw image centred at x,y with width w; reveal: clip wipe 0..1 from 'dir' */
function img(name, x, y, w, a = 1, opt = {}) {
  const im = IM[name]; if (!im || a < .005) return; const h = w * im.height / im.width;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); if (opt.rot) ctx.rotate(opt.rot); if (opt.sc) ctx.scale(opt.sc, opt.sc);
  if (opt.shadow) { ctx.shadowColor = 'rgba(40,30,20,' + (opt.shadow * .35) + ')'; ctx.shadowBlur = 40 * opt.shadow; ctx.shadowOffsetY = 14 * opt.shadow; }
  if (opt.wipe !== undefined && opt.wipe < 1) { const p = clamp(opt.wipe); ctx.beginPath(); if (opt.dir === 'x') ctx.rect(-w / 2, -h / 2, w * p, h); else ctx.rect(-w / 2, h / 2 - h * p, w, h * p); ctx.clip(); }
  if (opt.frame) { ctx.fillStyle = opt.frame; ctx.fillRect(-w / 2 - opt.pad, -h / 2 - opt.pad, w + 2 * opt.pad, h + 2 * opt.pad + (opt.pb || 0)); ctx.shadowBlur = 0; ctx.shadowOffsetY = 0; }
  if (opt.radius) { ctx.save(); rr(-w / 2, -h / 2, w, h, opt.radius); ctx.clip(); ctx.drawImage(im, -w / 2, -h / 2, w, h); ctx.restore(); }
  else ctx.drawImage(im, -w / 2, -h / 2, w, h);
  ctx.restore(); return h;
}

/* ---------- ink line drawing of vector illustrations (the motif) ---------- */
const SVGNS = 'http://www.w3.org/2000/svg', SVGM = document.getElementById('svgm');
const LP = {};  // name -> {vb, paths:[{p2d, fill, len, el}], total}
function prepLearn() {
  for (const k in LEARN) {
    const L = LEARN[k]; let tot = 0; const paths = [];
    for (const [d, fill] of L.p) { const el = document.createElementNS(SVGNS, 'path'); el.setAttribute('d', d); SVGM.appendChild(el); const len = el.getTotalLength(); const dark = fill === '#141413' || fill === '#231F20'; paths.push({ p2d: new Path2D(d), fill, len, el, dark }); if (dark) tot += len; }
    const all = new Path2D(); for (const q of paths) if (q.dark) all.addPath(q.p2d); LP[k] = { vb: L.vb, paths, total: tot, all };
  }
}
const OFF = document.createElement('canvas'); OFF.width = 900; OFF.height = 900; const ofx = OFF.getContext('2d');
const OFF2 = document.createElement('canvas'); OFF2.width = 900; OFF2.height = 900; const of2 = OFF2.getContext('2d');
/* p: 0..1 line progress; fillA: wash fill alpha; ink: line colour; wash: override fill colour */
function inkDraw(name, cx, cy, size, p, a = 1, opt = {}) {
  const L = LP[name]; if (!L || a < .005 || p <= 0) return; const S = Math.min(900, Math.ceil(size)); const sc = S / Math.max(L.vb[2], L.vb[3]);
  const ink = opt.ink || (DARK > .5 ? IVORY : INK), fillA = opt.fillA === undefined ? smooth((p - .75) / .25) : opt.fillA;
  ofx.setTransform(1, 0, 0, 1, 0, 0); ofx.clearRect(0, 0, S, S); of2.setTransform(1, 0, 0, 1, 0, 0); of2.clearRect(0, 0, S, S);
  ofx.setTransform(sc, 0, 0, sc, -L.vb[0] * sc, -L.vb[1] * sc); of2.setTransform(sc, 0, 0, sc, -L.vb[0] * sc, -L.vb[1] * sc);
  // wash fills first (beneath lines)
  if (fillA > .01) { of2.globalAlpha = fillA; for (const q of L.paths) if (!q.dark && q.fill !== 'none') { of2.fillStyle = opt.wash || q.fill; of2.fill(q.p2d); } of2.globalAlpha = 1; }
  // mask: stroke along each dark outline up to progress
  let rem = p * L.total, nib = null; ofx.lineCap = 'round'; ofx.lineJoin = 'round'; ofx.lineWidth = opt.lw || 26; ofx.strokeStyle = '#000';
  for (const q of L.paths) { if (!q.dark) continue; if (rem <= 0) break; const l = Math.min(q.len, rem); ofx.setLineDash([l, q.len + 10]); ofx.stroke(q.p2d); if (rem < q.len) { const pt = q.el.getPointAtLength(l); nib = [pt.x, pt.y]; } rem -= q.len; }
  ofx.setLineDash([]); ofx.globalCompositeOperation = 'source-in'; ofx.fillStyle = ink; ofx.fill(L.all); ofx.globalCompositeOperation = 'source-over';
  ctx.save(); ctx.globalAlpha = a; const x0 = cx - S / 2 * (size / S), y0 = cy - S / 2 * (size / S);
  if (opt.rot) { ctx.translate(cx, cy); ctx.rotate(opt.rot); ctx.translate(-cx, -cy); }
  ctx.drawImage(OFF2, 0, 0, S, S, x0, y0, size, size); ctx.drawImage(OFF, 0, 0, S, S, x0, y0, size, size);
  if (nib && p < .995 && opt.nib !== false) { const nx = x0 + (nib[0] - L.vb[0]) * sc * size / S, ny = y0 + (nib[1] - L.vb[1]) * sc * size / S; const g = ctx.createRadialGradient(nx, ny, 0, nx, ny, 26); g.addColorStop(0, DARK > .5 ? 'rgba(255,200,170,.95)' : 'rgba(204,120,92,.9)'); g.addColorStop(1, 'rgba(204,120,92,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(nx, ny, 26, 0, 6.2832); ctx.fill(); ctx.fillStyle = DARK > .5 ? '#fff' : CLAYD; ctx.beginPath(); ctx.arc(nx, ny, 4.5, 0, 6.2832); ctx.fill(); }
  ctx.restore();
}
/* a hand-drawn stroke between points with wobble; p reveals along it */
function handLine(pts, p, w, col, a = 1, seed = 1, nib = true) {
  if (p <= 0 || a < .005) return; const seg = []; let tot = 0;
  for (let i = 0; i < pts.length - 1; i++) { const [x0, y0] = pts[i], [x1, y1] = pts[i + 1], l = Math.hypot(x1 - x0, y1 - y0); seg.push(l); tot += l; }
  let rem = p * tot; ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); let last = pts[0];
  for (let i = 0; i < seg.length && rem > 0; i++) {
    const [x0, y0] = pts[i], [x1, y1] = pts[i + 1], f = Math.min(1, rem / seg[i]), steps = Math.max(2, Math.ceil(seg[i] * f / 14)), nx = -(y1 - y0) / (seg[i] || 1), ny = (x1 - x0) / (seg[i] || 1);
    for (let k = 1; k <= steps; k++) { const u = f * k / steps, wob = Math.sin((i * 7 + u * seg[i] / 60) * 2.1 + seed) * 2.2 + Math.sin(u * seg[i] / 23 + seed * 3) * 1.1; last = [x0 + (x1 - x0) * u + nx * wob, y0 + (y1 - y0) * u + ny * wob]; ctx.lineTo(last[0], last[1]); }
    rem -= seg[i];
  }
  ctx.lineWidth = w; ctx.stroke();
  if (nib && p < .995) { ctx.fillStyle = DARK > .5 ? '#FFE3D4' : CLAYD; ctx.shadowColor = CLAY; ctx.shadowBlur = 18; ctx.beginPath(); ctx.arc(last[0], last[1], w * .55 + 2, 0, 6.2832); ctx.fill(); }
  ctx.restore(); return last;
}

/* ---------- camera ---------- */
const cam = { yaw: 0, pitch: 0, dist: 4, tx: 0, ty: 0, tz: 0, f: H * .95 };
let cY = 1, sY = 0, cP = 1, sP = 0;
function setCam(c) { Object.assign(cam, c); cY = Math.cos(cam.yaw); sY = Math.sin(cam.yaw); cP = Math.cos(cam.pitch); sP = Math.sin(cam.pitch); }
const PR = { x: 0, y: 0, z: 0, k: 0 };
function proj(x, y, z) {
  x -= cam.tx; y -= cam.ty; z -= cam.tz;
  const x1 = x * cY + z * sY, z1 = -x * sY + z * cY, y2 = y * cP + z1 * sP, z2 = -y * sP + z1 * cP, zc = z2 + cam.dist;
  PR.z = zc; if (zc < .05) return false; const k = cam.f / zc; PR.k = k; PR.x = W / 2 + x1 * k; PR.y = H / 2 - y2 * k; return true;
}
const CAM0 = { yaw: 0, pitch: 0, dist: 4, tx: 0, ty: 0, tz: 0, f: H * .95 };
const C = o => Object.assign({}, CAM0, o);
function lerpCam(a, b, t) { const o = {}; for (const k in a) o[k] = lerp(a[k], b[k], t); return o; }

/* ---------- particles ---------- */
const D = new Float32Array(N), PH = new Float32Array(N), Q = new Float32Array(N), NV = new Float32Array(N * 3), DUST = new Float32Array(N * 3);
for (let i = 0; i < N; i++) {
  D[i] = R(); PH[i] = R() * 6.2832; Q[i] = R();
  let x = gauss(), y = gauss(), z = gauss(), l = Math.hypot(x, y, z) || 1;
  NV[i * 3] = x / l; NV[i * 3 + 1] = y / l; NV[i * 3 + 2] = z / l;
  DUST[i * 3] = (R() * 2 - 1) * 4.5; DUST[i * 3 + 1] = (R() * 2 - 1) * 2.6; DUST[i * 3 + 2] = (R() * 2 - 1) * 3;
}
function mk(o) { for (const k of ['P', 'C', 'V', 'bP', 'bC']) o[k] = new Float32Array(N * 3); for (const k of ['B', 'S', 'bB', 'bS']) o[k] = new Float32Array(N); return o; }
function setB(s, i, x, y, z, c, br, sz) { const j = i * 3; s.bP[j] = x; s.bP[j + 1] = y; s.bP[j + 2] = z; s.bC[j] = c[0]; s.bC[j + 1] = c[1]; s.bC[j + 2] = c[2]; s.bB[i] = br; s.bS[i] = sz; }
function copyBase(s) { s.P.set(s.bP); s.C.set(s.bC); s.B.set(s.bB); s.S.set(s.bS); s.V.fill(0); }
function driftDust(s, t, i0, i1, sp = 1) { const P = s.P; for (let i = i0; i < i1; i++) { const j = i * 3; P[j + 1] = ((s.bP[j + 1] + 2.6 + t * (.03 + .05 * Q[i]) * sp) % 5.2 + 5.2) % 5.2 - 2.6; P[j] += Math.sin(t * .2 + PH[i]) * .08; } }
const WX = sx => (sx - W / 2) / 256.5, WY = sy => -(sy - H / 2) / 256.5;
/* ink dust for paper scenes (dark specks on ivory) */
function dustScene(o) {
  return mk(Object.assign({
    init() { R = mulberry(o.seed || 1); const tn = o.tints || [COL.ink, COL.clay, COL.kraft]; const n = o.n || 2600; for (let i = 0; i < N; i++) { const big = Q[i] < .04; setB(this, i, DUST[i * 3], DUST[i * 3 + 1], DUST[i * 3 + 2], tn[Math.floor(hash(i * 17 + (o.seed || 1)) * tn.length)], i < n ? (o.br || .05) * (.3 + Q[i]) * (big ? 2 : 1) : 0, big ? .009 : .004); } },
    update(t) { copyBase(this); driftDust(this, t, 0, o.n || 2600, o.sp || .4); },
    cam(t) { return C({ dist: 4 }); }
  }, o));
}

const BR = new Float32Array(WH), BG = new Float32Array(WH), BB = new Float32Array(WH);
function splat(px, py, e, r, g, b, s) {
  if (s < 1.7) {
    const fx = px - .5, fy = py - .5, ix = Math.floor(fx), iy = Math.floor(fy); if (ix < 0 || iy < 0 || ix >= W - 1 || iy >= H - 1) return;
    const ax = fx - ix, ay = fy - iy, i0 = iy * W + ix, w00 = (1 - ax) * (1 - ay) * e, w10 = ax * (1 - ay) * e, w01 = (1 - ax) * ay * e, w11 = ax * ay * e;
    BR[i0] += r * w00; BG[i0] += g * w00; BB[i0] += b * w00; BR[i0 + 1] += r * w10; BG[i0 + 1] += g * w10; BB[i0 + 1] += b * w10;
    BR[i0 + W] += r * w01; BG[i0 + W] += g * w01; BB[i0 + W] += b * w01; BR[i0 + W + 1] += r * w11; BG[i0 + W + 1] += g * w11; BB[i0 + W + 1] += b * w11;
  } else {
    s = Math.min(s, 8); const r2 = Math.ceil(s), ix = Math.round(px), iy = Math.round(py), k = 1 / (s * s * .3), ee = e * 1.1 / (s * .9);
    for (let dy = -r2; dy <= r2; dy++) { const y = iy + dy; if (y < 0 || y >= H) continue; for (let dx = -r2; dx <= r2; dx++) { const x = ix + dx; if (x < 0 || x >= W) continue; const w = Math.exp(-((x - px) ** 2 + (y - py) ** 2) * k) * ee; const o = y * W + x; BR[o] += r * w; BG[o] += g * w; BB[o] += b * w; } }
  }
}
