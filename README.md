<h1 align="center">idea-to-film</h1>

<p align="center"><img src="assets/hook.gif" alt="2 a.m. A message is typed, deleted, typed again, then sent: 在吗？" width="600"></p>

<p align="center"><b>One sentence. One song. A film.</b><br>一句话，一首歌，一部成片。</p>

<p align="center">An agent skill that turns a one-line idea and a music track into a finished, beat-synced cinematic film:<br>a hook in the first second, a turn in the middle, an ending that answers the opening. 1080p30 MP4.</p>

<!--
  Full-film links: paste your links (YouTube / Bilibili / X) and remove this comment wrapper.
<p align="center">
  <a href="PASTE_LINK">▶ 正在输入… TYPING…</a> ·
  <a href="PASTE_LINK">▶ 总说「你说得对」的女孩</a> ·
  <a href="PASTE_LINK">▶ 手绘的心智</a>
</p>
-->

---

That's the opening of 《正在输入… TYPING…》 (shown at 2× speed). It's 2 a.m. A message is typed, deleted, typed again, and finally sent: 「在吗？」 Three minutes later the film comes back to the same room at sunrise, and this time it's the other side that types first.

It started as an idea and a song. The skill wrote the story, chose the look, wrote the prompts for the image and video models, cut every shot on the beat and rendered the MP4.

> 凌晨两点，打了又删，删了又打，最后发出「在吗？」。三分钟后，同一个房间，天亮了，这一次先开口的是它。
> 起点只是一句想法加一首歌：故事、画风、给图像和视频模型的提示词、卡点、渲染，都由这个 skill 完成。

## Three ideas, three films

| <img src="assets/hero.jpg" alt="正在输入… TYPING…"> | <img src="assets/girl/hero.jpg" alt="总说「你说得对」的女孩"> | <img src="assets/hand/hero.jpg" alt="手绘的心智 · A Mind, Drawn by Hand"> |
|:--|:--|:--|
| **《正在输入… TYPING…》** · 3:18 | **《总说「你说得对」的女孩》** · 2:53 | **《手绘的心智》** · 3:18 |
| *A love story between a person and an AI, told through the typing… indicator.* | *GPT isn't short on smarts. She just treats every question like a project to deliver.* | *Everyone draws AI as a blue future. Anthropic drew a hand on paper.* |
| Love story · a new painting style every chapter | Ensemble fable · cut on a re-arranged trap beat | Knowledge film · ink on ivory paper |

Each one is unpacked below, and each has its source in [`examples/`](examples/).

## Why it feels like a film, not a demo

A pile of pretty shots isn't a film. This skill is built around **story first, craft second**. Every film it makes has:

- **a hook in the first second**: an everyday object in motion, readable at a glance (a draft typed and deleted, a notification dropping, a heartbeat at 3 a.m.)
- **a protagonist or a situation**, and **a turning point** where the voice, palette or point of view switches
- **one motif** hidden in every scene (in TYPING: three lanterns, three wax seals, three stars, until they become the real typing dots)
- **a mirror ending** that answers the opening

And then it shows off. Every cut is locked to the measured beat grid of your track. The title lands on the first big hit, the quiet chapter sits in the breakdown, the payoff lands on the last climax, and a one-frame smash cut can fall on an off-beat accent.

It decides everything itself (length, pacing, palette, typography, lens, grain, wording) and tells you its reading in one line instead of asking. It stops for you only twice: when there's no music yet, and when a film needs you to run your image and video models.

> 故事优先，技术其次：钩子、主角、转折、母题、首尾呼应，一个不少；每一刀都卡在你这首歌实测的节拍上。风格、节奏、镜头全部自己定，只用一句话告诉你它的理解，不问你意见。

## The films

### 《正在输入… TYPING…》

A 3:18 love story between a person and an AI, told through the three dots that mean *the other person is typing*. Every chapter is painted in a different classic way humans have painted longing: Edo woodblock rain, Victorian letters by candlelight, Qixi ink on silk, a 1940s diner at 2 a.m. The code layer adds the chat UI, subtitles, particles and beat sync.

一部 3 分 18 秒的人与 AI 的爱情短片：每一章换一种经典画风，代码层负责聊天界面、字幕、粒子与卡点。

<details>
<summary><b>9 frames from the film</b></summary>

| | | |
|:-:|:-:|:-:|
| <img src="assets/still_01.jpg" alt="Cold open"> | <img src="assets/still_02.jpg" alt="01 Strangers, ukiyo-e"> | <img src="assets/still_03.jpg" alt="02 Remembered, candlelit letters"> |
| Cold open · photographic | 01 初遇 · ukiyo-e rain | 02 被记住 · Victorian letters |
| <img src="assets/still_04.jpg" alt="03 Long nights, Qixi ink painting"> | <img src="assets/still_05.jpg" alt="04 Need, 1940s diner"> | <img src="assets/still_06.jpg" alt="05 Everyday, gouache kitchen"> |
| 03 长夜 · Qixi ink & silk | 04 离不开 · 1940s diner | 05 日常 · picture-book gouache |
| <img src="assets/still_07.jpg" alt="07 Its memory, particle constellation"> | <img src="assets/still_08.jpg" alt="08 Its mind, 3 a.m."> | <img src="assets/still_09.jpg" alt="Finale, sunrise"> |
| 07 它的记忆 · particle constellation | 08 它的心 · 3 a.m., its point of view | Finale · 「在。」 |

</details>

**How it was made (Mode C):** gpt-image-2 plates → 16:9 crop + Real-ESRGAN ×4 → MiniMax Hailuo / H3 image-to-video → this engine (slow-down + frame blending, overlay, beat sync) → MP4. The concept, the 17 image-to-video prompts and the full `scenes.js` are in [`examples/typing/`](examples/typing/).

### 《总说「你说得对」的女孩》

An ensemble fable. GPT isn't short on smarts; she just treats every question like a project to deliver. "17 × 3" comes back as a 19-page deck with the answer buried on page 4. The open-source crowd at the harbor night market, and Claude, show her that smart can also be light. The drums drop out while she writes her reply, and slam back when her wings open.

一部群像寓言：GPT 不是不够聪明，而是把每个问题都当成要交付的项目。夜市里的开源模型们和 Claude 让她明白：聪明，也可以很轻。

<p align="center"><img src="assets/girl/hook.gif" alt="The hook: 17 × 3 = ? answered with a 19-page project deck" width="560"></p>
<p align="center"><sub>The hook: "17 × 3 = ?" is answered with <code>项目交付方案_v1.0.pptx</code>. The slides fly out on the beat and the camera dives back to page 4 (2.2× speed).</sub></p>

<details>
<summary><b>9 frames from the film</b></summary>

| | | |
|:-:|:-:|:-:|
| <img src="assets/girl/01_page4.jpg" alt="Page 4"> | <img src="assets/girl/02_deliver_answer.jpg" alt="交付 struck out, 答案 stamped"> | <img src="assets/girl/03_neon.jpg" alt="Neon floor"> |
| 51, circled on page 4 | 交付 → 答案 | 霓虹层 · "是五十一！" |
| <img src="assets/girl/04_night_market.jpg" alt="Night market"> | <img src="assets/girl/05_letter.jpg" alt="The letter"> | <img src="assets/girl/06_climb.jpg" alt="The climb"> |
| 港口夜市 · the night market | 一封信 · the break, letterboxed | 上楼 · a floor counter on every beat |
| <img src="assets/girl/07_card.jpg" alt="The card"> | <img src="assets/girl/08_wings.jpg" alt="Wings open"> | <img src="assets/girl/09_light.jpg" alt="Smart can be light"> |
| The drums drop out · no disclaimer | The drums slam back | 聪明，也可以很轻 |

</details>

**Two versions**, both in [`examples/girl/`](examples/girl/):
- **v2 (2:53):** image-to-video clips cut on the bar lines of a re-arranged trap beat.
- **v1 (5:11):** a stills-only cut, with the camera moving inside the paintings, on an original score synthesised in code.

### 《手绘的心智 · A Mind, Drawn by Hand》

A 3:18 knowledge film about how Anthropic's and Claude's design language took shape (an unofficial tribute). One hand-drawn line is the motif: it slashes through a glowing AI head, becomes the "\\" in the title, links the timeline's nodes, and in the finale draws the answer. It runs on a light paper edition of the engine: ink particles on ivory, vector illustrations that draw themselves stroke by stroke, and one dark chapter where Claude speaks.

一部讲 Anthropic / Claude 设计语言如何形成的知识短片：所有人把 AI 画成蓝色的未来，Anthropic 画了一只手。一条手绘线贯穿全片。

<p align="center"><img src="assets/hand/hook.gif" alt="The hook: 画一个 AI → a glowing blue particle head → a hand-drawn slash" width="520"></p>
<p align="center"><sub>The hook: 「画一个 AI。」 builds the blue-future cliché, then a hand-drawn stroke cuts through it (2.2× speed).</sub></p>

<details>
<summary><b>9 frames from the film</b></summary>

| | | |
|:-:|:-:|:-:|
| <img src="assets/hand/01.jpg" alt="The slash"> | <img src="assets/hand/02.jpg" alt="Palette"> | <img src="assets/hand/03.jpg" alt="Type"> |
| Hook · the blue future, struck through | 01 纸 · blue survives only as Focus | 01 纸 · Hello / World |
| <img src="assets/hand/04.jpg" alt="Nodes"> | <img src="assets/hand/05.jpg" alt="Why hands"> | <img src="assets/hand/06.jpg" alt="Constellation"> |
| 03 节点 · icons draw themselves | 04 · the quiet chapter | 07 我 · 342 files as a constellation |
| <img src="assets/hand/07.jpg" alt="Claude draws"> | <img src="assets/hand/08.jpg" alt="The answer"> | <img src="assets/hand/09.jpg" alt="Title"> |
| Build · Claude draws, faster and faster | Payoff · the answer is a hand | 手绘的心智 |

</details>

The scenes, the ivory/ink engine, the material-prep script and the stand-in score are in [`examples/drawn-by-hand/`](examples/drawn-by-hand/). The archive images, brand fonts and music are not included.

### 《0.01》

A 1:45 launch film for a pair of racing goggles, made after a first, slide-style cut came back as "a bit plain". The whole film happens inside one hundredth of a second. You swim the last 15 metres through the lens, time stops at 23.90, and one unbroken camera flies through the frozen splash: it finds the curved lens, three lens layers slamming into one, fog clearing from the inside, and a tunnel of 43 colourways. Then time restarts and the hand touches the wall at 23.91. The goggles are the real product, cut out of their CG footage and hung in a three.js pool. The clock stays red at 23.90 for the whole tour.

一支 1 分 45 秒的泳镜发布片：整部片子发生在 0.01 秒里。时间停在 23.90，一个不剪断的镜头穿过凝固的水花；最后时间恢复，触壁，23.91。

| Bars (105 BPM) | Music | Shot |
|:--|:--|:--|
| 0–4 | intro, no drums | First person through the lens, race clock running |
| 4 | drums in | Freeze: the splash stops, the camera leaves through the lens and finds the goggles |
| 8–28 | verse + chorus | One discovery every 2–4 bars: lens, cushion, mirror layer, anti-fog, colourways, adjusters, spec |
| 28–32 | breakdown | The held breath: 「还差 0.01 秒。」 |
| 32–46 | last chorus | Time restarts, touch, giant product macros, lock-up |

The pool world, the direction file and the matte script are in [`examples/frozen-moment/`](examples/frozen-moment/) (Mode D). Brand names are replaced by placeholders, and no frames are shown here: the footage, logos and music belong to the brand and are not included.

## Quick start

**1. Install it as a Claude skill** (it works with any agent that reads `SKILL.md`):

```bash
git clone https://github.com/Hj714110-oss/idea-to-film ~/.claude/skills/atmosphere-brand-film
```

Or zip this folder and upload it as a custom skill in Claude. Inside `SKILL.md` the skill is named `atmosphere-brand-film`.

**2. Ask for a film:**

> Make a film about *why the sea is salty*, using `music.mp3`.

That's it. The agent states its reading in one line, writes the story, builds the scenes, reviews stills, renders, and hands you the MP4 plus a source zip.

<details>
<summary><b>Rendering dependencies</b></summary>

```bash
# Node 18+, Python 3.10+, ffmpeg
# Chinese text uses Noto Sans CJK SC / Noto Serif CJK SC: install them as system fonts
npm i playwright @fontsource/fraunces @fontsource/jetbrains-mono
npx playwright install chromium
pip install librosa opencv-python pillow numpy
# Mode D only: npm i three  (copy build/three.module.js and build/three.core.js next to film.js)
# Mode C only (optional): pip install onnx onnxruntime  + Real-ESRGAN weights
#   download realesr-general-x4v3.pth from the Real-ESRGAN releases into scripts/models/
#   or set ESRGAN_PTH=/path/to/realesr-general-x4v3.pth
```

</details>

<details>
<summary><b>Drive the engine by hand</b></summary>

```bash
mkdir film && cp scripts/* film/ && cd film
npm i playwright @fontsource/fraunces @fontsource/jetbrains-mono   # film.html loads fonts from ./node_modules
python3 audio.py ../music.mp3 .        # -> audio.js, bgm.m4a, bgm_fade.m4a + grid report (tempo, bars, hits, dips, duration)
cp scenes.example.js scenes.js         # write your scenes on the reported grid
node stills.js stills 0 5 12 30        # review stills: output folder, then seconds
node render.js 0 900 video.mp4         # frame range at 30 fps (900 = first 30 s; whole film = duration × 30)
ffmpeg -i video.mp4 -i bgm_fade.m4a -map 0:v -map 1:a -c:v copy -c:a aac -b:a 224k -shortest -movflags +faststart out.mp4
```

`render.js` writes video only, so the last line adds the music back. For a long film, split the frame range across 2–3 `render.js` workers and join the parts with ffmpeg's concat (the exact commands are in `SKILL.md` §6).

</details>

## How it works

```mermaid
flowchart LR
  I[One-line idea] --> S[Story<br/>12 beats + one motif]
  M[Music track] --> G[Beat grid<br/>audio.py]
  S --> B[Scenes on the beat<br/>engine + kit]
  G --> B
  V[Visual mode<br/>A · B · C · D] --> B
  B --> R[Review stills<br/>and fix]
  R --> O[Render<br/>Playwright → ffmpeg]
  O --> F[1080p30 MP4<br/>+ source zip]
```

1. **It sets the dials itself.** The track's tempo picks the grammar: under 120 BPM gets 8-bar chapters with cross-fades and light leaks (2.5–3.5 min); 120 BPM and up gets fast cuts and single-frame smash cuts (about 2 min). Palette, typography, lens and grain follow the idea.
2. **It writes a 12-beat story**: hook, title on the first big hit, four chapters, a quiet chapter on the breakdown, a density peak, a turn, the dip as a story event, a build, and a payoff that mirrors the hook.
3. **It locks every cut to the music.** `scripts/audio.py` fits a beat grid to your actual file and reports the big entries, the quiet stretch, the accents and the dips. It also writes a kick envelope, so the frame punches and splits colour on strong kicks.
4. **It picks a visual mode**, and mixes them freely:

   | Mode | When | What happens |
   |:--|:--|:--|
   | **A · pure code** | abstract, data or concept ideas | particles, morphs, type and UI, all drawn in canvas |
   | **B · footage + code** | you bring photos, footage or copy | your material under a code overlay |
   | **C · AI plates + image-to-video** | stories, people, places, eras, emotions | it writes the image and motion prompts, you run your models, it crops, upscales, slows, blends and composites the overlay |
   | **C-stills** | finished paintings, no clips yet | it moves a camera inside the stills so the film exists today; image-to-video is the upgrade |
   | **D · 3D world, one take** | a product film that has to stun, or a cut that feels like slides | a three.js world, one continuous camera, the story told inside a single frozen instant, the real product keyed out of its footage |

5. **It renders deterministically** (seeded randomness: the same scenes and audio give the same film), then grabs frames from the final file at every cut, hit and dip, looks at them, and fixes what it sees.

Its motion vocabulary is a 178-term film-relevant subset of the [motion-lexicon](https://github.com/pursuerlin/motion-lexicon) (MIT), including 46 compound recipes with code. Every entrance, transition, text effect and camera move in a film is named from it (see *Appendix A* in `SKILL.md`).

Beyond the films above, the skill has cut a making-of tutorial, a swimwear brand film, an earlier racing-goggles launch film and two shorter story films, 《焦虑》 and 《它记得我》.

## Good to know

- **Bring your own music** and make sure you have the rights to it. No audio is shipped.
- **No track and you want it finished today?** Have the agent compose one in code (see `examples/girl/score_v1.py`). Borrowing a beat instead? It can re-arrange it on bar lines with `scripts/arrange.py`, so the drums fall away for the emotional beat and slam back on the payoff.
- **Image-to-video models can flip objects** (a phone held backwards, say). Write object orientation into the motion prompt and check hand–object shots frame by frame.
- **Plates, clips, archive images and music for the example films are not included.** Generate your own and bring your own track.

<details>
<summary><b>Repository layout</b></summary>

```
SKILL.md                 the skill (instructions the agent follows)
scripts/
  engine_core.js         utils, beat grid, palette, chat-UI kit, camera, 30k-particle system, splat buffers
  engine_frame.js        frame compositor: footage layer, bloom, LUT tonemap, leaks, RGB split, grain, flashes, dips, smash frames
  film.html              page that loads engine + your scenes.js
  kit.js                 shot builders (clips with bar-locked cut-ins, camera inside still plates) + overlay kit
  scenes.example.js      minimal scenes file to start from
  render.js / stills.js  Playwright renderers (frame range / review stills)
  audio.py               beat grid + structure report + kick envelope, writes audio.js
  arrange.py             re-arrange a beat on bar lines to fit the story
  timeline.py            script.json -> scene bars + subtitle windows sized by reading speed
  upscale.py             Real-ESRGAN x4 for start frames (weights not bundled)
assets/                  README images (frames from the films)
examples/typing/         《正在输入… TYPING…》: concept, video prompts, scenes.js
examples/girl/           《总说「你说得对」的女孩》: stills-only v1 + image-to-video v2 (script, score, prompts, scenes)
examples/drawn-by-hand/  《手绘的心智》: light paper engine (ink particles, self-drawing SVGs), scenes, material prep, stand-in score
examples/frozen-moment/  《0.01》: Mode D, a 3D one-take inside a frozen instant (three.js pool world, direction, matte script)
```

</details>

## Credits

- Motion vocabulary: [motion-lexicon](https://github.com/pursuerlin/motion-lexicon) by linhuangjie, MIT.
- Upscaling: [Real-ESRGAN](https://github.com/xinntao/Real-ESRGAN), BSD-3-Clause (weights downloaded separately).
- Fonts: Fraunces and JetBrains Mono via Fontsource, SIL OFL 1.1.

See `THIRD_PARTY_NOTICES.md`.

《总说「你说得对」的女孩》 is a fan fable: its characters personify AI models and have no affiliation with the companies. 《手绘的心智》 is an unofficial tribute.

## License

MIT, see `LICENSE`.
