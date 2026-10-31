# 《手绘的心智 · A Mind, Drawn by Hand》

A 3:18 knowledge film about how Anthropic's and Claude's design language took shape. It is an unofficial tribute, made from an archive of public brand material the user collected.

**Thesis.** Everyone draws AI as a blue future: glowing, cold, behind glass. Anthropic drew a hand on paper instead. The one motif is a single hand-drawn line, and it is in every scene.

**Mode.** B (the user's material) plus A (particles and code), on a **light paper engine** with one dark section for the point-of-view switch.

## Story on the 112 BPM track (example track A)

| Bars | Scene | What happens |
|---|---|---|
| 0–8 | Hook (dark) | 「画一个 AI。」 is typed, and a glowing cyan particle head builds itself behind a HUD. At bar 7.5 an ivory hand-drawn stroke slashes through it. |
| 8–12 | Title (ivory, hard cut under a flash) | Match cut: the slash flies into the title as the "\" in **A MIND \ DRAWN BY HAND**. |
| 12–20 | 01 纸 PAPER | The six palette cards drop in. Blue survives only as the *Focus* colour, circled in ink. Then a Hello / World type sample and photo-style shots of the stationery. |
| 20–28 | 02 手 HAND | Clay wipes up from the bottom. Twelve hand illustrations pop in on the beat, then gather into one large hand: the white paper is the idea, the black line is us. |
| 28–36 | 03 节点 NODE | A 2024 → 2025 timeline. Each vector icon draws itself with a glowing pen tip, linked by one running line. |
| 36–44 | 04 Why hands (quiet) | Two hands drawn slowly, a line at a time. |
| 44–52 | 05 拼贴 COLLAGE | A depth tunnel through 48 research covers in date order, with a year counter. |
| 52–60 | 06 系统 SYSTEM | Two icon rows scroll opposite ways while a counter climbs to 342, then the Claude Design screenshot is circled in ink. |
| 60–68 | 07 我 (dark, Claude's voice) | A one-word smash frame, then the 342 files as a constellation, with nodes that remember drawings. |
| 68–75 | Dip | The constellation collapses into a cursor that types 「我来画。」 Then the music's silence. |
| 75–83 | Build | Claude draws 18 icons, faster and faster, then pushes through them. |
| 83 + 1 beat → end | Payoff (ivory) | The hook's prompt again, answered this time by a drawn hand. A one-frame flashback of the chapters, the title, then credits. |

## Files

- `scenes.js`: the whole film.
- `engine_core.js` and `engine_frame.js`: the **ivory/ink edition** of the engine.
  - **Paper and slate backgrounds:** a per-scene `dark: 0 | 1 | fn(t)`. Light and dark switch on a `hard: true` cut, under a flash or a smash frame.
  - **Ink particles:** splat absorbance `1 - colour`, tone-map with `255·exp(-v)`, then composite with `multiply`. In dark scenes the particles are additive with bloom.
  - **`inkDraw(name, x, y, size, p)`:** draws a filled-outline SVG (stored in `learn.js`) stroke by stroke. A thick dashed stroke along each outline masks a single combined `Path2D` fill, with a glowing nib at the pen point and the pale fills washing in at the end.
  - **`handLine(points, p, width, colour)`:** a wobbly hand-drawn line with a nib.
  - **`img(name, x, y, w, a, {wipe, rot, shadow, frame})`:** keyed cut-outs and photos.
- `prep_material.py`: turns an asset archive into `img/`, `learn.js` and `assets.js`. It keys out the clay backgrounds, sorts the covers by date, and pulls the path data out of the vector drawings.
- `score.py`: the stand-in score composed in numpy on the same grid before the real track arrived.
- `film.html`: loads the brand fonts from `fonts/` (`AS`, `ASe`, `AM`) and falls back to Noto CJK. Point it at your own fonts.

**Not included:** the archive images, the brand fonts and the music. The artwork's rights are reserved by its owners. Bring your own material.

## Run

```bash
mkdir film && cp examples/drawn-by-hand/* film/ && cp scripts/render.js scripts/stills.js film/ && cd film
npm i playwright @fontsource/jetbrains-mono
python3 prep_material.py /path/to/archive .      # -> img/, learn.js, assets.js
python3 ../scripts/audio.py /path/to/track.mp3 .  # -> audio.js, bgm_fade.m4a
node stills.js st 20 50 90 135 183               # review
node render.js 0 2973 p1.mp4 & node render.js 2973 5945 p2.mp4 &
```

**Timing note.** The real track's beat is 0.53152 s (bar 2.1261 s). Its nominal 112.35 BPM gives 0.53405 s, which drifts about 0.85 s by bar 83. Always build on `audio.py`'s measured grid. The track's last climax lands one beat after bar 83 (177.08 s), so the payoff starts at `bar(83) + BP`.
