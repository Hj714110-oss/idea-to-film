/* engine_frame.js — compositor: paper/slate background, ink or light particles, overlays, subtitles */
const FILM = window.FILM || {};
const FLASHES = FILM.flashes || []; const DIPS = FILM.dips || [];
const PC = document.createElement('canvas'); PC.width = W; PC.height = H; const pcx = PC.getContext('2d');
const pimg = pcx.createImageData(W, H);
const LUTA = new Uint8ClampedArray(4096), LUTI = new Uint8ClampedArray(4096);
for (let i = 0; i < 4096; i++) { LUTA[i] = Math.round(255 * (1 - Math.exp(-i / 512))); LUTI[i] = Math.round(255 * Math.exp(-i / 380)); }
const FP = new Float32Array(N * 3), FC = new Float32Array(N * 3), FV = new Float32Array(N * 3), FB = new Float32Array(N), FS = new Float32Array(N);
const b1 = document.createElement('canvas'); b1.width = 480; b1.height = 270; const b1x = b1.getContext('2d');
const b2 = document.createElement('canvas'); b2.width = 240; b2.height = 135; const b2x = b2.getContext('2d');
/* paper texture + grain */
const PAPER = document.createElement('canvas'); PAPER.width = W; PAPER.height = H;
{ const x = PAPER.getContext('2d'), d = x.createImageData(W, H), r = mulberry(5); let fib = new Float32Array(W);
  for (let i = 0; i < W; i++) fib[i] = r();
  for (let y = 0, o = 0; y < H; y++) for (let xx = 0; xx < W; xx++, o += 4) { const n = r() * .55 + .45 * fib[(xx + y * 3) % W]; const v = 255 - n * 20; d.data[o] = v; d.data[o + 1] = v - 1; d.data[o + 2] = v - 4; d.data[o + 3] = 255; }
  x.putImageData(d, 0, 0); }
const GR = []; { const r = mulberry(99); for (let k = 0; k < 6; k++) { const c = document.createElement('canvas'); c.width = 960; c.height = 540; const x = c.getContext('2d'), d = x.createImageData(960, 540); for (let i = 0; i < d.data.length; i += 4) { const v = r() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; } x.putImageData(d, 0, 0); GR.push(c); } }

function drawSub(t, t0, t1, zh, en, ai) {
  if (t < t0 - .1 || t > t1 + .1) return; const ao = smooth((t1 - t) / .4), dk = DARK > .5, hx = HX();
  const chars = parseRich(zh), font = ai ? '400 33px "Noto Sans CJK SC"' : '400 34px "Noto Serif CJK SC"'; ctx.font = font; ctx.textAlign = 'left'; ctx.letterSpacing = '0px';
  const ls = ai ? 7 : 5, ws = chars.map(c => ctx.measureText(c[0]).width + ls), tot = ws.reduce((a, b) => a + b, 0) - ls; let x = W / 2 - tot / 2; const y = 960;
  const base = dk ? (ai ? '#FBEFE8' : IVORY) : INK;
  chars.forEach(([ch, col], k) => {
    const lt = t0 + k * (ai ? .05 : .035), a = smooth((t - lt) / .3) * ao;
    if (a > .003) {
      let g = ch; if (col && t < lt + .26 && t >= lt - .05) g = POOL[Math.floor(hash(k * 97 + Math.floor(t * 24)) * POOL.length)];
      const bl = (1 - a) * 6; ctx.filter = bl > .4 ? `blur(${bl.toFixed(1)}px)` : 'none';
      ctx.fillStyle = col ? hx[col] : base;
      if (dk) { ctx.shadowColor = col ? hx[col] : (ai ? 'rgba(224,142,112,.6)' : 'rgba(0,0,0,.7)'); ctx.shadowBlur = 16; } else { ctx.shadowColor = 'rgba(250,250,247,.9)'; ctx.shadowBlur = 10; }
      ctx.globalAlpha = a; ctx.fillText(g, x, y + (1 - a) * 8); ctx.shadowBlur = 0;
    }
    x += ws[k];
  });
  ctx.filter = 'none'; ctx.globalAlpha = 1;
  const ae = smooth((t - t0 - .25 - chars.length * .035) / .5) * ao;
  if (ai) T(en, W / 2, 998, '400 17px AM', dk ? `rgba(240,200,180,${.8 * ae})` : `rgba(80,60,50,${.8 * ae})`, 1, 'center', 1);
  else T(en, W / 2, 998, '400 21px ASe', dk ? `rgba(240,240,235,${.75 * ae})` : `rgba(25,25,25,${.68 * ae})`, 1, 'center', .4);
  ctx.globalAlpha = .75 * ae; ctx.fillStyle = CLAY; ctx.fillRect(W / 2 - 12, 1016, 24, 2); ctx.globalAlpha = 1;
}
function drawChapter(c, a, t, t0, ai, cc) {
  if (a < .005) return; const x = 76, y = 96, dk = DARK > .5, col = cc || (dk ? '#E08E70' : CLAYD);
  ctx.save(); if (dk) { ctx.shadowColor = 'rgba(0,0,0,.8)'; ctx.shadowBlur = 14; } else { ctx.shadowColor = 'rgba(250,250,247,.95)'; ctx.shadowBlur = 12; }
  T(c[0], x, y, '400 46px ASe', col, a, 'left'); ctx.globalAlpha = a; ctx.fillStyle = dk ? 'rgba(240,240,235,.55)' : 'rgba(25,25,25,.45)'; ctx.fillRect(x + 66, y - 15, 30, 1.5); ctx.globalAlpha = 1;
  T(scramble(c[1], t, t0, .025, POOLA, 26), x + 108, y - 8, '400 16px "Noto Sans CJK SC", AS', dk ? 'rgba(245,240,236,.9)' : 'rgba(25,25,25,.88)', a, 'left', 3);
  if (c[2]) T(c[2], x + 108, y + 17, '400 12px AM, "Noto Sans CJK SC"', dk ? 'rgba(240,190,170,.8)' : 'rgba(102,102,99,.95)', a * smooth((t - t0 - .4) / .5), 'left', 3);
  ctx.restore();
}
function drawSource(s, a, t, t0) { if (a < .01) return; const n = Math.floor(clamp((t - t0) / 1.6) * s.length); T(s.slice(0, n), W / 2, 1064, '400 11px AM, "Noto Sans CJK SC"', DARK > .5 ? 'rgba(240,236,228,.45)' : 'rgba(25,25,25,.42)', a, 'center', 1); }

const TPRE = .7, TPOST = 1.5, TRAIL = 6, TDT = .012;
function active(t) { let k = 0; while (k + 1 < SC.length && t >= SC[k + 1].start) k++; let A = SC[k], Bs = null; if (k + 1 < SC.length && t >= SC[k + 1].start - TPRE) Bs = SC[k + 1]; else if (k > 0 && t < SC[k].start + TPOST) { A = SC[k - 1]; Bs = SC[k]; } return [A, Bs]; }
const darkOf = (s, t) => typeof s.dark === 'function' ? s.dark(t - s.start) : (s.dark || 0);
function renderFrame(t) {
  const [A, Bs] = active(t);
  A.update(t - A.start); let cm = A.cam(t - A.start), gp = 0, bs = 0, ob = 0;
  if (Bs) { Bs.update(t - Bs.start); bs = Bs.start; gp = ease((t - (bs - TPRE)) / (TPRE + TPOST)); cm = lerpCam(cm, Bs.cam(t - Bs.start), gp); ob = smooth((t - (bs - .2)) / .4); }
  const hard = Bs && Bs.hard; if (hard) ob = t >= bs ? 1 : 0;
  // darkness: switches with the scene boundary (hard cut under flash) unless scene defines dark(t)
  DARK = Bs && t >= bs ? darkOf(Bs, t) : darkOf(A, t);
  const opairs = Bs ? [[A, 1 - ob], [Bs, ob]] : [[A, 1]];
  let shk = 0; for (const [s, a] of opairs) if (s.shake) shk += s.shake(t - s.start) * a;
  if (shk > .05) { const f = Math.floor(t * 30); cm.tx += (hash(f * 3) - .5) * shk * .012; cm.ty += (hash(f * 7) - .5) * shk * .012; }
  setCam(cm);
  ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; ctx.filter = 'none';
  // background
  const bgc = mixc([240, 240, 235], [20, 20, 19], DARK);
  ctx.fillStyle = `rgb(${bgc[0] | 0},${bgc[1] | 0},${bgc[2] | 0})`; ctx.fillRect(0, 0, W, H);
  if (DARK < .99) { ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = .55 * (1 - DARK); ctx.drawImage(PAPER, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; }
  if (DARK > .01) { const rg = ctx.createRadialGradient(W / 2, H * .45, 0, W / 2, H * .45, W * .6); rg.addColorStop(0, `rgba(70,40,30,${.5 * DARK})`); rg.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H); }
  for (const [s, a] of opairs) if (s.back && a > .003) s.back(t - s.start, a, t);
  // particle morph
  if (Bs) {
    for (let i = 0; i < N; i++) {
      const p = smooth((t - (bs - TPRE) - D[i] * .8) / 1.3), j = i * 3, fly = Math.sin(Math.PI * p) * .3;
      for (let c = 0; c < 3; c++) { FP[j + c] = lerp(A.P[j + c], Bs.P[j + c], p) + NV[j + c] * fly; FC[j + c] = lerp(A.C[j + c], Bs.C[j + c], p); FV[j + c] = lerp(A.V[j + c], Bs.V[j + c], p); }
      FB[i] = lerp(A.B[i], Bs.B[i], p); FS[i] = lerp(A.S[i], Bs.S[i], p);
    }
  } else { FP.set(A.P); FC.set(A.C); FV.set(A.V); FB.set(A.B); FS.set(A.S); }
  BR.fill(0); BG.fill(0); BB.fill(0); const inkm = DARK < .5; let any = false;
  for (let i = 0; i < N; i++) {
    const br = FB[i]; if (br < .004) continue; any = true; const j = i * 3, vx = FV[j], vy = FV[j + 1], vz = FV[j + 2], moving = vx * vx + vy * vy + vz * vz > .01, steps = moving ? TRAIL : 1;
    const cr = inkm ? 1 - FC[j] : FC[j], cg = inkm ? 1 - FC[j + 1] : FC[j + 1], cb = inkm ? 1 - FC[j + 2] : FC[j + 2];
    for (let k = 0; k < steps; k++) {
      const x = FP[j] - vx * TDT * k * 2, y = FP[j + 1] - vy * TDT * k * 2, z = FP[j + 2] - vz * TDT * k * 2;
      if (!proj(x, y, z)) continue; const zc = PR.z; if (zc < .2) continue;
      if (PR.x < -40 || PR.x > W + 40 || PR.y < -40 || PR.y > H + 40) continue;
      const fog = clamp((19 - zc) / 10, .15, 1) * clamp((zc - .25) / .6), e = br * fog * 1.15 * (moving ? (1 - k / steps) * 1.3 : 1);
      splat(PR.x, PR.y, e, cr, cg, cb, FS[i] * PR.k);
    }
  }
  if (any) {
    const d = pimg.data, LUT = inkm ? LUTI : LUTA;
    for (let i = 0, o = 0; i < WH; i++, o += 4) { const r = BR[i], g = BG[i], b = BB[i]; if (r + g + b < .001) { const z = inkm ? 255 : 0; d[o] = d[o + 1] = d[o + 2] = z; d[o + 3] = 255; continue; } d[o] = LUT[Math.min(4095, (r * 512) | 0)]; d[o + 1] = LUT[Math.min(4095, (g * 512) | 0)]; d[o + 2] = LUT[Math.min(4095, (b * 512) | 0)]; d[o + 3] = 255; }
    pcx.putImageData(pimg, 0, 0);
    ctx.globalCompositeOperation = inkm ? 'multiply' : 'lighter'; ctx.drawImage(PC, 0, 0);
    if (!inkm) { b1x.clearRect(0, 0, 480, 270); b1x.filter = 'blur(2.5px)'; b1x.drawImage(PC, 0, 0, 480, 270); b1x.filter = 'none'; b2x.clearRect(0, 0, 240, 135); b2x.filter = 'blur(4px)'; b2x.drawImage(b1, 0, 0, 240, 135); b2x.filter = 'none'; ctx.globalAlpha = .5; ctx.drawImage(b1, 0, 0, W, H); ctx.globalAlpha = .6; ctx.drawImage(b2, 0, 0, W, H); ctx.globalAlpha = 1; }
    ctx.globalCompositeOperation = 'source-over';
  }
  // light leak at boundaries
  if (Bs && !hard) { const lk = Math.sin(Math.PI * clamp((t - (bs - .9)) / 1.8)); if (lk > .01) { ctx.save(); ctx.globalCompositeOperation = DARK > .5 ? 'lighter' : 'soft-light'; const gx = W * (.15 + .7 * clamp((t - (bs - .9)) / 1.8)); const g = ctx.createRadialGradient(gx, H * .3, 0, gx, H * .3, W * .55); g.addColorStop(0, `rgba(217,119,87,${(DARK > .5 ? .3 : .55) * lk})`); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore(); } }
  // overlays
  const ox = shk > .05 ? (hash(Math.floor(t * 30) * 11) - .5) * shk : 0, oy = shk > .05 ? (hash(Math.floor(t * 30) * 13) - .5) * shk : 0;
  ctx.save(); ctx.translate(ox, oy);
  for (const [s, a] of opairs) if (s.over && a > .003) s.over(t - s.start, a, t);
  ctx.restore();
  // vignette + subtitle band
  const vg = ctx.createRadialGradient(W / 2, H / 2, H * .5, W / 2, H / 2, H * 1.15); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, DARK > .5 ? 'rgba(0,0,0,.55)' : 'rgba(120,90,60,.09)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  const lg = ctx.createLinearGradient(0, H * .8, 0, H); lg.addColorStop(0, 'rgba(0,0,0,0)'); lg.addColorStop(1, DARK > .5 ? 'rgba(0,0,0,.6)' : 'rgba(250,250,247,.55)'); ctx.fillStyle = lg; ctx.fillRect(0, H * .8, W, H * .2);
  for (const s of (Bs ? [A, Bs] : [A])) {
    const wa = win(t, s.start + .3, s.end - .25, .4, .35);
    if (s.chap) drawChapter(s.chap, wa, t, s.start + .3, s.voice === 'ai', s.chapCol);
    if (s.src) drawSource(s.src, wa * smooth((t - s.start - 10.5) / 1), t, s.start + 10.5);
    if (s.subs) for (const sb of s.subs) drawSub(t, s.start + sb[0], s.start + sb[1], sb[2], sb[3], s.voice === 'ai');
  }
  ctx.globalCompositeOperation = 'soft-light'; ctx.globalAlpha = DARK > .5 ? .22 : .14; ctx.drawImage(GR[Math.floor(t * 30) % 6], 0, 0, W, H);
  ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
  let fa = 0, fc = '255,250,240'; for (const [h, c] of FLASHES) { let v = 0; if (t >= h) v = .8 * Math.exp(-(t - h) / .35); if (v > fa) { fa = v; fc = c; } }
  if (fa > .003) { ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(${fc},${fa * .75})`; ctx.fillRect(0, 0, W, H); ctx.globalCompositeOperation = 'source-over'; }
  for (const [s0, dd, col, txt, tc] of (FILM.smash || [])) if (t >= s0 && t < s0 + dd) { ctx.fillStyle = col; ctx.fillRect(0, 0, W, H); if (txt) T(txt, W / 2, H / 2 + 60, `400 ${txt.length > 2 ? 150 : 300}px "Noto Serif CJK SC"`, tc || (col === '#141413' || col === '#000' ? IVORY : INK), 1, 'center'); }
  let k = 0; if (t < .12) k = 1 - smooth(t / .12);
  for (const [d0, d1] of DIPS) if (t > d0 && t < d1 + 1.2) k = Math.max(k, smooth((t - d0) / .5) * (1 - smooth((t - d1) / 1.1)) * .92);
  if (t > DUR - 1.4) k = Math.max(k, smooth((t - (DUR - 1.4)) / 1.3));
  if (k > 0) { ctx.fillStyle = DARK > .5 || t > DUR - 2 ? `rgba(0,0,0,${k})` : `rgba(0,0,0,${k})`; ctx.fillRect(0, 0, W, H); }
}
window.frameJPEG = async (t, q = .94) => { renderFrame(t); return cv.toDataURL('image/jpeg', q); };
window.ready = (async () => {
  for (const f of ['400 34px "Noto Serif CJK SC"', '700 34px "Noto Serif CJK SC"', '300 34px "Noto Serif CJK SC"', '400 20px "Noto Sans CJK SC"', '700 20px "Noto Sans CJK SC"', '300 20px "Noto Sans CJK SC"', '400 40px AS', '400 40px ASe', '400 20px AM', '300 14px JBM']) await document.fonts.load(f);
  await loadAll(); prepLearn();
  for (let k = 0; k < SC.length; k++) SC[k].end = k + 1 < SC.length ? SC[k + 1].start : DUR;
  for (const s of SC) if (s.init) s.init();
  return true;
})();
