/* "0.01" — a racing-goggles launch film (1:45, 1920x1080, 30 fps, 105 BPM).
   One continuous camera through a frozen hundredth of a second. world.js draws the pool; this file directs it. */
import * as G from './world.js';
const { THREE } = G;
const W = 1920, H = 1080, BEAT = 60 / 105, BAR = BEAT * 4, DUR = 105.14;
const bar = n => n * BAR;
const cv = document.getElementById('c'), ctx = cv.getContext('2d');

/* ---------- maths ---------- */
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = x => { x = clamp(x); return x * x * (3 - 2 * x); };
const ease = x => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const easeOut = x => 1 - Math.pow(1 - clamp(x), 3);
const easeOut5 = x => 1 - Math.pow(1 - clamp(x), 5);
const easeIn = x => Math.pow(clamp(x), 3);
const easeBack = x => { x = clamp(x); const c = 1.6; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
const win = (t, a, b, fi = .4, fo = .4) => smooth((t - a) / fi) * (1 - smooth((t - (b - fo)) / fo));
const hash = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const beatPulse = (t, d = .1) => Math.exp(-((t % BEAT + BEAT) % BEAT) / d);

/* ---------- key times ---------- */
const T = { freeze: bar(4), title: bar(5), line: bar(6), curve: bar(8), cushion: bar(10), lens: bar(12), slam: bar(14), fog: bar(16), clear: bar(17), col: bar(18), wall: bar(20), adj: bar(22), spec: bar(24), you: bar(26), brk: bar(28), dive: bar(31), resume: bar(32), touch: bar(32) + BEAT, sky: bar(33), hero: bar(36), lock: bar(40) };
const G0 = new THREE.Vector3(0, .25, 1.4), MC = new THREE.Vector3(-.9, .52, 2.2);
const INK = '#0c1220', INK2 = '#4c566a', INK3 = '#8e98aa', RED = '#e3343f';
const IRI = ['#7b5cff', '#3fa8ff', '#19c2b4', '#f2b33d'];

/* ---------- time warps ---------- */
function tau1(t) { const ts = T.freeze - .22, tf = T.freeze + .08; if (t < ts) return 0; if (t < tf) return t - ts; const a = .30 + .06 * (1 - Math.exp(-(t - tf) / .25)) + .0012 * (t - tf); if (t < T.resume) return a; const ar = .30 + .06 + .0012 * (T.resume - tf); return ar + (t - T.resume) * 1.1; }
function tau2(t) { const t0 = T.touch; if (t < t0) return 0; const u = t - t0; if (u < .26) return u; const hold = T.hero - .5 - t0; if (u < hold) return .26 + .16 * (1 - Math.exp(-(u - .26) / .6)) + .028 * (u - .26); const h = .26 + .16 + .028 * (hold - .26); return h + (u - hold) * 1.0; }
function waveT(t) { if (t < T.freeze) return t; const f = T.freeze + .35 * (1 - Math.exp(-(t - T.freeze) / .35)) + .012 * (t - T.freeze); if (t < T.resume) return f; const fr = T.freeze + .35 + .012 * (T.resume - T.freeze); return fr + (t - T.resume); }

/* ---------- camera ---------- */
const K = [];
const key = (t, p, l, fov, roll = 0) => K.push({ t, p: new THREE.Vector3(...p), l: new THREE.Vector3(...l), fov, roll });
key(T.freeze, [0, .20, 1.40], [0, .10, -2.0], 64);
key(T.freeze + .5, [-.10, .27, 1.02], [1.7, .28, .1], 50, -.12);
key(T.freeze + 1.15, [0, .30, .70], [0, .25, 1.40], 34);
key(T.title, [0, .30, .66], [0, .26, 1.40], 32);
key(T.line, [.06, .29, .62], [0, .27, 1.40], 32);
key(T.curve - .3, [.24, .28, .72], [0, .25, 1.40], 31);
key(T.curve + .55, [.64, .27, 1.14], [0, .245, 1.40], 30, .05);
key(T.cushion - .3, [.58, .27, 1.22], [0, .245, 1.40], 28);
key(T.cushion + .6, [.14, .30, 2.02], [0, .245, 1.40], 30, -.04);
key(T.lens - .3, [.05, .28, 1.94], [0, .245, 1.40], 28);
key(T.lens + .7, [-.50, .52, 1.20], [-.9, .52, 2.2], 34);
key(T.slam - .15, [-1.62, .60, 1.42], [-.9, .52, 2.2], 32);
key(T.slam + .5, [-1.70, .58, 1.60], [-.9, .52, 2.2], 30);
key(T.fog - .4, [-1.35, .52, 1.30], [-.9, .52, 2.2], 26);
key(T.fog + .5, [0, .245, 1.43], [0, .16, -2], 62);
key(T.col - .2, [0, .245, 1.39], [0, .16, -2], 60);
key(T.col + .3, [0, .42, 1.75], [2.6, .5, 1.9], 52, .1);
key(T.col + .75, [0, .62, 2.6], [0, .85, 9], 48);
key(T.col + BAR, [0, .82, 5.6], [0, .9, 13], 48);
key(T.wall - .1, [0, .9, 10.6], [0, 1.2, 17], 46);
key(T.wall + .8, [0, 1.25, 11.2], [0, 1.25, 17], 40);
key(T.adj - .3, [0, 1.25, 10.7], [0, 1.25, 17], 38);
key(T.adj + .6, [5.65, 1.05, 11.9], [5.26, .98, 15], 38);
key(T.spec - .3, [4.9, 1.05, 12.05], [5.26, .98, 15], 36);
key(T.spec + .5, [2.05, .30, 13.75], [.95, .16, 11.9], 40);
key(T.you - .2, [2.05, .29, 8.95], [.95, .16, 7.1], 40);
key(T.you + 1.1, [1.15, .36, 3.2], [0, .25, 1.4], 36);
key(T.you + BAR, [.52, .30, .76], [0, .25, 1.4], 32);
key(T.brk - .2, [.2, .30, .66], [0, .25, 1.4], 30);
key(T.brk + BAR, [0, 1.25, -.8], [0, .35, 2.6], 40);
key(T.dive - .2, [0, 2.3, -2.2], [0, .25, 4.0], 42);
key(T.dive + 1.0, [.5, .7, 2.3], [0, .25, 1.4], 46, .08);
key(T.resume - .28, [0, .25, 1.46], [0, .14, -2], 60);
key(T.resume, [0, .25, 1.40], [0, .12, -2], 62);
key(T.touch - .02, [0, .12, .27], [0, .02, -2], 72);
// hidden cut inside the touch flash: the sky studio
const K2 = [];
const key2 = (t, p, l, fov, roll = 0) => K2.push({ t, p: new THREE.Vector3(...p), l: new THREE.Vector3(...l), fov, roll });
key2(T.touch, [0, .5, .6], [0, 8, 1.7], 44);
key2(T.hero - .7, [0, .56, .62], [0, 8, 1.9], 40);
key2(T.hero + .7, [0, .31, .60], [0, .25, 1.4], 33);
key2(T.lock, [.04, .30, .56], [0, .25, 1.4], 31);
key2(bar(44), [0, .33, .46], [0, .27, 1.4], 32);
key2(DUR + 1, [0, .35, .40], [0, .28, 1.4], 33);
const hv = new THREE.Vector3(), hw = new THREE.Vector3();
function hermite(Ks, i, u, f, out) { // non-uniform Catmull-Rom
  const k0 = Ks[Math.max(0, i - 1)], k1 = Ks[i], k2 = Ks[i + 1], k3 = Ks[Math.min(Ks.length - 1, i + 2)], dt = k2.t - k1.t;
  const E = 1e-5, hold = (a, b) => a[f].distanceToSquared(b[f]) < E;
  if (hold(k1, k2)) return out.copy(k1[f]);
  const m1 = hv.copy(k2[f]).sub(k0[f]).multiplyScalar(dt / Math.max(1e-4, k2.t - k0.t)), m2 = hw.copy(k3[f]).sub(k1[f]).multiplyScalar(dt / Math.max(1e-4, k3.t - k1.t));
  if (k0 !== k1 && hold(k0, k1)) m1.set(0, 0, 0); if (k3 !== k2 && hold(k2, k3)) m2.set(0, 0, 0);
  m1.multiplyScalar(.7); m2.multiplyScalar(.7);
  const u2 = u * u, u3 = u2 * u; out.set(0, 0, 0).addScaledVector(k1[f], 2 * u3 - 3 * u2 + 1).addScaledVector(m1, u3 - 2 * u2 + u).addScaledVector(k2[f], -2 * u3 + 3 * u2).addScaledVector(m2, u3 - u2); return out;
}
const cp = new THREE.Vector3(), cl = new THREE.Vector3();
function setCamera(t) {
  let fov, roll = 0;
  if (t < T.freeze) { // swimmer's eyes: last metres of the race
    const u = t / T.freeze, z = lerp(19.5, 1.4, u), ph = t / BEAT * Math.PI;
    cp.set(.05 * Math.sin(ph), .13 + .035 * Math.sin(ph * 2 + 1.), z); cl.set(.25 * Math.sin(ph), .02 - .05 * Math.sin(ph * 2), z - 3.2); fov = 64; roll = .11 * Math.sin(ph);
  } else {
    const Ks = t < T.touch ? K : K2; let i = 0; while (i < Ks.length - 2 && t >= Ks[i + 1].t) i++;
    const k1 = Ks[i], k2 = Ks[i + 1], u = clamp((t - k1.t) / (k2.t - k1.t)), e = u * u * (3 - 2 * u), ue = lerp(u, e, .65);
    hermite(Ks, i, ue, 'p', cp); hermite(Ks, i, ue, 'l', cl); fov = lerp(k1.fov, k2.fov, e); roll = lerp(k1.roll, k2.roll, e);
    // living camera: breath drift + a tiny push on each kick
    const d = .004; cp.x += d * Math.sin(t * .9); cp.y += d * .7 * Math.sin(t * 1.3 + 1);
    if (t > T.lens && t < T.brk || t > T.resume && t < T.lock) fov -= .5 * beatPulse(t, .09);
    if (t > T.slam && t < T.slam + .5) { const s = .012 * Math.exp(-(t - T.slam) / .12); cp.x += s * (hash(Math.floor(t * 60)) - .5); cp.y += s * (hash(Math.floor(t * 60) + 5) - .5); }
  }
  G.camera.position.copy(cp); G.camera.up.set(0, 1, 0); G.camera.lookAt(cl); if (roll) G.camera.rotateZ(roll);
  G.camera.fov = fov; G.camera.updateProjectionMatrix(); G.camera.updateMatrixWorld();
}
const camSpace = (x, y, z, out) => { out.set(x, y, -z).applyMatrix4(G.camera.matrixWorld); return out; };

/* ---------- assets ---------- */
const CLIPS = { belt: 170, curve: 245, cushion: 170, front: 292, hero: 211, lenspair: 56, nosecg: 208, bridgehow: 241, straphow: 126 };
const MATTED = new Set(['belt', 'curve', 'cushion', 'front', 'hero', 'lenspair', 'nosecg']);
const CACHE = new Map(); let REQ = [];
const loadImg = src => new Promise(r => { const im = new Image(); im.onload = () => r(im); im.onerror = () => r(null); im.src = src; });
const fpath = (dir, name, f) => `${dir}/${name}/${String(clamp(Math.round(f), 1, CLIPS[name])).padStart(4, '0')}.jpg`;
async function preload() {
  const need = new Set(); for (const r of REQ) { need.add(fpath('clips', r.name, r.f)); if (MATTED.has(r.name)) need.add(fpath('matte', r.name, r.f)); }
  for (const p of need) if (!CACHE.has(p)) CACHE.set(p, await loadImg(p));
  if (CACHE.size > 160) { for (const k of [...CACHE.keys()]) { if (CACHE.size <= 90) break; if (!need.has(k)) CACHE.delete(k); } }
}
const IMG = {};
const bbA = G.makeBB(), bbB = G.makeBB(), bbC = G.makeBB();
const cardN = G.makeCard(16 / 9), cardR = G.makeCard(16 / 9), loupe = G.makeCard(1, 1);
let wordmark, wordmarkR, cw = [], badges = [];
function tintCanvas(im, col) { const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const g = c.getContext('2d'); g.drawImage(im, 0, 0); g.globalCompositeOperation = 'source-in'; g.fillStyle = col; g.fillRect(0, 0, c.width, c.height); return c; }
function textCanvas(s, font, col, pad = 40, ls = 0) { const c = document.createElement('canvas'), g = c.getContext('2d'); g.font = font; g.letterSpacing = ls + 'px'; const m = g.measureText(s), h = parseInt(font.match(/(\d+)px/)[1]); c.width = Math.ceil(m.width + pad * 2); c.height = Math.ceil(h * 1.25 + pad * 2); const q = c.getContext('2d'); q.font = font; q.letterSpacing = ls + 'px'; q.fillStyle = col; q.textBaseline = 'alphabetic'; q.fillText(s, pad, pad + h); return c; }
const BLAB = [['高级防雾', 'ANTI-FOG'], ['简易调节扣', 'QUICK ADJUSTER'], ['UV 防护', 'UV CUT'], ['弧形镜片', 'CURVED LENS'], ['鼻桥可调', 'ADJUSTABLE BRIDGE'], ['抗菌', 'ANTIBACTERIAL'], ['世界泳联认证', 'WORLD AQUATICS APPROVED']];
async function loadStatic() {
  for (const k of ['wordmark', 'logo_white', 'qr', 'badge0', 'badge1', 'badge2', 'badge3', 'badge4', 'badge5', 'badge6']) IMG[k] = await loadImg(`assets/${k}.png`);
  IMG.wordInk = tintCanvas(IMG.wordmark, INK); IMG.logo = tintCanvas(IMG.logo_white, INK); IMG.logoRed = tintCanvas(IMG.logo_white, RED);
  wordmark = G.makeSprite(IMG.wordInk, IMG.wordmark.width / IMG.wordmark.height); wordmarkR = G.makeSprite(IMG.wordInk, IMG.wordmark.width / IMG.wordmark.height); wordmarkR.material.depthTest = false; wordmarkR.renderOrder = 2;
  for (let k = 0; k < CW.length; k++) { const im = await loadImg(`cut/${CW[k][0]}.png`); const s = G.makeSprite(im, im.width / im.height); s.userData.asp = im.width / im.height; cw.push(s); }
  for (let k = 0; k < 7; k++) { // badge plates
    const c = document.createElement('canvas'); c.width = 720; c.height = 480; const g = c.getContext('2d');
    g.fillStyle = '#ffffff'; g.beginPath(); g.roundRect(8, 8, 704, 464, 44); g.fill(); g.strokeStyle = 'rgba(12,18,32,.14)'; g.lineWidth = 4; g.stroke();
    const b = tintCanvas(IMG['badge' + k], INK), bw = Math.min(560, 190 * b.width / b.height * (k === 6 ? .75 : 1)), bh = bw * b.height / b.width; g.drawImage(b, 360 - bw / 2, 190 - bh / 2, bw, bh);
    g.fillStyle = INK; g.textAlign = 'center'; g.font = '700 58px "Noto Sans CJK SC"'; g.fillText(BLAB[k][0], 360, 380); g.font = '500 24px JBM'; g.fillStyle = INK2; g.letterSpacing = '4px'; g.fillText(BLAB[k][1], 360, 428);
    g.fillStyle = RED; g.fillRect(300, 448, 120, 6);
    badges.push(G.makeSprite(c, 1.5)); }
}

/* =====================================================================
   STAGE — pose the world for time t
   ===================================================================== */
const v1 = new THREE.Vector3(), v2 = new THREE.Vector3(), q1 = new THREE.Quaternion(), m4 = new THREE.Matrix4();
const HELIX = CW.map((c, i) => { const a = i * 2.39996, r = .62 + .32 * hash(i * 3.3); return [Math.cos(a) * r, .86 + Math.sin(a) * r * .62, 3.7 + i * .245, (hash(i * 5.1) - .5) * .5, (hash(i * 9.7) - .5) * .7]; });
const GRID = CW.map((c, i) => { const col = i % 9, row = Math.floor(i / 9), n = row === 4 ? 7 : 9; return [(col - (n - 1) / 2) * .64, 2.12 - row * .44, 17 + .25 * Math.cos((col - 4) * .35) - .25]; });
const req = (bb, name, f) => REQ.push({ bb, name, f });
function stage(t) {
  REQ = [];
  setCamera(t);
  const cam = G.camera, pov = povAmount(t);
  /* water + splash */
  const frozen = t >= T.freeze && t < T.resume;
  G.waterU.uCalm.value = t < T.freeze ? 1.25 : 1;
  if (t < T.touch) { G.SPL.c.set(0, 0, 1.4); const ta = tau1(t), alive = t < T.resume ? 1 : 1 - smooth((t - T.resume - .25) / .3); G.poseSplash(ta, alive, t); G.poseCrown(ta, .6 * alive * (1 - smooth((t - T.curve + .3) / .6) + smooth((t - T.you - 1.3) / .9)));
    G.waterU.uRip.value.set(0, 1.4, ta > 0 ? ta : -1, 1.3); }
  else { G.SPL.c.set(0, 0, .3); const tb = tau2(t), alive = 1 - smooth((t - T.hero - .3) / .5); G.poseSplash(tb, alive, t); G.poseCrown(0, 0);
    G.waterU.uRip.value.set(0, .3, t - T.touch, 1.6 * (1 - smooth((t - T.touch - 3) / 3))); }
  // second ripple: the title rising out of the water, later rain
  const tr = t - T.title; G.waterU.uRip2.value.set(0, 9, tr > 0 && t < T.lens ? Math.min(.9, tr * .45) : -1, 2.2);
  G.waterU.uRain.value = t > T.hero - .4 ? (1 - smooth((t - T.hero - 4) / 6)) * smooth((t - T.hero + .4) / .5) : 0;

  /* the goggles at G0 (billboards A/B cross-fade between clips) */
  G.hideBB(bbA); G.hideBB(bbB); G.hideBB(bbC);
  const R = .5; // reflection strength
  const show = (bb, name, f, w, a, o = {}) => { if (a <= .003) return; req(bb, name, f); bb._pose = [o.pos || G0, w, a, o]; };
  bbA._pose = bbB._pose = bbC._pose = null;
  if (t >= T.freeze + .55 && t < T.curve + .9) { // reveal + title + slow orbit, then whip to the side
    const a = smooth((t - T.freeze - .55) / .3) * (1 - smooth((t - T.curve - .5) / .4));
    const f = t < T.line ? 292 : t < T.curve ? lerp(292, 236, ease((t - T.line) / (T.curve - T.line))) : lerp(236, 40, easeOut((t - T.curve) / .7));
    show(bbA, 'front', f, .34, a, { reflect: R });
  }
  if (t >= T.curve + .45 && t < T.cushion + .5) { const a = smooth((t - T.curve - .45) / .45) * (1 - smooth((t - T.cushion - .1) / .4)); show(bbB, 'curve', 34 + (t - T.curve - .45) * 38, lerp(1.0, 1.12, smooth((t - T.curve) / 4.5)), a, { pos: new THREE.Vector3(.03, .275, 1.46) }); }
  { const on = t >= T.cushion + .1 && t < T.lens + .6; loupe.visible = on; if (on) { const a = smooth((t - T.cushion - .1) / .4) * (1 - smooth((t - T.lens - .15) / .4)), p = easeBack((t - T.cushion - .1) / .6); loupe.position.set(.105, .262, 1.4); loupe.quaternion.copy(G.camera.quaternion); loupe.scale.setScalar(.25 * Math.max(.001, p) * (1 + .04 * smooth((t - T.cushion) / 4.5))); loupe.material.uniforms.uA.value = a; REQ.push({ card: loupe, name: 'cushion', f: 1 + (t - T.cushion) * 34 }); } }
  if (t >= T.lens + .4 && t < T.fog + .3) show(bbB, 'front', 120, .34, smooth((t - T.lens - .4) / .5) * (1 - smooth((t - T.fog + .1) / .3)), { reflect: R });
  if (t >= T.col + .2 && t < T.you + .6) show(bbA, 'front', 200, .34, smooth((t - T.col - .2) / .4) * (1 - smooth((t - T.you - .2) / .4)), { reflect: R });
  if (t >= T.you + .2 && t < T.brk + .7) { const a = smooth((t - T.you - .2) / .5) * (1 - smooth((t - T.brk - .2) / .5)); show(bbB, 'hero', lerp(96, 211, ease((t - T.you - .2) / 4.6)), .33, a, { reflect: R }); }
  if (t >= T.brk + .2 && t < T.resume - .2) show(bbA, 'front', 292, .34, smooth((t - T.brk - .2) / .5) * (1 - smooth((t - T.resume + .55) / .3)), { reflect: R });
  // sky studio: the product as a giant, one macro per bar
  if (t >= T.touch && t < T.hero + .2) {
    const M = [['curve', 60, 30, T.sky - .9, T.sky + BAR], ['belt', 6, 28, T.sky + BAR, T.sky + 2 * BAR], ['nosecg', 20, 30, T.sky + 2 * BAR, T.hero - .1]];
    M.forEach(([name, f0, rate, a0, a1], k) => { const u = (t - a0) / (a1 - a0); if (u < -.02 || u > 1.08) return; const bb = [bbA, bbB, bbC][k];
      const a = smooth((t - a0) / .16) * (1 - smooth((t - a1 + .1) / .16)), dir = k % 2 ? -1 : 1, sc = lerp(1.18, 1.0, easeOut5(u * 2.2)) * lerp(1, 1.1, u);
      camSpace(dir * lerp(.10, -.06, u), lerp(-.03, .02, u) + (k === 0 ? .08 : 0), 1.25, v2); show(bb, name, f0 + (t - a0) * rate, 2.25 * sc, a, { pos: v2.clone(), roll: dir * lerp(.06, .0, easeOut(u * 2)) }); });
  }
  if (t >= T.hero - .3) { const a = smooth((t - T.hero + .3) / .8); show(bbA, 'front', lerp(120, 292, ease((t - T.hero) / 7)), .34, a, { reflect: R * smooth((t - T.hero) / 2) }); }
  if (pov > .5) { bbA._pose = bbB._pose = bbC._pose = null; REQ = REQ.filter(r => !r.bb); }

  /* wordmark standing on the water */
  { const up = easeBack((t - T.title) / .9), a = (t >= T.title ? 1 : 0) * (1 - smooth((t - T.fog + .6) / .6)) + smooth((t - T.hero) / 1.5);
    const vis = a > .01 && up > 0; wordmark.visible = wordmarkR.visible = vis;
    if (vis) { const w = 6.4, h = w / (IMG.wordmark.width / IMG.wordmark.height), y = lerp(-.4, 1.02, t < T.fog ? up : 1);
      wordmark.position.set(0, y, 9); wordmark.scale.set(w, w, 1); wordmark.rotation.set(0, Math.PI, 0); wordmark.material.opacity = clamp(a);
      wordmarkR.position.set(0, -y, 9); wordmarkR.scale.set(w, -w, 1); wordmarkR.rotation.set(0, Math.PI, 0); wordmarkR.material.opacity = clamp(a) * .22; }
  }

  /* lens layers: glass / mirror / glass */
  { const on = t >= T.lens + .1 && t < T.fog + .25; G.layers.forEach(l => l.visible = on);
    if (on) { const sep = (t < T.slam ? smooth((t - T.lens - .1) / .9) * (1 - easeIn((t - T.slam + .2) / .2)) : 0), hit = t >= T.slam ? Math.exp(-(t - T.slam) / .3) : 0, sc = .2 * smooth((t - T.lens - .1) / .5) * (1 - smooth((t - T.fog - .05) / .2)) * (1 + .06 * hit);
      const ry = t < T.slam ? lerp(1.32, 1.18, smooth((t - T.lens) / (T.slam - T.lens))) : lerp(1.18, .78, easeOut((t - T.slam) / 1.6)) + (t - T.slam) * .03;
      G.layers.forEach((l, i) => { const o = (i - 1) * sep * .30; l.rotation.set(.06, ry, .04); v1.set(0, 0, 1).applyEuler(l.rotation); l.position.copy(MC).addScaledVector(v1, o); l.position.y += .015 * Math.sin(t * .8); l.scale.setScalar(sc); l.material.uniforms.uA.value = i === 1 ? 1 : lerp(.25, .95, sep); }); }
  }

  /* colourways: helix tunnel -> wall */
  { const a = smooth((t - T.col + .4) / .5), on = t >= T.col - .4;
    cw.forEach((s, i) => { s.visible = on; if (!on) return; const hp = HELIX[i], gp = GRID[i], k = ease((t - T.wall + .25 - i * .012) / .9);
      const pop = easeBack((t - T.col + .3 - i * .02) / .5), drift = .03 * Math.sin(t * .5 + i);
      s.position.set(lerp(hp[0], gp[0], k), lerp(hp[1] + drift, gp[1], k), lerp(hp[2], gp[2], k));
      const w = lerp(.44, .52, k) * Math.max(.001, pop); s.scale.set(w, w, 1); s.rotation.set(hp[3] * .4 * (1 - k), Math.PI + hp[4] * (1 - k), hp[3] * (1 - k)); s.material.opacity = a * (1 - smooth((t - T.resume + .2) / .4)); s.visible = on && t < T.resume + .3; }); }

  /* adjust cards */
  { const on = t >= T.adj - .3 && t < T.you + .8; cardN.visible = cardR.visible = on;
    if (on) { const a = smooth((t - T.adj + .3) / .5) * (1 - smooth((t - T.you) / .7));
      [[cardN, 'bridgehow', 5.9, 0], [cardR, 'straphow', 4.62, .35]].forEach(([c, name, x, d]) => { const p = easeBack((t - T.adj + .1 - d) / .6); c.position.set(x, 1.1 + (1 - p) * -.3, 15 + (x > 5 ? .12 : 0)); c.scale.setScalar(1.18 * Math.max(.001, p)); c.rotation.set(0, Math.PI + (x > 5 ? -.12 : .12), 0); c.material.uniforms.uA.value = a; REQ.push({ card: c, name, f: 8 + (t - T.adj) * 22 }); }); }
  }

  /* spec badges standing on the lane rope */
  badges.forEach((b, k) => { const t0 = T.spec + k * BEAT * .98 + .1, p = easeBack((t - t0) / .4), on = t >= t0 && t < T.brk + 3; b.visible = on && p > 0; if (!b.visible) return;
    b.position.set(1.25, .055 + .14 * p, 12.2 - k * .7); b.scale.set(.42, .42 * Math.max(.001, p), 1); b.rotation.set(0, .8, 0); b.material.opacity = 1 - smooth((t - T.brk - 1) / 2); });

}
function applyImages() {
  for (const bb of [bbA, bbB, bbC]) { if (!bb._pose) { G.hideBB(bb); continue; } const r = REQ.find(x => x.bb === bb); if (!r) { G.hideBB(bb); continue; }
    const im = CACHE.get(fpath('clips', r.name, r.f)), mt = MATTED.has(r.name) ? CACHE.get(fpath('matte', r.name, r.f)) : null; if (!im) { G.hideBB(bb); continue; }
    G.setBBImage(bb, im, mt); const [pos, w, a, o] = bb._pose; G.poseBB(bb, pos, w, a, o); }
  for (const r of REQ) if (r.card) { const im = CACHE.get(fpath('clips', r.name, r.f)); G.swapImage(r.card.material.uniforms.uC.value, im); }
}

/* =====================================================================
   HUD — type, clock, the lens you look through
   ===================================================================== */
function rr(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
function txt(s, x, y, f, col, a = 1, align = 'left', ls = 0) { if (a <= .005) return; ctx.save(); ctx.globalAlpha *= a; ctx.font = f; ctx.fillStyle = col; ctx.textAlign = align; ctx.letterSpacing = ls + 'px'; ctx.fillText(s, x, y); ctx.restore(); }
function reveal(s, x, y, size, t0, t, t1, o = {}) {
  const a = o.a ?? 1; if (t < t0 || a <= .005) return 0; const f = `${o.w || 800} ${size}px ${o.fam || '"Inter Display", Inter'}`, ls = o.ls ?? -size * .035, per = o.per ?? .026, col = o.col || INK, out = t1 ? smooth((t - t1) / .35) : 0; if (out >= 1) return 0;
  ctx.save(); ctx.font = f; ctx.letterSpacing = ls + 'px'; const total = ctx.measureText(s).width; let cx = o.align === 'center' ? x - total / 2 : o.align === 'right' ? x - total : x;
  if (o.glow !== false) { ctx.shadowColor = o.glowCol || 'rgba(255,255,255,.95)'; ctx.shadowBlur = o.glow || 26; }
  [...s].forEach((ch, i) => { const w = ctx.measureText(ch).width + ls, p = easeOut5((t - t0 - i * per) / .5); if (p > 0) { const bl = (1 - p) * 10 + out * 8; ctx.globalAlpha = a * clamp(p * 1.3) * (1 - out); ctx.filter = bl > .3 ? `blur(${bl.toFixed(1)}px)` : 'none'; ctx.fillStyle = col; ctx.fillText(ch, cx, y + (1 - p) * size * .3 - out * size * .12); } cx += w; });
  ctx.restore(); return total;
}
function sub(s, x, y, t0, t, t1, o = {}) { const p = easeOut((t - t0) / .5), ou = t1 ? smooth((t - t1) / .35) : 0, a = (o.a ?? 1) * p * (1 - ou); if (a < .01) return; ctx.save(); ctx.shadowColor = 'rgba(255,255,255,.95)'; ctx.shadowBlur = 18; txt(s, x, y + (1 - p) * 14, `${o.w || 600} ${o.size || 36}px "Noto Sans CJK SC"`, o.col || INK, a, o.align || 'left', o.ls ?? 2); ctx.restore(); }
function label(s, x, y, t0, t, t1, o = {}) { if (t < t0) return; const n = Math.floor((t - t0) / .02), ou = t1 ? smooth((t - t1) / .3) : 0, a = (o.a ?? 1) * (1 - ou); if (a < .01) return; ctx.save(); ctx.shadowColor = 'rgba(255,255,255,.9)'; ctx.shadowBlur = 12;
  const shown = s.slice(0, n); txt(shown, x, y, `500 ${o.size || 18}px JBM`, o.col || INK2, a, o.align || 'left', 2);
  if (n < s.length + 8 && Math.floor(t * 5) % 2 === 0) { ctx.font = `500 ${o.size || 18}px JBM`; ctx.letterSpacing = '2px'; const w = ctx.measureText(shown).width; ctx.fillStyle = RED; ctx.globalAlpha = a; ctx.fillRect((o.align === 'center' ? x + w / 2 : x + w) + 3, y - (o.size || 18) + 2, 9, o.size || 18); } ctx.restore(); }
function plate(x, y, w, h, a) { if (a < .01) return; const g = ctx.createRadialGradient(x + w / 2, y + h / 2, 0, x + w / 2, y + h / 2, Math.max(w, h) * .62); g.addColorStop(0, `rgba(255,255,255,${.62 * a})`); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.scale(1, h / w * 1.3); ctx.translate(-x - w / 2, -y - h / 2); ctx.fillStyle = g; ctx.fillRect(x - w, y - w, w * 3, w * 3); ctx.restore(); }
function pill(s, x, y, t0, t, a = 1, o = {}) { const p = easeBack((t - t0) / .4); if (p <= 0 || a < .01) return 0; ctx.save(); ctx.font = `600 ${o.size || 28}px "Noto Sans CJK SC", Inter`; ctx.letterSpacing = '1px'; const w = ctx.measureText(s).width + 66, h = (o.size || 28) + 38;
  ctx.globalAlpha = a * clamp(p * 1.4); ctx.translate(x, y); ctx.scale(lerp(.8, 1, p), lerp(.8, 1, p)); ctx.shadowColor = 'rgba(20,40,80,.18)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 8; rr(0, -h / 2, w, h, h / 2); ctx.fillStyle = 'rgba(255,255,255,.95)'; ctx.fill(); ctx.shadowColor = 'transparent';
  ctx.fillStyle = o.dot || RED; ctx.beginPath(); ctx.arc(27, 0, 6.5, 0, 6.283); ctx.fill(); ctx.fillStyle = INK; ctx.textBaseline = 'middle'; ctx.fillText(s, 46, 2); ctx.restore(); return w; }
function callout(t, a, t0, ax, ay, lx, ly, zh, en) { const la = a * smooth((t - t0) / .35); if (la < .01) return; const d = easeOut((t - t0) / .55), ex = lerp(ax, lx, d), ey = lerp(ay, ly, d);
  ctx.save(); ctx.globalAlpha = la; ctx.strokeStyle = 'rgba(255,255,255,.95)'; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ex, ey); ctx.stroke(); ctx.strokeStyle = INK; ctx.lineWidth = 1.4; ctx.stroke();
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(ax, ay, 10, 0, 6.283); ctx.fill(); ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(ax, ay, 5.5, 0, 6.283); ctx.fill(); ctx.restore();
  const right = lx >= ax, ta = la * smooth((t - t0 - .25) / .35), ox = right ? 16 : -16; ctx.save(); ctx.shadowColor = 'rgba(255,255,255,.95)'; ctx.shadowBlur = 16;
  txt(zh, lx + ox, ly - 2, '700 32px "Noto Sans CJK SC"', INK, ta, right ? 'left' : 'right', 2); txt(en, lx + ox, ly + 26, '500 14px JBM', INK2, ta, right ? 'left' : 'right', 2); ctx.restore(); }
const flashAt = (t, at, a = .9, d = .3) => { const u = t - at; if (u >= 0 && u < d) { ctx.fillStyle = `rgba(255,255,255,${a * Math.pow(1 - u / d, 1.5)})`; ctx.fillRect(0, 0, W, H); } };

/* through-the-lens: how much we are inside the goggles */
function povAmount(t) { return t < T.freeze ? 1 : t < T.freeze + .45 ? 1 - smooth((t - T.freeze) / .45) : (t >= T.fog + .1 && t < T.col + .35) ? smooth((t - T.fog - .1) / .4) * (1 - smooth((t - T.col) / .35)) : (t >= T.resume - .45 && t < T.touch + .1) ? smooth((t - T.resume + .45) / .4) : 0; }
const LENSPATH = (() => { const c = new THREE.CatmullRomCurve3(G.LENS_OUTLINE.map(([x, y]) => new THREE.Vector3(x, y, 0)), true, 'centripetal'); return c.getPoints(160).map(p => [p.x, p.y]); })();
function lensFrame(a, zoom = 1) { // the dark gasket and mirror tint at the edge of sight
  if (a < .01) return; ctx.save(); ctx.globalAlpha = a;
  const sx = 1010 * zoom, sy = 990 * zoom, cx = W / 2 + 40, cy = H / 2 + 20;
  const path = () => { ctx.beginPath(); ctx.rect(-200, -200, W + 400, H + 400); LENSPATH.forEach(([x, y], i) => { const X = cx + x * sx, Y = cy - y * sy; i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }); ctx.closePath(); };
  ctx.save(); ctx.shadowColor = 'rgba(8,12,18,.9)'; ctx.shadowBlur = 90; path(); ctx.fillStyle = '#0b0f15'; ctx.fill('evenodd'); ctx.restore();
  ctx.save(); ctx.shadowColor = 'rgba(8,12,18,1)'; ctx.shadowBlur = 30; path(); ctx.fillStyle = '#0b0f15'; ctx.fill('evenodd'); ctx.restore();
  // mirror tint breathing at the rim
  const g = ctx.createRadialGradient(cx, cy, 380 * zoom, cx, cy, 1150 * zoom); g.addColorStop(0, 'rgba(25,194,180,0)'); g.addColorStop(.7, 'rgba(25,194,180,.10)'); g.addColorStop(1, 'rgba(123,92,255,.22)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.restore();
}
const LDROPS = Array.from({ length: 26 }, (_, i) => [hash(i * 2.1) * W, hash(i * 4.7) * H, 5 + hash(i * 8.3) * 16, hash(i * 1.9)]);
function lensWater(t, a) { // water running off the lens with each stroke
  if (a < .01) return; ctx.save(); ctx.globalAlpha = a;
  const ph = (t / BEAT) % 1, y = lerp(-300, H + 300, easeIn(ph * 1.15)), k = Math.sin(Math.PI * clamp(ph * 1.15));
  const g = ctx.createLinearGradient(0, y - 260, 0, y + 120); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.75, `rgba(235,250,255,${.22 * k})`); g.addColorStop(.92, `rgba(255,255,255,${.5 * k})`); g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, y - 260); for (let x = 0; x <= W; x += 40) ctx.lineTo(x, y - 260 + 0); for (let x = W; x >= 0; x -= 40) ctx.lineTo(x, y + 90 + 18 * Math.sin(x * .004 + t * 3)); ctx.closePath(); ctx.fill();
  LDROPS.forEach(([x, y0, r, s]) => { const yy = (y0 + t * (20 + 60 * s)) % (H + 40) - 20; const gg = ctx.createRadialGradient(x - r * .3, yy - r * .3, 0, x, yy, r); gg.addColorStop(0, 'rgba(255,255,255,.85)'); gg.addColorStop(.5, 'rgba(210,240,250,.22)'); gg.addColorStop(1, 'rgba(120,180,200,.28)'); ctx.fillStyle = gg; ctx.beginPath(); ctx.ellipse(x, yy, r * .85, r * 1.15, 0, 0, 6.283); ctx.fill(); });
  ctx.restore();
}
const FOGD = Array.from({ length: 520 }, (_, i) => [hash(i * 3.1), hash(i * 7.7), .5 + hash(i * 1.3)]);
function fogOverlay(t) { // CH4 inside the goggles: fog builds, then one film of water clears it
  if (t < T.fog || t > T.col + .4) return; const build = smooth((t - T.fog - .35) / 1.3), sweep = easeOut5((t - T.clear) / .9), gone = smooth((t - T.col + .2) / .5);
  ctx.save();
  const edge = lerp(-.25, 1.45, sweep); // clear film sweeps from the top-left
  ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.clip();
  // fog = white veil + condensation beads, cut by the sweep line
  const off = document.createElement('canvas'); off.width = W / 4; off.height = H / 4; const g = off.getContext('2d');
  g.fillStyle = `rgba(244,248,251,${.86 * build})`; g.fillRect(0, 0, off.width, off.height);
  FOGD.forEach(([x, y, r]) => { g.fillStyle = `rgba(255,255,255,${.55 * build})`; g.beginPath(); g.arc(x * off.width, y * off.height, r * 2.2, 0, 6.283); g.fill(); g.fillStyle = `rgba(170,190,205,${.35 * build})`; g.beginPath(); g.arc(x * off.width + .6, y * off.height + .8, r * 1.3, 0, 6.283); g.fill(); });
  if (sweep > 0) { g.globalCompositeOperation = 'destination-out'; const gx = g.createLinearGradient(0, 0, off.width, off.height * .8); const e0 = clamp(edge - .12, 0, .998), e1 = clamp(Math.max(e0 + .001, edge), 0, .999); gx.addColorStop(0, 'rgba(0,0,0,1)'); gx.addColorStop(e0, 'rgba(0,0,0,1)'); gx.addColorStop(e1, 'rgba(0,0,0,0)'); gx.addColorStop(1, edge >= 1.1 ? 'rgba(0,0,0,1)' : 'rgba(0,0,0,0)'); g.fillStyle = gx; g.fillRect(0, 0, off.width, off.height); }
  ctx.globalAlpha = 1 - gone; ctx.imageSmoothingEnabled = true; ctx.filter = 'blur(6px)'; ctx.drawImage(off, 0, 0, W, H); ctx.filter = 'none';
  if (sweep > 0 && sweep < 1) { const gx = ctx.createLinearGradient(0, 0, W, H * .8), e = clamp(edge); gx.addColorStop(clamp(e - .05), 'rgba(255,255,255,0)'); gx.addColorStop(clamp(e - .005), 'rgba(255,255,255,.85)'); gx.addColorStop(clamp(e + .01), 'rgba(160,230,245,.5)'); gx.addColorStop(clamp(e + .05), 'rgba(255,255,255,0)'); ctx.fillStyle = gx; ctx.fillRect(0, 0, W, H); }
  ctx.restore();
}

/* clock + the hundredth-of-a-second ruler */
function clockVal(t) { if (t < T.freeze) return 23.90 - (T.freeze - t); if (t < T.resume) return 23.90; if (t < T.touch) return 23.90 + .01 * easeIn((t - T.resume) / (T.touch - T.resume)); return 23.91; }
const CHS = [['CURVE', T.curve], ['CUSHION', T.cushion], ['MIRROR', T.lens], ['ANTI-FOG', T.fog], ['COLOUR', T.col], ['ADJUST', T.adj], ['SPEC', T.spec], ['YOU', T.you]];
function chrome(t, a, dark) {
  if (a < .01) return; ctx.save(); ctx.globalAlpha = a; const C1 = dark ? '#fff' : INK, C2 = dark ? 'rgba(255,255,255,.75)' : INK2;
  ctx.shadowColor = dark ? 'rgba(0,0,0,.5)' : 'rgba(255,255,255,.9)'; ctx.shadowBlur = 14;
  const sw = dark ? IMG.logo_white : IMG.logo, hh = 24, ww = hh * sw.width / sw.height; ctx.drawImage(sw, 72, 48, ww, hh);
  txt('MODEL NAME  ·  型号名', 72 + ww + 18, 68, '500 18px Inter, "Noto Sans CJK SC"', C2, 1);
  const frozen = t >= T.freeze && t < T.resume, v = clockVal(t);
  txt(v.toFixed(2), W - 72, 76, '700 34px JBM', frozen ? RED : C1, 1, 'right', 1); txt('s', W - 52, 76, '500 18px JBM', C2, 1, 'left');
  if (frozen) { const bl = .55 + .45 * Math.sin(t * 5); txt('❚❚  TIME FROZEN · 时间静止', W - 72, 106, '500 13px JBM, "Noto Sans CJK SC"', RED, bl, 'right', 2); }
  else if (t >= T.touch) txt('FINISH · 触壁', W - 72, 106, '500 13px JBM, "Noto Sans CJK SC"', C2, 1, 'right', 2);
  else txt('LANE 4 · 50M FREE · FINAL', W - 72, 106, '500 13px JBM', C2, 1, 'right', 2);
  // ruler: the whole frozen film happens between 23.90 and 23.91
  const ra = smooth((t - T.freeze - 1.4) / .6) * (1 - smooth((t - T.touch - .2) / .5));
  if (ra > .01) { ctx.globalAlpha = a * ra; const y = 1014, x0 = 72, x1 = W - 72, p = clamp((t - T.freeze) / (T.resume - T.freeze));
    ctx.fillStyle = 'rgba(12,18,32,.22)'; ctx.fillRect(x0, y, x1 - x0, 1.5); ctx.fillStyle = INK; ctx.fillRect(x0, y, (x1 - x0) * p, 2);
    for (let m = 0; m <= 10; m++) { const x = x0 + (x1 - x0) * m / 10; ctx.fillStyle = 'rgba(12,18,32,.4)'; ctx.fillRect(x, y - (m % 5 === 0 ? 8 : 4), 1.5, m % 5 === 0 ? 8 : 4); if (m % 5 === 0) txt((23.9 + m / 1000).toFixed(3) + ' s', x, y + 30, '500 13px JBM', INK2, 1, m === 0 ? 'left' : m === 10 ? 'right' : 'center', 1); }
    CHS.forEach(([n, t0], i) => { const x = x0 + (x1 - x0) * (t0 - T.freeze) / (T.resume - T.freeze), on = t >= t0; ctx.fillStyle = on ? INK : 'rgba(12,18,32,.3)'; ctx.beginPath(); ctx.arc(x, y + 1, on ? 4 : 3, 0, 6.283); ctx.fill(); const cur = on && (i === CHS.length - 1 ? t < T.brk : t < CHS[i + 1][1]); if (cur) txt(n, x, y - 18, '500 12px JBM', INK, 1, 'center', 2); });
    const px = x0 + (x1 - x0) * p; ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(px, y + 1, 8 + 2.5 * beatPulse(t, .12), 0, 6.283); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(px, y + 1, 3, 0, 6.283); ctx.fill(); }
  ctx.restore();
}
// chapter block, lower left
function chapter(t, t0, t1, lab, lines, o = {}) { // lines: [[en, zh, start, end]]
  if (t < t0 - .1 || t > t1 + .5) return; const x = o.x ?? 120, y = o.y ?? 770, a = win(t, t0, t1 + .3, .3, .35); plate(x - 80, y - 150, 1100, 330, a * .9);
  label(lab, x + 4, y - 96, t0 + .05, t, t1 - .1);
  for (const [en, zh, a0, a1, size] of lines) { reveal(en, x, y, size || 104, a0, t, a1); sub(zh, x + 4, y + 66, a0 + .35, t, a1); }
}
function hud(t) {
  const pov = povAmount(t);
  ctx.save(); ctx.letterSpacing = '0px'; ctx.filter = 'none';
  /* lens overlays */
  if (pov > .01) { if (t < T.freeze + .5) lensWater(t, pov * .9); fogOverlay(t); lensFrame(pov, lerp(1.25, 1, pov)); }
  /* A: last metres */
  if (t < T.freeze + .3) { const a = 1 - smooth((t - T.freeze + .25) / .25);
    ctx.save(); ctx.globalAlpha = a; txt(clockVal(t).toFixed(2), W / 2, 250, '800 150px "Inter Display", Inter', '#fff', smooth(t / .5) * .96, 'center', -6); ctx.restore();
    ctx.save(); ctx.shadowColor = 'rgba(0,20,40,.55)'; ctx.shadowBlur = 24;
    reveal('最后十五米。', W / 2, 820, 76, .7, t, 3.6, { align: 'center', fam: '"Noto Sans CJK SC"', w: 800, ls: 6, col: '#fff', glowCol: 'rgba(0,30,50,.6)', per: .07, a });
    txt('LAST 15 METRES', W / 2, 870, '500 18px JBM', '#fff', win(t, 1.2, 3.9, .4, .3) * a, 'center', 6);
    reveal('比赛，往往只差 0.01 秒。', W / 2, 820, 76, 4.4, t, 8.5, { align: 'center', fam: '"Noto Sans CJK SC"', w: 800, ls: 4, col: '#fff', glowCol: 'rgba(0,30,50,.6)', per: .05, a });
    txt('RACES ARE WON BY A HUNDREDTH OF A SECOND', W / 2, 870, '500 18px JBM', '#fff', win(t, 5.0, 8.8, .4, .3) * a, 'center', 6); ctx.restore(); }
  /* B: freeze */
  if (t >= T.freeze - .05 && t < T.title + .2) { const u = t - T.freeze, p = easeOut5(u / .35), go = easeIn((u - .75) / .55);
    const sz = lerp(lerp(520, 400, p), 34, go), x = lerp(W / 2, W - 72 - 60, go), y = lerp(600, 76, go); if (go < 1 && u >= 0) { ctx.save(); ctx.shadowColor = 'rgba(255,255,255,.9)'; ctx.shadowBlur = 40; txt('23.90', x, y + (go < .01 ? (hash(Math.floor(t * 30)) - .5) * 16 * Math.exp(-u / .15) : 0), `800 ${sz.toFixed(0)}px "Inter Display", Inter`, INK, clamp(u / .05) * (1 - go * .3), 'center', -sz * .04); ctx.restore(); }
    txt('TIME FROZEN — 0.01 s BEFORE THE WALL', W / 2, 760, '500 22px JBM', INK, win(u, .3, 1.25, .25, .3), 'center', 8); }
  if (t >= T.title && t < T.curve) { const a = 1 - smooth((t - T.curve + .4) / .4);
    sub('型号名  ·  为速度与贴合而生', W / 2, 905, T.title + .9, t, T.line - .3, { align: 'center', size: 34, ls: 10, a });
    plate(W / 2 - 700, 820, 1400, 190, win(t, T.line, T.curve, .4, .4) * .8);
    reveal('这 0.01 秒里，藏着一副泳镜的全部。', W / 2, 905, 60, T.line + .1, t, T.curve - .45, { align: 'center', fam: '"Noto Sans CJK SC"', w: 800, ls: 3, per: .045 });
    txt('INSIDE THIS HUNDREDTH: EVERYTHING A PAIR OF GOGGLES CAN DO', W / 2, 955, '500 17px JBM', INK2, win(t, T.line + .9, T.curve - .3, .4, .3), 'center', 5); }
  /* C: curve */
  chapter(t, T.curve + .35, T.cushion - .2, 'CH 01  ·  CURVE LENS  ·  弧面破水', [['Curved lens.', '独家弧形镜片专利，视野更开阔。', T.curve + .45, T.curve + BAR - .1], ['Cuts the water.', '切削眼尾侧镜框，破水更快。', T.curve + BAR + .05, T.cushion - .25]]);
  { const a = win(t, T.curve + 1.0, T.cushion - .2, .3, .3); callout(t, a, T.curve + 1.1, 1180, 470, 1010, 250, '弧形镜片专利', 'PATENTED CURVED LENS'); callout(t, a, T.curve + BAR + .3, 1500, 600, 1560, 880, '眼尾镜框切削', 'EYE-TAIL CUT · LOWER DRAG'); }
  /* D: cushion */
  chapter(t, T.cushion + .35, T.lens - .2, 'CH 02  ·  3D CUSHION  ·  立体锁合', [['3D cushion.', '专为亚洲脸型设计的立体密封垫。', T.cushion + .45, T.cushion + BAR - .1], ['No leaks. No slipping.', '起跳入水、转身蹬壁，都稳稳贴合。', T.cushion + BAR + .05, T.lens - .25, 88]]);
  { const a = win(t, T.cushion + .6, T.lens - .2, .2, .3); ['亚洲脸型定制', '抗菌材质', '防漏 · 防移位'].forEach((s, k) => pill(s, 1330 + k * 30, 250 + k * 96, T.cushion + .8 + k * BEAT, t, a, { dot: [RED, IRI[2], IRI[0]][k] })); }
  /* E: the mirror layer */
  chapter(t, T.lens + .5, T.fog - .25, 'CH 03  ·  MIRROR INSIDE THE LENS', [['A mirror inside the lens.', '镜膜层，嵌进镜片的中间层。', T.lens + .6, T.slam - .15, 96], ["Won't scratch. Won't peel.", '一体成型，不刮花，不脱落。', T.slam + .1, T.fog - .3, 84]]);
  { const a = win(t, T.lens + 1.1, T.slam - .1, .3, .2), P = i => { const l = G.layers[i]; return G.toScreen(v1.copy(l.position).add(v2.set(.12, .09, 0))); }; if (a > .01 && G.layers[0].visible) { const L = [['镜片层', 'LENS'], ['镜面层', 'MIRROR · 镜膜'], ['镜片层', 'LENS']]; [0, 1, 2].forEach(i => { const p = P(i); callout(t, a, T.lens + 1.2 + i * .28, p[0], p[1], 1500, 250 + i * 150, L[i][0], L[i][1]); }); }
    const ta = win(t, T.slam + .5, T.fog - .25, .2, .3); ['防刮', '不脱落', '一体成型'].forEach((s, k) => pill(s, 1280, 300 + k * 96, T.slam + .6 + k * BEAT, t, ta, { dot: IRI[k] })); }
  /* F: anti-fog, seen from inside */
  if (t >= T.fog + .3 && t < T.col + .1) { const a = 1 - smooth((t - T.col + .25) / .3); ctx.save(); ctx.globalAlpha = a;
    label('CH 04  ·  ANTI-FOG  ·  防雾', W / 2, 640, T.fog + .4, t, T.col - .2, { align: 'center', col: INK });
    reveal('Anti-fog.', W / 2, 780, 120, T.fog + .5, t, T.clear - .1, { align: 'center' });
    sub('起雾了？', W / 2, 860, T.fog + 1.1, t, T.clear - .1, { align: 'center', size: 44 });
    reveal('Clear, lap after lap.', W / 2, 780, 120, T.clear + .25, t, T.col - .25, { align: 'center' });
    sub('遇水激活，内侧一层超薄水膜，全程清晰。', W / 2, 860, T.clear + .6, t, T.col - .25, { align: 'center', size: 40 }); ctx.restore(); }
  /* G: colours */
  if (t >= T.col + .4 && t < T.adj + .2) { const a = 1 - smooth((t - T.adj + .15) / .3);
    const n = Math.min(43, Math.floor(1 + 42 * clamp((t - T.col - .5) / (T.wall + .6 - T.col - .5))));
    plate(40, 640, 760, 360, a * .8); ctx.save(); ctx.shadowColor = 'rgba(255,255,255,.95)'; ctx.shadowBlur = 30;
    txt(String(n), 110, 900, '800 300px "Inter Display", Inter', INK, a * smooth((t - T.col - .4) / .3), 'left', -12); ctx.restore();
    label('CH 05  ·  COLOURWAYS  ·  配色', 124, 650, T.col + .5, t, T.adj - .2);
    sub('款实拍配色', 500, 830, T.col + .9, t, T.adj - .2, { size: 44, w: 800 });
    sub('每一种颜色，都是一种出发状态。', 124, 960, T.wall + .6, t, T.adj - .2, { size: 40 }); txt('EVERY COLOUR IS A WAY TO START', 126, 1000 - 8, '500 15px JBM', INK2, win(t, T.wall + 1, T.adj - .1, .3, .3), 'left', 4); }
  /* H: adjust */
  chapter(t, T.adj + .4, T.spec - .25, 'CH 06  ·  QUICK ADJUST  ·  快调系统', [['Swap. Adjust. Go.', '鼻桥向上一滑就换；调节扣一推一拉。', T.adj + .5, T.spec - .3, 92]], { y: 860 });
  /* I: spec */
  chapter(t, T.spec + .3, T.you - .2, 'CH 07  ·  RACE SPEC  ·  竞赛级配置', [['Race spec.', '七项竞赛级配置，世界泳联认证。', T.spec + .4, T.you - .25]], { x: 1010, y: 860 });
  /* J: you */
  if (t >= T.you + .1 && t < T.brk + .2) { const a = 1 - smooth((t - T.brk - .05) / .2); const P = [['备战各级赛事的运动员', 'COMPETITIVE SWIMMERS'], ['对速度和贴合较真的铁三玩家', 'TRIATHLETES WHO WANT EVERY HUNDREDTH'], ['受够了漏水、滑脱的亚洲脸型泳者', 'DONE WITH LEAKS AND SLIPPING']];
    plate(60, 250, 1100, 600, a * .85); reveal('If you are —', 120, 330, 84, T.you + .15, t, T.brk - .1);
    P.forEach(([zh, en], k) => { const t0 = T.you + .5 + k * BEAT * 2, p = easeOut5((t - t0) / .45); if (p <= 0) return; const y = 480 + k * 135, dx = (1 - p) * 70; ctx.save(); ctx.globalAlpha = p * a; ctx.shadowColor = 'rgba(255,255,255,.95)'; ctx.shadowBlur = 18; txt('0' + (k + 1), 120 + dx, y + 6, '800 64px "Inter Display", Inter', RED, 1, 'left', -2); txt(zh, 235 + dx, y - 12, '700 44px "Noto Sans CJK SC"', INK, 1, 'left', 1); txt(en, 237 + dx, y + 28, '500 15px JBM', INK2, 1, 'left', 3); ctx.restore(); }); }
  /* K: the held breath */
  if (t >= T.brk + .3 && t < T.resume) { const a = win(t, T.brk + .3, T.dive + .5, .8, .5); ctx.save(); ctx.shadowColor = 'rgba(255,255,255,.95)'; ctx.shadowBlur = 40;
    txt('23.90', W / 2, 470, '800 300px "Inter Display", Inter', INK, a, 'center', -12); ctx.restore();
    reveal('还差 0.01 秒。', W / 2, 600, 72, T.brk + 1.3, t, T.dive + .3, { align: 'center', fam: '"Noto Sans CJK SC"', w: 800, ls: 8, per: .09 });
    txt('ONE HUNDREDTH TO GO', W / 2, 656, '500 20px JBM', INK2, win(t, T.brk + 2.2, T.dive + .4, .5, .4), 'center', 10);
    reveal('它不是一副普通的泳镜，是你在水里的第二层皮肤。', W / 2, 900, 46, T.brk + 4.2, t, T.dive + .4, { align: 'center', fam: '"Noto Sans CJK SC"', w: 700, ls: 3, per: .035 });
    txt("NOT JUST GOGGLES. YOUR SECOND SKIN.", W / 2, 944, '500 16px JBM', INK2, win(t, T.brk + 5.2, T.dive + .4, .5, .4), 'center', 6); }
  /* L: touch */
  if (t >= T.resume - .1 && t < T.touch + .05) { const u = (t - T.resume) / (T.touch - T.resume); txt(clockVal(t).toFixed(3), W / 2, 300, '800 170px "Inter Display", Inter', '#fff', clamp(u * 4 + .2), 'center', -6); }
  if (t >= T.touch && t < T.sky - .2) { const u = t - T.touch, p = easeOut5(u / .3), o = smooth((u - 1.0) / .35); ctx.save(); ctx.globalAlpha = 1 - o; ctx.translate(W / 2, 560); ctx.scale(lerp(1.5, 1, p), lerp(1.5, 1, p)); txt('23.91', 0, 60, '800 420px "Inter Display", Inter', INK, clamp(u / .05), 'center', -18); ctx.restore();
    txt('触壁。', W / 2, 800, '800 84px "Noto Sans CJK SC"', RED, win(u, .25, 1.3, .2, .3), 'center', 12); txt('TOUCH · 1ST · LANE 4', W / 2, 856, '500 22px JBM', INK, win(u, .4, 1.3, .2, .3), 'center', 8); }
  /* sky studio: the product as a giant, one line per bar */
  if (t >= T.sky - .9 && t < T.hero + .1) { const L = [['LOCK ON.', '锁定目标', T.sky - .9, T.sky + BAR], ['OWN THE WATER.', '征服水域', T.sky + BAR, T.sky + 2 * BAR], ['MODEL.', '型号名', T.sky + 2 * BAR, T.hero]];
    L.forEach(([en, zh, a0, a1], k) => { if (t < a0 || t > a1 + .1) return; const u = t - a0, p = easeOut5(u / .3), o = smooth((t - a1 + .14) / .14), dir = k % 2 ? 1 : -1;
      ctx.save(); ctx.globalAlpha = (1 - o) * clamp(u / .06); ctx.translate(W / 2 + dir * (1 - p) * 500 - dir * u * 14, 0); ctx.shadowColor = 'rgba(8,14,28,.55)'; ctx.shadowBlur = 50; ctx.shadowOffsetY = 10;
      txt(en, 0, 890, `900 ${en.length > 8 ? 190 : 250}px "Inter Display", Inter`, '#fff', 1, 'center', -8); ctx.shadowBlur = 20; txt(zh, 0, 980, '800 62px "Noto Sans CJK SC"', '#fff', smooth((u - .15) / .25), 'center', 24); ctx.restore(); }); }
  /* M / N: lock-up */
  if (t >= T.hero + .9) { const a = 1;
    plate(W / 2 - 560, 770, 1120, 240, smooth((t - T.hero - .9) / .8) * .85);
    reveal('锁定目标，征服水域。', W / 2, 880, 70, T.hero + 1.2, t, 0, { align: 'center', fam: '"Noto Sans CJK SC"', w: 800, ls: 10, per: .07 });
    label('LOCK ON.  OWN THE WATER.', W / 2, 936, T.hero + 2.4, t, 0, { align: 'center', size: 18, col: INK2 });
    const qa = smooth((t - T.lock - .3) / .7), qs = 150, qx = W - 150 - qs, qy = 730;
    if (qa > .01) { ctx.save(); ctx.globalAlpha = qa; ctx.shadowColor = 'rgba(20,40,80,.2)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 16; rr(qx - 18, qy - 18, qs + 36, qs + 36, 24); ctx.fillStyle = '#fff'; ctx.fill(); ctx.shadowColor = 'transparent'; ctx.drawImage(IMG.qr, qx, qy, qs, qs); ctx.restore();
      ctx.save(); ctx.shadowColor = 'rgba(255,255,255,.95)'; ctx.shadowBlur = 14; txt('扫码 · 即刻入手', qx + qs / 2, qy + qs + 62, '700 20px "Noto Sans CJK SC"', INK, qa, 'center', 2); txt('SCAN TO SHOP', qx + qs / 2, qy + qs + 90, '500 13px JBM', INK2, qa, 'center', 2); ctx.restore(); }
    const sa = smooth((t - T.lock) / .7); if (sa > .01) { const s = IMG.logoRed, hh = 64, ww = hh * s.width / s.height; ctx.save(); ctx.globalAlpha = sa; ctx.shadowColor = 'rgba(255,255,255,.9)'; ctx.shadowBlur = 20; ctx.drawImage(s, 150, 790, ww, hh); ctx.restore(); txt('MODEL NAME · 型号名', 152, 896, '500 16px JBM, "Noto Sans CJK SC"', INK2, sa, 'left', 3); } }
  ctx.restore();
  /* chrome + hits */
  const dark = t < T.freeze;
  chrome(t, (t < 1 ? smooth(t / 1) : 1) * (t > T.touch && t < T.hero ? .0 + smooth((t - T.hero + .5) / .5) : 1) * (1 - smooth((t - DUR + 2.6) / 1.6)), dark);
  flashAt(t, T.freeze, 1, .5); flashAt(t, T.title, .35, .25); flashAt(t, T.curve, .3, .2); flashAt(t, T.cushion, .3, .2); flashAt(t, T.lens, .3, .2); flashAt(t, T.slam, .85, .35); flashAt(t, T.clear, .4, .25);
  flashAt(t, T.wall, .35, .2); flashAt(t, T.adj, .25, .2); flashAt(t, T.spec, .25, .2); flashAt(t, T.you, .25, .2); flashAt(t, T.touch, 1, .7); flashAt(t, T.hero, .5, .35);
  { const u = t - T.touch + .06; if (u >= 0 && u < .08) { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H); } }
  const fade = smooth((t - (DUR - 2.4)) / 2.2); if (fade > 0) { ctx.fillStyle = `rgba(246,249,252,${fade})`; ctx.fillRect(0, 0, W, H); }
}

/* ---------- frame ---------- */
window.frameJPEG = async (t, q = .92) => {
  stage(t); await preload(); applyImages();
  const c = G.render(waveT(t)); ctx.globalAlpha = 1; ctx.filter = 'none'; ctx.drawImage(c, 0, 0);
  // soft vignette + highlight bloom for polish
  const vg = ctx.createRadialGradient(W / 2, H / 2, 500, W / 2, H / 2, 1180); vg.addColorStop(0, 'rgba(20,40,70,0)'); vg.addColorStop(1, 'rgba(20,40,70,.16)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  hud(t);
  return cv.toDataURL('image/jpeg', q);
};
window.ready = (async () => { for (const f of ['800 40px "Inter Display"', '900 40px "Inter Display"', '500 40px Inter', '500 20px JBM', '700 20px JBM', '900 40px "Noto Sans CJK SC"', '700 40px "Noto Sans CJK SC"', '500 20px "Noto Sans CJK SC"']) await document.fonts.load(f); await loadStatic(); return true; })();
