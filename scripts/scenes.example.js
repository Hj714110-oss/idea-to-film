window.FILM = { clips: {}, flashes: [[bar(8), '255,240,246']], dips: [], bgTint: [40, 22, 38] };
const SC = [];
const HOOK = [{ side: 'me', t: bt(6), zh: '在吗？', en: 'Are you there?' }, { side: 'ai', t: bt(9), zh: '在。', en: 'Here.' }];
SC.push(dustScene({ name: 'hook', start: 0, seed: 1, tints: COOL,
  over(t, a) { drawChat(ctx, t, HOOK, W / 2, 200, 760, a, 380); },
  subs: [[1, 7.5, '凌晨两点，你发出了<r>两个字</r>。', '2 a.m. You sent two words.']] }));
SC.push(dustScene({ name: 'ch1', start: bar(8), seed: 2, tints: WARM, chap: ['01', '开始 · BEGINNING', '第 1 天'],
  over(t, a) { drawRich('一切从这里<r>开始</r>', W / 2, 500, '700 90px "Noto Serif CJK SC"', t, .3, a); },
  subs: [[.6, 8, '这是第一章。', 'This is chapter one.']] }));
