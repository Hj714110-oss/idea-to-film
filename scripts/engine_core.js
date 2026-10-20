'use strict';
/* engine_core.js — deterministic beat-synced film engine (atmosphere-brand-film skill) */
const W = 1920, H = 1080, WH = W * H, N = 30000;
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
const easeBack = x => { x = clamp(x); const c = 1.5; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
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
const beatIndex = t => Math.floor((t - B0) / BP);
const loud = t => { const r = AUDIO.rms[clamp(Math.floor(t * 4), 0, AUDIO.rms.length - 1)]; return clamp((r - .22) / .2); };

/* ---------- palette ---------- */
const COL = { rose: [1, .42, .58], peach: [1, .7, .52], ai: [.48, .78, 1], lilac: [.7, .6, 1], white: [1, 1, 1], dim: [.42, .4, .55], green: [.4, 1, .56], gold: [1, .78, .48] };
const ROSE = '#FF8FA3', PEACH = '#FFC2A1', AIC = '#8FD3FF', LILAC = '#B9A8FF', GREEN = '#7CFF9B', WHITE = '#F5EEF2', SOFT = 'rgba(236,224,234,.62)', MONO = 'rgba(220,204,218,.55)';
const HX = { r: ROSE, a: AIC, p: PEACH, g: '#FFD58A' };
const bt = k => B0 + k * BP;           // absolute time of beat k
const BPr = k => k * BP;               // k beats after a bar-aligned scene start

/* ---------- text + ui helpers ---------- */
const POOL = '记忆念想你我在等候陪伴懂梦暖光心声晚安';
const POOLA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&@?!';
const POOLD = '01010110∅#';
function scramble(str, t, t0, per = .3, pool = POOL, rate = 18) { let o = ''; for (let i = 0; i < str.length; i++) { const lock = t0 + i * per; if (str[i] === ' ' || t >= lock) o += str[i]; else if (t < t0 - .2) o += ' '; else o += pool[Math.floor(hash(i * 131 + Math.floor(t * rate)) * pool.length)]; } return o; }
function rr2(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
const rr = (x, y, w, h, r) => rr2(ctx, x, y, w, h, r);
function T(str, x, y, font, color, a = 1, align = 'left', ls = 0) { if (a < .005) return; ctx.globalAlpha = a; ctx.font = font; ctx.fillStyle = color; ctx.textAlign = align; ctx.letterSpacing = ls + 'px'; ctx.fillText(str, x, y); ctx.letterSpacing = '0px'; ctx.globalAlpha = 1; }
function parseRich(s) { const out = []; let col = null; for (let i = 0; i < s.length; i++) { if (s[i] === '<') { const e = s.indexOf('>', i), tag = s.slice(i + 1, e); col = tag[0] === '/' ? null : tag; i = e; continue; } out.push([s[i], col]); } return out; }
/* per-character reveal of a rich string, centred or left */
function drawRich(str, x, y, font, t, t0, a = 1, per = .045, align = 'center', ls = 4, base = WHITE, pool = null) {
  if (a < .005 || t < t0 - .1) return; const ch = parseRich(str); ctx.font = font; ctx.textAlign = 'left'; ctx.letterSpacing = '0px';
  const ws = ch.map(c => ctx.measureText(c[0]).width + ls), tot = ws.reduce((p, q) => p + q, 0) - ls; let xx = align === 'center' ? x - tot / 2 : align === 'right' ? x - tot : x;
  ch.forEach(([c, col], k) => {
    const lt = t0 + k * per, aa = smooth((t - lt) / .35) * a; if (aa > .003) {
      let g = c; if (pool && col && t < lt + .45) g = pool[Math.floor(hash(k * 97 + Math.floor(t * 22)) * pool.length)];
      ctx.fillStyle = col ? HX[col] : base; ctx.globalAlpha = aa; if (col) { ctx.shadowColor = HX[col]; ctx.shadowBlur = 22; }
      ctx.fillText(g, xx, y + (1 - aa) * 10); ctx.shadowBlur = 0;
    }
    xx += ws[k];
  });
  ctx.globalAlpha = 1;
}

/* ---------- chat UI ---------- */
const FZ = '400 30px "Noto Sans CJK SC"', FE = 'italic 400 19px Fr';
function bubbleSize(g, m) {
  if (m.typing) return [118, 66]; if (m.call) return [430, 112];
  g.font = FZ; g.letterSpacing = '1px'; const wz = g.measureText(m.zh).width; g.letterSpacing = '0px'; g.font = FE; const we = m.en ? g.measureText(m.en).width : 0; return [Math.max(wz, we) + 54, m.en ? 104 : 70];
}
function avatar(g, x, y, r, t, k = 1) {
  const p = 1 + .08 * Math.sin(t * 3);
  const gr = g.createRadialGradient(x - r * .3, y - r * .3, 0, x, y, r * p); gr.addColorStop(0, '#ffffff'); gr.addColorStop(.35, AIC); gr.addColorStop(1, 'rgba(185,168,255,.9)');
  g.save(); g.globalAlpha *= k; g.shadowColor = AIC; g.shadowBlur = 24; g.fillStyle = gr; g.beginPath(); g.arc(x, y, r * p, 0, 6.2832); g.fill(); g.restore();
}
function drawBubble(g, m, xa, y, a, pop, t) {
  const [w, h] = bubbleSize(g, m), me = m.side === 'me', x = me ? xa - w : xa;
  g.save(); g.globalAlpha = a; const ox = me ? x + w : x, oy = y + h; g.translate(ox, oy); g.scale(pop, pop); g.translate(-ox, -oy);
  rr2(g, x, y, w, h, 24);
  if (me) { const gr = g.createLinearGradient(x, y, x + w, y + h); gr.addColorStop(0, 'rgba(255,120,156,.96)'); gr.addColorStop(1, 'rgba(255,168,136,.96)'); g.fillStyle = gr; g.shadowColor = 'rgba(255,120,156,.45)'; g.shadowBlur = 26; g.fill(); g.shadowBlur = 0; }
  else { g.fillStyle = 'rgba(26,30,48,.9)'; g.fill(); g.strokeStyle = 'rgba(143,211,255,.42)'; g.lineWidth = 1.4; g.stroke(); }
  if (m.typing) { for (let k = 0; k < 3; k++) { const b = Math.max(0, Math.sin(t * 9 - k * .9)); g.fillStyle = `rgba(200,228,255,${.45 + .5 * b})`; g.beginPath(); g.arc(x + 34 + k * 25, y + 34 - 5 * b, 6.5, 0, 6.2832); g.fill(); } }
  else if (m.call) {
    const on = m.on !== undefined && t >= m.on, cx = x + 56, cy = y + h / 2;
    for (let k = 0; k < 3; k++) { const ph = ((t * .9 + k / 3) % 1); g.strokeStyle = on ? `rgba(255,194,161,${(1 - ph) * .7})` : `rgba(143,211,255,${(1 - ph) * .7})`; g.lineWidth = 2; g.beginPath(); g.arc(cx, cy, 22 + ph * 26, 0, 6.2832); g.stroke(); }
    g.fillStyle = on ? PEACH : AIC; g.beginPath(); g.arc(cx, cy, 22, 0, 6.2832); g.fill();
    g.fillStyle = '#141018'; g.font = '700 22px "Noto Sans CJK SC"'; g.textAlign = 'center'; g.fillText('☎', cx, cy + 8); g.textAlign = 'left';
    g.font = '500 30px "Noto Sans CJK SC"'; g.fillStyle = WHITE; g.letterSpacing = '2px'; g.fillText(on ? (m.zhOn || '已接通') : m.zh, x + 104, y + 48); g.letterSpacing = '0px';
    const sec = on ? Math.floor(t - m.on) : 0; g.font = '400 15px JBM'; g.fillStyle = on ? 'rgba(255,194,161,.85)' : 'rgba(143,211,255,.75)'; g.letterSpacing = '3px'; g.fillText(on ? 'CONNECTED · 00:' + String(sec).padStart(2, '0') : (m.en || 'CALLING'), x + 106, y + 80); g.letterSpacing = '0px';
  } else {
    g.fillStyle = '#fff'; g.font = FZ; g.letterSpacing = '1px'; g.textAlign = 'left'; g.fillText(m.zh, x + 27, y + 45); g.letterSpacing = '0px';
    if (m.en) { g.font = FE; g.fillStyle = me ? 'rgba(255,255,255,.85)' : 'rgba(190,218,244,.72)'; g.fillText(m.en, x + 27, y + 81); }
  }
  g.restore();
}
function chatItems(t, msgs) { const it = []; for (const m of msgs) { if (m.ty !== undefined && t >= m.ty && t < m.t) it.push({ side: 'ai', typing: true, t0: m.ty }); if (t >= m.t) it.push(Object.assign({ t0: m.t }, m)); } return it; }
function drawChat(g, t, msgs, cx, top, bot, a, hw, head) {
  if (a < .01) return;
  g.save(); g.globalAlpha = a; rr2(g, cx - hw, top, hw * 2, bot - top, 32); g.fillStyle = 'rgba(11,10,17,.7)'; g.fill(); g.strokeStyle = 'rgba(255,190,210,.18)'; g.lineWidth = 1.5; g.stroke();
  avatar(g, cx - hw + 54, top + 48, 21, t); g.textAlign = 'left'; g.font = '700 25px "Noto Sans CJK SC"'; g.fillStyle = WHITE; g.fillText('它', cx - hw + 90, top + 46);
  g.font = '300 13px JBM, "Noto Sans CJK SC"'; g.fillStyle = 'rgba(143,211,255,.8)'; g.letterSpacing = '2px'; g.fillText(head || '● 在线 · ONLINE', cx - hw + 90, top + 70); g.letterSpacing = '0px';
  g.fillStyle = 'rgba(255,255,255,.08)'; g.fillRect(cx - hw + 26, top + 94, hw * 2 - 52, 1);
  g.restore();
  g.save(); rr2(g, cx - hw, top + 96, hw * 2, bot - top - 96, 32); g.clip();
  const it = chatItems(t, msgs); let y = bot - 30;
  for (let k = it.length - 1; k >= 0; k--) {
    const m = it[k], h = bubbleSize(g, m)[1]; let p = easeOut5((t - m.t0) / .38); if (m.ty !== undefined && !m.typing) p = lerp(84 / (h + 18), 1, p);
    y -= (h + 18) * p; if (y < top - 220) break;
    const pop = m.typing ? .7 + .3 * easeBack((t - m.t0) / .3) : .55 + .45 * easeBack((t - m.t0) / .34);
    drawBubble(g, m, m.side === 'me' ? cx + hw - 30 : cx - hw + 30, y, a * clamp((t - m.t0) / .14), pop, t);
  }
  g.restore();
}
/* depth-of-field text in world space */
function zText(x, y, z, str, sub, col, focus, a, size = .36, glow = 18) {
  if (!proj(x, y, z)) return; const zc = PR.z; if (zc < .35) return;
  const al = a * clamp((zc - .35) / 1.1) * clamp((22 - zc) / 9); if (al < .01) return;
  const px = size * PR.k, bl = Math.min(22, Math.abs(zc - focus) * 3.4);
  ctx.save(); ctx.filter = bl > .6 ? `blur(${bl.toFixed(1)}px)` : 'none'; ctx.globalAlpha = al; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = `700 ${px.toFixed(1)}px "Noto Serif CJK SC"`; ctx.letterSpacing = (px * .12).toFixed(1) + 'px'; ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = glow; ctx.fillText(str, PR.x, PR.y);
  ctx.shadowBlur = 0; ctx.letterSpacing = (px * .05).toFixed(1) + 'px'; if (sub) { ctx.font = `300 ${(px * .17).toFixed(1)}px JBM`; ctx.fillStyle = 'rgba(230,220,235,.7)'; ctx.fillText(sub, PR.x, PR.y + px * .72); }
  ctx.restore(); ctx.letterSpacing = '0px';
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

/* ---------- per-particle constants ---------- */
const D = new Float32Array(N), PH = new Float32Array(N), Q = new Float32Array(N), NV = new Float32Array(N * 3), DUST = new Float32Array(N * 3);
for (let i = 0; i < N; i++) {
  D[i] = R(); PH[i] = R() * 6.2832; Q[i] = R();
  let x = gauss(), y = gauss(), z = gauss(), l = Math.hypot(x, y, z) || 1;
  NV[i * 3] = x / l; NV[i * 3 + 1] = y / l; NV[i * 3 + 2] = z / l;
  DUST[i * 3] = (R() * 2 - 1) * 4.5; DUST[i * 3 + 1] = (R() * 2 - 1) * 2.6; DUST[i * 3 + 2] = (R() * 2 - 1) * 3;
}
function mk(o) { for (const k of ['P', 'C', 'V', 'bP', 'bC']) o[k] = new Float32Array(N * 3); for (const k of ['B', 'S', 'bB', 'bS']) o[k] = new Float32Array(N); return o; }
function setB(s, i, x, y, z, c, br, sz) { const j = i * 3; s.bP[j] = x; s.bP[j + 1] = y; s.bP[j + 2] = z; s.bC[j] = c[0]; s.bC[j + 1] = c[1]; s.bC[j + 2] = c[2]; s.bB[i] = br; s.bS[i] = sz; }
function dustB(s, i0, i1, br = .08, col = COL.dim) { for (let i = i0; i < i1; i++) setB(s, i, DUST[i * 3], DUST[i * 3 + 1], DUST[i * 3 + 2], col, br * (.4 + Q[i]), .0045); }
function copyBase(s) { s.P.set(s.bP); s.C.set(s.bC); s.B.set(s.bB); s.S.set(s.bS); s.V.fill(0); }
function driftDust(s, t, i0, i1, sp = 1) { const P = s.P; for (let i = i0; i < i1; i++) { const j = i * 3; P[j + 1] = ((s.bP[j + 1] + 2.6 + t * (.03 + .05 * Q[i]) * sp) % 5.2 + 5.2) % 5.2 - 2.6; P[j] += Math.sin(t * .2 + PH[i]) * .08; } }
/* nervous tremble: high-frequency jitter */
function jitter(s, t, amp, i0 = 0, i1 = N) { if (amp <= 0) return; const P = s.P, f = Math.floor(t * 30); for (let i = i0; i < i1; i++) { const j = i * 3; P[j] += (hash(i * 3 + f * 7919) - .5) * amp; P[j + 1] += (hash(i * 5 + f * 104729) - .5) * amp; } }
function setC(s, i, c) { const j = i * 3; s.C[j] = c[0]; s.C[j + 1] = c[1]; s.C[j + 2] = c[2]; }

/* ---------- scene helpers ---------- */
const TINT = [COL.rose, COL.peach, COL.gold, COL.ai];
const WARM = [COL.peach, COL.gold, COL.rose], COOL = [COL.ai, COL.lilac, COL.ai];
const WX = sx => (sx - W / 2) / 256.5, WY = sy => -(sy - H / 2) / 256.5;
function dustScene(o) {
  return mk(Object.assign({
    init() { R = mulberry(o.seed || 1); const tn = o.tints || TINT; for (let i = 0; i < N; i++) { const big = Q[i] < .035; setB(this, i, DUST[i * 3], DUST[i * 3 + 1], DUST[i * 3 + 2], tn[Math.floor(hash(i * 17 + (o.seed || 1)) * tn.length)], (o.br || .06) * (.3 + Q[i]) * (big ? 2.2 : 1), big ? .011 : .0045); } },
    update(t) { copyBase(this); driftDust(this, t, 0, N, o.sp || .5); },
    cam(t) { return C({ dist: 4 }); }
  }, o));
}
/* typewriter with deletes: steps [t0, t1, text, 'type'|'del'] */
function typer(t, steps) { let s = ''; for (const [a, b, txt, m] of steps) { if (t < a) break; const p = clamp((t - a) / (b - a)); if (m === 'type') s = txt.slice(0, Math.round(p * txt.length)); else s = txt.slice(0, Math.round((1 - p) * txt.length)); } return s; }
function cursorOn(t) { return Math.floor(t * 2.4) % 2 === 0; }
/* paper slip (woodblock chapter) */
function slip(x, y, txt, ai, t0, t, a) {
  const p = t - t0; if (p < 0 || a < .01) return; const sc = 1 + .45 * (1 - easeOut5(p / .28)), al = a * clamp(p / .08);
  ctx.save(); ctx.translate(x, y); ctx.rotate(ai ? .022 : -.028); ctx.scale(sc, sc); ctx.globalAlpha = al;
  ctx.font = '500 32px "Noto Serif CJK SC"'; ctx.letterSpacing = '4px'; const w = ctx.measureText(txt).width + 76;
  ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 8; ctx.fillStyle = '#EFE3CB'; ctx.fillRect(0, 0, w, 78); ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
  ctx.strokeStyle = 'rgba(80,50,30,.35)'; ctx.lineWidth = 1; ctx.strokeRect(6, 6, w - 12, 66);
  ctx.fillStyle = '#2B1D14'; ctx.textAlign = 'left'; ctx.fillText(txt, 34, 50); ctx.letterSpacing = '0px';
  if (ai) { ctx.fillStyle = '#B8322A'; ctx.fillRect(w - 30, 8, 22, 22); ctx.fillStyle = '#EFE3CB'; ctx.font = '700 14px "Noto Serif CJK SC"'; ctx.textAlign = 'center'; ctx.fillText('它', w - 19, 25); }
  ctx.restore();
}
/* soft card */
function card(x, y, w, h, a, warm) { ctx.save(); ctx.globalAlpha = a; rr(x, y, w, h, 18); ctx.fillStyle = warm ? 'rgba(40,28,22,.62)' : 'rgba(14,16,26,.66)'; ctx.fill(); ctx.strokeStyle = warm ? 'rgba(255,214,170,.28)' : 'rgba(158,220,255,.3)'; ctx.lineWidth = 1.2; ctx.stroke(); ctx.restore(); }
function typingBubble(x, y, a, t, sc = 1, col = 'rgba(26,30,48,.9)') { if (a < .01) return; ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.scale(sc, sc); rr(0, 0, 124, 68, 26); ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = 'rgba(143,211,255,.45)'; ctx.lineWidth = 1.4; ctx.stroke(); for (let k = 0; k < 3; k++) { const b = Math.max(0, Math.sin(t * 7 - k * .9)); ctx.fillStyle = `rgba(210,232,255,${.45 + .55 * b})`; ctx.beginPath(); ctx.arc(36 + k * 26, 35 - 6 * b, 7, 0, 6.2832); ctx.fill(); } ctx.restore(); }
function clockStr(m) { m = ((Math.floor(m) % 1440) + 1440) % 1440; return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); }

const BR = new Float32Array(WH), BG = new Float32Array(WH), BB = new Float32Array(WH);
const PC = document.createElement('canvas'); PC.width = W; PC.height = H; const pcx = PC.getContext('2d');
const img = pcx.createImageData(W, H); for (let i = 3; i < img.data.length; i += 4) img.data[i] = 255;
const LUT = new Uint8ClampedArray(4096); for (let i = 0; i < 4096; i++) LUT[i] = Math.round(255 * (1 - Math.exp(-i / 512)));
const FP = new Float32Array(N * 3), FC = new Float32Array(N * 3), FV = new Float32Array(N * 3), FB = new Float32Array(N), FS = new Float32Array(N);
const b1 = document.createElement('canvas'); b1.width = 480; b1.height = 270; const b1x = b1.getContext('2d');
const b2 = document.createElement('canvas'); b2.width = 240; b2.height = 135; const b2x = b2.getContext('2d');
const SPL = document.createElement('canvas'); SPL.width = W; SPL.height = H; const splx = SPL.getContext('2d');
const GR = []; { const r = mulberry(99); for (let k = 0; k < 6; k++) { const c = document.createElement('canvas'); c.width = 960; c.height = 540; const x = c.getContext('2d'), d = x.createImageData(960, 540); for (let i = 0; i < d.data.length; i += 4) { const v = r() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; } x.putImageData(d, 0, 0); GR.push(c); } }
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
