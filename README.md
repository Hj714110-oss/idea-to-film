# idea-to-film

<p align="center"><img src="assets/hero.jpg" alt="正在输入… TYPING… — title frame" width="100%"></p>


**One line of idea + one music track → a finished, beat-synced cinematic film (MP4).**
An agent skill for Claude (works with any agent that reads `SKILL.md`) plus a small deterministic canvas engine.

> 一句话想法 + 一首音乐 → 一部卡点、有故事、有氛围的成片。知识视频、品牌片、情绪/故事短片都能做。

---

## What it does

Give it an idea — *"how lighthouses work"*, *"a launch film for our goggles"*, *"a love story between a person and an AI"* — and a track. The skill:

1. **Sets the dials itself** — length, pacing (TikTok-fast ↔ cinematic), palette, typography, lens and grain — and states them in one line instead of asking.
2. **Writes a 12-beat story** with a 0.2 s hook, a recurring motif, two voices, a quiet chapter, a mirror ending and single-frame smash cuts.
3. **Locks every cut to the music** (`scripts/audio.py` fits a beat grid and finds the big entries, the quiet stretch and the dips).
4. **Picks a visual mode** (finished paintings but no clips yet? It moves a camera inside the stills first, and image-to-video is the upgrade)
   - **A — pure code:** particles, morphs, type, UI, all drawn in canvas.
   - **B — footage + code:** your clips under a code overlay.
   - **C — AI plates + image-to-video ("OPUS method"):** it writes the image prompts and motion prompts, you generate them with your models, then it crops, upscales, slows, blends and composites the overlay on top.
5. **Renders deterministically** with Playwright → frames → ffmpeg, then reviews stills and fixes what it sees.

Motion vocabulary comes from a 178-term film-relevant subset of the **motion-lexicon** (MIT), including 46 compound recipes with code — see *Appendix A* in `SKILL.md`.

## Made with it: 《正在输入… TYPING…》

A 3:18 love story between a person and an AI, told through the *typing…* indicator. Every chapter is painted in a different classic style; the code layer adds the chat UI, subtitles, particles and beat sync.
一部 3 分 18 秒的人与 AI 的爱情短片：每一章换一种经典画风，代码层负责聊天界面、字幕、粒子与卡点。

<p align="center"><img src="assets/hook.gif" alt="The opening hook: 2 a.m., typing and deleting, then sending 在吗？" width="600"></p>
<p align="center"><sub>The 0.2 s hook: 2 a.m., typing and deleting, then sending 「在吗？」 (shown at 2× speed)</sub></p>

| | | |
|:-:|:-:|:-:|
| <img src="assets/still_01.jpg" alt="Cold open"> | <img src="assets/still_02.jpg" alt="01 Strangers, ukiyo-e"> | <img src="assets/still_03.jpg" alt="02 Remembered, candlelit letters"> |
| Cold open · photographic | 01 初遇 · ukiyo-e rain | 02 被记住 · Victorian letters |
| <img src="assets/still_04.jpg" alt="03 Long nights, Qixi ink painting"> | <img src="assets/still_05.jpg" alt="04 Need, 1940s diner"> | <img src="assets/still_06.jpg" alt="05 Everyday, gouache kitchen"> |
| 03 长夜 · Qixi ink & silk | 04 离不开 · 1940s diner | 05 日常 · picture-book gouache |
| <img src="assets/still_07.jpg" alt="07 Its memory, particle constellation"> | <img src="assets/still_08.jpg" alt="08 Its mind, 3 a.m."> | <img src="assets/still_09.jpg" alt="Finale, sunrise"> |
| 07 它的记忆 · particle constellation | 08 它的心 · 3 a.m., its point of view | Finale · 「在。」 |

Pipeline for this film (Mode C): gpt-image-2 plates → 16:9 crop + Real-ESRGAN ×4 → MiniMax Hailuo / H3 image-to-video → this engine (slow-down + frame blending, overlay, beat sync) → MP4. Prompts and the full `scenes.js` are in [`examples/typing/`](examples/typing/).

## Made with it: 《总说「你说得对」的女孩》

An ensemble fable: GPT isn't short on smarts, she just treats every question like a project to deliver. 17 × 3 comes back as a 19-page deck, the answer buried on page 4. The open-source crowd at the night market and Claude show her that smart can be light. Image-to-video clips are cut on the bar lines of a re-arranged trap beat. The drums drop out while she writes her reply, and slam back when her wings open.
一部群像寓言：GPT 不是不够聪明，而是把每个问题都当成要交付的项目。夜市里的开源模型们和 Claude 让她明白：聪明，也可以很轻。

<p align="center"><img src="assets/girl/hero.jpg" alt="Title over the Leaderboard spire" width="100%"></p>
<p align="center"><img src="assets/girl/hook.gif" alt="The hook: 17 × 3 = ? answered with a 19-page project deck" width="520"></p>
<p align="center"><sub>The hook: "17 × 3 = ?" is answered with <code>项目交付方案_v1.0.pptx</code>. The slides fly out on the beat and the camera dives back to page 4 (2.2× speed).</sub></p>

| | | |
|:-:|:-:|:-:|
| <img src="assets/girl/01_page4.jpg" alt="Page 4"> | <img src="assets/girl/02_deliver_answer.jpg" alt="交付 struck out, 答案 stamped"> | <img src="assets/girl/03_neon.jpg" alt="Neon floor"> |
| 51, circled on page 4 | 交付 → 答案 | 霓虹层 · "是五十一！" |
| <img src="assets/girl/04_night_market.jpg" alt="Night market"> | <img src="assets/girl/05_letter.jpg" alt="The letter"> | <img src="assets/girl/06_climb.jpg" alt="The climb"> |
| 港口夜市 · the night market | 一封信 · the break, letterboxed | 上楼 · a floor counter on every beat |
| <img src="assets/girl/07_card.jpg" alt="The card"> | <img src="assets/girl/08_wings.jpg" alt="Wings open"> | <img src="assets/girl/09_light.jpg" alt="Smart can be light"> |
| The drums drop out · no disclaimer | The drums slam back | 聪明，也可以很轻 |

Both versions are in [`examples/girl/`](examples/girl/):
- **v1:** a stills-only cut with an original synthesised score.
- **v2:** image-to-video clips on the re-arranged beat.

## Repository layout

```
SKILL.md                 the skill (instructions the agent follows)
scripts/
  engine_core.js         utils, beat grid, palette, chat-UI kit, camera, 30k-particle system, splat buffers
  engine_frame.js        frame compositor: footage layer, bloom, LUT tonemap, leaks, RGB split, grain, flashes, dips, smash frames
  film.html              page that loads engine + your scenes.js
  kit.js                 shot builders (clips with bar-locked cut-ins, camera inside still plates) + overlay kit
  scenes.example.js      minimal scenes file to start from
  render.js / stills.js  Playwright renderers (full film / review stills)
  audio.py               beat grid + structure report + kick envelope, writes audio.js
  arrange.py             re-arrange a beat on bar lines to fit the story
  timeline.py            script.json -> scene bars + subtitle windows sized by reading speed
  upscale.py             Real-ESRGAN x4 for start frames (weights not bundled)
assets/                  README images (frames from the two films)
examples/typing/         full worked example: 《正在输入… TYPING…》 (concept, video prompts, scenes.js)
examples/girl/           《总说「你说得对」的女孩》: stills-only v1 + image-to-video v2 (script, score, prompts, scenes)
```

## Install

**As a Claude skill:**

```bash
git clone https://github.com/Hj714110-oss/idea-to-film ~/.claude/skills/atmosphere-brand-film
```

or zip this folder and upload it as a custom skill in Claude. (Inside `SKILL.md` the skill is named `atmosphere-brand-film`.)

**Dependencies (for rendering):**

```bash
# Node 18+, Python 3.10+, ffmpeg
npm i playwright @fontsource/fraunces @fontsource/jetbrains-mono
npx playwright install chromium
pip install librosa opencv-python pillow numpy
# Mode C only (optional): pip install onnx onnxruntime  + Real-ESRGAN weights
#   download realesr-general-x4v3.pth from the Real-ESRGAN releases into scripts/models/
#   or set ESRGAN_PTH=/path/to/realesr-general-x4v3.pth
```

## Quick start

Just ask your agent:

> Make a film about *why the sea is salty*, using `music.mp3`.

Or drive the engine by hand:

```bash
mkdir film && cp scripts/* film/ && cd film
python3 audio.py ../music.mp3 .          # -> audio.js, bgm.m4a, grid report
cp scenes.example.js scenes.js           # write your scenes on the reported grid
node stills.js stills 0 5 12 30          # review stills (outdir, then seconds)
node render.js                           # -> out.mp4
```

## The worked example

`examples/typing/` contains everything that defined 《正在输入… TYPING…》, a 3:18 human–AI love story told through the *typing…* indicator: the concept, the 17 image-to-video prompts and the full `scenes.js`. Plates, clips and music are **not** included (generate your own, bring your own track).

## Notes

- Bring your own music and make sure you have the rights to it. No audio is shipped.
- No track and you want it finished today? Have the agent compose one in code (see `examples/girl/score_v1.py`). Borrowing a beat instead? It can re-arrange it on bar lines with `scripts/arrange.py`.
- Image-to-video models can flip objects (e.g. a phone held backwards). Write object orientation into the motion prompt and check hand–object shots frame by frame.
- Rendering is deterministic (seeded RNG); the same scenes + audio give the same film.

## Credits

- Motion vocabulary: [motion-lexicon](https://github.com/pursuerlin/motion-lexicon) by linhuangjie — MIT.
- Upscaling: [Real-ESRGAN](https://github.com/xinntao/Real-ESRGAN) — BSD-3-Clause (weights downloaded separately).
- Fonts: Fraunces and JetBrains Mono via Fontsource — SIL OFL 1.1.

See `THIRD_PARTY_NOTICES.md`.

## License

MIT — see `LICENSE`.
