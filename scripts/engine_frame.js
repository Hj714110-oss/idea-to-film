
/* =====================================================================
   clips
   ===================================================================== */
const FILM = window.FILM || {}; const CLIP = FILM.clips || {}; const CFPS = FILM.clipFps || 24;
const FLASHES = FILM.flashes || [[bar(8), '255,240,246']]; const DIPS = FILM.dips || []; const BGTINT = FILM.bgTint || [40, 22, 38];
const FCACHE = new Map(); let NEED = [];
function loadImg(src) { return new Promise(res => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = src; }); }
function fpath(n, k) { return `clips/${n}/${String(k + 1).padStart(4, '0')}.jpg`; }
function frameIdx(n, s) { const c = CLIP[n], x = clamp(s * CFPS, 0, c - 1.001), k = Math.floor(x); return [k, Math.min(c - 1, k + 1), x - k]; }
function needLayer(L) { if (L[0][0] === '!') return; const [a, b] = frameIdx(L[0], L[1]); NEED.push(fpath(L[0], a), fpath(L[0], b)); }
async function preload() { for (const p of NEED) if (!FCACHE.has(p)) FCACHE.set(p, await loadImg(p)); if (FCACHE.size > 90) { const ks = [...FCACHE.keys()]; for (let i = 0; i < ks.length - 60; i++) if (!NEED.includes(ks[i])) FCACHE.delete(ks[i]); } }
const PLATES = {}; const PW = 3072, PLH = 2048;
function plateView(cx, cy, vw) { const w = clamp(vw, .05, 1) * PW, h = w * H / W; return { sx: clamp(cx * PW - w / 2, 0, PW - w), sy: clamp(cy * PLH - h / 2, 0, Math.max(0, PLH - h)), w, h }; }
function p2s(v, u, w) { return [(u * PW - v.sx) / v.w * W, (w * PLH - v.sy) / v.h * H]; }
function drawPlate(L, alpha) {
  const [n, cx, cy, vw, a0 = 1, blur = 0, filt = ''] = L, a = a0 * alpha, im = PLATES[n.slice(1)]; if (a < .004 || !im) return;
  const v = plateView(cx, cy, vw); ctx.save(); const f = (blur ? `blur(${blur}px) ` : '') + filt; if (f.trim()) ctx.filter = f.trim();
  ctx.globalAlpha = a; ctx.drawImage(im, v.sx, v.sy, v.w, v.h, 0, 0, W, H); ctx.restore();
}
function drawLayer(L, alpha) {
  if (typeof L[0] === 'string' && L[0][0] === '!') return drawPlate(L, alpha);
  const [n, s, a0, zoom = 1, ox = 0, oy = 0, blur = 0, gl = 0, filt = ''] = L, a = a0 * alpha; if (a < .004) return;
  const [k0, k1, f] = frameIdx(n, s), i0 = FCACHE.get(fpath(n, k0)), i1 = FCACHE.get(fpath(n, k1)); if (!i0) return;
  const w = W * zoom, h = H * zoom, x = W / 2 - w / 2 + ox, y = H / 2 - h / 2 + oy;
  if (gl > .02) { const ns = 18, fr = Math.floor(TNOW * 30); ctx.save(); ctx.globalAlpha = a; for (let j = 0; j < ns; j++) { const hj = hash(j * 31 + fr * 7), dx = (hj - .5) * gl * W * .12 * (hj > .55 ? 1 : .2); ctx.drawImage(i0, 0, j * i0.height / ns, i0.width, i0.height / ns, x + dx, y + j * h / ns, w, h / ns + 1); } ctx.restore(); return; }
  ctx.save(); const ff = (blur ? `blur(${blur}px) ` : '') + filt; if (ff.trim()) ctx.filter = ff.trim();
  ctx.globalAlpha = a; ctx.drawImage(i0, x, y, w, h); if (i1 && f > .02) { ctx.globalAlpha = a * f; ctx.drawImage(i1, x, y, w, h); }
  ctx.restore();
}

/* =====================================================================
   overlays
   ===================================================================== */
function drawSub(t, t0, t1, zh, en, ai, spk) {
  if (t < t0 - .1 || t > t1 + .1) return; const ao = smooth((t1 - t) / .4);
  const SPK = (window.TL && TL.speakers && spk) ? TL.speakers[spk] : null;
  if (SPK) { const at = smooth((t - t0 + .05) / .25) * ao; ctx.save(); ctx.font = '500 18px JBM, "Noto Sans CJK SC"'; ctx.letterSpacing = '3px'; const lab = SPK[0].toUpperCase(), lw = ctx.measureText(lab).width;
    ctx.globalAlpha = at; ctx.shadowColor = 'rgba(0,0,0,.9)'; ctx.shadowBlur = 10; ctx.fillStyle = SPK[1]; ctx.beginPath(); ctx.arc(W / 2 - lw / 2 - 14, 899, 5, 0, 6.2832); ctx.fill(); ctx.textAlign = 'left'; ctx.fillText(lab, W / 2 - lw / 2 + 2, 905); ctx.restore(); ctx.letterSpacing = '0px'; }
  const chars = parseRich(zh), font = ai ? '300 33px "Noto Sans CJK SC"' : '400 34px "Noto Serif CJK SC"'; ctx.font = font; ctx.textAlign = 'left'; ctx.letterSpacing = '0px';
  const ls = ai ? 7 : 5, ws = chars.map(c => ctx.measureText(c[0]).width + ls), tot = ws.reduce((a, b) => a + b, 0) - ls; let x = W / 2 - tot / 2; const y = 952;
  chars.forEach(([ch, col], k) => {
    const lt = t0 + k * (ai ? .05 : .035), a = smooth((t - lt) / .3) * ao;
    if (a > .003) {
      let g = ch; if (col && t < lt + .26 && t >= lt - .05) g = POOL[Math.floor(hash(k * 97 + Math.floor(t * 24)) * POOL.length)];
      const bl = (1 - a) * 6; ctx.filter = bl > .4 ? `blur(${bl.toFixed(1)}px)` : 'none';
      ctx.fillStyle = col ? HX[col] : (ai ? '#E6F6FF' : WHITE); ctx.shadowColor = col ? HX[col] : (ai ? 'rgba(143,211,255,.7)' : 'rgba(0,0,0,.6)'); ctx.shadowBlur = col || ai ? 16 : 14; ctx.globalAlpha = a; ctx.fillText(g, x, y + (1 - a) * 8); ctx.shadowBlur = 0;
    }
    x += ws[k];
  });
  ctx.filter = 'none'; ctx.globalAlpha = 1;
  const ae = smooth((t - t0 - .25 - chars.length * .035) / .5) * ao;
  if (ai) T(en, W / 2, 990, '300 17px JBM', `rgba(190,228,255,${.72 * ae})`, 1, 'center', 1);
  else T(en, W / 2, 990, 'italic 400 21px Fr', `rgba(246,236,228,${.72 * ae})`, 1, 'center', .4);
  if (SPK) { ctx.globalAlpha = .8 * ae; ctx.fillStyle = SPK[1]; ctx.fillRect(W / 2 - 12, 1008, 24, 2); ctx.globalAlpha = 1; } else { ctx.fillStyle = `rgba(255,214,170,${.6 * ae})`; ctx.fillRect(W / 2 - 12, 1008, 24, 2); }
}
function drawChapter(c, a, t, t0, ai) {
  if (a < .005) return; const x = 76, y = 96, col = window.CHAPCOL || (ai ? AIC : ROSE);
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.85)'; ctx.shadowBlur = 16;
  T(c[0], x, y, '400 44px Fr', col, a, 'left'); ctx.globalAlpha = a; ctx.fillStyle = 'rgba(246,236,232,.6)'; ctx.fillRect(x + 66, y - 15, 30, 1); ctx.globalAlpha = 1;
  T(scramble(c[1], t, t0, .025, POOLA, 26), x + 108, y - 8, '400 15px "Noto Sans CJK SC", JBM', 'rgba(250,240,236,.82)', a, 'left', 3);
  if (c[2]) T(c[2], x + 108, y + 16, '300 12px JBM, "Noto Sans CJK SC"', ai ? 'rgba(158,220,255,.75)' : 'rgba(250,236,228,.6)', a * smooth((t - t0 - .4) / .5), 'left', 3);
  ctx.restore();
}
function drawSource(s, a, t, t0) { if (a < .01) return; const n = Math.floor(clamp((t - t0) / 1.6) * s.length); T(s.slice(0, n), W / 2, 1062, '300 11px JBM, "Noto Sans CJK SC"', 'rgba(250,236,228,.45)', a, 'center', 1); }



/* =====================================================================
   frame
   ===================================================================== */
const TPRE = .7, TPOST = 1.5, FLASH = FLASHES.length ? FLASHES[0][0] : 1e9, TRAIL = 6, TDT = .012;
function active(t) { let k = 0; while (k + 1 < SC.length && t >= SC[k + 1].start) k++; let A = SC[k], Bs = null; if (k + 1 < SC.length && t >= SC[k + 1].start - TPRE) Bs = SC[k + 1]; else if (k > 0 && t < SC[k].start + TPOST) { A = SC[k - 1]; Bs = SC[k]; } return [A, Bs]; }
function xf(t, bs) { return smooth((t - (bs - .55)) / 1.1); } // background crossfade
let TNOW = 0;
function renderFrame(t) { TNOW = t;
  const [A, Bs] = active(t);
  A.update(t - A.start); let cm = A.cam(t - A.start), gp = 0, bs = 0, ob = 0;
  if (Bs) { Bs.update(t - Bs.start); bs = Bs.start; gp = ease((t - (bs - TPRE)) / (TPRE + TPOST)); cm = lerpCam(cm, Bs.cam(t - Bs.start), gp); ob = Bs.cut ? (t >= bs ? 1 : 0) : smooth((t - (bs - .2)) / .4); }
  const opairs = Bs ? [[A, 1 - ob], [Bs, ob]] : [[A, 1]];
  let shk = 0, rgbA = 0; { const kq = AUDIO.kick ? (AUDIO.kick[Math.min(AUDIO.kick.length - 1, Math.floor(t * 30))] || 0) : 0; if (kq > .75) rgbA += (kq - .75) * 5; } for (const [s, a] of opairs) { if (s.shake) shk += s.shake(t - s.start) * a; if (s.rgb) rgbA += s.rgb(t - s.start) * a; }
  if (t > FLASH) cm.f *= 1 + .006 * barPulse(t, .3) * (.3 + loud(t));
  if (shk > .05) { const f = Math.floor(t * 30); cm.tx += (hash(f * 3) - .5) * shk * .012; cm.ty += (hash(f * 7) - .5) * shk * .012; }
  setCam(cm);
  // background footage (crossfaded), with a slow beat punch
  ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  const KK = AUDIO.kick ? (AUDIO.kick[Math.min(AUDIO.kick.length - 1, Math.floor(t * 30))] || 0) : 0; const pz = 1 + .016 * KK;
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(pz, pz); ctx.translate(-W / 2, -H / 2);
  const rg = ctx.createRadialGradient(W / 2, H * .45, 0, W / 2, H * .45, W * .62); rg.addColorStop(0, `rgba(${BGTINT[0]},${BGTINT[1]},${BGTINT[2]},.75)`); rg.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H);
  const cutIn = Bs && Bs.cut && t >= bs;
  if (A.bg && !cutIn) for (const L of A.bg(t - A.start)) drawLayer(L, 1);
  if (Bs && Bs.bg) { const c = Bs.cut ? (t >= bs ? 1 : 0) : xf(t, bs); if (c > 0) for (const L of Bs.bg(t - Bs.start)) drawLayer(L, c); }
  ctx.restore();
  // light leak on scene boundaries
  if (Bs && !Bs.cut) { const lk = Math.sin(Math.PI * clamp((t - (bs - .9)) / 1.8)); if (lk > .01) { const ai = Bs.voice === 'ai'; ctx.save(); ctx.globalCompositeOperation = 'lighter'; const gx = W * (.15 + .7 * clamp((t - (bs - .9)) / 1.8)); const g = ctx.createRadialGradient(gx, H * .3, 0, gx, H * .3, W * .55); g.addColorStop(0, Bs.leak ? `rgba(${Bs.leak},${.3 * lk})` : ai ? `rgba(120,200,255,${.28 * lk})` : `rgba(255,190,130,${.32 * lk})`); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore(); } }
  // particles
  if (Bs) {
    for (let i = 0; i < N; i++) {
      const p = smooth((t - (bs - TPRE) - D[i] * .8) / 1.3), j = i * 3, fly = Math.sin(Math.PI * p) * .3;
      for (let c = 0; c < 3; c++) { FP[j + c] = lerp(A.P[j + c], Bs.P[j + c], p) + NV[j + c] * fly; FC[j + c] = lerp(A.C[j + c], Bs.C[j + c], p); FV[j + c] = lerp(A.V[j + c], Bs.V[j + c], p); }
      FB[i] = lerp(A.B[i], Bs.B[i], p); FS[i] = lerp(A.S[i], Bs.S[i], p);
    }
  } else { FP.set(A.P); FC.set(A.C); FV.set(A.V); FB.set(A.B); FS.set(A.S); }
  BR.fill(0); BG.fill(0); BB.fill(0);
  for (let i = 0; i < N; i++) {
    const br = FB[i]; if (br < .004) continue; const j = i * 3, vx = FV[j], vy = FV[j + 1], vz = FV[j + 2], moving = vx * vx + vy * vy + vz * vz > .01, steps = moving ? TRAIL : 1;
    for (let k = 0; k < steps; k++) {
      const x = FP[j] - vx * TDT * k * 2, y = FP[j + 1] - vy * TDT * k * 2, z = FP[j + 2] - vz * TDT * k * 2;
      if (!proj(x, y, z)) continue; const zc = PR.z; if (zc < .2) continue;
      if (PR.x < -40 || PR.x > W + 40 || PR.y < -40 || PR.y > H + 40) continue;
      const fog = clamp((19 - zc) / 10, .15, 1) * clamp((zc - .25) / .6), e = br * fog * 1.15 * (moving ? (1 - k / steps) * 1.3 : 1);
      splat(PR.x, PR.y, e, FC[j], FC[j + 1], FC[j + 2], FS[i] * PR.k);
    }
  }
  const d = img.data;
  for (let i = 0, o = 0; i < WH; i++, o += 4) { const r = BR[i], g = BG[i], b = BB[i]; if (r + g + b < .001) { d[o] = d[o + 1] = d[o + 2] = 0; continue; } d[o] = LUT[Math.min(4095, (r * 512) | 0)]; d[o + 1] = LUT[Math.min(4095, (g * 512) | 0)]; d[o + 2] = LUT[Math.min(4095, (b * 512) | 0)]; }
  pcx.putImageData(img, 0, 0);
  ctx.globalCompositeOperation = 'lighter'; ctx.drawImage(PC, 0, 0);
  if (rgbA > .3) { for (const [col, dx] of [['#ff2a5a', rgbA], ['#18d8ff', -rgbA]]) { splx.globalCompositeOperation = 'source-over'; splx.drawImage(cv, 0, 0); splx.globalCompositeOperation = 'multiply'; splx.fillStyle = col; splx.fillRect(0, 0, W, H); ctx.globalAlpha = .28; ctx.drawImage(SPL, dx * 1.5, 0); } ctx.globalAlpha = 1; }
  ctx.globalCompositeOperation = 'source-over';
  b1x.clearRect(0, 0, 480, 270); b1x.filter = 'blur(2.5px)'; b1x.drawImage(PC, 0, 0, 480, 270); b1x.filter = 'none'; b2x.filter = 'blur(4px)'; b2x.drawImage(b1, 0, 0, 240, 135); b2x.filter = 'none';
  ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .5; ctx.drawImage(b1, 0, 0, W, H); ctx.globalAlpha = .6; ctx.drawImage(b2, 0, 0, W, H); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  const vg = ctx.createRadialGradient(W / 2, H / 2, H * .45, W / 2, H / 2, H * 1.15); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.5)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  const lg = ctx.createLinearGradient(0, H * .78, 0, H); lg.addColorStop(0, 'rgba(0,0,0,0)'); lg.addColorStop(1, 'rgba(0,0,0,.74)'); ctx.fillStyle = lg; ctx.fillRect(0, H * .78, W, H * .22);
  { const lb = window.LETTERBOX ? LETTERBOX(t) : 0; if (lb > .003) { ctx.fillStyle = '#000'; const hb = 132 * lb; ctx.fillRect(0, 0, W, hb); ctx.fillRect(0, H - hb, W, hb); } }
  if (window.POST) POST(t);
  // overlays
  const ox = shk > .05 ? (hash(Math.floor(t * 30) * 11) - .5) * shk : 0, oy = shk > .05 ? (hash(Math.floor(t * 30) * 13) - .5) * shk : 0;
  ctx.save(); ctx.translate(ox, oy);
  for (const [s, a] of opairs) if (s.over && a > .003) s.over(t - s.start, a, t);
  for (const s of (Bs ? [A, Bs] : [A])) {
    const wa = win(t, s.start + .3, s.end - .25, .4, .35);
    if (s.chap) drawChapter(s.chap, wa, t, s.start + .3, s.voice === 'ai');
    if (s.src) drawSource(s.src, wa * smooth((t - s.start - 11) / 1), t, s.start + 11);
    if (s.subs) for (const sb of s.subs) drawSub(t, s.start + sb[0], s.start + sb[1], sb[2], sb[3], s.voice === 'ai', sb[4]);
  }
  ctx.restore();
  if (window.TOP) TOP(t);
  // grain
  ctx.globalCompositeOperation = 'soft-light'; ctx.globalAlpha = .2; ctx.drawImage(GR[Math.floor(t * 30) % 6], 0, 0, W, H);
  ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
  // flashes
  let fa = 0, fc = '255,240,246'; for (const [h, c] of FLASHES) { let v = 0; if (t >= h) v = .75 * Math.exp(-(t - h) / .4); if (v > fa) { fa = v; fc = c; } }
  if (fa > .003) { ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(${fc},${fa * .7})`; ctx.fillRect(0, 0, W, H); ctx.globalCompositeOperation = 'source-over'; }
  for (const [s0, dd, col, txt] of (FILM.smash || [])) if (t >= s0 && t < s0 + dd) { ctx.fillStyle = col; ctx.fillRect(0, 0, W, H); if (txt) T(txt, W / 2, H / 2 + 60, `700 ${txt.length > 1 ? 176 : 320}px "Noto Serif CJK SC"`, col === '#fff' ? '#0a0608' : '#fff', 1, 'center'); }
  // the screen times out (music dip)
  let k = 0; if (t < .2) k = 1 - smooth(t / .2);
  for (const [d0, d1] of DIPS) if (t > d0 && t < d1 + 1.2) k = Math.max(k, smooth((t - d0) / .5) * (1 - smooth((t - d1) / 1.1)));
  if (t > DUR - 1.6) k = Math.max(k, smooth((t - (DUR - 1.6)) / 1.5));
  if (k > 0) { ctx.fillStyle = `rgba(0,0,0,${k})`; ctx.fillRect(0, 0, W, H); }
}
window.frameJPEG = async (t, q = .94) => {
  NEED = []; const [A, Bs] = active(t); for (const s of (Bs ? [A, Bs] : [A])) if (s.bg) for (const L of s.bg(t - s.start)) needLayer(L);
  await preload(); renderFrame(t); return cv.toDataURL('image/jpeg', q);
};
window.ready = (async () => {
  for (const f of ['400 34px "Noto Serif CJK SC"', '700 34px "Noto Serif CJK SC"', '300 34px "Noto Serif CJK SC"', '500 34px "Noto Serif CJK SC"', '400 20px "Noto Sans CJK SC"', '500 20px "Noto Sans CJK SC"', '700 20px "Noto Sans CJK SC"', '300 20px "Noto Sans CJK SC"', '400 40px Fr', 'italic 400 20px Fr', '300 14px JBM', '400 14px JBM']) await document.fonts.load(f);
  for (const n of (FILM.plates || [])) PLATES[n] = await loadImg('plates/' + n + '.jpg');
  for (let k = 0; k < SC.length; k++) SC[k].end = k + 1 < SC.length ? SC[k + 1].start : DUR;
  for (const s of SC) if (s.init) s.init();
  return true;
})();
