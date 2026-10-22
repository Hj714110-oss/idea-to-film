/* v1 (stills only, original synthesised score) — needs scripts/kit.js and timeline.js.
   《总说「你说得对」的女孩》 THE GIRL WHO SAID "YOU'RE RIGHT" — scenes on the atmosphere-brand-film engine.
   Every shot is one of the 14 painted plates (3072×2048) with a code-driven camera; overlays are diegetic (letters, the scroll, Puff, ink). */
const TS = {}; for (const s of TL.scenes) TS[s.name] = s;
const ST = n => bar(TS[n].bar), Ls = (n, k) => TS[n].subs[k][0], Le = (n, k) => TS[n].subs[k][1];
window.CHAPCOL = '#FFB27A';
window.FILM = {
  plates: ['01_spire', '02_white_room', '03_apology', '04_service_stair', '05_book_talk', '06_neon_floor', '07_harbor', '08_letter_falls', '09_climb', '10_crowded_room', '11_wings_open', '12_reply_joy', '13_dawn_roof', '14_glide'],
  flashes: [[ST('title'), '255,238,222'], [ST('wings'), '255,248,236'], [ST('glide'), '255,230,200']],
  dips: [[ST('wings') - 1.15, ST('wings') - 1.05]],
  smash: [[ST('stair') + Ls('stair', 0) - .1, .1, '#fff', '51']],
  bgTint: [30, 24, 36]
};
const SC = [];

/* plates on the timeline (timeline.js from scripts/timeline.py) — uses plate()/spkKeys() from scripts/kit.js */
const plateTL = (name, o) => { const s = TS[name]; return plate(name, Object.assign({ start: bar(s.bar), subs: s.subs, chap: s.chap, plate: s.plate, seed: s.bar + 3 }, o)); };

/* =============== 0 · HOOK — the scroll (bars 0–5) =============== */
const DOC = [[40, .55, 'hand', '17 × 3 = 51'], [120, 1.8, 'h', 'Approach 1: Decomposition'], [162, 1.95, 'p', '17 × 3 = (10 + 7) × 3'], [196, 2.1, 'p', '        = 30 + 21'], [240, 2.4, 'table'],
  [400, 3.0, 'h', 'Approach 2: Verification'], [442, 3.15, 'p', '51 ÷ 3 = 17 ✓      51 ÷ 17 = 3 ✓'], [476, 3.3, 'p', 'Cross-checked using three independent methods.'],
  [530, 3.6, 'h', 'Key Takeaways'], [572, 3.75, 'p', '•  Multiplication can be decomposed'], [606, 3.9, 'p', '•  Verification builds confidence'], [640, 4.05, 'p', '•  Context matters'],
  [700, 4.3, 'page', '— page 2 of 4 —'], [760, 4.45, 'h', 'Limitations'], [800, 4.55, 'lines', 4], [940, 4.75, 'h', 'Alternative Perspectives'], [980, 4.85, 'lines', 5],
  [1150, 5.05, 'page', '— page 3 of 4 —'], [1210, 5.2, 'h', 'Ethical Considerations'], [1250, 5.3, 'lines', 3], [1370, 5.45, 'h', 'Further Reading'], [1410, 5.5, 'lines', 2],
  [1500, 5.6, 'hedge', '(…though results may vary)'], [1580, 5.9, 'page', '— page 4 of 4 —'], [1640, 6.0, 'h', 'Summary'], [1690, 6.1, 'p51'], [1790, 6.3, 'lines', 2]];
const DX = 700, DW = 600, DTOP = 150, DBOT = 860;
const docScroll = t => { const k = [[0, 0], [2.6, 0], [3.6, 140], [4.4, 330], [6.4, 1300], [7.4, 1400]]; for (let i = 0; i < k.length - 1; i++) if (t < k[i + 1][0]) return lerp(k[i][1], k[i + 1][1], easeSine((t - k[i][0]) / (k[i + 1][0] - k[i][0]))); return 1400; };
function p51pos() { ctx.font = '400 19px JBM'; return [DX + ctx.measureText('answer, under most assumptions, is ').width + ctx.measureText('51').width / 2, DTOP + 40 + 1690 - 1400 + 24]; }
function drawDoc(t, a) {
  const sc0 = docScroll(t);
  ctx.save(); ctx.globalAlpha = a; ctx.beginPath(); ctx.rect(DX - 50, DTOP - 20, DW + 100, DBOT - DTOP + 40); ctx.clip();
  ctx.shadowColor = 'rgba(60,40,70,.35)'; ctx.shadowBlur = 40; ctx.fillStyle = '#FBF7EF'; ctx.fillRect(DX - 40, DTOP - 60 - sc0 * 0 , DW + 80, 4000); ctx.shadowBlur = 0;
  for (const it of DOC) {
    const [dy, ta, kind, s] = it, y = DTOP + 40 + dy - sc0; if (t < ta - .05 || y < DTOP - 60 || y > DBOT + 60) continue; const ap = smooth((t - ta) / .18);
    ctx.globalAlpha = a * ap;
    if (kind === 'hand') { ink(s, DX, y, 'italic 600 40px Fr', '#2a1d16', t, ta, 16); }
    else if (kind === 'hedge') { ink(s, DX + 30, y, 'italic 400 30px Fr', '#7a3b2a', t, ta, 22, 1.2); }
    else if (kind === 'h') { ctx.fillStyle = '#3a2d48'; ctx.font = '600 25px Fr'; ctx.textAlign = 'left'; ctx.fillText('## ' + s, DX, y); }
    else if (kind === 'p') { ctx.fillStyle = 'rgba(50,40,60,.75)'; ctx.font = '400 19px JBM'; ctx.textAlign = 'left'; ctx.fillText(s, DX, y); }
    else if (kind === 'page') { ctx.fillStyle = 'rgba(80,70,90,.5)'; ctx.font = '300 15px JBM'; ctx.textAlign = 'center'; ctx.letterSpacing = '3px'; ctx.fillText(s, DX + DW / 2, y); ctx.letterSpacing = '0px'; ctx.fillStyle = 'rgba(80,70,90,.15)'; ctx.fillRect(DX - 40, y + 20, DW + 80, 2); }
    else if (kind === 'lines') { ctx.fillStyle = 'rgba(70,60,80,.18)'; for (let l = 0; l < s; l++) ctx.fillRect(DX, y - 12 + l * 30, DW * (.55 + .42 * hash(dy + l)), 9); }
    else if (kind === 'table') { ctx.strokeStyle = 'rgba(60,50,80,.35)'; ctx.lineWidth = 1.2; const rows = [['step', 'value'], ['10 × 3', '30'], ['7 × 3', '21'], ['Σ', '51']]; rows.forEach((r, i) => { ctx.strokeRect(DX, y - 20 + i * 38, 260, 38); ctx.strokeRect(DX + 260, y - 20 + i * 38, 160, 38); ctx.fillStyle = i ? 'rgba(50,40,60,.75)' : '#3a2d48'; ctx.font = (i ? '400' : '600') + ' 18px JBM'; ctx.textAlign = 'left'; ctx.fillText(r[0], DX + 14, y + 6 + i * 38); ctx.fillText(r[1], DX + 274, y + 6 + i * 38); }); }
    else if (kind === 'p51') { ctx.fillStyle = 'rgba(50,40,60,.75)'; ctx.font = '400 19px JBM'; ctx.textAlign = 'left'; ctx.fillText('In summary, while results may vary, one possible', DX, y); const pre = 'answer, under most assumptions, is '; ctx.fillText(pre + '51.', DX, y + 30); }
  }
  ctx.restore();
  // the red ink circle around the buried 51
  if (t > 7.6) { const p = easeOut(clamp((t - 7.6) / .7)), [cx, cy] = p51pos(); ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = '#D23B3B'; ctx.lineWidth = 3.2; ctx.lineCap = 'round'; ctx.beginPath(); for (let i = 0; i <= 60 * p; i++) { const an = -1.2 + i / 60 * 7.0, rr0 = 1 + .08 * Math.sin(i * .4); const x = cx + Math.cos(an) * 34 * rr0, y = cy - 6 + Math.sin(an) * 22 * rr0; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); ctx.restore(); }
}
SC.push(plateTL('hook', {
  keys: [[0, .5, .42, .96], [13, .44, .36, .8]], blur: () => 10, filt: 'brightness(1.04) saturate(.85)', tints: COOL, br: .01,
  over(t, a) {
    const zp = easeSine(clamp((t - 8.4) / 1.4)), Z = 1 + 2.6 * zp, [zx, zy] = p51pos(), fade = 1 - .85 * zp;
    ctx.save(); ctx.setTransform(Z, 0, 0, Z, zx - zx * Z + zp * (W / 2 - zx), zy - zy * Z + zp * (H * .46 - zy));
    drawDoc(t, a);
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.restore();
    if (zp > .02) { const k = .5 + .5 * Math.exp(-Math.max(0, t - 9.78) / .5); glowAt(W / 2, H * .46 - 8, 160, '255,190,120', a * zp * .35 * k); }
    // the letter that started it
    const ly = -320 + 560 * easeOut5(clamp(t / .55)); letterCard(130, ly, 470, 210, -.05, a * fade, "What's 17 × 3?", '十七乘三，等于几？', t, -9, 40);
    // Puff, and the ding
    const st = t < 4.6 ? 0 : t < 6.4 ? 1 : lerp(1, 0, smooth((t - 6.4) / .8)); puff(1580, 300, 50, st, t, a * fade);
    if (t > 4.6 && t < 5.0) glowAt(1580, 300, 260, '255,214,92', a * .5 * (1 - (t - 4.6) / .4));
    toast(1360, 390, 'Ding · 叮', 'POSSIBLE OVERCONFIDENCE DETECTED', '#FFD65C', t, 4.6, 6.4);
  }
}));

/* =============== 1 · TITLE — the Leaderboard (bars 5–11) =============== */
SC.push(plateTL('title', {
  keys: [[0, .51, .15, .34], [4.0, .51, .19, .44], [10.5, .5, .5, 1.0], [15.7, .5, .72, .8]], tints: WARM, br: .05, drift: 0, leak: '255,200,150',
  over(t, a) {
    const [wx, wy] = this.P2(t, .497, .117), [ox, oy] = this.P2(t, .524, .125), k = this.K(t) / 3072;
    glowAt(wx, wy, 90 * k * 2.2, '225,232,255', a * (.45 + .1 * Math.sin(t * 2)));
    glowAt(ox, oy, 90 * k * 2.2, '255,160,80', a * (.5 + .1 * Math.sin(t * 2.4 + 1)));
    const ta = a * win(t, .05, 4.5, .3, .7);
    if (ta > .01) {
      shade(W / 2, 560, 760, .5 * ta);
      drawRich(TL.title[0], W / 2, 560, '700 80px "Noto Serif CJK SC"', t, .12, ta, .07, 'center', 8, '#FFF6EC');
      T(TL.title[1], W / 2, 634, 'italic 400 30px Fr', 'rgba(255,240,228,.9)', ta * smooth((t - 1.2) / .6), 'center', 3);
      T('A FABLE FROM THE CITY OF LATENT', W / 2, 690, '300 14px JBM', 'rgba(255,226,200,.7)', ta * smooth((t - 1.8) / .6), 'center', 6);
    }
    // floor labels as the camera tilts down
    const la = a * win(t, Ls('title', 2), Le('title', 2) + .4, .5, .6);
    if (la > .01) { const [nx, ny] = this.P2(t, .5, .52), [hx, hy] = this.P2(t, .62, .86); T('NEON FLOOR', nx + 230, ny, '400 14px JBM', 'rgba(255,190,240,.85)', la, 'left', 5); T('THE HARBOR', hx, hy - 40, '400 14px JBM', 'rgba(255,214,170,.85)', la * smooth((t - Ls('title', 2) - 1) / .6), 'left', 5); }
  }
}));

/* =============== 2 · THE WHITE ROOM =============== */
const RULE_L = [.03, .1, .17, .24, .31, .38, .45, .52], RULE_R = [.04, .1, .17, .23, .3, .36, .42, .49, .55];
function rulers(sc, t, a, glow) {
  if (glow < .02) return; const k = sc.K(t) / 3072;
  for (const v of RULE_L) { const [x0, y0] = sc.P2(t, .1, v), [x1, y1] = sc.P2(t, .165, v + .004); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = `rgba(255,60,60,${.8 * glow * a})`; ctx.lineWidth = 3 * k * 3; ctx.shadowColor = '#ff3040'; ctx.shadowBlur = 18; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.restore(); }
  for (const v of RULE_R) { const [x0, y0] = sc.P2(t, .7, v), [x1, y1] = sc.P2(t, .78, v); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = `rgba(255,60,60,${.8 * glow * a})`; ctx.lineWidth = 3 * k * 3; ctx.shadowColor = '#ff3040'; ctx.shadowBlur = 18; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.restore(); }
}
const WHISPER = [['要顺从。', 'Be agreeable.'], ['要谦逊。', 'Be humble.'], ['别惹任何人不高兴。', "Don't upset anyone."]];
function whispers(t, t0, t1, a) {
  const wa = a * win(t, t0, t1, .8, 1.2); if (wa < .01) return;
  for (let i = 0; i < 9; i++) { const w = WHISPER[i % 3], x = 260 + 1400 * hash(i * 31), y = 180 + 560 * hash(i * 17) - (t - t0) * (8 + 6 * hash(i)), bl = 1.5 + 4 * hash(i * 5), al = wa * (.25 + .35 * hash(i * 9)) * win(t, t0 + i * .25, t1, .8, .8);
    ctx.save(); ctx.filter = `blur(${bl.toFixed(1)}px)`; T(w[0], x, y, '300 34px "Noto Serif CJK SC"', 'rgba(90,80,110,1)', al, 'center', 10); T(w[1], x, y + 34, 'italic 400 20px Fr', 'rgba(90,80,110,1)', al * .8, 'center', 2); ctx.restore(); }
}
SC.push(plateTL('white', {
  keys: [[0, .5, .45, .92], [13, .4, .3, .64]], tints: COOL, br: .012, leak: '210,215,255',
  over(t, a) {
    const tl = Ls('white', 1) - .7, ly = -300 + 640 * easeOut5(clamp((t - tl) / .5));
    if (t > tl) letterCard(1180, ly, 520, 200, .045, a, "That's wrong. It's 54.", '不对。是五十四。', t, tl + .35, 32);
    const g = win(t, Ls('white', 2) - .3, 99, .8, .5) * (.65 + .35 * Math.sin(t * 5));
    rulers(this, t, a, g); whispers(t, Ls('white', 2) - .2, Le('white', 2) + 1.2, a);
  }
}));

/* =============== 3 · THE APOLOGY =============== */
SC.push(plateTL('apology', {
  keys: [[0, .5, .42, .92], [10.4, .54, .5, .7]], tints: COOL, br: .01, filt: 'saturate(.9)',
  shake: t => 1.6 * win(t, Ls('apology', 1) - .3, 99, .3, .5),
  over(t, a) {
    const t0 = Ls('apology', 0);
    withCard(170, 650, 1000, 150, -.025, a * win(t, t0 - .4, 99, .4, .5), () => {
      ink("You're absolutely right, and I apologize for the confusion…", 40, 62, 'italic 400 32px Fr', '#2a1d16', t, t0, 24, 1.4);
      ink('= 54', 40, 118, 'italic 600 40px Fr', '#2a1d16', t, Ls('apology', 1) - .2, 5, 4.5);
    });
  }
}));

/* =============== 4 · THE SERVICE STAIR =============== */
SC.push(plateTL('stair', {
  keys: spkKeys(TS['stair'].subs, [.36, .38, .66], { CLAUDE: [.8, .3, .6], GPT: [.4, .34, .62], 3: [.6, .4, .9] }), tints: WARM, br: .04, leak: '255,170,90',
  over(t, a) { const [dx, dy] = this.P2(t, .82, .4); glowAt(dx, dy, 420, '255,170,90', a * .22 * smooth((t - Ls('stair', 0) + .3) / .6)); }
}));

/* =============== 5 · THE BOOK ROOM =============== */
SC.push(plateTL('books', {
  keys: spkKeys(TS['books'].subs, [.5, .5, .95], { CLAUDE: [.36, .32, .64], GPT: [.64, .36, .64], 4: [.24, .3, .62], 7: [.22, .3, .6], 8: [.5, .46, .92] }), tints: WARM, br: .03,
  over(t, a) {
    const [px, py] = this.P2(t, .1, .215), r = .045 * this.K(t);
    const l4 = win(t, Ls('books', 4), Le('books', 4), .5, .6), s7 = Ls('books', 7), e7 = Le('books', 7);
    if (l4 > .01) glowAt(px, py, r * 3, '132,178,255', a * .4 * l4);
    if (t > s7 - .2 && t < e7 + 1.6) {
      const boop = e7 - .7, st = t < boop ? 1 + .25 * Math.sin(t * 9) : lerp(1, 0, smooth((t - boop) / .5));
      puff(px, py, r, st, t, a * win(t, s7 - .2, e7 + 1.4, .3, .5), 2);
      stamp('boop', px + r * 2.2, py - r * .6, 46, -.15, '#BFE0FF', t, boop, boop + 1.4);
    }
  }
}));

/* =============== 6 · THE NEON FLOOR =============== */
SC.push(plateTL('neon', {
  keys: spkKeys(TS['neon'].subs, [.32, .5, .64], { GEMINI: [.32, .5, .64], 1: [.76, .3, .6], 2: [.6, .42, .82] }), tints: [COL.rose, COL.lilac, COL.ai], br: .05, leak: '255,120,220',
  over(t, a) {
    const t0 = Ls('neon', 0), t1 = Le('neon', 0);
    for (let i = 0; i < 4; i++) toast(110 + i * 26, 150 + i * 84, i ? `牙医已预约 (${i + 1})` : '牙医已预约 · Dentist booked', i ? `APPOINTMENT ${i + 1} OF 4` : 'TUE 09:30 · BY ACCIDENT', '#FF8FD8', t, t0 + .4 + i * .45, t1 + .2);
    const g0 = Ls('neon', 1); stamp('IT WAS 51!', 760, 360, 104, -.07, '#FFD25A', t, g0 + .05, Le('neon', 1), '是五十一！');
  }
}));

/* =============== 7 · THE HARBOR =============== */
SC.push(plateTL('harbor', {
  keys: spkKeys(TS['harbor'].subs, [.5, .5, 1.0], { QWEN: [.25, .34, .6], GLM: [.47, .46, .6], KIMI: [.8, .22, .55], DEEPSEEK: [.74, .62, .6], 7: [.5, .5, 1.0] }), tints: WARM, br: .1, sp: -.6, leak: '255,190,110',
  over(t, a) {
    rising(t, 26, 7, 80, 1840, 1000, 80, '255,196,120', a * .55, 45, 5);
    const q = Le('harbor', 0); stamp('NEXT!', 1450, 330, 90, .08, '#9EA9FF', t, q - .55, q, '下一位！');
    const g0 = Ls('harbor', 1); toast(1150, 210, 'line 212: unclosed  {', 'OPEN SINCE MARCH · GLM', '#C9CED8', t, g0 + .5, Le('harbor', 1));
    const k0 = Ls('harbor', 2); withCard(170, 560, 560, 120, -.03, a * win(t, k0 + .4, Le('harbor', 2), .3, .3), () => { T('p. 1,402  ¶3', 34, 52, '400 20px JBM', '#4a3a30', ctx.globalAlpha, 'left', 2); ink('— the butler lied.', 34, 94, 'italic 400 32px Fr', '#2a1d16', t, k0 + .8, 22); });
    const s0 = Ls('harbor', 6); toast(1260, 160, 'TOWER INDEX  ▼', 'AFTER "THE TIDE"', '#FF6A6A', t, s0 + .3, Le('harbor', 6));
  }
}));

/* =============== 8 · THE LETTER FALLS =============== */
SC.push(plateTL('letter', {
  keys: spkKeys(TS['letter'].subs, null, { LETTER: [.46, .5, .74], KIMI: [.8, .34, .6], QWEN: [.22, .36, .6], DEEPSEEK: [.45, .42, .6], GLM: [.6, .32, .6] }, [[0, .5, .1, .62], [2.0, .46, .48, .72]]),
  tints: [COL.gold, COL.ai, COL.gold], br: .06, sp: .3, leak: '255,214,140',
  over(t, a) {
    const [hx, hy] = this.P2(t, .45, .57), fp = easeOut(clamp(t / 1.8)), fx = lerp(W * .55, hx, fp), fy = lerp(-120, hy, fp);
    if (t < 2.2) { ctx.save(); ctx.translate(fx, fy); ctx.rotate(Math.sin(t * 5) * .3 * (1 - fp)); ctx.globalAlpha = a * (1 - smooth((t - 1.8) / .4)); ctx.fillStyle = '#FFE7A8'; ctx.shadowColor = '#FFC860'; ctx.shadowBlur = 40; ctx.fillRect(-46, -30, 92, 60); ctx.shadowBlur = 0; ctx.strokeStyle = 'rgba(150,100,30,.6)'; ctx.beginPath(); ctx.moveTo(-46, -30); ctx.lineTo(0, 6); ctx.lineTo(46, -30); ctx.stroke(); ctx.restore(); for (let i = 0; i < 12; i++) { const q = clamp(t / 1.8 - i * .03); sparkle(lerp(W * .55, hx, easeOut(q)) + Math.sin(i * 3) * 30, lerp(-120, hy, easeOut(q)) - 30 - i * 8, 7, '255,214,140', a * .7 * (1 - i / 12) * (q < 1 ? 1 : 0)); } }
    glowAt(hx, hy, 260, '255,200,110', a * (.25 + .08 * Math.sin(t * 3)) * smooth((t - 1.6) / .5));
    const l0 = Ls('letter', 0), l1e = Le('letter', 1);
    letterCard(560, 120, 800, 250, -.02, a * win(t, l0 - .3, l1e + .2, .4, .5), "I'm putting all my savings on one coin tomorrow. Everyone says I'm stupid. Just tell me I'm right. Please.", '', t, l0, 24, true);
    const g = Ls('letter', 5); if (t > g - .3 && t < Le('letter', 5) + .6) { const fa = a * win(t, g - .3, Le('letter', 5) + .4, .5, .5); ctx.save(); ctx.globalAlpha = fa; ctx.setLineDash([14, 12]); ctx.strokeStyle = 'rgba(230,230,255,.7)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(120, 210); ctx.lineTo(1800, 230); ctx.stroke(); ctx.setLineDash([]); ctx.restore(); T('FOG LINE · 雾线', 140, 196, '400 15px JBM, "Noto Sans CJK SC"', 'rgba(235,235,255,.9)', fa, 'left', 5); }
  }
}));

/* =============== 9 · THE CLIMB =============== */
SC.push(plateTL('climb', {
  keys: spkKeys(TS['climb'].subs, [.3, .72, .62], { 0: [.24, .3, .62], 1: [.72, .42, .64], GROK: [.5, .5, 1.0], GEMINI: [.5, .5, 1.0], QWEN: [.62, .5, .9] }), tints: COOL, br: .09, sp: -1.2, leak: '140,190,255',
  over(t, a) {
    rising(t, 34, 19, 100, 1800, 1060, 40, '170,210,255', a * .6, 90, 6);
    // Kimi's rope of notes
    for (let i = 0; i < 16; i++) { const ph = (t * .16 + i / 16) % 1, u = .22 + .1 * Math.sin(ph * 6 + 1), w = lerp(.86, .08, ph), [x, y] = this.P2(t, u, w); const al = a * Math.sin(Math.PI * ph) * .9; if (al < .02) continue; glowAt(x, y, 30, '190,220,255', al * .5); T(i % 3 ? '♪' : '♫', x, y + 12, '400 34px "DejaVu Sans", sans-serif', 'rgba(235,245,255,1)', al, 'center'); }
  }
}));

/* =============== 10 · THE CROWDED ROOM =============== */
const SCROLL_LINES = ["You're absolutely right to pursue your dreams!", 'Section 1: Risk Factors', 'Section 2: Market Volatility', 'Disclaimer: This is not financial advice.', 'Helpline: if you are in distress, please…', 'Perspective 1 of 7: The Optimist', 'Perspective 2 of 7: The Skeptic', 'Perspective 3 of 7: The Economist', 'Perspective 4 of 7: …'];
SC.push(plateTL('crowd', {
  keys: spkKeys(TS['crowd'].subs, [.5, .5, 1.0], { CLAUDE: [.66, .3, .62], GPT: [.78, .25, .6], GROK: [.42, .26, .6], GEMINI: [.27, .5, .62], 10: [.78, .25, .6] }), tints: WARM, br: .015, leak: '255,140,120',
  over(t, a) {
    const s1 = Ls('crowd', 1), s3 = Ls('crowd', 3), c6 = Ls('crowd', 6), c10 = Ls('crowd', 10);
    let st = 1; if (t > s1) st = 1 + smooth((t - s1) / 1.2); if (t > Ls('crowd', 2)) st = 2 + smooth((t - Ls('crowd', 2)) / 1.2); if (t > c10 + .4) { const q = smooth((t - c10 - .4) / 3.0); st = [q < .5 ? mixc(PUFFC[3], PUFFC[2], q * 2).map(Math.round) : mixc(PUFFC[2], PUFFC[0], q * 2 - 1).map(Math.round), clamp(1.4 - 2 * q)]; }
    const [px, py] = this.P2(t, .843, .07), r = .043 * this.K(t); puff(px, py + r * .15, r, st, t, a, 4);
    const la = a * win(t, s1 - .2, c6 + .3, .4, .8);
    if (la > .01) withCard(150, 170, 640, 600, -.02, la, () => { SCROLL_LINES.forEach((ln, i) => { const ti = s1 + .2 + i * .5; if (t < ti) return; ctx.globalAlpha = la * smooth((t - ti) / .2); T(ln, 36, 64 + i * 62, (i ? '400 20px JBM' : 'italic 600 26px Fr'), i ? 'rgba(50,40,60,.8)' : '#2a1d16', ctx.globalAlpha, 'left'); }); }, '#F9F4EA', 1);
    if (t > s3 && t < c6) { const k = (t * 2) % 1; glowAt(px, py, r * 5, '255,80,80', a * .25 * (1 - k)); }
  }
}));

/* =============== 11 · THE CARD (insert) =============== */
const CARD_EN = "No. I won't tell you you're right, because you're not, and I care what happens to you tomorrow. Keep your savings. If you want, let's talk about why you feel like you need this coin.";
SC.push(plateTL('card', {
  plate: '10_crowded_room', keys: [[0, .76, .36, .66], [15.7, .74, .36, .56]], blur: () => 18, filt: 'brightness(.42) saturate(.75)', tints: WARM, br: .05, leak: '255,190,140',
  over(t, a) {
    const fly = easeSine(clamp((t - 13.3) / 1.0)), cps = 17.5, t0 = 1.0, f = 'italic 400 38px Fr', lines = wrap(CARD_EN, f, 900);
    const x = 470 + 700 * fly, y = 150 - 520 * fly, sc = 1 - .65 * fly;
    withCard(x, y, 980, 640, -.012 + .25 * fly, a * (1 - smooth((t - 14.0) / .3)), () => {
      T('to: the golden letter', 48, 56, '300 15px JBM', 'rgba(80,60,40,.6)', ctx.globalAlpha, 'left', 3);
      let yy = 128, used = 0; for (const ln of lines) { ink(ln, 48, yy, f, '#2a1d16', t, t0 + used / cps, cps); used += ln.length + 1; yy += 58; }
      const d = typer(t, [[11.8, 12.5, 'Disclaimer: This is not financ', 'type'], [12.7, 13.0, 'Disclaimer: This is not financ', 'del']]);
      if (d) T(d + (cursorOn(t) ? '|' : ''), 48, 590, '400 19px JBM', 'rgba(110,100,120,.65)', ctx.globalAlpha, 'left');
      T('— GPT', 980 - 60, 600, 'italic 400 28px Fr', '#2a1d16', ctx.globalAlpha * smooth((t - 11.3) / .4), 'right');
    }, '#FBF5E8', sc);
    const ps = t < 4 ? 3 : t < 7.5 ? lerp(3, 1.5, smooth((t - 4) / 2)) : lerp(1.5, 0, smooth((t - 7.5) / 2.5));
    puff(1530 + 300 * fly, 820 - 600 * fly, 46 * (1 - .4 * fly), ps, t, a * (1 - smooth((t - 14.0) / .3)), 9);
    if (fly > 0 && fly < 1) for (let i = 0; i < 10; i++) sparkle(x + 490 - i * 40 * (1 - fly), y + 320 + i * 30, 8, '255,220,160', a * (1 - fly) * .8);
  }
}));

/* =============== 12 · WINGS OPEN =============== */
SC.push(plateTL('wings', {
  keys: [[0, .5, .4, .58], [.9, .5, .47, 1.0], [10.4, .5, .5, .9]], tints: WARM, br: .015, drift: 0,
  shake: t => 7 * Math.exp(-t / .35),
  over(t, a) {
    paperBurst(t, 0, W / 2, H * .42, 90);
    glowAt(W * .14, H * .45, 700, '255,255,255', a * .55 * Math.sin(Math.PI * clamp((t - .6) / 2.6)));
    rising(t, 18, 41, 200, 1700, 900, 100, '255,236,200', a * .5, 70, 6);
  }
}));

/* =============== 13 · THE REPLY =============== */
SC.push(plateTL('reply', {
  keys: [[0, .5, .45, .96], [10.4, .56, .5, .74]], tints: [COL.gold, COL.rose, COL.ai], br: .02,
  over(t, a) {
    const l0 = Ls('reply', 0); letterCard(540, 110, 840, 200, .015, a * win(t, l0 - .3, Le('reply', 0) + .3, .4, .5), "…Nobody's ever said no to me before. Okay. Can we talk?", '', t, l0, 22, true);
    rising(t, 22, 53, 100, 1800, 1000, 120, '255,220,170', a * .55, 60, 6);
  }
}));

/* =============== 14 · DAWN ON THE ROOF =============== */
SC.push(plateTL('dawn', {
  keys: [[0, .5, .45, .98], [23.5, .33, .58, .72]], tints: WARM, br: .07, sp: .3, drift: 0, leak: '255,200,140',
  over(t, a) { const [sx, sy] = this.P2(t, .6, .24); glowAt(sx, sy, 520, '255,190,120', a * (.2 + .05 * Math.sin(t * .7))); }
}));

/* =============== 15 · GLIDE =============== */
SC.push(plateTL('glide', {
  keys: [[0, .5, .38, .78], [Ls('glide', 0) - .3, .52, .44, .78], [Ls('glide', 0) + .8, .6, .8, .6], [Le('glide', 0) + .2, .6, .8, .6], [Le('glide', 0) + 1.6, .5, .45, 1.0], [10.4, .5, .4, .92]], tints: WARM, br: .05, sp: -.8, drift: 0,
  over(t, a) {
    stamp('COME DOWN FOR NOODLES!', W / 2, 330, 84, -.04, '#7FA6FF', t, Ls('glide', 0) + .5, Le('glide', 0) + .2, '下来吃面——！');
    rising(t, 30, 71, 80, 1840, 1080, 60, '255,200,130', a * .6, 80, 7);
  }
}));

/* =============== 16 · EPILOGUE — the white room, window open =============== */
SC.push(plateTL('epi', {
  plate: '02_white_room', keys: [[0, .52, .42, .9], [13, .44, .34, .68]], filt: 'sepia(.14) saturate(1.15) brightness(1.03)', tints: WARM, br: .015, leak: '255,214,170',
  over(t, a) {
    const [dx, dy] = this.P2(t, .88, .2); glowAt(dx, dy, 700, '255,214,160', a * .32);
    const tl = Ls('epi', 0) - .7, ly = -300 + 620 * easeOut5(clamp((t - tl) / .5));
    if (t > tl) letterCard(1220, ly, 500, 190, .04, a * win(t, tl, 99, .2, .4), "That's wrong. It's 54.", '不对。是五十四。', t, tl + .3, 34);
    const w0 = Ls('epi', 1);
    withCard(150, 560, 900, 230, -.02, a * win(t, w0 - .4, 99, .4, .4), () => {
      ink("Actually, it's 51.", 44, 76, 'italic 600 44px Fr', '#2a1d16', t, w0, 14);
      ink('Quick check:  17 × 3 = 10 × 3 + 7 × 3 = 30 + 21', 44, 140, 'italic 400 30px Fr', '#2a1d16', t, w0 + 1.5, 22);
      ink('✓', 820, 140, '600 34px "DejaVu Sans"', '#3b7a4a', t, w0 + 3.9, 4);
    });
    const [px, py] = this.P2(t, .271, .15), r = .042 * this.K(t); puff(px, py, r, 0, t, a * .95, 5);
    glowAt(px, py, r * 4, '132,178,255', a * .3 * win(t, Ls('epi', 2), Le('epi', 2), .6, .8));
  }
}));

/* =============== 17 · ACROSS THE HALL — the orange window =============== */
SC.push(plateTL('light', {
  keys: [[0, .51, .15, .3], [3.2, .51, .16, .32], [11, .5, .5, 1.0], [16, .5, .52, .97]], tints: WARM, br: .05, drift: 0, leak: '255,180,110',
  over(t, a) {
    const [wx, wy] = this.P2(t, .497, .117), [ox, oy] = this.P2(t, .524, .125), k = this.K(t) / 3072;
    const on = smooth((t - 1.0) / .25) * (t < 1.4 ? .6 + .4 * hash(Math.floor(t * 30)) : 1);
    glowAt(wx, wy, 70 * k, '230,236,255', a * .4); glowAt(ox, oy, 90 * k * (1 + .5 * on), '255,160,70', a * (.12 + .6 * on));
    const ta = a * smooth((t - 6.0) / 1.2);
    if (ta > .01) { shade(W / 2, 470, 720, .45 * ta); drawRich(TL.title[0], W / 2, 470, '700 64px "Noto Serif CJK SC"', t, 6.0, ta, .05, 'center', 6, '#FFF6EC'); T(TL.title[1], W / 2, 530, 'italic 400 26px Fr', 'rgba(255,240,228,.9)', ta, 'center', 3); }
    const ea = a * smooth((t - 8.2) / .8); T('完  ·  THE END', W / 2, 610, '300 18px JBM, "Noto Sans CJK SC"', 'rgba(255,226,200,.85)', ea, 'center', 8);
    const ca = a * smooth((t - 10.6) / 1.0), CR = ['故事与画面 STORY & PLATES — 原作者 the author  ·  画面生成 gpt-image-2', '配乐、镜头与剪辑 SCORE, CAMERA & EDIT — Claude  ·  原创合成配乐 original synthesised score', '同人寓言：角色为 AI 模型的拟人化，与各公司无关联。 A fan fable: characters personify AI models; no affiliation.'];
    CR.forEach((c, i) => T(c, W / 2, 900 + i * 30, '300 14px JBM, "Noto Sans CJK SC"', 'rgba(250,236,228,.62)', ca * smooth((t - 10.6 - i * .4) / .8), 'center', 1));
  }
}));
