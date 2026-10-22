/* kit.js — shot builders + overlay kit for the atmosphere-brand-film engine.
   Loaded after engine_core.js and before your scenes.js (see film.html). Everything here is optional sugar. */

/* ======================= camera keys ======================= */
/* kf(t, [[t, cx, cy, viewW], ...]) — eased camera keys inside a still plate (cx, cy in 0..1 of the plate; viewW = visible fraction of plate width) */
function kf(t, keys) {
  if (t <= keys[0][0]) return keys[0].slice(1);
  for (let i = 0; i < keys.length - 1; i++) { const a = keys[i], b = keys[i + 1]; if (t < b[0]) { const p = easeSine((t - a[0]) / (b[0] - a[0])); return [lerp(a[1], b[1], p), lerp(a[2], b[2], p), lerp(a[3], b[3], p)]; } }
  return keys[keys.length - 1].slice(1);
}
/* spkKeys(subs, first, map, pre) — the camera finds whoever is speaking.
   subs: [[t0, t1, zh, en, SPEAKER], ...]; map: {lineIndex | SPEAKER | '_': [cx, cy, viewW]} */
function spkKeys(subs, first, map, pre) {
  const keys = pre ? pre.slice() : [[0, ...first]]; let cur = pre ? pre[pre.length - 1].slice(1) : first;
  subs.forEach((sb, k) => {
    const tg = map[k] || map[sb[4] || '_'] || map['_']; if (!tg || tg.join() === cur.join()) return;
    const t0 = Math.max(keys[keys.length - 1][0] + .05, sb[0] - .5); keys.push([t0, ...cur]); keys.push([t0 + 1.2, ...tg]); cur = tg;
  });
  return keys;
}

/* ======================= shot builders ======================= */
/* plate(name, {start, plate, keys, subs, chap, blur(t), filt, drift}) — a still painting (FILM.plates) with a code-driven camera.
   Gives sc.P2(t, u, v) → screen [x, y] of a plate point and sc.K(t) → screen px per plate-width unit, for overlays that stick to the painting. */
function plate(name, o) {
  const sc = dustScene(Object.assign({ name, seed: 3, tints: WARM, br: .02, sp: .4 }, o));
  const pl = '!' + o.plate, drift = o.drift === undefined ? .0025 : o.drift;
  sc.vc = t => { const c = kf(t, o.keys); return [c[0], c[1], c[2] * (1 - drift * t)]; };
  sc.v = t => { const c = sc.vc(t); return plateView(c[0], c[1], c[2]); };
  sc.P2 = (t, u, w) => p2s(sc.v(t), u, w);
  sc.K = t => W / sc.v(t).w * PW;
  sc.bg = t => { const c = sc.vc(t); return [[pl, c[0], c[1], c[2], 1, o.blur ? o.blur(t) : 0, o.filt || '']]; };
  return sc;
}
/* shot(name, {start, clip, c0, rate, hold, z0, dz, ox, oy, blur(t), filt(t), tin, tout, dir}) — an image-to-video clip with a bar-locked cut-in.
   tin: 'fade' (engine cross-fade + light leak) | 'whip' | 'zoom' | 'up' | 'glitch' (hard cuts); tout: 'whip' | 'zoom'. */
function shot(name, o) {
  const sc = dustScene(Object.assign({ name, seed: 5, tints: WARM, br: .015, sp: .4 }, o));
  sc.cut = o.tin !== 'fade';
  sc.bg = function (t) {
    const len = this.end - this.start, p = clamp(t / .34), q = clamp((t - (len - .2)) / .2), dir = o.dir || 1;
    let s = (o.c0 || 0) + (o.rate || 1) * t; if (o.hold !== undefined) s = Math.min(s, o.hold);
    let z = (o.z0 || 1.03) + (o.dz === undefined ? .05 : o.dz) * t / len, ox = o.ox || 0, oy = o.oy || 0, bl = o.blur ? o.blur(t) : 0, gl = 0;
    if (o.tin === 'whip') { ox += dir * W * .42 * (1 - easeOut5(p)); bl += 28 * (1 - p); }
    if (o.tin === 'zoom') { z *= 1 + .55 * (1 - easeOut5(p)); bl += 20 * (1 - p); }
    if (o.tin === 'up') { oy += H * .6 * (1 - easeOut5(p)); bl += 24 * (1 - p); }
    if (o.tin === 'glitch') { gl = Math.max(0, 1 - t / .28); }
    if (o.tout === 'whip') { ox -= dir * W * .3 * q * q; bl += 26 * q; }
    if (o.tout === 'zoom') { z *= 1 + .4 * q * q; bl += 18 * q; }
    return [[o.clip, s, 1, z, ox, oy, bl, gl, o.filt ? o.filt(t) : '']];
  };
  return sc;
}

/* ======================= overlay kit ======================= */
/* puff(): a small mascot blob with mood colours (0 calm blue · 1 yellow · 2 orange · 3 red alarm); pass [rgb, alarm] for a custom path. */
function glowAt(x, y, r, rgb, a) { if (a < .01) return; ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(${rgb},${a})`); g.addColorStop(.35, `rgba(${rgb},${a * .35})`); g.addColorStop(1, `rgba(${rgb},0)`); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.restore(); }
function shade(x, y, r, a) { if (a < .01) return; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(12,8,20,${a})`); g.addColorStop(1, 'rgba(12,8,20,0)'); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); }
const PUFFC = [[132, 178, 255], [255, 214, 92], [255, 150, 66], [255, 82, 82]];
function puffRGB(s) { s = clamp(s, 0, 3); const i = Math.min(2, Math.floor(s)); return mixc(PUFFC[i], PUFFC[i + 1], s - i).map(Math.round); }
function puff(x, y, r, s, t, a, k = 0) {
  if (a < .01) return; const c = Array.isArray(s) ? s[0] : puffRGB(s), alarm = Array.isArray(s) ? s[1] : clamp(s - 1.6), bob = Math.sin(t * 2.3 + k) * r * .06 + (alarm > .3 ? (hash(Math.floor(t * 30) + k) - .5) * r * .08 * alarm : 0);
  y += bob; glowAt(x, y, r * 2.6, c.join(','), .55 * a);
  ctx.save(); ctx.globalAlpha = a; const g = ctx.createRadialGradient(x - r * .35, y - r * .45, r * .1, x, y, r * 1.2);
  g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(.45, `rgb(${mixc(c, [255, 255, 255], .25).map(Math.round)})`); g.addColorStop(1, `rgb(${mixc(c, [40, 50, 90], .25).map(Math.round)})`);
  ctx.fillStyle = g; ctx.beginPath(); for (const [dx, dy, rr0] of [[-.55, .15, .5], [0, -.22, .62], [.55, .1, .5], [-.25, .36, .46], [.3, .38, .46]]) { ctx.moveTo(x + dx * r + rr0 * r, y + dy * r); ctx.arc(x + dx * r, y + dy * r, rr0 * r, 0, 6.2832); } ctx.fill();
  const blink = (Math.floor(t * 10 + k * 7) % 41) === 0 ? .15 : 1, ew = r * (.11 + .04 * alarm), eh = r * (.17 + .05 * alarm) * blink;
  ctx.fillStyle = '#1a2150'; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.ellipse(x + sx * r * .24, y - r * .02, ew, eh, 0, 0, 6.2832); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x + sx * r * .24 - ew * .3, y - r * .02 - eh * .4, ew * .35, 0, 6.2832); ctx.fill(); ctx.fillStyle = '#1a2150'; }
  if (alarm > .3) { ctx.fillStyle = '#5a1020'; ctx.beginPath(); ctx.ellipse(x, y + r * .3, r * .14 * alarm, r * .1 * alarm, 0, 0, 6.2832); ctx.fill(); }
  ctx.restore();
}
function withCard(x, y, w, h, rot, a, fn, tint = '#F7F0E3', sc = 1) {
  if (a < .01) return; ctx.save(); ctx.globalAlpha = a; ctx.translate(x + w / 2, y + h / 2); ctx.rotate(rot); ctx.scale(sc, sc); ctx.translate(-w / 2, -h / 2);
  ctx.shadowColor = 'rgba(30,16,8,.45)'; ctx.shadowBlur = 34; ctx.shadowOffsetY = 12; ctx.fillStyle = tint; ctx.fillRect(0, 0, w, h); ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
  const g = ctx.createLinearGradient(0, 0, w, h); g.addColorStop(0, 'rgba(255,255,255,.35)'); g.addColorStop(1, 'rgba(120,90,50,.08)'); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = 'rgba(120,90,60,.22)'; ctx.lineWidth = 1; ctx.strokeRect(9, 9, w - 18, h - 18); fn(); ctx.restore();
}
/* ink: characters appear at cps, a glowing nib leads; tremble = shaky hand */
function ink(str, x, y, font, col, t, t0, cps, tremble = 0, align = 'left') {
  const n = clamp((t - t0) * cps, 0, str.length); if (n <= 0) return 0; const k = Math.floor(n), s = str.slice(0, k);
  ctx.font = font; ctx.textAlign = 'left'; const tw = ctx.measureText(str).width; let x0 = align === 'center' ? x - tw / 2 : x;
  let dx = 0, dy = 0; if (tremble) { const f = Math.floor(t * 24); dx = (hash(f * 3) - .5) * tremble; dy = (hash(f * 7 + 1) - .5) * tremble; }
  ctx.fillStyle = col; ctx.fillText(s, x0 + dx, y + dy); const w = ctx.measureText(s).width;
  if (k < str.length) { ctx.globalAlpha *= (n - k); ctx.fillText(str[k], x0 + w + dx, y + dy); ctx.globalAlpha /= Math.max(.001, (n - k)); }
  if (n < str.length) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(x0 + w + dx, y - 8 + dy, 0, x0 + w + dx, y - 8 + dy, 16); g.addColorStop(0, 'rgba(255,200,120,.9)'); g.addColorStop(1, 'rgba(255,200,120,0)'); ctx.fillStyle = g; ctx.fillRect(x0 + w - 16 + dx, y - 24 + dy, 32, 32); ctx.restore(); }
  return w;
}
function wrap(str, font, maxW) { ctx.font = font; const out = []; let line = ''; for (const wd of str.split(' ')) { const tr = line ? line + ' ' + wd : wd; if (ctx.measureText(tr).width > maxW && line) { out.push(line); line = wd; } else line = tr; } if (line) out.push(line); return out; }
function stamp(str, x, y, size, rot, col, t, t0, t1, sub) {
  const p = t - t0; if (p < 0 || t > t1 + .3) return; const sc = 1 + 1.1 * (1 - easeOut5(p / .22)), al = clamp(p / .05) * smooth((t1 + .3 - t) / .3);
  ctx.save(); ctx.globalAlpha = al; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc); ctx.textAlign = 'center'; ctx.lineJoin = 'round';
  ctx.font = `900 ${size}px "Noto Sans CJK SC"`; ctx.letterSpacing = (size * .03) + 'px'; ctx.lineWidth = size * .16; ctx.strokeStyle = '#140c18'; ctx.strokeText(str, 0, 0); ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 24; ctx.fillText(str, 0, 0); ctx.shadowBlur = 0;
  if (sub) { ctx.font = `900 ${size * .42}px "Noto Sans CJK SC"`; ctx.lineWidth = size * .08; ctx.strokeText(sub, 0, size * .62); ctx.fillStyle = '#fff'; ctx.fillText(sub, 0, size * .62); }
  ctx.letterSpacing = '0px'; ctx.restore();
}
function toast(x, y, title, sub, col, t, t0, t1) {
  const p = t - t0; if (p < 0 || t > t1 + .3) return; const sc = .6 + .4 * easeBack(p / .3), al = clamp(p / .1) * smooth((t1 + .3 - t) / .3);
  ctx.save(); ctx.globalAlpha = al; ctx.font = '500 21px "Noto Sans CJK SC"'; const w = Math.max(ctx.measureText(title).width, sub ? (ctx.font = '300 14px JBM', ctx.measureText(sub).width) : 0) + 86, h = sub ? 74 : 56;
  ctx.translate(x, y); ctx.scale(sc, sc); rr(0, 0, w, h, 18); ctx.fillStyle = 'rgba(16,14,26,.86)'; ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 20; ctx.fill(); ctx.shadowBlur = 0; ctx.strokeStyle = col; ctx.globalAlpha = al * .55; ctx.lineWidth = 1.4; ctx.stroke(); ctx.globalAlpha = al;
  ctx.fillStyle = col; ctx.beginPath(); ctx.arc(32, h / 2, 10, 0, 6.2832); ctx.fill();
  ctx.textAlign = 'left'; ctx.font = '500 21px "Noto Sans CJK SC"'; ctx.fillStyle = '#F5EEF2'; ctx.fillText(title, 56, sub ? 32 : 36); if (sub) { ctx.font = '300 14px JBM'; ctx.letterSpacing = '1px'; ctx.fillStyle = 'rgba(230,220,240,.7)'; ctx.fillText(sub, 56, 56); ctx.letterSpacing = '0px'; }
  ctx.restore();
}
function sparkle(x, y, s, rgb, a) { if (a < .01) return; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = a; ctx.fillStyle = `rgb(${rgb})`; ctx.beginPath(); ctx.moveTo(x, y - s); ctx.quadraticCurveTo(x, y, x + s, y); ctx.quadraticCurveTo(x, y, x, y + s); ctx.quadraticCurveTo(x, y, x - s, y); ctx.quadraticCurveTo(x, y, x, y - s); ctx.fill(); ctx.restore(); glowAt(x, y, s * 2.2, rgb, a * .5); }
function rising(t, n, seed, x0, x1, y0, y1, rgb, a, sp = 60, sz = 6) { for (let i = 0; i < n; i++) { const h1 = hash(i * 13 + seed), h2 = hash(i * 29 + seed), ph = (t * sp / (y0 - y1) + h2) % 1; const x = lerp(x0, x1, h1) + Math.sin(t * .8 + i) * 18, y = lerp(y0, y1, ph); sparkle(x, y, sz * (.5 + hash(i + seed * 3)), rgb, a * Math.sin(Math.PI * ph) * (.5 + .5 * Math.sin(t * 3 + i))); } }
function paperBurst(t, t0, cx, cy, n = 80) {
  const p = t - t0; if (p < 0 || p > 6) return;
  for (let i = 0; i < n; i++) {
    const an = hash(i * 7) * 6.2832, sp = 500 + 1300 * hash(i * 11), d = 1 - Math.exp(-p * 2.2), x = cx + Math.cos(an) * sp * d * .55, y = cy + Math.sin(an) * sp * d * .4 + 90 * p * p * (.4 + hash(i * 5));
    const w = 34 + 30 * hash(i * 3), rot = an + p * (2 + 4 * hash(i * 17)) * (i % 2 ? 1 : -1), al = clamp(p / .05) * smooth((6 - p) / 1.5);
    ctx.save(); ctx.globalAlpha = al; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(1, Math.abs(Math.cos(p * 3 + i)) * .8 + .2);
    ctx.fillStyle = '#FBF6EC'; ctx.shadowColor = 'rgba(80,50,30,.35)'; ctx.shadowBlur = 8; ctx.fillRect(-w / 2, -w * .65, w, w * 1.3); ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(90,70,60,.35)'; for (let l = 0; l < 4; l++) ctx.fillRect(-w / 2 + 5, -w * .5 + l * w * .26, w * (.6 + .3 * hash(i + l)), 2); ctx.restore();
  }
}
function letterCard(x, y, w, h, rot, a, en, zh, t, t0, cps = 28, gold = false, sc = 1) {
  withCard(x, y, w, h, rot, a, () => {
    ctx.textAlign = 'left'; const f = 'italic 400 38px Fr', lines = wrap(en, f, w - 90); let yy = 74;
    for (const ln of lines) { const before = lines.slice(0, lines.indexOf(ln)).join(' ').length; ink(ln, 44, yy, f, gold ? '#5a3a10' : '#2a1d16', t, t0 + before / cps, cps); yy += 52; }
    if (zh) { ctx.globalAlpha *= smooth((t - t0 - en.length / cps) / .5); T(zh, 46, yy + 8, '400 24px "Noto Serif CJK SC"', gold ? 'rgba(90,58,16,.8)' : 'rgba(42,29,22,.75)', ctx.globalAlpha, 'left', 2); }
  }, gold ? '#FFF1CC' : '#F7F0E3', sc);
  if (gold) glowAt(x + w / 2, y + h / 2, w * .8, '255,210,120', .18 * a);
}


/* ======================= Chinese text, rain, glyphs ======================= */
function wrapZh(str, font, maxW) { ctx.font = font; const out = []; let line = ''; for (const ch of str) { if (ctx.measureText(line + ch).width > maxW && line) { out.push(line); line = ch === '，' || ch === '。' ? '' : ch; if (ch === '，' || ch === '。') out[out.length - 1] += ch; } else line += ch; } if (line) out.push(line); return out; }
function inkZh(str, x, y, font, col, t, t0, cps, maxW, lh, tremble = 0) { const lines = wrapZh(str, font, maxW); let used = 0; lines.forEach((ln, i) => { ink(ln, x, y + i * lh, font, col, t, t0 + used / cps, cps, tremble); used += ln.length; }); return lines.length; }
function zhCard(x, y, w, h, rot, a, str, t, t0, cps, gold, sign, sc = 1, font = '500 36px "Noto Serif CJK SC"', lh = 56) {
  withCard(x, y, w, h, rot, a, () => {
    inkZh(str, 50, 76, font, gold ? '#5a3a10' : '#2a1d16', t, t0, cps, w - 100, lh);
    if (sign) T(sign, w - 50, h - 40, 'italic 400 28px Fr', gold ? 'rgba(90,58,16,.85)' : '#2a1d16', ctx.globalAlpha * smooth((t - t0 - [...str].length / cps) / .4), 'right');
  }, gold ? '#FFF1CC' : '#FBF5E8', sc);
  if (gold) glowAt(x + w / 2, y + h / 2, w * .8, '255,210,120', .16 * a);
}
function rain(t, a, n = 140, ang = .18, sp = 1900, rgb = '200,215,255') {
  if (a < .01) return; ctx.save(); ctx.strokeStyle = `rgba(${rgb},1)`; ctx.lineCap = 'round';
  for (let i = 0; i < n; i++) { const h1 = hash(i * 7 + 3), h2 = hash(i * 13 + 5), L = 40 + 70 * h2, y = ((t * sp * (.7 + .5 * h2) + h1 * 1400) % 1400) - 160, x = h1 * 2300 - 190 + y * ang; ctx.globalAlpha = a * (.08 + .14 * h2); ctx.lineWidth = .8 + 1.2 * h2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + L * ang, y + L); ctx.stroke(); }
  ctx.restore();
}
function bigGlyph(str, x, y, size, a, col = 'rgba(255,240,228,1)', stroke = true) {
  if (a < .01) return; ctx.save(); ctx.globalAlpha = a; ctx.font = `900 ${size}px "Noto Serif CJK SC"`; ctx.textAlign = 'center';
  if (stroke) { ctx.lineWidth = 2.2; ctx.strokeStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 20; ctx.strokeText(str, x, y); } else { ctx.fillStyle = col; ctx.fillText(str, x, y); } ctx.restore();
}
/* floorCounter(t, t0, a, x, y, labels) — a beat-stepped counter (one label per beat) */
function floorCounter(t, t0, a, x, y, fl = ['B3', 'B2', 'B1', '1F', '7F', '12F', '23F', '38F', '47F', '61F', '78F', '92F', '99F']) {
  const i = clamp(Math.floor((t - t0) / BP), 0, fl.length - 1);
  if (a < .01 || t < t0) return; const p = ((t - t0) / BP) % 1, pop = 1 + .25 * Math.exp(-p * 6);
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.scale(pop, pop); ctx.textAlign = 'right'; ctx.font = '700 92px JBM'; ctx.fillStyle = '#E6F2FF'; ctx.shadowColor = '#7FB0FF'; ctx.shadowBlur = 30; ctx.fillText(fl[i], 0, 0); ctx.shadowBlur = 0;
  ctx.font = '300 16px JBM'; ctx.letterSpacing = '6px'; ctx.fillStyle = 'rgba(220,235,255,.8)'; ctx.fillText('FLOOR · 楼层', 0, 36); ctx.letterSpacing = '0px'; ctx.restore();
}
