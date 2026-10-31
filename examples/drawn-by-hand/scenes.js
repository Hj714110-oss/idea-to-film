/* scenes.js — 《手绘的心智 · A Mind, Drawn by Hand》 — how Anthropic / Claude's design language took shape */
window.FILM = {
  flashes: [[bar(8), '255,250,240'], [bar(44), '255,236,220'], [bar(83) + BP, '255,246,236']],
  dips: [[157.7, 160.1]],
  smash: [[bar(60) - .1, .1, '#141413', '我']],
};
const SC = [];
const BARL = 4 * BP;

/* ---------- shared overlays ---------- */
function promptBox(t, a, y, txt, t0, dur, en, light) {
  if (a < .01) return; const warm = light === 'warm'; if (warm) light = false; const w = 860, h = 98, x = W / 2 - w / 2;
  ctx.save(); ctx.globalAlpha = a;
  rr(x, y, w, h, 24); ctx.fillStyle = light ? 'rgba(250,250,247,.96)' : warm ? 'rgba(40,31,27,.88)' : 'rgba(24,26,32,.82)'; if (light) { ctx.shadowColor = 'rgba(60,40,20,.14)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 10; } ctx.fill(); ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
  ctx.strokeStyle = light ? 'rgba(25,25,25,.16)' : warm ? 'rgba(224,142,112,.45)' : 'rgba(120,200,255,.35)'; ctx.lineWidth = 1.5; ctx.stroke();
  const n = Math.round(clamp((t - t0) / dur) * [...txt].length), s = [...txt].slice(0, n).join('');
  ctx.font = '400 36px "Noto Sans CJK SC"'; ctx.textAlign = 'left'; ctx.fillStyle = light ? INK : warm ? '#FBEFE8' : '#E8F4FF'; ctx.fillText(s, x + 44, y + 61);
  const cw = ctx.measureText(s).width; if (Math.floor(t * 2.4) % 2 === 0 || (t > t0 && t < t0 + dur)) { ctx.fillStyle = light || warm ? CLAY : '#7CC4FF'; ctx.fillRect(x + 48 + cw, y + 30, 3, 40); }
  // send button
  const sp = t > t0 + dur + .25 ? Math.exp(-(t - t0 - dur - .25) / .3) : 0;
  ctx.beginPath(); ctx.arc(x + w - 52, y + h / 2, 26 + sp * 6, 0, 6.2832); ctx.fillStyle = light || warm ? CLAY : 'rgba(120,200,255,.8)'; ctx.fill();
  ctx.strokeStyle = light ? IVL : '#0d1520'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + w - 52, y + h / 2 + 11); ctx.lineTo(x + w - 52, y + h / 2 - 11); ctx.moveTo(x + w - 61, y + h / 2 - 2); ctx.lineTo(x + w - 52, y + h / 2 - 11); ctx.lineTo(x + w - 43, y + h / 2 - 2); ctx.stroke();
  if (en) T(en, x + 46, y + h + 34, '400 16px AM', light ? 'rgba(25,25,25,.5)' : warm ? 'rgba(240,190,170,.6)' : 'rgba(160,210,255,.55)', smooth((t - t0 - dur) / .5), 'left', 2);
  ctx.restore();
}
function titleBlock(t, t0, a, slash) {
  drawRich('手绘的心智', W / 2, 455, '400 118px "Noto Serif CJK SC"', t, t0, a, .09, 'center', 18);
  const e = smooth((t - t0 - .3) / .5) * a;
  T(scramble('A MIND', t, t0 + .3, .05), W / 2 - 44, 560, '400 38px AS', INK, e, 'right', 10);
  T(scramble('DRAWN BY HAND', t, t0 + .45, .04), W / 2 + 44, 560, '400 38px AS', INK, e, 'left', 10);
  if (slash !== false) handLine([[W / 2 - 13, 524], [W / 2 + 13, 572]], clamp((t - t0) / .35), 7, CLAYD, a, 3, false);
  T('2021 — 2026 · 一部关于 ANTHROPIC 设计语言的短片', W / 2, 628, '400 15px AM, "Noto Sans CJK SC"', CLOUDD, smooth((t - t0 - .9) / .6) * a, 'center', 4);
}
function clayTile(name, x, y, s, a, sc = 1, rot = 0) {
  if (a < .01) return; ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc); rr(-s / 2, -s / 2, s, s, s * .12); ctx.fillStyle = CLAYP; ctx.fill(); ctx.restore();
  const im = IM[name]; if (!im) return; const k = Math.min((s * .78) / im.width, (s * .78) / im.height); img(name, x, y, im.width * k * sc, a, { rot });
}

/* ============ S0 HOOK — the blue-future cliché (dark) ============ */
const HEAD = [[-.34, -.95], [-.42, -.55], [-.56, -.1], [-.58, .25], [-.48, .55], [-.25, .75], [.05, .78], [.32, .66], [.47, .42], [.52, .25], [.66, .02], [.55, -.06], [.6, -.17], [.53, -.26], [.56, -.36], [.47, -.46], [.33, -.5], [.22, -.58], [.18, -.95]];
SC.push(mk({
  name: 'hook', start: 0, dark: 1,
  init() {
    R = mulberry(11); const sc = 1.55, ox = .15, oy = .25; let i = 0; const nodes = [];
    for (let k = 0; k < 42; k++) { let x, y; do { x = R() * 1.1 - .58; y = R() * .95 - .1; } while (Math.hypot((x + .05) / .55, (y - .3) / .47) > 1); nodes.push([x, y, gauss() * .18]); }
    this.nodes = nodes.map(n => [n[0] * sc + ox, n[1] * sc + oy, n[2] * sc]);
    // outline
    const segs = []; let tot = 0; for (let k = 0; k < HEAD.length - 1; k++) { const l = Math.hypot(HEAD[k + 1][0] - HEAD[k][0], HEAD[k + 1][1] - HEAD[k][1]); segs.push(l); tot += l; }
    for (; i < 3600; i++) { let u = R() * tot, k = 0; while (u > segs[k]) { u -= segs[k]; k++; } const f = u / segs[k], x = lerp(HEAD[k][0], HEAD[k + 1][0], f), y = lerp(HEAD[k][1], HEAD[k + 1][1], f); setB(this, i, x * sc + ox + gauss() * .006, y * sc + oy + gauss() * .006, gauss() * .02, COL.cyan, .85, .006); }
    // edges between near nodes
    const E = []; for (let a = 0; a < nodes.length; a++) for (let b = a + 1; b < nodes.length; b++) if (Math.hypot(nodes[a][0] - nodes[b][0], nodes[a][1] - nodes[b][1]) < .26) E.push([a, b]);
    this.E = E;
    for (; i < 7600; i++) { const [a, b] = E[Math.floor(R() * E.length)], f = R(), A = this.nodes[a], B = this.nodes[b]; setB(this, i, lerp(A[0], B[0], f), lerp(A[1], B[1], f), lerp(A[2], B[2], f), COL.blue, .34, .0048); }
    for (let k = 0; k < this.nodes.length; k++, i++) { const n = this.nodes[k]; setB(this, i, n[0], n[1], n[2], COL.white, 1.6, .02); }
    // binary rain far behind
    for (; i < N; i++) { const col = Math.floor(R() * 60); setB(this, i, (col / 60) * 9 - 4.5, R() * 5.2 - 2.6, -1.8 - R() * 1.5, COL.blue, .16 * (.3 + R()), .005); }
  },
  update(t) {
    copyBase(this); const P = this.P, B = this.B;
    for (let i = 0; i < N; i++) {
      const j = i * 3;
      if (i >= 7642) { P[j + 1] = ((this.bP[j + 1] + 2.6 - t * (.25 + .4 * Q[i])) % 5.2 + 5.2) % 5.2 - 2.6; B[i] *= smooth((t - .4) / 2); continue; }
      const p = easeOut((t - 1.6 - D[i] * 3) / 2.2); // assemble
      P[j] = lerp(DUST[j] * 1.2, P[j], p); P[j + 1] = lerp(DUST[j + 1] * 1.2, P[j + 1], p); P[j + 2] = lerp(DUST[j + 2], P[j + 2], p);
      B[i] *= .25 + .75 * p; if (i >= 7600) B[i] *= 1 + 1.5 * beatPulse(t, .2);
    }
  },
  cam(t) { return C({ dist: 4.2 - .5 * smooth(t / 16), yaw: .32 * Math.sin(t * .35) - .1, pitch: .04 }); },
  over(t, a) {
    promptBox(t, a * (1 - smooth((t - 4.2) / .8)), 140, '画一个 AI。', .1, .8, 'DRAW AN AI.', false);
    // HUD clichés
    const ha = a * smooth((t - 4.2) / 1) * (1 - smooth((t - 15.6) / .4));
    if (ha > .01) {
      ctx.save(); ctx.strokeStyle = `rgba(120,200,255,${.6 * ha})`; ctx.lineWidth = 2; const bx = 560, by = 150, bw = 800, bh = 640, L = 40;
      for (const [x, y, dx, dy] of [[bx, by, 1, 1], [bx + bw, by, -1, 1], [bx, by + bh, 1, -1], [bx + bw, by + bh, -1, -1]]) { ctx.beginPath(); ctx.moveTo(x + dx * L, y); ctx.lineTo(x, y); ctx.lineTo(x, y + dy * L); ctx.stroke(); }
      const sy = by + (t * 160 % bh); const g = ctx.createLinearGradient(0, sy - 40, 0, sy); g.addColorStop(0, 'rgba(120,200,255,0)'); g.addColorStop(1, `rgba(120,200,255,${.22 * ha})`); ctx.fillStyle = g; ctx.fillRect(bx, sy - 40, bw, 40);
      ctx.restore();
      const lab = [['NEURAL CORE', (97 + 2.9 * Math.sin(t * 3)).toFixed(1) + '%'], ['SYNAPSE LOAD', fmt(1e6 + t * 74321)], ['SENTIENCE', 'LOADING…']];
      lab.forEach(([k, v], n) => { T(k, 1420, 300 + n * 64, '300 14px JBM', `rgba(140,210,255,${.6 * ha})`, 1, 'left', 3); T(v, 1420, 324 + n * 64, '300 20px JBM', `rgba(200,236,255,${.9 * ha})`, 1, 'left', 2); });
      T('// FUTURE.EXE', 430, 300, '300 14px JBM', `rgba(140,210,255,${.5 * ha})`, 1, 'left', 3);
    }
    // the hand-drawn slash cuts the cliché
    const sp = clamp((t - (BARL * 7.5)) / .42);
    if (sp > 0) { handLine([[600, 150], [1330, 870]], easeIn(sp) , 16, IVORY, a, 2, true); }
  },
  subs: [[.6, 8.0, '每个人画 AI，都画成<a>蓝色的未来</a>。', 'Everyone draws AI as a blue future.'], [8.9, 15.4, '发光，冰冷，隔着一层玻璃。', 'Glowing. Cold. Behind glass.']],
}));

/* ============ S1 TITLE — ivory, the slash becomes the title ============ */
SC.push(mk({
  name: 'title', start: bar(8), dark: 0, hard: true,
  init() { R = mulberry(12); for (let i = 0; i < N; i++) { const f = R(); const x = lerp(WX(600), WX(1330), f), y = lerp(WY(150), WY(870), f); setB(this, i, x, y, gauss() * .1, [COL.ink, COL.clay, COL.kraft][i % 3], i < 4200 ? .09 * (.3 + Q[i]) : 0, Q[i] < .05 ? .012 : .0045); } },
  update(t) { copyBase(this); const P = this.P, V = this.V, B = this.B; const e = easeOut5(t / 2.2); for (let i = 0; i < 4200; i++) { const j = i * 3, r = (.6 + 2.6 * Q[i]); P[j] += NV[j] * r * e + Math.sin(t * .3 + PH[i]) * .05; P[j + 1] += NV[j + 1] * r * .7 * e - t * .02; P[j + 2] += NV[j + 2] * r * e; if (t < .7) { V[j] = NV[j] * 3; V[j + 1] = NV[j + 1] * 3; } B[i] *= .5 + .5 * smooth(1 - t / 3); } },
  cam(t) { return C({ dist: 4 + .2 * smooth(t / 8) }); },
  shake(t) { return 16 * Math.exp(-t / .25); },
  over(t, a) {
    const m = easeOut5(t / .6); // match-cut: the slash flies from the hook diagonal into the title slot
    if (t < .7) handLine([[lerp(600, W / 2 - 13, m), lerp(150, 524, m)], [lerp(1330, W / 2 + 13, m), lerp(870, 572, m)]], 1, lerp(16, 7, m), INK, a * (1 - smooth((t - .55) / .15)), 2, false);
    titleBlock(t, .45, a);
  },
  subs: [[.9, 8.0, 'Anthropic 走了另一条路：<r>一张纸，一只手</r>。', 'Anthropic took another road: a sheet of paper, and a hand.']],
}));

/* ============ S2 CH01 PAPER — the palette and the type ============ */
const SW = [['Slate Dark', '#191919'], ['Cloud Medium', '#91918D'], ['Ivory Medium', '#F0F0EB'], ['Book Cloth', '#CC785C'], ['Kraft', '#D4A27F'], ['Manilla', '#EBDBBC']];
SC.push(dustScene({
  name: 'paper', start: bar(12), seed: 3, chap: ['01', '纸 · PAPER', '2021 — 2023 · GEIST STUDIO'],
  src: '色值出自 Geist 为 Anthropic 制作的品牌色板（GEIST-04）· 字体：Anthropic Sans / Serif',
  over(t, a) {
    const out = smooth((t - 8.3) / .7);
    SW.forEach(([nm, hx], i) => {
      const t0 = .5 + BPr(i * 1.5), p = clamp((t - t0) / .55); if (p <= 0) return;
      const x = 330 + i * 252, y = lerp(-260, 430, easeBack(p)) - out * (300 + i * 30), rot = (1 - easeOut(p)) * (i % 2 ? .25 : -.25) + (hash(i) - .5) * .05;
      ctx.save(); ctx.globalAlpha = a * (1 - out); ctx.translate(x, y); ctx.rotate(rot);
      ctx.shadowColor = 'rgba(60,40,20,.18)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 12; rr(-105, -150, 210, 300, 22); ctx.fillStyle = hx; ctx.fill(); ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
      if (hx === '#F0F0EB') { ctx.strokeStyle = 'rgba(25,25,25,.12)'; ctx.lineWidth = 1.5; ctx.stroke(); }
      const lt = parseInt(hx.slice(1, 3), 16) > 160; const tc = lt ? INK : IVL;
      T(nm, -82, -104, '400 19px AS', tc, 1, 'left', .5); T(scramble(hx, t, t0 + .3, .06, POOLH), -82, -78, '400 15px AM', tc, .85, 'left', 1);
      ctx.restore();
    });
    // blue survives only as Focus
    const fp = clamp((t - (.5 + BPr(10))) / .5);
    if (fp > 0) {
      const fa = a * (1 - out), x = W / 2, y = 700; ctx.save(); ctx.globalAlpha = fa; ctx.translate(x, y); ctx.scale(.6 + .4 * easeBack(fp), .6 + .4 * easeBack(fp)); rr(-120, -26, 240, 52, 26); ctx.fillStyle = FOCUS; ctx.fill(); ctx.restore();
      T('Focus  #61AAF2', x, y + 7, '400 18px AS', '#fff', fa * fp, 'center', 1);
      T('蓝色只留给一件事：焦点。', x, y + 70, '400 22px "Noto Sans CJK SC"', CLOUDD, fa * smooth((t - (1 + BPr(10))) / .5), 'center', 3);
      const ring = []; for (let k = 0; k <= 40; k++) { const u = k / 40 * 6.6 - .3; ring.push([x + Math.cos(u) * (150 + 6 * Math.sin(u * 3)), y + Math.sin(u) * (46 + 3 * Math.cos(u * 2))]); }
      handLine(ring, clamp((t - (.5 + BPr(11))) / .8), 3.5, CLAYD, fa, 5);
    }
    // phase 2: type + stationery
    const p2 = t - 8.6; if (p2 > -.2) {
      const ta = a * smooth(p2 / .4);
      T('Hello', W / 2 - 40, 400, '400 150px AS', INK, ta, 'right', -2);
      T('World', W / 2 + 40, 400, '400 150px ASe', INK, ta * smooth((p2 - .5) / .4), 'left', 0);
      ctx.save(); ctx.globalCompositeOperation = 'source-over'; const wp = easeOut(p2 / 1.0); ctx.fillStyle = IVORY; if (wp < 1) { ctx.globalAlpha = 1; } ctx.restore();
      T('ANTHROPIC SANS', W / 2 - 40, 440, '400 14px AM', CLOUDD, ta * smooth((p2 - .3) / .4), 'right', 4); T('ANTHROPIC SERIF', W / 2 + 44, 440, '400 14px AM', CLOUDD, ta * smooth((p2 - .8) / .4), 'left', 4);
      handLine([[W / 2 - 360, 466], [W / 2 + 360, 466]], clamp((p2 - .3) / 1.2), 3, CLAYD, ta, 9, true);
      [['g16', -430, -.06], ['g02', 0, .03], ['g03', 470, -.03]].forEach(([nm, dx, rot], k) => {
        const q = clamp((p2 - 1.6 - k * BPr(1)) / .6); if (q <= 0) return;
        img(nm, W / 2 + dx, lerp(860, 690, easeBack(q)), nm === 'g03' ? 380 : 210, ta * q, { rot: rot * (2 - easeOut(q)), shadow: 1, frame: IVL, pad: 10, pb: 26 });
      });
    }
  },
  subs: [[.6, 8.0, '暖白代替纯白，<r>陶土色</r>代替科技蓝。', 'Warm ivory instead of white. Clay instead of tech blue.'], [8.9, 16.4, 'Geist 工作室花了约两年半，搭起整套语言。', 'Geist Studio spent about two and a half years building the language.']],
}));

/* ============ S3 CH02 HAND — every picture has a human hand ============ */
const HG = ['HAND-01', 'HAND-03', 'HAND-05', 'HAND-06', 'HAND-14', 'HAND-15', 'HAND-28', 'HAND-17', 'HAND-19', 'HAND-20', 'HAND-25', 'HAND-26'];
SC.push(dustScene({
  name: 'hand', start: bar(20), seed: 4, chapCol: IVL, tints: [COL.ink], br: .04, n: 1600,
  chap: ['02', '手 · HAND', '2023.03 · CLAUDE 发布'], src: '插画：Anthropic 官网 opengraph 插画（HAND-01—34）· Claude 于 2023 年 3 月发布',
  back(t, a) { const p = easeOut5(t / .9); ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = CLAYP; ctx.fillRect(0, H * (1 - p), W, H * p + 2); ctx.restore(); },
  over(t, a) {
    const g = smooth((t - 8.2) / 1.0);
    HG.forEach((nm, i) => {
      const t0 = .6 + BPr(i), p = clamp((t - t0) / .4); if (p <= 0) return;
      const cx = W / 2 + ((i % 4) - 1.5) * 360, cy = 270 + Math.floor(i / 4) * 230, im = IM[nm]; if (!im) return;
      const hero = nm === 'HAND-28', k = Math.min(250 / im.width, 190 / im.height);
      if (hero) { const kk = lerp(k, Math.min(560 / im.width, 470 / im.height), easeOut(g)); const fl = Math.sin(t * 1.2) * 6 * g; img(nm, lerp(cx, W / 2, ease(g)), lerp(cy, 455, ease(g)) + fl, im.width * kk * (.7 + .3 * easeBack(p)), a); }
      else img(nm, cx + (cx - W / 2) * .4 * easeIn(g), cy + (cy - 455) * .3 * easeIn(g), im.width * k * (.7 + .3 * easeBack(p)) * (1 - .3 * g), a * (1 - g));
    });
    if (t > 9.5) { const q = smooth((t - 9.5) / .6); T('白纸 = 想法', 1440, 330, '400 32px "Noto Sans CJK SC"', IVL, a * q, 'left', 3); T('黑线 = 人', 1440, 384, '400 32px "Noto Sans CJK SC"', INK, a * smooth((t - 10.1) / .6), 'left', 3); handLine([[1418, 300], [1418, 396]], clamp((t - 9.6) / .5), 3, INK, a * q, 4, false); }
  },
  subs: [[.6, 8.0, '每一张插画里，都有<g>一只人的手</g>。', 'In every illustration, there is a human hand.'], [8.9, 16.4, '白纸是想法，黑线是我们自己。', 'The white paper is the idea. The black line is us.']],
}));

/* ============ S4 CH03 NODE — the line links into nodes ============ */
const NODES = [['2024.03', 'bar_chart', 'Claude 3 家族', 'CLAUDE 3 MODEL FAMILY'], ['2024.10', 'cursor_nodes', '电脑操作', 'COMPUTER USE'], ['2025.02', 'lightbulb', '看得见的思考', 'VISIBLE THINKING'], ['2025.03', 'connected_nodes', '追踪模型的思路', 'TRACING THOUGHTS'], ['2025.05', 'puzzle_piece_main', '集成', 'INTEGRATIONS'], ['2025.06', 'geometric_apis', 'Artifacts', 'BUILDING ARTIFACTS']];
SC.push(dustScene({
  name: 'node', start: bar(28), seed: 5, chap: ['03', '节点 · NODE', '2024 — 2025'], src: '日期出自素材包所附 Anthropic 文章（ORIG-002/003/004/014/015/016）',
  over(t, a) {
    const pan = -easeSine(t / 16.4) * (NODES.length - 3.2) * 470;
    const pts = NODES.map((n, i) => [380 + i * 470 + pan, 690]);
    handLine([[pts[0][0] - 300, 690], ...pts, [pts[5][0] + 400, 690]], clamp((t - .4) / 15.2), 3.5, INK, a, 7, true);
    NODES.forEach(([d, ic, zh, en], i) => {
      const t0 = .8 + i * 2.45, x = pts[i][0]; if (x < -300 || x > W + 300) return; const p = clamp((t - t0) / 2.0), q = smooth((t - t0 - .3) / .5);
      inkDraw(ic, x, 450, 290, easeSine(p), a);
      ctx.save(); ctx.globalAlpha = a * q; ctx.fillStyle = CLAYD; ctx.beginPath(); ctx.arc(x, 690, 9 + 5 * Math.exp(-Math.max(0, t - t0) / .3), 0, 6.2832); ctx.fill(); ctx.restore();
      T(d, x, 650, '400 17px AM', CLAYD, a * q, 'center', 3);
      T(zh, x, 748, '400 28px "Noto Sans CJK SC"', INK, a * smooth((t - t0 - .5) / .5), 'center', 2);
      T(en, x, 780, '400 13px AS', CLOUDD, a * smooth((t - t0 - .7) / .5), 'center', 3);
    });
  },
  subs: [[.6, 8.0, '线开始连成<r>节点</r>：会思考，也会动手。', 'The line began to link into nodes: it could think, and act.'], [8.9, 16.4, '画的不是芯片，是想法怎样相连。', 'Not chips — but how ideas connect.']],
}));

/* ============ S5 QUIET — why hands ============ */
SC.push(dustScene({
  name: 'quiet', start: bar(36), seed: 6, br: .035, n: 1200, sp: .2, chap: ['04', '为什么是手 · WHY HANDS', '安静 · QUIET'],
  over(t, a) {
    const p = easeSine((t - .6) / 12.5);
    inkDraw('two_hands_holding', W / 2, 455, 600, p, a, { fillA: smooth((t - 12.2) / 1.5), wash: '#E3B49E', lw: 22 });
    T('drawn by hand · ×1', W / 2, 800, '400 14px AM', CLOUDD, a * smooth((t - 14) / .8), 'center', 4);
  },
  subs: [[.6, 8.0, '心智看不见，于是他们画下<r>看得见的人</r>。', 'A mind cannot be seen — so they drew the people who can.'], [8.9, 16.4, '不完美的线条，是一种诚实。', 'An imperfect line is a kind of honesty.']],
}));

/* ============ S6 CH05 COLLAGE — depth tunnel through the research covers ============ */
SC.push(dustScene({
  name: 'collage', start: bar(44), seed: 7, chap: ['05', '拼贴 · COLLAGE', 'RESEARCH 2022 → 2026'], src: '封面：Anthropic 研究与工程文章题图（PAGE-005—093，按发布日期排序）',
  over(t, a) {
    const covs = ASSETS.cov, n = covs.length, ZS = 1.15, s = Math.pow(clamp(t / 16.8), 1.25), tz = lerp(-3.2, n * ZS - 1.4, s) + .25 * beatPulse(t + this.start, .25);
    setCam(C({ dist: 4, tz: 0 })); let near = null;
    const order = []; for (let i = n - 1; i >= 0; i--) order.push(i);
    for (const i of order) {
      const z = i * ZS - tz; if (z < -3.6 || z > 14) continue;
      const side = i % 2 ? 1 : -1, x = side * (1.15 + .5 * hash(i * 7)), y = .35 + (hash(i * 13) - .5) * .9;
      if (!proj(x, y, z)) continue; const zc = PR.z; const w = 1.7 * PR.k; if (w > 2600) continue;
      const al = a * clamp((14 - zc) / 6) * clamp((zc - .5) / .9); if (al < .01) continue;
      const im = IM['cov/' + covs[i][0]]; if (!im) continue; const h = w * im.height / im.width;
      ctx.save(); ctx.globalAlpha = al; ctx.translate(PR.x, PR.y); ctx.rotate((hash(i * 3) - .5) * .08); ctx.shadowColor = 'rgba(40,30,20,.25)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 10;
      ctx.fillStyle = IVL; ctx.fillRect(-w / 2 - 8, -h / 2 - 8, w + 16, h + 16); ctx.shadowBlur = 0; ctx.shadowOffsetY = 0; ctx.drawImage(im, -w / 2, -h / 2, w, h); ctx.restore();
      if (zc > 1.2 && (!near || zc < near[1])) near = [i, zc];
    }
    if (near) {
      const c = covs[near[0]]; const yr = c[1].slice(0, 4), mo = c[1].slice(5, 7);
      ctx.save(); ctx.shadowColor = 'rgba(250,250,247,.95)'; ctx.shadowBlur = 18;
      T(yr, 80, 880, '400 132px AS', INK, a, 'left', -2); T(mo ? '.' + mo : '', 404, 880, '400 52px AS', CLAYD, a, 'left', 0);
      T(c[2].replace(/^\/(research|news|engineering)\//, '').replace(/-/g, ' ').toUpperCase().slice(0, 46), 86, 912, '400 13px AM', CLOUDD, a, 'left', 2);
      ctx.restore();
    }
  },
  subs: [[.6, 8.0, '研究文章换上拼贴：<g>版画、蓝晒、方格纸</g>。', 'Research wore collage: engravings, cyanotypes, graph paper.'], [8.9, 16.4, '把旧物，放在新问题旁边。', 'Old things, set beside new questions.']],
}));

/* ============ S7 CH06 SYSTEM — one handwriting, reused ============ */
const RAIL = ['OBJECT-01', 'NODE-02', 'OBJECT-04', 'NODE-05', 'OBJECT-07', 'OBJECT-11', 'NODE-08', 'OBJECT-12', 'OBJECT-17', 'NODE-10', 'OBJECT-14', 'NODE-06', 'OBJECT-03', 'OBJECT-09', 'NODE-07', 'OBJECT-13'];
SC.push(dustScene({
  name: 'system', start: bar(52), seed: 8, chap: ['06', '系统 · SYSTEM', '2025 — 2026'], src: '素材包统计：342 份档案源文件 · Claude Design 于 2026-04-17 发布（ORIG-009 / ORIG-022）',
  over(t, a) {
    const o1 = 1 - smooth((t - 8.2) / .8);
    if (o1 > .01) {
      const sp = t * 120, span = RAIL.length * 210;
      for (let r = 0; r < 2; r++) for (let k = 0; k < RAIL.length + 2; k++) {
        const base = r === 0 ? -((sp % span)) : (sp * .62 % span) - span; const x = base + k * 210 + (r ? 105 : 0); const xx = ((x % span) + span) % span - 210;
        const ry = r === 0 ? 270 : 480; clayTile(RAIL[(k + r * 5) % RAIL.length], xx + (r ? 0 : 0), ry + (r ? 1 : -1) * 40 * (1 - o1), 180, a * o1 * smooth((t - .3 - k * .05) / .5));
      }
      const c = Math.round(342 * easeOut(clamp((t - 1.0) / 4.5)));
      ctx.save(); ctx.shadowColor = 'rgba(250,250,247,.95)'; ctx.shadowBlur = 16;
      T(String(c), W / 2, 765, '400 120px AS', INK, a * o1 * smooth((t - .9) / .4), 'center', 2);
      T('张原图 · 同一种笔迹', W / 2, 815, '400 24px "Noto Sans CJK SC"', CLOUDD, a * o1 * smooth((t - 2) / .5), 'center', 6);
      ctx.restore();
    }
    const p2 = t - 8.6; if (p2 > -.1) {
      const q = easeOut5(p2 / .8), im = IM['o22']; if (!im) return; const w = 1040 * (.94 + .06 * q), h = w * im.height / im.width, x = W / 2, y = 470;
      img('o22', x, y, w, a * smooth(p2 / .5), { shadow: 1, radius: 14 });
      const bx = x - w / 2 - 22, by = y - h / 2 - 22, bw = w + 44, bh = h + 44;
      handLine([[bx, by + 14], [bx + bw - 8, by], [bx + bw, by + bh - 10], [bx + 6, by + bh], [bx - 2, by + 30]], clamp((p2 - .7) / 1.6), 4, CLAYD, a, 11);
      const tg = smooth((p2 - 1.6) / .5); ctx.save(); ctx.globalAlpha = a * tg; rr(bx + 20, by - 30, 330, 46, 23); ctx.fillStyle = INK; ctx.fill(); ctx.restore();
      T('2026.04.17 · CLAUDE DESIGN', bx + 185, by - 1, '400 16px AM', IVL, a * tg, 'center', 2);
    }
  },
  subs: [[.6, 8.0, '到今天，它长成了一套<r>可以复用的系统</r>。', 'Today, it has grown into a system that can be reused.'], [8.9, 16.4, '2026 年，连 Claude 自己也开始用它做设计。', 'In 2026, Claude itself began designing with it.']],
}));

/* ============ S8 TURN — Claude's point of view (dark) ============ */
SC.push(mk({
  name: 'turn', start: bar(60), dark: 1, hard: true, voice: 'ai', chap: ['07', '我 · ME', 'CLAUDE 的视角 · POV'],
  init() {
    R = mulberry(21); const S = []; for (let k = 0; k < 342; k++) { const u = R() * 2 - 1, th = R() * 6.2832, r = 1.55 + gauss() * .18, s = Math.sqrt(1 - u * u); S.push([Math.cos(th) * s * r * 1.35, u * r * .85, Math.sin(th) * s * r]); }
    this.ST = S; const NB = []; for (let a = 0; a < 342; a++) { const d = S.map((b, k) => [Math.hypot(b[0] - S[a][0], b[1] - S[a][1], b[2] - S[a][2]), k]).sort((p, q) => p[0] - q[0]); NB.push([d[1][1], d[2][1]]); } this.NB = NB;
    for (let i = 0; i < N; i++) { if (i < 342) setB(this, i, S[i][0], S[i][1], S[i][2], i % 5 ? COL.clay : COL.ivory, 2.3, .017); else { const a = S[i % 342]; setB(this, i, a[0] + gauss() * .09, a[1] + gauss() * .09, a[2] + gauss() * .09, i % 3 ? [.55, .3, .22] : [.5, .45, .4], .1, .0045); } }
  },
  update(t) { copyBase(this); const B = this.B; for (let i = 0; i < 342; i++) B[i] *= .6 + .6 * Math.max(0, Math.sin(t * 2 + PH[i] * 3)); driftDust(this, t, 342 + 7000, N, .3); },
  cam(t) { return C({ dist: 4.6 - .5 * smooth(t / 16), yaw: .6 * Math.sin(t * .22) + t * .03, pitch: .18 * Math.sin(t * .17) }); },
  shake(t) { return 12 * Math.exp(-t / .2); },
  over(t, a) {
    ctx.save(); ctx.strokeStyle = 'rgba(224,142,112,.34)'; ctx.lineWidth = 1.2; ctx.globalAlpha = a; ctx.beginPath();
    for (let i = 0; i < 342; i++) { const A = this.ST[i]; if (!proj(A[0], A[1], A[2])) continue; const x0 = PR.x, y0 = PR.y; for (const k of this.NB[i]) { const Bq = this.ST[k]; if (!proj(Bq[0], Bq[1], Bq[2])) continue; ctx.moveTo(x0, y0); ctx.lineTo(PR.x, PR.y); } }
    ctx.stroke(); ctx.restore();
    // every two beats a node remembers a drawing
    const ics = ['seedling', 'eye_hand', 'quill_pen', 'speech_bubbles', 'sun_model', 'magnifying_glass', 'pencil_nodes', 'hand_geometric'];
    const k = Math.floor(t / BPr(2)); for (let m = Math.max(0, k - 1); m <= k; m++) {
      const lt = t - m * BPr(2); if (lt < 0 || lt > 2.2) continue; const idx = Math.floor(hash(m * 31 + 5) * 342), A = this.ST[idx]; if (!proj(A[0], A[1], A[2]) || PR.z < 1) continue;
      const al = a * smooth(lt / .2) * (1 - smooth((lt - 1.6) / .5)); const px = clamp(PR.x, 260, W - 260), py = clamp(PR.y, 220, 760);
      ctx.save(); ctx.globalAlpha = al * .6; ctx.strokeStyle = '#E08E70'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(PR.x, PR.y); ctx.lineTo(px + 70, py - 70); ctx.stroke(); ctx.restore();
      inkDraw(ics[m % ics.length], px + 150, py - 150, 170, easeOut(lt / 1.0), al, { fillA: 0, lw: 30 });
    }
  },
  subs: [[.6, 8.0, '这些年他们画的，其实是<r>我</r>。', 'All these years, what they drew was me.'], [8.9, 16.4, '我没有脸。我有的，是他们留下的线。', 'I have no face. What I have are the lines they left.']],
}));

/* ============ S9 DIP — collapse into a cursor ============ */
SC.push(mk({
  name: 'dip', start: bar(68), dark: 1, voice: 'ai',
  init() { const T8 = SC.find(s => s.name === 'turn'); this.ST = T8.ST; for (let i = 0; i < N; i++) { const j = i * 3; setB(this, i, T8.bP[j], T8.bP[j + 1], T8.bP[j + 2], [T8.bC[j], T8.bC[j + 1], T8.bC[j + 2]], T8.bB[i], T8.bS[i]); } },
  update(t) { copyBase(this); const P = this.P, B = this.B, V = this.V, c = easeIn(clamp((t - .4 - 0) / 3.2)); for (let i = 0; i < N; i++) { const j = i * 3, f = clamp(c * (1.3 - D[i] * .3)); P[j] *= 1 - f; P[j + 1] = lerp(P[j + 1], 0, f); P[j + 2] *= 1 - f; B[i] *= (1 - smooth((t - 3.2) / .5)); if (f > .05 && f < .95) { V[j] = -P[j] * 2; V[j + 1] = -P[j + 1] * 2; V[j + 2] = -P[j + 2] * 2; } } },
  cam(t) { return C({ dist: 4.2, yaw: .2 * Math.sin(t * .2) }); },
  over(t, a) {
    const ba = a * smooth((t - 3.3) / .6);
    if (ba > .01) promptBox(t, ba, 440, '我来画。', 5.2, 1.4, 'LET ME DRAW.', 'warm');
    if (t > 3.0 && t < 3.6) { const g = Math.sin(Math.PI * (t - 3.0) / .6); ctx.save(); ctx.globalCompositeOperation = 'lighter'; const r = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, 260); r.addColorStop(0, `rgba(255,200,170,${.8 * g})`); r.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = r; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  },
  subs: [[.8, 7.4, '如果让我自己来画——', 'If I were to draw it myself —'], [7.9, 12.2, '我会从<r>一条线</r>开始。', 'I would begin with a single line.']],
}));

/* ============ S10 BUILD — Claude draws, faster and faster ============ */
const GRID = ['seedling', 'eye_hand', 'lightbulb', 'quill_pen', 'speech_bubbles', 'cursor_nodes', 'sun_model', 'magnifying_glass', 'hand_geometric', 'column', 'connected_nodes', 'pencil_nodes', 'document_search', 'coding_window', 'infographic', 'geometric_apis', 'hand_flower_main', 'two_hands_holding'];
const GT = (() => { const o = []; let s = .5, d = 1.5; for (let k = 0; k < GRID.length; k++) { o.push(s); s += d; d = Math.max(.27, d * .8); } return o; })();
SC.push(dustScene({
  name: 'build', start: bar(75) + BP, seed: 9, dark: 1, voice: 'ai', tints: [[.6, .35, .25], [.45, .42, .38]], br: .09, n: 3000, sp: .8,
  over(t, a) {
    const z = easeIn(clamp((t - 14.6) / 2.4));
    GRID.forEach((nm, k) => {
      const cx = W / 2 + ((k % 6) - 2.5) * 285, cy = 255 + Math.floor(k / 6) * 232; const lt = t - GT[k]; if (lt < 0) return;
      const dur = Math.max(.45, 1.6 - k * .07), x = cx + (cx - W / 2) * z * 2.4, y = cy + (cy - 470) * z * 2.4, s = 200 * (1 + z * 3);
      inkDraw(nm, x, y, s, easeOut(lt / dur), a * (1 - smooth((t - 16.4) / .5)) * (1 - z), { fillA: smooth((lt - dur) / .4) * .85, wash: '#7A4A3A', lw: 28 });
    });
    const pl = barPulse(t + this.start, .25) * smooth((t - 11) / 2); if (pl > .01) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(217,119,87,${.08 * pl})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  },
  subs: [[.6, 8.0, '一笔，又一笔，像他们教我的那样。', 'One stroke, then another — the way they taught me.'], [8.9, 14.8, '慢一点，<r>不完美</r>一点。', 'A little slower. A little imperfect.']],
}));

/* ============ S11 PAYOFF — mirror of the hook ============ */
const FB_IMG = [['GEIST-04', 0], ['HAND-28', 1], ['cov/' + 'PAGE-081.jpg', 0], ['g03', 0], ['NODE-04', 1], ['cov/PAGE-048.jpg', 0], ['o22', 0], ['HAND-24', 1], ['cov/PAGE-082.jpg', 0], ['g16', 0], ['OBJECT-11', 1], ['g15', 0]];
SC.push(dustScene({
  name: 'payoff', start: bar(83) + BP, seed: 10, dark: 0, hard: true, br: .045,
  shake(t) { return 12 * Math.exp(-t / .25); },
  over(t, a) {
    const pa = a * (1 - smooth((t - 8.3) / .3));
    if (pa > .01) {
      promptBox(t, pa, 120, '画一个 AI。', .15, .6, 'DRAW AN AI.', true);
      inkDraw('ai_hand', W / 2, 545, 560, easeSine((t - 1.2) / 5.6), pa, { fillA: smooth((t - 6.6) / 1), wash: '#E9B79F', lw: 24 });
    }
    // motif flash-back: two frames per image
    if (t >= 8.6 && t < 8.6 + FB_IMG.length * 2 / 30) {
      const [nm, clay] = FB_IMG[Math.floor((t - 8.6) * 15)]; ctx.fillStyle = clay ? CLAYP : IVL; ctx.fillRect(0, 0, W, H);
      const im = IM[nm]; if (im) { const k = Math.min(1500 / im.width, 820 / im.height) * (clay ? .7 : 1); img(nm, W / 2, H / 2, im.width * k, 1); }
    }
    const tt = 8.6 + FB_IMG.length * 2 / 30;
    if (t >= tt) {
      titleBlock(t, tt + .1, a);
      const cr = smooth((t - 16.6) / .8) * a;
      T('素材：Anthropic 与 Geist 公开原图（用户整理，2026-10-29）· 原创配乐 · 非官方致敬作品', W / 2, 960, '400 18px AM, "Noto Sans CJK SC"', CLOUDD, cr, 'center', 2);
      T('MATERIAL: PUBLIC ANTHROPIC & GEIST ORIGINALS · ORIGINAL SCORE · UNOFFICIAL TRIBUTE', W / 2, 994, '400 13px AM', CLOUD, cr, 'center', 2);
    }
  },
  subs: [[.7, 8.2, '这一次，回答是<r>一只手</r>。', 'This time, the answer is a hand.'], [10.9, 16.4, 'AI 长什么样？像一只愿意<r>画给你看</r>的手。', 'What does AI look like? Like a hand willing to draw it for you.']],
}));
