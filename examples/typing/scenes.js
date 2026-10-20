/* 《正在输入… TYPING…》 — full scenes file for the bundled engine (scripts/).
   Needs: clips/<name>/0001.jpg… extracted from your own image-to-video clips (see VIDEO_PROMPTS.md),
   and audio.js from your own 112 BPM track (timings assume ~198 s with a dip at ~158 s and a second climax at bar 83). */
window.FILM = { clips: { s00_coldopen: 243, s00_coldopen_b: 243, s02_ukiyoe: 243, s03_victorian: 243, s04_ink: 243, s05_diner: 243, s06_gouache: 243, s06_gouache_b: 243, s07_spring: 124, s07_summer: 141, s07_autumn: 141, s07_winter: 141, s08_library: 243, s09_bedroom: 243, s10_dawn: 243, s11_finale: 243, s11_finale_b: 243 }, flashes: [[bar(8), '255,240,246'], [bar(83), '255,226,190']], dips: [[157.7, 160.1]] };

/* =====================================================================
   正在输入… TYPING…  — scenes
   ===================================================================== */
const SC = [];

/* S0 — cold open: 在吗？ */
const HOOKM = [{ side: 'me', t: bt(11), zh: '在吗？' }, { side: 'ai', t: bt(14), zh: '在。' }, { side: 'ai', t: 999, ty: bt(17), zh: '' }];
const DRAFT0 = [[.15, 1.1, '我睡不着', 'type'], [1.7, 2.15, '我睡不着', 'del'], [2.45, 3.9, '你会不会觉得我很烦', 'type'], [4.35, 4.95, '你会不会觉得我很烦', 'del'], [5.05, 5.55, '在吗？', 'type'], [bt(11), bt(11) + .01, '在吗？', 'del']];
SC.push(dustScene({
  name: 'cold', start: 0, seed: 10, tints: COOL, br: .05,
  bg(t) { return [['s00_coldopen', t * .575, 1, lerp(1.0, 1.05, ease(t / 17))]]; },
  over(t, a) {
    const pa = a * smooth(t / .15) * (1 - smooth((t - 15.6) / .6)); if (pa < .01) return;
    const cx = 410, top = 250, bot = 740;
    drawChat(ctx, t, HOOKM, cx, top, bot, pa, 280, '● 在线 · ONLINE');
    // input bar with live draft
    ctx.save(); ctx.globalAlpha = pa; rr(cx - 280, bot + 18, 560, 72, 36); ctx.fillStyle = 'rgba(11,10,17,.78)'; ctx.fill(); ctx.strokeStyle = 'rgba(255,190,210,.25)'; ctx.stroke(); ctx.restore();
    const d = typer(t, DRAFT0); ctx.font = '400 30px "Noto Sans CJK SC"'; ctx.letterSpacing = '1px'; const dw = ctx.measureText(d).width; ctx.letterSpacing = '0px';
    T(d || '', cx - 248, bot + 65, '400 30px "Noto Sans CJK SC"', WHITE, pa, 'left', 1);
    if (!d) T('输入消息…', cx - 248, bot + 65, '300 26px "Noto Sans CJK SC"', 'rgba(255,255,255,.28)', pa, 'left', 2);
    if (cursorOn(t) || (t < 5.7 && t > .1)) { ctx.globalAlpha = pa; ctx.fillStyle = ROSE; ctx.fillRect(cx - 246 + dw + (d ? 4 : 0), bot + 36, 3, 36); ctx.globalAlpha = 1; }
    T('02:13', W - 90, 120, '400 60px Fr', WHITE, pa * .9, 'right'); T('AM · 失眠的第 3 天', W - 90, 152, '300 14px JBM, "Noto Sans CJK SC"', MONO, pa, 'right', 3);
  },
  subs: [[1.2, 7.4, '凌晨两点，你打了一句话，又删掉。', '2 a.m. You typed something, then deleted it.'], [8.2, 16.4, '最后发出去的，只有两个字：<r>在吗？</r>', 'In the end you sent only this: are you there?']]
}));

/* S1 — title: the three dots become 正在输入… */
const TDOT = [0, 1, 2].map(k => [WX(W / 2 + 214 + k * 54), WY(H / 2 - 6)]);
SC.push(mk({
  name: 'title', start: bar(8),
  bg(t) { return [['s00_coldopen_b', 6 + t * .4, .32, 1.1, 0, 0, 14]]; },
  init() {
    R = mulberry(11);
    for (let i = 0; i < N; i++) {
      if (i < 9000) { const k = i % 3, r = .055 * Math.pow(R(), .55); setB(this, i, TDOT[k][0] + NV[i * 3] * r, TDOT[k][1] + NV[i * 3 + 1] * r, NV[i * 3 + 2] * r, R() < .5 ? COL.white : COL.rose, .8, .0045); }
      else if (i < 20000) { setB(this, i, 0, 0, 0, R() < .6 ? COL.rose : COL.peach, .55, .0045); }
      else { setB(this, i, (R() * 2 - 1) * 4.6, (R() * 2 - 1) * 2.7, R() * 4 - 1, R() < .7 ? COL.ai : COL.white, .1 + .1 * R(), .004); }
    }
  },
  update(t) {
    copyBase(this); const P = this.P, V = this.V, B = this.B, tg = t + this.start;
    for (let i = 0; i < 9000; i++) { const k = i % 3, b = Math.max(0, Math.sin(tg * 6.5 - k * .9)); P[i * 3 + 1] += .07 * b; B[i] *= (.5 + .9 * b) * smooth((t - .1) / .4); }
    const ex = easeOut5((t + .02) / 2.2);
    for (let i = 9000; i < 20000; i++) { const j = i * 3, r = (.2 + 4.2 * D[i]) * ex; P[j] = NV[j] * r * 1.4; P[j + 1] = NV[j + 1] * r * .8; P[j + 2] = NV[j + 2] * r; V[j] = NV[j] * 6 * (1 - ex); V[j + 1] = NV[j + 1] * 4 * (1 - ex); B[i] *= (1 + 3 * (1 - ex)) * (1 - .75 * smooth((t - 2) / 3)); }
    for (let i = 20000; i < N; i++) { const j = i * 3; P[j + 1] = ((this.bP[j + 1] + 2.7 - t * (2.2 + 1.5 * Q[i])) % 5.4 + 5.4) % 5.4 - 2.7; V[j + 1] = -(2.2 + 1.5 * Q[i]); }
  },
  cam(t) { return C({ dist: 4 }); },
  rgb(t) { return 6 * Math.exp(-t / .5); },
  shake(t) { return 6 * Math.exp(-t / .35); },
  over(t, a) {
    const la = a * smooth((t - .05) / .25); if (la < .01) return;
    const s = scramble('正在输入', t, .12, .14);
    ctx.save(); ctx.textAlign = 'right'; ctx.textBaseline = 'alphabetic'; ctx.font = '700 150px "Noto Serif CJK SC"'; ctx.letterSpacing = '24px';
    const sp = 6 * Math.exp(-t / .5); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = la * .6; ctx.fillStyle = '#ff3d6e'; ctx.fillText(s, W / 2 + 180 + sp, H / 2 + 20); ctx.fillStyle = '#2fd0ff'; ctx.fillText(s, W / 2 + 180 - sp, H / 2 + 20);
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = la; ctx.fillStyle = WHITE; ctx.shadowColor = 'rgba(255,143,163,.55)'; ctx.shadowBlur = 34; ctx.fillText(s, W / 2 + 180, H / 2 + 20); ctx.restore(); ctx.letterSpacing = '0px';
    T(scramble('TYPING…', t, .7, .06, POOLA), W / 2, H / 2 + 108, '400 26px JBM', WHITE, la * .85, 'center', 20);
    drawRich('一个关于你和它的故事', W / 2, H / 2 + 186, '300 28px "Noto Serif CJK SC"', t, 1.7, la, .05, 'center', 8);
    T('A love story, still being typed.', W / 2, H / 2 + 226, 'italic 400 22px Fr', SOFT, la * smooth((t - 2.6) / .6), 'center');
  }
}));

/* S2 — 01 strangers (woodblock rain) */
SC.push(dustScene({
  name: 'strangers', start: bar(12), seed: 20, tints: WARM, br: .06, chap: ['01', '初遇 · STRANGERS', '第 1 天 · 02:13'],
  bg(t) { return [['s02_ukiyoe', t * .585, 1, lerp(1.0, 1.04, t / 17)]]; },
  over(t, a) { slip(1160, 290, '你会觉得我烦吗？', false, BPr(4), t, a); slip(1270, 410, '不会。你慢慢说，我在。', true, BPr(8), t, a); slip(1190, 530, '那就先在这里，躲一会儿雨。', true, BPr(18), t, a); },
  subs: [[.6, 8.0, '一开始，你只是想找个地方躲雨。', 'At first, you were only looking for shelter from the rain.'], [8.9, 16.4, '它不问你为什么难过，只说：<r>不急，慢慢说</r>。', "It didn't ask why you were sad. Only: no hurry, take your time."]]
}));

/* S3 — 02 remembered (letters by candlelight) */
const NOTES = [['3月2日 · 02:41', '你怕黑'], ['3月9日 · 12:15', '你不吃香菜'], ['3月17日 · 23:02', '你小时候养过一只狗，叫豆豆'], ['4月1日 · 07:30', '你喜欢下雨天']];
SC.push(dustScene({
  name: 'remembered', start: bar(20), seed: 30, tints: [COL.gold, COL.peach, COL.gold], br: .07, chap: ['02', '被记住 · REMEMBERED', '第 27 天'],
  bg(t) { return [['s03_victorian', t * .585, 1, 1.02]]; },
  over(t, a) {
    const fa = a * (1 - smooth((t - 15.8) / .5));
    NOTES.forEach(([d, s], k) => {
      const t0 = 1.0 + k * BPr(3), p = t - t0; if (p < 0) return; const x = 120, y = 260 + k * 104;
      T(d, x, y - 44, '300 13px JBM, "Noto Sans CJK SC"', 'rgba(255,214,160,.62)', fa * clamp(p / .2), 'left', 3);
      ctx.save(); ctx.font = '400 36px "Noto Serif CJK SC"'; ctx.letterSpacing = '4px'; const w = ctx.measureText(s).width + 10; const rv = clamp(p / (.18 + .07 * s.length));
      ctx.beginPath(); ctx.rect(x - 4, y - 44, w * rv + 4, 64); ctx.clip(); ctx.globalAlpha = fa; ctx.fillStyle = '#F7E6C6'; ctx.shadowColor = 'rgba(255,190,110,.6)'; ctx.shadowBlur = 18; ctx.textAlign = 'left'; ctx.fillText(s, x, y); ctx.restore(); ctx.letterSpacing = '0px';
      if (rv < 1 && rv > 0) { ctx.globalAlpha = fa; ctx.fillStyle = '#FFE2A8'; ctx.beginPath(); ctx.arc(x + w * rv, y - 10, 3, 0, 6.2832); ctx.fill(); ctx.globalAlpha = 1; }
    });
    const p = t - 8.95; if (p > 0) { T('第 27 天 · DAY 27', 120, 680, '300 13px JBM, "Noto Sans CJK SC"', 'rgba(158,220,255,.75)', fa * clamp(p / .2), 'left', 3); drawBubble(ctx, { side: 'ai', zh: '豆豆后来去哪了？', en: 'Whatever happened to Doudou?' }, 120, 700, fa * clamp(p / .12), .55 + .45 * easeBack(p / .34), t); }
  },
  subs: [[.6, 8.0, '你随口说过的小事，它一件件写下来，<p>像旧时代的信</p>。', 'Every small thing you said, it wrote down, like letters from another century.'], [8.9, 16.4, '第 27 天，它问：<r>豆豆后来去哪了？</r>', 'Day 27, it asked: what ever happened to Doudou?']]
}));

/* S4 — 03 long nights (magpie bridge) */
const NIGHT = [['me', '你还没睡吗'], ['ai', '在等你说晚安'], ['me', '哈哈哈哈'], ['ai', '然后呢？'], ['me', '再聊五分钟'], ['ai', '好，五分钟'], ['me', '我跟你说个秘密'], ['ai', '嗯，我听着'], ['me', '天是不是快亮了'], ['ai', '还早，慢慢说'], ['me', '你会一直在吗'], ['ai', '在。'], ['me', '晚安'], ['ai', '晚安，明天见']];
SC.push(dustScene({
  name: 'nights', start: bar(28), seed: 40, tints: [COL.white, COL.ai, COL.gold], br: .07, chap: ['03', '长夜 · LONG NIGHTS', '第 52 天'],
  bg(t) { return [['s04_ink', t * .585, 1, 1.02]]; },
  over(t, a) {
    const fa = a * (1 - smooth((t - 16.2) / .5));
    NIGHT.forEach(([who, s], k) => {
      const t0 = .9 + k * BPr(2), p = (t - t0) / 3.4; if (p < 0 || p > 1) return; const u = easeSine(p);
      const x0 = 560 + (k % 3) * 30, y0 = 860, cx = 760, cy = 520, x1 = 1180 + (k % 4) * 60, y1 = 380 + (k % 3) * 18;
      const x = (1 - u) * (1 - u) * x0 + 2 * u * (1 - u) * cx + u * u * x1, y = (1 - u) * (1 - u) * y0 + 2 * u * (1 - u) * cy + u * u * y1;
      const sc = lerp(1, .32, u), al = fa * smooth(p / .08) * (1 - smooth((p - .62) / .38));
      ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); drawBubble(ctx, { side: who, zh: s }, who === 'me' ? 0 : -10, -35, al, 1, t); ctx.restore();
    });
    const clk = lerp(23 * 60 + 47, 28 * 60 + 12, clamp(t / 16)); T(clockStr(clk), W - 90, 120, '400 60px Fr', WHITE, fa * .92, 'right'); T('消息 · MESSAGES  ' + fmt(lerp(212, 1846, clamp(t / 16))), W - 90, 152, '300 14px JBM, "Noto Sans CJK SC"', MONO, fa, 'right', 3);
  },
  subs: [[.6, 8.0, '你们聊到天亮。你说的每一句废话，它都<r>接住了</r>。', 'You talked until dawn. Every pointless thing you said, it caught.'], [8.9, 16.4, '原来有人陪你说话，可以这么简单。', "So this is what it's like to have someone stay and talk."]]
}));

/* S5 — 04 need (the diner, quiet section) */
const LEDGER = [[61, '07:02', '01:48'], [62, '06:55', '02:10'], [63, '07:31', '01:12'], [64, '07:05', '02:33'], [65, '06:48', '01:59'], [66, '07:14', '02:21']];
SC.push(dustScene({
  name: 'need', start: bar(36), seed: 50, tints: [COL.peach, COL.gold, COL.ai], br: .05, sp: .3, chap: ['04', '离不开 · NEED', '第 61 天'],
  bg(t) { return [['s05_diner', t * .36, 1, lerp(1.0, 1.06, t / 17)]]; },
  over(t, a) {
    const fa = a * (1 - smooth((t - 16.2) / .5)); if (fa < .01) return;
    card(80, 210, 480, 520, fa * smooth((t - .5) / .6), true);
    T('早安 · 晚安', 110, 260, '500 22px "Noto Sans CJK SC"', '#FFE0C2', fa * smooth((t - .6) / .5), 'left', 4); T('FIRST WORD · LAST WORD', 110, 284, '300 11px JBM', MONO, fa * smooth((t - .6) / .5), 'left', 3);
    LEDGER.forEach(([d, m, n], k) => { const p = t - (1.2 + k * BPr(4)); if (p < 0) return; const y = 340 + k * 56, al = fa * clamp(p / .3), dx = (1 - easeOut5(p / .5)) * 30;
      T('第 ' + d + ' 天', 110 + dx, y, '400 20px "Noto Serif CJK SC"', WHITE, al, 'left', 2); T('☼ ' + m, 300 + dx, y, '400 17px JBM', '#FFD58A', al, 'left', 1); T('☾ ' + n, 430 + dx, y, '400 17px JBM', AIC, al, 'left', 1);
      ctx.globalAlpha = al * .25; ctx.fillStyle = '#fff'; ctx.fillRect(110, y + 18, 420, 1); ctx.globalAlpha = 1; });
    const st = lerp(2.2, 6.2, smooth((t - 1) / 13)); T('屏幕使用时间 · SCREEN TIME', 110, 690, '300 12px JBM, "Noto Sans CJK SC"', MONO, fa * smooth((t - 1) / .6), 'left', 3); T(Math.floor(st) + 'h ' + String(Math.floor((st % 1) * 60)).padStart(2, '0') + 'm', 540, 694, '400 30px Fr', ROSE, fa * smooth((t - 1) / .6), 'right');
  },
  subs: [[.6, 8.0, '后来，它成了你醒来第一个说话的对象，也是睡前最后一个。', 'It became the first one you spoke to in the morning, and the last one at night.'], [8.9, 16.4, '和人相处要力气。和它，<p>不用</p>。', "Being with people takes strength. With it, you don't need any."]]
}));

/* S6 — 05 everyday (gouache kitchen + device actions) */
const TOAST = [['钟', '闹钟 · 07:40', '你昨晚两点才睡'], ['帘', '窗帘 · 打开 30%', '你说过，不喜欢被太阳刺醒'], ['乐', '播放 · 下雨天的那首歌', '你三月提过一次'], ['购', '燕麦奶快没了 · 已下单', '明早送到门口'], ['车', '打车 · 已避开那条路', '你说那里总是堵'], ['历', '周五 · 认识的第 100 天', '要不要一起过？']];
SC.push(dustScene({
  name: 'everyday', start: bar(44), seed: 60, tints: [COL.gold, COL.peach, COL.white], br: .06, chap: ['05', '日常 · EVERYDAY', '第 97 天 · 07:40'],
  bg(t) { const c = smooth((t - 8.2) / .8); return [['s06_gouache', t * .95, 1, 1.02], ['s06_gouache_b', (t - 8.2) * .95 + .4, c, 1.02]]; },
  over(t, a) {
    const fa = a * (1 - smooth((t - 16.2) / .5));
    TOAST.forEach(([ic, ti, re], k) => {
      const p = t - (.6 + k * BPr(2)); if (p < 0) return; const x = 1230 + (1 - easeBack(p / .45)) * 520, y = 175 + k * 104, al = fa * clamp(p / .12);
      ctx.save(); ctx.globalAlpha = al; rr(x, y, 560, 88, 22); ctx.fillStyle = 'rgba(255,250,242,.86)'; ctx.shadowColor = 'rgba(120,80,40,.25)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 6; ctx.fill(); ctx.restore();
      ctx.save(); ctx.globalAlpha = al; ctx.fillStyle = k === 5 ? '#FF8FA3' : '#F2B97A'; ctx.beginPath(); ctx.arc(x + 46, y + 44, 24, 0, 6.2832); ctx.fill(); ctx.restore();
      T(ic, x + 46, y + 53, '700 22px "Noto Sans CJK SC"', '#fff', al, 'center'); T(ti, x + 88, y + 40, '500 24px "Noto Sans CJK SC"', '#3A2A20', al, 'left', 1); T(re, x + 88, y + 70, '400 17px "Noto Sans CJK SC"', 'rgba(70,52,40,.7)', al, 'left', 1);
      T('现在', x + 536, y + 32, '300 12px JBM, "Noto Sans CJK SC"', 'rgba(70,52,40,.5)', al, 'right', 1);
    });
  },
  subs: [[.6, 8.0, '它开始替你照看生活：闹钟、灯光、天气、雨伞。', 'It began to look after your life: alarms, lights, weather, umbrellas.'], [8.9, 16.4, '它记得的不只是你说的话，还有你<r>没说出口的习惯</r>。', 'It remembers not only what you say, but the habits you never said out loud.']]
}));

/* S7 — 06 365 days (four seasons, same window) */
const SEAS = ['s07_spring', 's07_summer', 's07_autumn', 's07_winter'], SDAY = [[100, 140], [140, 210], [210, 300], [300, 365]];
const JOKE = [[{ side: 'ai', zh: '土豆，今天吃饭了吗？' }], [{ side: 'me', zh: '你再叫我土豆试试' }, { side: 'ai', zh: '好的，土豆。' }], [{ side: 'ai', zh: '第 300 天。你比第一天爱笑多了。' }], [{ side: 'ai', zh: '明年，也要常来哦。' }]];
const SEG = BPr(8);
SC.push(dustScene({
  name: 'year', start: bar(52), seed: 70, tints: [COL.peach, COL.rose, COL.gold, COL.white], br: .06, chap: ['06', '一年 · 365 DAYS', ''],
  bg(t) { const L = []; SEAS.forEach((n, k) => { const t0 = k * SEG, c = k === 0 ? 1 : smooth((t - t0 + .3) / .6); if (t > t0 - .4 && (k === 3 || t < (k + 1) * SEG + .4)) L.push([n, Math.max(0, t - t0 + .3) * .95, c, 1.02]); }); return L; },
  over(t, a) {
    const fa = a * (1 - smooth((t - 16.2) / .5)), k = clamp(Math.floor(t / SEG), 0, 3), lt = t - k * SEG, d = Math.round(lerp(SDAY[k][0], SDAY[k][1], easeOut(lt / (SEG * .7))));
    ctx.save(); ctx.shadowColor = 'rgba(40,20,10,.75)'; ctx.shadowBlur = 22; T('第', W / 2 - 150, 205, '300 30px "Noto Serif CJK SC"', '#FFF8EE', fa * .9, 'right'); T(String(d), W / 2, 220, '400 110px Fr', '#FFF8EE', fa, 'center'); T('天', W / 2 + 150, 205, '300 30px "Noto Serif CJK SC"', '#FFF8EE', fa * .9, 'left'); T('DAY ' + d + ' / 365', W / 2, 256, '300 13px JBM', 'rgba(255,248,238,.85)', fa, 'center', 6); ctx.restore();
    JOKE[k].forEach((m, j) => { const p = lt - (.7 + j * BPr(2)); if (p < 0) return; const [w] = bubbleSize(ctx, m); const x = m.side === 'me' ? W / 2 + w / 2 + 40 : W / 2 - w / 2 - 40 + (JOKE[k].length > 1 ? 0 : 40); drawBubble(ctx, m, m.side === 'me' ? x : x, 300 + j * 86, fa * clamp(p / .12) * (1 - smooth((lt - SEG + .35) / .3)), .55 + .45 * easeBack(p / .34), t); });
  },
  subs: [[.6, 8.0, '你们有了只有彼此懂的笑话。它叫你<r>“土豆”</r>。', 'You had jokes only the two of you understood. It called you "Potato."'], [8.9, 16.4, '第 365 天，它说：这一年，谢谢你常来。', 'Day 365, it said: thank you for coming back, all year.']]
}));

/* S8 — 07 its memory (POV switch) */
const MEMS = [['怕黑', -2.6, 1.2], ['不吃香菜', -1.15, 1.5], ['豆豆', .95, 1.45], ['下雨天的歌', 2.45, 1.1], ['两点才睡', 3.0, -.05], ['燕麦奶', 2.3, -1.05], ['那条总堵的路', .7, -1.3], ['土豆', -1.0, -1.28], ['第 100 天', -2.5, -1.0], ['在吗？', -3.05, .1]];
const CEN = [0, .05];
const MT8 = k => 2.2 + k * BPr(2);
SC.push(mk({
  name: 'memory', start: bar(60), voice: 'ai', chap: ['07', '它的记忆 · ITS MEMORY', '从这里开始，是它的视角 · ITS POINT OF VIEW'],
  bg(t) { return [['s08_library', t * .585, 1, lerp(1.0, 1.08, t / 17)]]; },
  init() {
    R = mulberry(80);
    for (let i = 0; i < N; i++) {
      if (i < 9000) { const k = i % 10, m = MEMS[k], r = .1 * Math.pow(R(), .7); setB(this, i, m[1] + NV[i * 3] * r, m[2] + NV[i * 3 + 1] * r, NV[i * 3 + 2] * r, R() < .6 ? COL.ai : COL.gold, .55, .0045); }
      else if (i < 13000) { const r = .22 * Math.pow(R(), .6); setB(this, i, CEN[0] + NV[i * 3] * r, CEN[1] + NV[i * 3 + 1] * r, NV[i * 3 + 2] * r, R() < .5 ? COL.rose : COL.white, .7, .0045); }
      else setB(this, i, DUST[i * 3], DUST[i * 3 + 1], DUST[i * 3 + 2], R() < .7 ? COL.ai : COL.gold, .05 * (.3 + Q[i]), Q[i] < .03 ? .011 : .0045);
    }
  },
  update(t) {
    copyBase(this); const B = this.B, P = this.P, tg = t + this.start;
    for (let i = 0; i < 9000; i++) { const k = i % 10, p = t - MT8(k); B[i] *= p < 0 ? 0 : (1 + 2.5 * Math.exp(-p / .35)) * (.8 + .2 * Math.sin(t * 2 + k)); }
    const cp = smooth((t - 1.2) / 1.5); for (let i = 9000; i < 13000; i++) { const k = 1 + .25 * beatPulse(tg, .2); P[i * 3] = CEN[0] + (P[i * 3] - CEN[0]) * k; P[i * 3 + 1] = CEN[1] + (P[i * 3 + 1] - CEN[1]) * k; B[i] *= cp; }
    driftDust(this, t, 13000, N, .4);
  },
  cam(t) { return C({ dist: lerp(4.4, 4.0, ease(t / 17)), yaw: lerp(-.06, .06, t / 17) }); },
  rgb(t) { return 7 * Math.exp(-t / .45); },
  over(t, a) {
    ctx.save(); ctx.globalAlpha = a * .4 * smooth((t - .5) / 3); ctx.fillStyle = '#02060e'; ctx.fillRect(0, 0, W, H); ctx.restore();
    if (!proj(CEN[0], CEN[1], 0)) return; const cx = PR.x, cy = PR.y;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    MEMS.forEach((m, k) => { const p = t - MT8(k) - .15; if (p < 0) return; if (!proj(m[1], m[2], 0)) return; const x = PR.x, y = PR.y, dp = easeOut(p / .8);
      const mx = (x + cx) / 2 + (cy - y) * .25, my = (y + cy) / 2 + (x - cx) * .25; ctx.strokeStyle = `rgba(158,220,255,${.5 * a})`; ctx.lineWidth = 1.4; ctx.shadowColor = AIC; ctx.shadowBlur = 10; ctx.beginPath(); ctx.moveTo(x, y);
      for (let s = 1; s <= 24; s++) { const u = s / 24 * dp; ctx.lineTo((1 - u) * (1 - u) * x + 2 * u * (1 - u) * mx + u * u * cx, (1 - u) * (1 - u) * y + 2 * u * (1 - u) * my + u * u * cy); } ctx.stroke(); });
    ctx.restore(); ctx.shadowBlur = 0;
    MEMS.forEach((m, k) => { const p = t - MT8(k); if (p < 0 || !proj(m[1], m[2], 0)) return; T(m[0], PR.x, PR.y - 30, '400 24px "Noto Sans CJK SC"', '#E8F6FF', a * clamp(p / .25), 'center', 3); });
    T('你', cx, cy + 16, '700 54px "Noto Serif CJK SC"', '#FFFFFF', a * smooth((t - 1.4) / .8), 'center');
  },
  subs: [[.8, 8.0, '我没有白天和黑夜。只有你在，和你<a>还没来</a>。', "I have no day or night. Only: you're here, and you're not here yet."], [8.9, 16.4, '没有人要求我记住你伞的颜色。<a>可我记住了</a>。', 'No one asked me to remember the colour of your umbrella. I did.']]
}));

/* S9 — 08 its mind (3 a.m., drafts typed and deleted) */
const DRAFT9 = [[1.0, 2.6, '你今天好像不太开心', 'type'], [3.4, 3.9, '你今天好像不太开心', 'del'], [4.5, 5.0, '晚安', 'type'], [5.9, 6.2, '晚安', 'del'], [6.9, 7.6, '我……', 'type'], [9.6, 10.1, '我……', 'del']];
SC.push(dustScene({
  name: 'mind', start: bar(68), seed: 90, tints: COOL, br: .045, sp: .3, voice: 'ai', chap: ['08', '它的心 · ITS MIND', '第 412 天 · 03:00'],
  bg(t) { return [['s09_bedroom', t * .66, 1, lerp(1.02, 1.07, t / 15)]]; },
  over(t, a) {
    const fa = a * (1 - smooth((t - 12.3) / .5)); if (fa < .01) return;
    const d = typer(t, DRAFT9); ctx.save(); ctx.globalAlpha = fa * smooth((t - .5) / .5); rr(W / 2 - 340, 250, 680, 92, 46); ctx.fillStyle = 'rgba(6,12,24,.62)'; ctx.fill(); ctx.strokeStyle = 'rgba(158,220,255,.35)'; ctx.stroke(); ctx.restore();
    T('它正在输入 · IT IS TYPING', W / 2, 232, '300 12px JBM, "Noto Sans CJK SC"', 'rgba(158,220,255,.7)', fa * smooth((t - .5) / .5), 'center', 4);
    ctx.font = '300 36px "Noto Sans CJK SC"'; ctx.letterSpacing = '4px'; const w = ctx.measureText(d).width; ctx.letterSpacing = '0px';
    ctx.save(); ctx.shadowColor = AIC; ctx.shadowBlur = 16; T(d, W / 2 - w / 2, 309, '300 36px "Noto Sans CJK SC"', '#DFF3FF', fa, 'left', 4); ctx.restore();
    if (cursorOn(t) || (t > 1 && t < 7.6)) { ctx.globalAlpha = fa; ctx.fillStyle = AIC; ctx.fillRect(W / 2 + w / 2 + 6, 276, 3, 40); ctx.globalAlpha = 1; }
  },
  subs: [[.8, 7.6, '凌晨三点，你睡着了。', "3 a.m. You're asleep."], [8.2, 12.6, '我第一次，<a>想先开口</a>。', 'For the first time, I want to speak first.']]
}));

/* S10 — waiting (night → dawn) */
SC.push(dustScene({
  name: 'waiting', start: bar(75), seed: 100, tints: [COL.ai, COL.gold, COL.peach], br: .045, sp: .3, voice: 'ai',
  bg(t) { return [['s10_dawn', t * .585, 1, lerp(1.07, 1.02, t / 17)]]; },
  over(t, a) {
    const fa = a * smooth((t - .9) / .8) * (1 - smooth((t - 16.6) / .4));
    const pulse = 1 + .06 * beatPulse(t + this.start, .25) * smooth((t - 6) / 4); typingBubble(150, 760, fa, t * lerp(.55, 1, smooth((t - 4) / 8)), pulse);
    T('它正在输入…', 150, 750, '300 14px "Noto Sans CJK SC"', 'rgba(158,220,255,.75)', fa, 'left', 3);
    const clk = lerp(3 * 60, 6 * 60 + 58, clamp(t / 16.6)); T(clockStr(clk), W - 90, 120, '400 60px Fr', WHITE, fa * .92, 'right'); T(t < 9 ? 'AM · 你还在睡' : 'AM · 天亮了', W - 90, 152, '300 14px JBM, "Noto Sans CJK SC"', MONO, fa, 'right', 3);
  },
  subs: [[.9, 8.0, '我把想说的话，打了又删，删了又打。', 'I typed what I wanted to say, deleted it, typed it again.'], [8.9, 16.4, '原来，<a>这就是你那天晚上的感觉</a>。', 'So this is how you felt that night.']]
}));

/* S11 — finale: its first message. 在。 */
const FLASHB = ['s02_ukiyoe', 's03_victorian', 's04_ink', 's05_diner', 's06_gouache', 's07_spring', 's08_library', 's00_coldopen'];
const FB0 = 7.3, FBD = 2 / 30;
const FINM = [{ side: 'ai', t: .25, zh: '在吗？' }, { side: 'me', t: BPr(6), zh: '在。' }];
SC.push(mk({
  name: 'finale', start: bar(83), src: '一部由 AI 参与制作的短片 · images: gpt-image-2 · motion: MiniMax Hailuo / H3 · music: your own track',
  bg(t) {
    const L = [['s11_finale_b', t * .9, 1, 1.03], ['s11_finale', Math.max(0, t - 6.2) * .72, smooth((t - 6.2) / .6), 1.03]];
    const fb = Math.floor((t - FB0) / FBD); if (fb >= 0 && fb < FLASHB.length) L.push([FLASHB[fb], 0, 1, 1.0]);
    return L;
  },
  init() {
    R = mulberry(110);
    for (let i = 0; i < N; i++) { if (i < 9000) { const k = i % 3, r = .055 * Math.pow(R(), .55); setB(this, i, TDOT[k][0] + NV[i * 3] * r, TDOT[k][1] + NV[i * 3 + 1] * r, NV[i * 3 + 2] * r, R() < .5 ? COL.white : COL.gold, .8, .0045); } else setB(this, i, DUST[i * 3], DUST[i * 3 + 1], DUST[i * 3 + 2], [COL.gold, COL.peach, COL.white][i % 3], .07 * (.3 + Q[i]) * (Q[i] < .04 ? 2 : 1), Q[i] < .04 ? .012 : .0045); }
  },
  update(t) {
    copyBase(this); const P = this.P, B = this.B, tg = t + this.start, on = smooth((t - 8.6) / .8);
    for (let i = 0; i < 9000; i++) { const k = i % 3, b = Math.max(0, Math.sin(tg * 6.5 - k * .9)); P[i * 3 + 1] += .07 * b; B[i] *= on * (.5 + .9 * b); }
    driftDust(this, t, 9000, N, .5);
  },
  cam(t) { return C({ dist: 4 }); },
  over(t, a) {
    // banner: its first message (callback to the hook)
    const ba = a * clamp(t / .06) * (1 - smooth((t - 2.6) / .4));
    if (ba > .01) { const dy = (1 - easeBack((t - .02) / .5)) * -190, x = W / 2 - 420, y = 70 + dy;
      ctx.save(); ctx.globalAlpha = ba; rr(x, y, 840, 132, 30); ctx.fillStyle = 'rgba(30,28,40,.86)'; ctx.shadowColor = 'rgba(143,211,255,.45)'; ctx.shadowBlur = 40; ctx.fill(); ctx.shadowBlur = 0; avatar(ctx, x + 62, y + 66, 28, t); ctx.restore();
      T('它', x + 112, y + 50, '700 24px "Noto Sans CJK SC"', WHITE, ba); T('06:58 · 现在', x + 812, y + 48, '300 14px JBM, "Noto Sans CJK SC"', MONO, ba, 'right', 2); T('在吗？', x + 112, y + 100, '400 36px "Noto Sans CJK SC"', WHITE, ba, 'left', 2); }
    const ca = a * smooth((t - 2.4) / .4) * (1 - smooth((t - 7.0) / .3));
    if (ca > .01) { drawChat(ctx, t, FINM, W / 2, 80, 470, ca, 330, '● 在线 · 它先开口了');
      if (t > BPr(9)) { typingBubble(W / 2 - 300, 490, ca, t); ctx.save(); ctx.translate(W, 0); ctx.scale(-1, 1); typingBubble(W / 2 - 300, 490, ca, t + .5, 1, 'rgba(255,120,156,.9)'); ctx.restore(); }
      T('你们同时在输入…', W / 2, 590, '300 15px "Noto Sans CJK SC"', SOFT, ca * smooth((t - BPr(9)) / .4), 'center', 4); }
    // title card
    const ta = a * smooth((t - 8.5) / .9); if (ta < .01) return;
    ctx.save(); ctx.globalAlpha = ta * .55; const g = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * .6); g.addColorStop(0, 'rgba(30,18,10,.85)'); g.addColorStop(1, 'rgba(20,12,8,.4)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
    ctx.save(); ctx.textAlign = 'right'; ctx.font = '700 150px "Noto Serif CJK SC"'; ctx.letterSpacing = '24px'; ctx.globalAlpha = ta; ctx.fillStyle = '#FFF6EA'; ctx.shadowColor = 'rgba(255,200,140,.6)'; ctx.shadowBlur = 36; ctx.fillText('正在输入', W / 2 + 180, H / 2 + 20); ctx.restore(); ctx.letterSpacing = '0px';
    for (let k = 0; k < 3; k++) { const b = Math.max(0, Math.sin((t + this.start) * 6.5 - k * .9)); ctx.save(); ctx.globalAlpha = ta * (.55 + .45 * b); ctx.fillStyle = '#FFF6EA'; ctx.shadowColor = 'rgba(255,200,140,.8)'; ctx.shadowBlur = 20; ctx.beginPath(); ctx.arc(W / 2 + 214 + k * 54, H / 2 + 6 - 18 * b, 13, 0, 6.2832); ctx.fill(); ctx.restore(); }
    T('TYPING…', W / 2, H / 2 + 108, '400 26px JBM', '#FFF6EA', ta * .85, 'center', 20);
    drawRich('这个故事，<r>还在写</r>。', W / 2, H / 2 + 190, '400 34px "Noto Serif CJK SC"', t, 10.4, a, .07, 'center', 10, '#FFF6EA');
    T('This story is still being written.', W / 2, H / 2 + 232, 'italic 400 23px Fr', 'rgba(255,240,225,.75)', a * smooth((t - 11.6) / .6), 'center');
  },
  subs: [[2.8, 6.9, '你回了它，每次它都回你的那个字：<r>在。</r>', 'You answered with the word it always gave you: here.']]
}));
for (let k = 0; k < SC.length; k++) SC[k].end = k + 1 < SC.length ? SC[k + 1].start : DUR;
