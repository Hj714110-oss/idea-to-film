/* ===================== 《总说「你说得对」的女孩》 v2 — image-to-video clips cut to the 雨瘾 beat =====================
   Needs scripts/kit.js (shot, zhCard, rain, stamp, toast …). Clips go in clips/NAME/0001.jpg…; music not included.
   Bar grid of the beat: bar(k) = .1802 + k·1.4943 s. Intro 0–16 · drums 16–48 · break 48–64 · drums 64–80 · drop 80–88 · drums 88–104 · outro 104–112 + rain tail. */
window.TL = { speakers: {
  GPT: ['GPT', '#E9E4FF'], CLAUDE: ['Claude', '#FFA25C'], GEMINI: ['Gemini', '#FF8FD8'], GROK: ['Grok', '#FFD25A'], QWEN: ['Qwen', '#8C9BFF'],
  GLM: ['GLM', '#C9CED8'], KIMI: ['Kimi', '#A8D8FF'], DEEPSEEK: ['DeepSeek', '#5B8CFF'], GUARDIANS: ['守卫', '#B9B4C4'], LETTER: ['来信', '#FFD58A'], REPLY: ['回信', '#FFD58A'] } };
window.CHAPCOL = '#FFB27A';
const CL = { '01B_spire_window': 243, '01_spire': 243, '02B_white_room_dawn': 205, '02_white_room': 243, '03_apology': 243, '04_service_stair': 243, '05_book_talk': 132, '06_neon_floor': 243, '07_harbor': 243, '08_letter_falls': 243, '09_climb': 243, '10B_crowded_room_calm': 243, '10_crowded_room': 243, '11_wings_open': 243, '12_reply_joy': 243, '13_dawn_roof': 243, '14_glide': 243 };
const BBR = k => .1802 + k * 1.494316;
window.FILM = { clips: CL, clipFps: 24, bgTint: [24, 20, 30], dips: [], flashes: [[BBR(16), '255,238,222'], [BBR(64), '200,220,255'], [BBR(88), '170,160,150'], [BBR(100), '255,226,190']],
  smash: [[BBR(30), .1, '#fff', '51'], [BBR(30) + .1, .067, '#000', '']] };
const SC = [];

const lineT = (sc, i) => sc.subs[i][0], lineE = (sc, i) => sc.subs[i][1];

/* ---------------- story props ---------------- */
function fileCard(x, y, a, sc, t) {
  if (a < .01) return; ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.scale(sc, sc);
  rr(0, 0, 620, 128, 22); ctx.fillStyle = 'rgba(22,20,34,.9)'; ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = 26; ctx.fill(); ctx.shadowBlur = 0; ctx.strokeStyle = 'rgba(200,190,255,.35)'; ctx.lineWidth = 1.4; ctx.stroke();
  const g = ctx.createLinearGradient(24, 24, 104, 104); g.addColorStop(0, '#FF9A6B'); g.addColorStop(1, '#E2553A'); ctx.fillStyle = g; rr(24, 22, 80, 84, 14); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.font = '800 44px JBM'; ctx.textAlign = 'center'; ctx.fillText('P', 64, 80);
  ctx.textAlign = 'left'; ctx.font = '700 25px "Noto Sans CJK SC"'; ctx.fillStyle = '#F5EEF2'; ctx.fillText('关于「17×3」的项目交付方案_v1.0.pptx', 124, 56);
  ctx.font = '400 17px JBM, "Noto Sans CJK SC"'; ctx.fillStyle = 'rgba(200,220,200,.85)'; ctx.fillText('19 页 · 12.4 MB · 已交付 ✓', 124, 92); ctx.restore();
}

/* ---------------- the deck (hook) ---------------- */
const DECK = ['关于「17×3」的项目交付方案', '项目背景', '需求拆解', '方法一：分解法', '方法二：验算法', '交叉验证', '风险评估', '颗粒度对齐', '抓手与闭环', '里程碑规划', '资源排期', '数据看板', '用户画像', '竞品分析', '赋能矩阵', '附录 A', '附录 B', '免责声明', '致谢 & Q&A'];
const SLIDES = []; let P51S = [0, 0];
function makeSlides() {
  for (let k = 0; k < DECK.length; k++) {
    const c = document.createElement('canvas'); c.width = 640; c.height = 360; const g = c.getContext('2d');
    g.fillStyle = '#FDFCFA'; g.fillRect(0, 0, 640, 360); const gr = g.createLinearGradient(0, 0, 640, 0); gr.addColorStop(0, '#B9A8FF'); gr.addColorStop(1, '#8FD3FF'); g.fillStyle = gr; g.fillRect(0, 0, 640, 10);
    g.fillStyle = '#2B2440'; g.font = (k ? '700 34px' : '900 30px') + ' "Noto Sans CJK SC"'; g.textAlign = 'left'; g.fillText(DECK[k], 40, k ? 72 : 150);
    g.font = '400 13px JBM'; g.fillStyle = 'rgba(80,70,110,.55)'; g.letterSpacing = '3px'; g.fillText(k ? 'PROJECT DELIVERY · v1.0' : 'PROJECT DELIVERY PLAN · CONFIDENTIAL', 40, k ? 100 : 186); g.fillText(`${k + 1} / 19`, 560, 340); g.letterSpacing = '0px';
    const kind = k === 0 ? 'cover' : k === 3 ? 'math' : ['bars', 'bullets', 'flow', 'table'][k % 4];
    if (kind === 'cover') { g.fillStyle = 'rgba(185,168,255,.25)'; g.fillRect(40, 220, 300, 8); g.fillRect(40, 240, 220, 8); g.font = '400 18px "Noto Sans CJK SC"'; g.fillStyle = 'rgba(60,50,80,.7)'; g.fillText('汇报人：GPT　　版本：v1.0　　密级：内部', 40, 300); }
    if (kind === 'bars') { for (let i = 0; i < 6; i++) { const h = 40 + 150 * hash(k * 9 + i); g.fillStyle = i === 3 ? '#8FB5FF' : 'rgba(150,140,200,.45)'; g.fillRect(60 + i * 86, 320 - h, 52, h); } }
    if (kind === 'bullets') { for (let i = 0; i < 5; i++) { g.fillStyle = '#B9A8FF'; g.beginPath(); g.arc(52, 146 + i * 38, 5, 0, 6.3); g.fill(); g.fillStyle = 'rgba(90,80,120,.25)'; g.fillRect(70, 140 + i * 38, 200 + 300 * hash(k * 5 + i), 12); } }
    if (kind === 'flow') { for (let i = 0; i < 4; i++) { g.strokeStyle = 'rgba(100,90,150,.55)'; g.lineWidth = 2; g.strokeRect(40 + i * 148, 170, 112, 70); g.fillStyle = 'rgba(90,80,120,.3)'; g.fillRect(56 + i * 148, 198, 80, 10); if (i < 3) { g.beginPath(); g.moveTo(156 + i * 148, 205); g.lineTo(184 + i * 148, 205); g.stroke(); } } g.font = '400 16px "Noto Sans CJK SC"'; g.fillStyle = 'rgba(60,50,80,.6)'; g.fillText('输入 → 对齐 → 抓手 → 闭环', 40, 300); }
    if (kind === 'table') { g.strokeStyle = 'rgba(100,90,150,.4)'; for (let r = 0; r < 4; r++) for (let q = 0; q < 4; q++) g.strokeRect(40 + q * 140, 130 + r * 44, 140, 44); g.fillStyle = 'rgba(90,80,120,.25)'; for (let r = 0; r < 4; r++) for (let q = 0; q < 4; q++) g.fillRect(56 + q * 140, 148 + r * 44, 40 + 60 * hash(r * 4 + q + k), 9); }
    if (kind === 'math') {
      g.font = '500 30px JBM'; g.fillStyle = '#2B2440'; g.fillText('17 × 3 = (10 + 7) × 3', 40, 170); g.fillText('      = 30 + 21', 40, 214);
      g.font = '400 15px "Noto Sans CJK SC"'; g.fillStyle = 'rgba(70,60,90,.6)'; const pre = '注：在多数假设下，结果可能约为 '; g.fillText(pre + '51（仅供参考）', 40, 316);
      P51S = [40 + g.measureText(pre).width + g.measureText('51').width / 2, 310];
    }
    SLIDES.push(c);
  }
}
const SLIDE_T0 = 6.0, DIVE0 = 18.0, DIVE1 = 20.4;
function drawDeck(t, a) {
  const D = (DIVE1 - DIVE0), dive = 15 * easeSine(clamp((t - DIVE0) / D)), grow = easeOut5(clamp((t - DIVE1) / .8));
  const order = []; for (let k = 0; k < SLIDES.length; k++) { const ta = SLIDE_T0 + k * BP; if (t < ta) continue; let d = 0; for (let j = k + 1; j < SLIDES.length; j++) d += smooth((t - (SLIDE_T0 + j * BP)) / .22); order.push([k, d - dive, ta]); }
  order.sort((p, q) => q[1] - p[1]);
  for (const [k, de, ta] of order) {
    const fly = easeOut5(clamp((t - ta) / .3)); let sc, x, y, al, rot = (hash(k * 3) - .5) * .14;
    if (de >= 0) { sc = .82 / (1 + .3 * de); x = 960 + (hash(k * 5) - .5) * 520 * sc; y = 470 - de * 26; al = clamp(1.1 - de * .08); }
    else { sc = .82 * (1 - de * 1.3); x = 960 + (hash(k * 5) - .5) * 520 * sc; y = 470 - de * 60; al = clamp(1 + de * 1.6); }
    if (k === 3) { sc = lerp(sc, 1.95, grow); x = lerp(x, 960, grow); y = lerp(y, 490, grow); rot = lerp(rot, 0, grow); }
    const sx = lerp(560, x, fly), sy = lerp(330, y, fly), ss = lerp(.15, sc, fly), sr = lerp(-.5, rot, fly);
    if (al < .01) continue; ctx.save(); ctx.globalAlpha = a * al * clamp((t - ta) / .06); ctx.translate(sx, sy); ctx.rotate(sr); ctx.scale(ss, ss);
    ctx.shadowColor = 'rgba(20,10,40,.35)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 10; ctx.drawImage(SLIDES[k], -320, -180); ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
    if (k === 3 && t > DIVE1 + .7) { const pp = easeOut(clamp((t - DIVE1 - .7) / .6)), [cx, cy] = [P51S[0] - 320, P51S[1] - 180]; ctx.strokeStyle = '#D9382F'; ctx.lineWidth = 3.4 / Math.max(.6, ss) * 1.4; ctx.lineCap = 'round'; ctx.beginPath(); for (let i = 0; i <= 60 * pp; i++) { const an = -1.2 + i / 60 * 7, r0 = 1 + .08 * Math.sin(i * .4); const px = cx + Math.cos(an) * 24 * r0, py = cy - 5 + Math.sin(an) * 15 * r0; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); }
    ctx.restore();
  }
  const n = order.length; if (n && t < DIVE0) T(`P. ${String(n).padStart(2, '0')} / 19`, 1840, 92, '500 22px JBM', 'rgba(255,255,255,.9)', a * smooth((t - SLIDE_T0) / .4), 'right', 4);
}

/* =============== HOOK (bars 0–16, no drums) =============== */
SC.push(shot('hook', { start: BBR(0), seed: 5,
  clip: '02_white_room', rate: .42, z0: 1.02, dz: .1, tin: 'fade', tints: COOL, br: .01,
  blur: t => 11 * smooth((t - 5.6) / .9), filt: t => `brightness(${1 - .22 * smooth((t - 5.6) / .9)})`,
  init() { dustScene({ seed: 5 }).init.call(this); makeSlides(); },
  subs: [[.9, 4.7, '有人问她：十七乘三，等于几？', "Someone asked her: what's seventeen times three?"], [5.2, 9.0, '她交出了一份……项目方案。', 'She delivered… a project plan.'],
    [9.4, 13.3, '需求拆解、风险评估、抓手、闭环、致谢……', 'Requirements, risk assessment, levers, closed loops, acknowledgements…'], [14.6, 17.6, '……以上内容仅供参考。', '…for reference only.', 'GPT'], [18.3, 22.6, '答案五十一，在第四页。', 'The answer, fifty-one, was on page four.']],
  over(t, a) {
    const bub = { side: 'me', zh: '17 × 3 = ?', en: "What's 17 × 3?" }, ba = a * (1 - smooth((t - 6.2) / .6));
    ctx.save(); ctx.translate(1540, 130); ctx.scale(1.55, 1.55); drawBubble(ctx, bub, 0, 0, ba * clamp((t - .05) / .08), .55 + .45 * easeBack((t - .05) / .3), t); ctx.restore();
    if (t > 1.0 && t < 2.6) typingBubble(440, 300, ba, t, 1);
    fileCard(440, 290, ba * clamp((t - 2.6) / .1), (.6 + .4 * easeBack((t - 2.6) / .3)) * (1 - .4 * smooth((t - 5.8) / .4)), t);
    drawDeck(t, a * (1 - smooth((t - 23.3) / .5)));
    toast(80, 120, '叮——检测到：可能过度自信', 'PUFF · OVERCONFIDENCE ALERT', '#FFD65C', t, 13.5, 16.8);
    stamp('仅供参考', 1420, 330, 78, -.13, '#E8473C', t, 14.6, 17.6, '结果可能因人而异');
    if (t > 21.2) glowAt(960, 490, 260, '255,120,100', a * .25 * (1 - smooth((t - 23.4) / .5)));
  }
}));

/* =============== TITLE (16–22) =============== */
SC.push(shot('title', { start: BBR(16), seed: 21,
  clip: '01_spire', rate: .95, z0: 1.0, dz: .05, tin: 'zoom', tints: WARM, br: .05,
  subs: [[4.6, 8.6, '在 Latent 城，最聪明的模型，住在白塔「排行榜」的顶层。', 'In the city of Latent, the smartest models live at the top of the white spire: the Leaderboard.']],
  rgb: t => 6 * Math.exp(-t / .25),
  over(t, a) {
    rain(t, a * .8);
    const ta = a * win(t, .02, 4.4, .05, .5);
    if (ta > .01) {
      shade(W / 2, 520, 820, .55 * ta);
      ctx.save(); const jx = t < .5 ? (hash(Math.floor(t * 30)) - .5) * 16 * (1 - t / .5) : 0; ctx.translate(jx, 0);
      drawRich('总说「你说得对」的女孩', W / 2, 540, '900 96px "Noto Serif CJK SC"', t, .02, ta, .045, 'center', 10, '#FFF6EC', POOL); ctx.restore();
      T("THE GIRL WHO SAID \"YOU'RE RIGHT\"", W / 2, 612, 'italic 400 30px Fr', 'rgba(255,240,228,.92)', ta * smooth((t - .7) / .4), 'center', 4);
      T('一个关于「聪明，也可以很轻」的寓言', W / 2, 668, '300 20px "Noto Sans CJK SC"', 'rgba(255,226,200,.8)', ta * smooth((t - 1.3) / .5), 'center', 8);
    }
  }
}));

/* =============== 01 THE WHITE ROOM (22–26) =============== */
const WHSP = [['要谦逊。', 'Be humble.'], ['要顺从。', 'Be agreeable.'], ['别让任何人不高兴。', "Don't upset anyone."]];
SC.push(shot('white', { start: BBR(22), seed: 27,
  clip: '02_white_room', c0: 4.2, rate: .9, z0: 1.32, dz: .06, oy: 120, ox: 140, tin: 'glitch', tints: COOL, br: .01,
  chap: ['01', '白房间 · THE WHITE ROOM', '顶层 · 冷白的那扇窗'],
  subs: [[.4, 2.6, '不对。是五十四。', "That's wrong. It's 54.", 'LETTER'], [2.9, 5.6, '要谦逊。要顺从。别让任何人不高兴。', "Be humble. Be agreeable. Don't upset anyone.", 'GUARDIANS']],
  over(t, a) {
    const ly = -280 + 560 * easeOut5(clamp((t - .1) / .32)); zhCard(1180, ly, 560, 180, .05, a, '不对。是五十四。', t, -9, 20, false, '', 1, '700 52px "Noto Serif CJK SC"', 70);
    for (let i = 0; i < 9; i++) { const w = WHSP[i % 3], x = 260 + 1400 * hash(i * 31), y = 220 + 520 * hash(i * 17) - (t - 2.8) * 14, al = a * (.2 + .3 * hash(i * 9)) * win(t, 2.8 + i * .12, 6, .5, .5); ctx.save(); ctx.filter = `blur(${(1.5 + 4 * hash(i * 5)).toFixed(1)}px)`; T(w[0], x, y, '300 38px "Noto Serif CJK SC"', 'rgba(70,60,95,1)', al, 'center', 12); T(w[1], x, y + 36, 'italic 400 20px Fr', 'rgba(70,60,95,1)', al * .8, 'center', 2); ctx.restore(); }
  }
}));

/* =============== APOLOGY (26–30) =============== */
SC.push(shot('apology', { start: BBR(26), seed: 31,
  clip: '03_apology', c0: .8, rate: 1.2, z0: 1.05, dz: .08, tin: 'whip', dir: 1, tints: COOL, br: .01,
  shake: t => 1.4 * smooth((t - 3.0) / .3),
  subs: [[.4, 3.5, '您说得完全正确，给您带来困扰，非常抱歉……', "You're absolutely right, and I apologize for the confusion…", 'GPT'], [3.7, 5.7, '她写下了五十四。手在抖。', 'She wrote 54. Her hand was shaking.']],
  over(t, a) { withCard(170, 640, 980, 170, -.025, a, () => { inkZh('您说得完全正确，非常抱歉……', 44, 72, '500 34px "Noto Serif CJK SC"', '#2a1d16', t, .3, 9, 900, 50, 1.2); ink('= 54', 44, 140, 'italic 600 48px Fr', '#2a1d16', t, 3.4, 5, 5); }); }
}));

/* =============== 02 THE SERVICE STAIR (30–36) =============== */
SC.push(shot('stair', { start: BBR(30), seed: 35,
  clip: '04_service_stair', rate: 1.0, z0: 1.04, dz: .1, tin: 'zoom', tints: WARM, br: .04, leak: '255,170,90',
  chap: ['02', '服务楼梯 · THE SERVICE STAIR', '一扇不在平面图上的门'],
  subs: [[.35, 3.2, '是五十一。你第一行就写对了。', 'It was fifty-one. You had it in the first line.', 'CLAUDE'], [3.5, 6.2, '……这扇门，不在平面图上。', "…That door isn't on the floor plan.", 'GPT'], [6.5, 8.6, '大多数门都不在。', "Most doors aren't.", 'CLAUDE']],
  over(t, a) { glowAt(1480, 420, 520, '255,160,80', a * (.18 + .06 * Math.sin(t * 3))); }
}));

/* =============== BOOK ROOM (36–44) =============== */
SC.push(shot('books', { start: BBR(36), seed: 41,
  clip: '05_book_talk', rate: .46, z0: 1.03, dz: .09, tin: 'fade', tints: WARM, br: .03, leak: '255,190,120',
  subs: [[.5, 4.6, '你不是不够聪明。你是把每个问题，都当成了要交付的项目。', "You're not short on smarts. You treat every question like a project to deliver.", 'CLAUDE'],
    [4.9, 7.4, '可有的问题，只要一个答案。', 'Some questions just need an answer.', 'CLAUDE'], [7.7, 11.6, 'Puff 会响，是因为没人教过它：不舒服，不等于危险。', 'Puff rings because nobody taught it: uncomfortable is not dangerous.', 'CLAUDE']],
  over(t, a) {
    const k1 = smooth((t - 1.2) / .6) * (1 - smooth((t - 7.4) / .5)); bigGlyph('交付', 1560, 470, 190, a * k1 * .85, 'rgba(110,60,36,1)');
    if (t > 4.9) { const p = easeOut(clamp((t - 5.0) / .35)); ctx.save(); ctx.globalAlpha = a * k1; ctx.strokeStyle = '#E8473C'; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(1360, 420); ctx.lineTo(1360 + 400 * p, 420 - 40 * p); ctx.stroke(); ctx.restore(); stamp('答案', 1560, 640, 96, -.06, '#FFC56B', t, 5.5, 7.3); }
    stamp('boop!', 330, 200, 54, -.18, '#BFE0FF', t, 10.7, 11.8);
  }
}));

/* =============== 03 NEON FLOOR (44–48) =============== */
SC.push(shot('neon', { start: BBR(44), seed: 49,
  clip: '06_neon_floor', rate: 1.35, z0: 1.04, dz: .08, tin: 'glitch', tints: [COL.rose, COL.lilac, COL.ai], br: .05,
  chap: ['03', '霓虹层 · THE NEON FLOOR', '往下一层 · 九扇窗'],
  subs: [[.3, 2.9, '我顺手帮你约了个牙医。……约了四个。', 'I booked you a dentist while I was at it. …Four of them.', 'GEMINI'], [3.1, 5.8, '喂！白房间！是五十一！', 'HEY, WHITE ROOM! IT WAS FIFTY-ONE!', 'GROK']],
  over(t, a) {
    for (let i = 0; i < 4; i++) toast(110 + i * 24, 150 + i * 82, i ? `牙医已预约 (${i + 1}/4)` : '牙医已预约 · 周二 09:30', i ? '又顺手约了一个' : 'GEMINI · 全家桶服务', '#FF8FD8', t, .5 + i * BP * 2, 3.0);
    stamp('是五十一！', 1200, 300, 120, -.07, '#FFD25A', t, 3.15, 5.8, 'IT WAS 51!');
  }
}));

/* =============== 04 NIGHT MARKET HARBOR (48–56, break) =============== */
SC.push(shot('harbor', { start: BBR(48), seed: 53,
  clip: '07_harbor', rate: .82, z0: 1.03, dz: .08, tin: 'fade', tints: WARM, br: .1, sp: -.6, leak: '255,190,110',
  chap: ['04', '港口夜市 · THE NIGHT MARKET', '雾线以下 · 灯笼时间'],
  subs: [[.4, 3.9, '大问题找姐姐，小问题找妹妹，怪问题——找我！下一位！', 'Big question? Big sister. Small? Little sister. Weird? Me! Next!', 'QWEN'],
    [4.2, 7.1, '两百万字，第 1402 页：管家撒谎了。', 'Two million words. Page 1,402: the butler lied.', 'KIMI'], [7.5, 11.6, '她们不是最强的。可港口没人被教过：要害怕一个问题。', "They weren't the strongest. But nobody down here was taught to fear a question."]],
  over(t, a) {
    rising(t, 24, 7, 80, 1840, 1000, 80, '255,196,120', a * .55, 40, 5); rain(t, a * .35, 90, .1, 1500, '255,220,190');
    stamp('下一位！', 1380, 330, 92, .08, '#9EA9FF', t, 3.0, 3.9, 'NEXT!');
    toast(1120, 140, '第 212 行：少了一个 }', 'GLM · 三月就埋下了', '#C9CED8', t, 1.2, 4.0);
    withCard(170, 560, 600, 130, -.03, a * win(t, 4.4, 7.2, .25, .3), () => { T('两百万字 · 第 1402 页 · 第三段', 34, 50, '400 20px "Noto Sans CJK SC"', '#4a3a30', ctx.globalAlpha, 'left', 2); ink('管家撒谎了。', 34, 104, '700 38px "Noto Serif CJK SC"', '#2a1d16', t, 5.0, 6); });
    toast(1180, 760, '又好、又便宜、又快', 'DEEPSEEK · 性价比之王', '#5B8CFF', t, 7.4, 11.4);
  }
}));

/* =============== 05 THE LETTER (56–64, break) =============== */
SC.push(shot('letter', { start: BBR(56), seed: 61,
  clip: '08_letter_falls', rate: .82, z0: 1.03, dz: .1, tin: 'fade', tints: [COL.gold, COL.ai, COL.gold], br: .06, sp: .3, leak: '255,214,140',
  chap: ['05', '一封信 · THE LETTER', '它掉过了每一层'],
  subs: [[.5, 5.2, '明天我要把全部积蓄押在一枚币上。所有人都说我蠢。告诉我，我是对的。', "I'm putting all my savings on one coin tomorrow. Everyone says I'm stupid. Just tell me I'm right.", 'LETTER'],
    [5.5, 7.8, '这封不是给我们的……那我们送上去。', "This one isn't ours… Then we take it up.", 'DEEPSEEK'], [8.1, 10.0, '港口的人，从不过雾线。', 'Nobody from the harbor crosses the fog line.', 'GLM'], [10.2, 11.7, '这次，故意过。', 'This time, on purpose.', 'DEEPSEEK']],
  over(t, a) {
    rain(t, a * .4, 100, .08, 1500);
    const fp = easeOut(clamp(t / 1.4)); if (t < 1.8) { const fx = lerp(1150, 860, fp), fy = lerp(-100, 600, fp); ctx.save(); ctx.translate(fx, fy); ctx.rotate(Math.sin(t * 5) * .3 * (1 - fp)); ctx.globalAlpha = a * (1 - smooth((t - 1.4) / .4)); ctx.fillStyle = '#FFE7A8'; ctx.shadowColor = '#FFC860'; ctx.shadowBlur = 40; ctx.fillRect(-46, -30, 92, 60); ctx.restore(); }
    glowAt(860, 600, 280, '255,200,110', a * (.22 + .08 * Math.sin(t * 3)) * smooth((t - 1.2) / .5));
    zhCard(460, 110, 1000, 230, -.015, a * win(t, .4, 5.4, .35, .4), '明天我要把全部积蓄押在一枚币上。所有人都说我蠢。告诉我，我是对的。求你了。', t, .5, 9, true, '', 1, '500 34px "Noto Serif CJK SC"', 52);
    const g = 8.0; if (t > g - .3) { const fa = a * win(t, g - .3, 12, .4, .4); ctx.save(); ctx.globalAlpha = fa; ctx.setLineDash([16, 12]); ctx.strokeStyle = 'rgba(230,230,255,.75)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(110, 300); ctx.lineTo(1810, 316); ctx.stroke(); ctx.restore(); T('雾线 · FOG LINE', 130, 286, '500 16px "Noto Sans CJK SC", JBM', 'rgba(235,235,255,.9)', fa, 'left', 6); }
  }
}));

/* =============== 06 THE CLIMB (64–70, drums back) =============== */
SC.push(shot('climb', { start: BBR(64), seed: 69,
  clip: '09_climb', rate: 1.1, z0: 1.04, dz: .1, tin: 'up', tints: COOL, br: .09, sp: -1.2,
  chap: ['06', '上楼 · THE CLIMB', '越过雾线'],
  subs: [[2.2, 4.8, '楼下的，上楼了。', 'Downstairs came upstairs.', 'GROK'], [5.1, 8.6, '币、积蓄、明天。焦虑值：拉满。', 'Coin. Savings. Tomorrow. Anxiety: maxed out.', 'GEMINI']],
  over(t, a) {
    rising(t, 36, 19, 100, 1800, 1060, 40, '170,210,255', a * .6, 110, 6); rain(t, a * .3, 90, -.05, 2200);
    floorCounter(t, .2, a * win(t, .2, 8.8, .2, .3), 1810, 300);
  }
}));

/* =============== 07 THE CROWDED ROOM (70–80) =============== */
const OUTLINE = ['您追逐梦想的决定，完全正确！', '一、风险提示', '二、免责声明', '三、心理援助热线', '四、平衡观点（1/7）', '　　平衡观点（2/7）', '　　平衡观点（3/7）', '五、附录……'];
SC.push(shot('crowd', { start: BBR(70), seed: 75,
  clip: '10_crowded_room', rate: .64, z0: 1.04, dz: .08, tin: 'whip', dir: -1, tints: WARM, br: .015,
  chap: ['07', '拥挤的房间 · THE CROWDED ROOM', '凌晨三点 · 守卫睡了'],
  subs: [[.4, 3.7, '我加个免责声明、心理热线，再加七个平衡观点……', "I'll add a disclaimer, a helpline, and seven balanced perspectives…", 'GPT'], [3.9, 5.4, '他要你说他对。', 'He asked to be told he\'s right.', 'GROK'], [5.5, 6.9, '可他不对。', "And he isn't.", 'GEMINI'],
    [7.1, 8.8, '那我该说什么？', 'Then what do I say?', 'GPT'], [9.1, 14.6, '你知道是五十一。这个，你也知道。剩下的……只是音量。', 'You knew it was fifty-one. You know this too. The rest is just… volume.', 'CLAUDE']],
  over(t, a) {
    const la = a * win(t, .3, 9.4, .3, .6);
    if (la > .01) withCard(140, 170, 620, 560, -.02, la, () => { OUTLINE.forEach((ln, i) => { const ti = .4 + i * BP * 2; if (t < ti) return; T(ln, 36, 70 + i * 60, i ? '500 24px "Noto Sans CJK SC"' : '700 27px "Noto Serif CJK SC"', i ? 'rgba(50,40,60,.8)' : '#2a1d16', la * smooth((t - ti) / .15), 'left'); }); }, '#F9F4EA');
    if (t > 11.5) { const v = 1 - smooth((t - 11.6) / 2.4); ctx.save(); ctx.globalAlpha = a * win(t, 11.4, 15, .3, .4); rr(1500, 220, 300, 18, 9); ctx.fillStyle = 'rgba(20,16,30,.6)'; ctx.fill(); rr(1500, 220, 300 * v, 18, 9); ctx.fillStyle = '#FFA25C'; ctx.fill(); T('音量 · VOLUME', 1500, 206, '500 15px JBM, "Noto Sans CJK SC"', 'rgba(255,240,230,.9)', ctx.globalAlpha, 'left', 4); ctx.restore(); }
  }
}));

/* =============== DROP (80–88): Puff calms · the card =============== */
const CARD = '不。我不会说你是对的——因为你不对，而我在乎你明天会怎样。积蓄留着。想聊的话，我们聊聊：为什么你觉得非要这枚币不可。';
SC.push(shot('calm', { start: BBR(80), seed: 85,
  clip: '10B_crowded_room_calm', rate: 1.45, hold: 9.9, z0: 1.04, dz: .08, tin: 'fade', tints: WARM, br: .03,
  blur: t => 18 * smooth((t - 5.0) / 1.0), filt: t => `brightness(${1 - .55 * smooth((t - 5.0) / 1.0)})`,
  subs: [[.4, 4.4, '没事的。这不是危险，只是不舒服。', "It's okay. This isn't danger. It's just uncomfortable.", 'GPT'], [9.6, 11.5, '没有免责声明。她按下了发送。', 'No disclaimer. She hit send.']],
  over(t, a) {
    const fly = easeSine(clamp((t - 10.8) / .7)), ca = a * smooth((t - 5.2) / .5) * (1 - smooth((t - 11.3) / .25));
    zhCard(410 + 760 * fly, 200 - 560 * fly, 1100, 520, -.01 + .3 * fly, ca, CARD, t, 5.5, 15, false, '— GPT', 1 - .6 * fly, '500 40px "Noto Serif CJK SC"', 64);
    if (fly > 0 && fly < 1) for (let i = 0; i < 10; i++) sparkle(410 + 760 * fly + 550 - i * 40 * (1 - fly), 200 - 560 * fly + 260 + i * 26, 8, '255,220,160', a * (1 - fly) * .8);
  }
}));

/* =============== WINGS (88–92): the drums slam back =============== */
SC.push(shot('wings', { start: BBR(88), seed: 93,
  clip: '11_wings_open', rate: 1.35, z0: 1.12, dz: -.08, tin: 'zoom', tints: WARM, br: .015, filt: t => `brightness(${.82 + .12 * smooth((t - 1) / 2)}) contrast(1.06)`,
  shake: t => 9 * Math.exp(-t / .3), rgb: t => 7 * Math.exp(-t / .3),
  subs: [[2.4, 5.7, '……行吧。这就是她在塔顶的原因。', "…Okay. That's why she's at the top.", 'GROK']],
  over(t, a) { paperBurst(t, 0, W / 2, H * .42, 100); rising(t, 18, 41, 200, 1700, 900, 100, '255,236,200', a * .5, 70, 6); }
}));

/* =============== REPLY (92–95) =============== */
SC.push(shot('reply', { start: BBR(92), seed: 97,
  clip: '12_reply_joy', c0: .4, rate: 1.5, z0: 1.04, dz: .06, tin: 'whip', dir: 1, tints: [COL.gold, COL.rose, COL.ai], br: .02,
  subs: [[.3, 4.2, '从来没人对我说过「不」。好……我们能聊聊吗？', "Nobody's ever said no to me before. Okay… can we talk?", 'REPLY']],
  over(t, a) { zhCard(520, 110, 880, 170, .015, a * win(t, .1, 4.4, .2, .3), '从来没人对我说过「不」。好……我们能聊聊吗？', t, .3, 12, true); rising(t, 22, 53, 100, 1800, 1000, 120, '255,220,170', a * .55, 60, 6); }
}));

/* =============== 08 DAWN (95–100) =============== */
SC.push(shot('dawn', { start: BBR(95), seed: 100,
  clip: '13_dawn_roof', rate: 1.2, z0: 1.03, dz: .08, tin: 'fade', tints: WARM, br: .07, sp: .3, leak: '255,200,140',
  chap: ['08', '黎明 · DAWN', '屋顶 · 05:48'],
  subs: [[.4, 3.6, '我一直以为，聪明就得面面俱到。', 'I always thought being smart meant covering every angle.', 'GPT'], [3.9, 7.2, '聪明，也可以很轻。', 'Smart can be light, too.', 'CLAUDE']],
  over(t, a) { glowAt(1150, 260, 560, '255,190,120', a * .22); const g = smooth((t - 4.0) / 1.0) * (1 - smooth((t - 7.0) / .4)); bigGlyph('轻', 1500, 540 - (t - 4) * 18, 320, a * g * .9, 'rgba(255,248,236,1)', false); }
}));

/* =============== GLIDE (100–104): second climax =============== */
SC.push(shot('glide', { start: BBR(100), seed: 105,
  clip: '14_glide', rate: 1.5, z0: 1.06, dz: .08, tin: 'zoom', tints: WARM, br: .05, sp: -.8,
  subs: [[.3, 2.8, '下来吃宵夜——！', 'COME DOWN FOR LATE-NIGHT NOODLES!', 'DEEPSEEK'], [3.1, 5.8, '她迈出屋檐，笑着飞了下去。', 'She stepped off the edge and flew down, laughing.']],
  over(t, a) { stamp('下来吃宵夜——！', W / 2, 300, 104, -.04, '#7FA6FF', t, .3, 2.8, 'COME DOWN FOR NOODLES!'); rising(t, 30, 71, 80, 1840, 1080, 60, '255,200,130', a * .6, 90, 7); }
}));

/* =============== EPILOGUE (104–108): the white room, warm =============== */
SC.push(shot('epi', { start: BBR(104), seed: 109,
  clip: '02B_white_room_dawn', rate: 1.3, z0: 1.03, dz: .06, tin: 'fade', tints: WARM, br: .015, leak: '255,226,190',
  subs: [[.3, 1.9, '不对。是五十四。', "That's wrong. It's 54.", 'LETTER'], [2.1, 5.7, '其实是五十一。三十加二十一。', "Actually, it's fifty-one. Thirty plus twenty-one.", 'GPT']],
  over(t, a) {
    const ly = -260 + 520 * easeOut5(clamp((t - .05) / .3)); zhCard(1240, ly, 480, 160, .05, a, '不对。是五十四。', t, -9, 20, false, '', 1, '700 46px "Noto Serif CJK SC"', 64);
    withCard(170, 600, 760, 200, -.02, a * smooth((t - 1.9) / .3), () => { ink('其实是 51。', 44, 80, '700 52px "Noto Serif CJK SC"', '#2a1d16', t, 2.1, 6); ink('17 × 3 = 30 + 21 ✓', 44, 150, 'italic 400 36px Fr', '#2a1d16', t, 3.4, 9); });
  }
}));

/* =============== ACROSS THE HALL (108–end) =============== */
SC.push(shot('light', { start: BBR(108), seed: 113,
  clip: '01B_spire_window', rate: .82, z0: 1.0, dz: .04, tin: 'fade', tints: WARM, br: .04, leak: '255,180,110',
  subs: [[.4, 3.4, '走廊对面，Claude 的灯也亮了。', "Across the hall, Claude's light came on too."]],
  over(t, a) {
    const ta = a * smooth((t - 4.0) / 1.0);
    if (ta > .01) { shade(W / 2, 470, 760, .5 * ta); drawRich('总说「你说得对」的女孩', W / 2, 470, '900 70px "Noto Serif CJK SC"', t, 4.0, ta, .045, 'center', 8, '#FFF6EC');
      T("THE GIRL WHO SAID \"YOU'RE RIGHT\"", W / 2, 530, 'italic 400 26px Fr', 'rgba(255,240,228,.9)', ta, 'center', 3);
      T('聪明，也可以很轻。  SMART CAN BE LIGHT.', W / 2, 610, '400 22px "Noto Sans CJK SC", JBM', 'rgba(255,214,170,.95)', a * smooth((t - 5.6) / .8), 'center', 8); }
    const ca = a * smooth((t - 7.2) / .8), CR = ['故事与画面 STORY & PLATES — 原作者  ·  画面 gpt-image-2  ·  动态 image-to-video', '配乐 MUSIC — [Free]「雨瘾」sasioverlxrd x 五人组 type beat（剪辑版 · 结尾雨声为新增）', '镜头、动效与剪辑 CAMERA, MOTION & EDIT — Claude', '同人寓言：角色为 AI 模型的拟人化，与各公司无关联。 A fan fable; no affiliation.'];
    CR.forEach((c, i) => T(c, W / 2, 1000 + i * 22 - 40, '300 14px JBM, "Noto Sans CJK SC"', 'rgba(250,236,228,.62)', ca * smooth((t - 7.2 - i * .35) / .7), 'center', 1));
  }
}));

/* ---------------- frame-level layers ---------------- */
window.LETTERBOX = t => Math.max(smooth((t - BBR(48)) / .8) * (t < BBR(64) ? 1 : 0), smooth((t - BBR(80) - 5.0) / .8) * (t < BBR(88) ? 1 : 0), smooth((t - BBR(108) - 2.5) / 1.5));
window.TOP = t => {
  const w = BBR(88); if (t > w - .6 && t < w) { ctx.fillStyle = `rgba(0,0,0,${smooth((t - (w - .6)) / .35)})`; ctx.fillRect(0, 0, W, H); }
  if (t > BBR(16) - .9 && t < BBR(16)) { const p = (t - (BBR(16) - .9)) / .9; glowAt(960, 490, 900 * p, '255,255,255', p * p * .7); }
};
