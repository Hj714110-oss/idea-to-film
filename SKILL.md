---
name: "atmosphere-brand-film"
description: "Turn any one-line idea (knowledge, product, emotion, story) plus a music track into a finished beat-synced cinematic film MP4: decides pacing, visual mode and story itself, with a bundled engine."
---

# Idea → Film (氛围感知识视频 · 品牌片 · 故事片)

The user states an idea, in any words; you make the film. Three common styles of these films are not separate modes the user picks:
- slow "atmosphere" knowledge films
- fast-cut short-video edits
- AI-plate films (a different AI-generated art style per chapter, animated with image-to-video)

They are dials you set yourself (§1).

Proven on:
- a making-of tutorial (particles)
- a swimwear brand film (product photos)
- a racing-goggles launch film (CG footage + hands-on clips)
- 《焦虑》 (story-driven knowledge film)
- 《它记得我》 (fast-cut, chat UI)
- 《正在输入… TYPING…》 (AI plates → image-to-video → code layer; scenes in `examples/typing/`)
- 《总说「你说得对」的女孩》 (an ensemble fable; v1 stills-only on an original synthesised score, v2 image-to-video cut to a re-arranged borrowed beat; `examples/girl/`)

**Contract.** Input: an idea, plus optionally music, material (photos/footage/copy), a reference video. Output: a 1080p30 MP4 and a source zip.

Decide everything — style, colour, lens, effects, story, wording — and state your reading in one line. Never ask for opinions. The only pauses allowed:
1. **No music file** → ask for one (or extract it from a reference video they send).
2. **Visual mode C** → the user runs two generation passes (images, then videos) from prompts you hand them.

**Story first, craft second.** The film must not feel "engineering". Every film needs:
- a hook in the first second
- a protagonist or situation
- a turning point
- a mirror ending
- one motif

Never preach; take the subject seriously on its own terms (a romance with an AI is treated as a real romance). Facts are seasoning: light, sourced, credits in the silent tail.

**Get the point right before the craft.** Say the film's thesis back to yourself in one sentence and check it against what the user said. In 《女孩》 the first cut read as "the top model isn't capable enough"; the user's real point was "she is strong, but treats every question as a project to deliver — the fun open-source crowd and Claude show her smart can be light". The fix was in the script (the project-deck hook, one line that states it, a tagline at the end), not in the effects.

**Speak the audience's idiom.** For a Chinese audience write the Chinese first, in living local language (大厂黑话 like 抓手/闭环/颗粒度/赋能, 夜市, 宵夜, 性价比之王, 嘴替), then the English under it — never translate English jokes word for word.

## 0. Task list (always create it)
1. Research the idea (if it touches facts) and read any material.
2. Run `audio.py` on the music.
3. Decide the dials (§1) and write the 12-beat story (§2). Name every move from the motion lexicon (Appendix A): each scene's entrance, transition, text effect and camera move gets its lexicon term.
   - Mode C: publish a concept doc with the plate prompts, review the user's images, hand back upscaled start frames + `VIDEO_PROMPTS.md`, then review their clips.
4. Build scenes on the bundled engine (§5, files in `scripts/`).
5. Review stills of every scene and boundary; fix.
6. Render on 2–3 workers, mux, QA frames from the final file, deliver MP4 + source zip.

## 1. The dials (set them silently, then say them in one line)
| Dial | Rule |
|---|---|
| **Pacing** | From the track tempo. **< 120 BPM → chapter grammar**: 8-bar chapters (~17 s), 1.1 s cross-fades + light leaks, 2.5–3.5 min. **≥ 120 BPM → fast grammar**: mixed 4/8-bar scenes, single-frame smash cuts, ~1:50–2:00. Both: hook within 0.2 s, a micro-event every 1–2 beats, big hits = flash + burst + shake. |
| **Visual mode** | **C-stills** when the user hands you finished paintings but no clips yet: upscale the plates to 3072×2048 and move a code camera inside them (`plate()` in `kit.js`), so the film exists today; offer the image-to-video pass as the upgrade (it looks markedly better). **B** when the user gave material (product photos, footage, copy): cutouts, clips, particles. **C** (default for stories, people, places, eras, emotions, when the user has an image model and an image-to-video model, e.g. gpt-image-2 + MiniMax Hailuo / Kling / Veo / Seedance): one AI-generated art style per chapter, animated by image-to-video, code layer on top. **A** for abstract, data or concept ideas, or when they want it with no generation: pure particles and code. Mix freely (e.g. a C film with an A particle chapter for the inner-world beat). |
| **Art styles (C)** | A different painting tradition per chapter that carries its meaning (eras: cave pigment, Persian miniature, ink wash, Bauhaus poster, ukiyo-e; feelings: woodblock rain, Victorian candlelight, Qixi ink, 1940s American realism, picture-book gouache, surreal library). Open and close on the same photographic shot. |
| **Look** | See the style table below. |
| **Voices** | One narrator (warm serif subs). Add a second voice when the point of view switches (light sans + cyan glow, mono EN, cyan chapter number and light leaks). |
| **Language** | Chinese subtitles + English line under each, unless told otherwise. |
| **Ensemble** | More than two characters → a coloured speaker tag above each subtitle (`window.TL.speakers`, `[t0, t1, zh, en, 'KEY']`) and a camera that cuts to whoever speaks (`spkKeys`). |

Style systems that worked:
| Look | Background | Particles | Text |
|---|---|---|---|
| Atmosphere / knowledge | near-black + vignette | additive light + bloom | Noto Serif CJK SC 34px, italic EN, keyword colours with glow |
| Warm-white product | gradient #F8F4EC→#E2ECEF + caustics | ink mode (LUT `255*exp(-v)`, `multiply`, darkened colours) | Noto Serif CJK Light, Jost EN caps, navy text |
| Racing | #040506 + grey radial | additive white/ice/red + trails | Noto Sans CJK Bold, Barlow Condensed italic, red keywords |
| Intimate / human-AI | #07060a + rose radial (cools at the turn) | rose / peach / AI cyan / lilac | dark glass chat UI, rose user bubbles, Fraunces + JetBrains Mono |
| AI plates (mode C) | the clips, cross-faded | sparse tinted dust only (additive particles vanish on bright plates; draw key marks as solid shapes) | white text with strong dark shadow; paper slips, ink reveals, toasts as diegetic overlays |

## 2. The 12-beat story (fits any idea)
Mapped to Example track A (112 BPM, bar 2.126 s). For other tracks, map beats to its phrases and loudness report.

| # | Bars (track A) | Beat | What goes there |
|---|---|---|---|
| 0 | 0–8 | **Hook** | An everyday artifact in motion, legible in 0.2 s: a draft typed and deleted, a notification dropping, a heartbeat at 3 a.m. Ends on the motif. |
| 1 | 8–12 | **Title** on the first big hit | The motif becomes the title (three typing dots → “…”); scramble decode; flash, burst, RGB split. |
| 2–5 | 12–44 | **Four chapters** | One idea / gift / fact / era each, each in its own visual world, each with a diegetic overlay (§5 kit) and two subtitle lines. Chapter label: number + name + a small day/year/place line. |
| 6 | 36–44 | **Quiet chapter** on the breakdown | The honest admission, the lonely image, slower overlays. |
| 7 | 44–60 | **Density peak** | The busiest chapters (toasts, counters, seasons montage). |
| 8 | 60–68 | **Turn / POV switch** | New voice, palette shift, glitch; the inner world (often particles: constellation, z-space words, memory library). |
| 9 | 68–75 | **The dip** as a story event | A screen timing out, a breath held. |
| 10 | 75–83 | **Waiting / build** | A time-lapse, a pulsing motif. |
| 11 | 83–end | **Payoff** on the second climax | Mirror of the hook (the other character now does what the protagonist did); one-frame-each motif flash-back through every scene; title returns; credits and a quiet last line in the silent tail. |

Rules:
- **Motif**: one small shape in every scene, with its count named in prompts (three lanterns, seals, stars, neon dots, magnets, ornaments → the typing indicator).
- Turning lines may get a 1–2-frame black/white smash frame with one word (`FILM.smash`).
- Use everyday artifacts over abstract shapes: chat bubbles, lock screens, tool-call logs, toasts, ledgers, paper slips, terminals.
- A physical metaphor beats a chart (seesaw, piles).
- Signature 3D moves:
  - **2D → 3D reveal**: flat UI sampled into particles, older layers stacked in z, camera yaws to reveal, dollies through on a hit.
  - **z-space word field** with depth of field (`zText`).
  - **Turning point**: speed change, warm → cold, positions quantised to a grid, a black band behind a two-line question.
- **Dialogue budget**: reading time ≈ 0.8 s + 0.11 s per Chinese character (`scripts/timeline.py` sizes scenes from a `script.json`). A full short story runs 5+ minutes this way; on a 2:30–3:00 track keep only the lines that carry the turn and let diegetic overlays (toasts, stamps, counters, cards) tell the jokes.
- Subtitles: one sentence per window: 8-bar scene `[0.6, 8.0]` / `[8.9, 16.4]`, 4-bar `[0.4, 7.0]`. Keyword tags: `<r>` rose, `<a>` cyan, `<p>` peach, `<g>` gold.

## 3. Music
- Run `python3 scripts/audio.py track out_dir`. It writes `audio.js`, `bgm.m4a`, `bgm_fade.m4a`, and prints:
  - tempo, BP, B0, bar and phrase length
  - loudness per bar (0–9 string)
  - big entries (bar indices)
  - accents (time, bar)
  - dips
- Place the title on the first big entry, the payoff on the last one, the quiet chapter on the low run of digits, the dip event on a dip, smash frames on off-grid accents.
- Speech check for borrowed tracks: a `showspectrumpic` of 20 s. Formant stacks mean a voice-over; don't reuse.
- Reference timings from two tracks we cut to (the music itself is not included):
  - **Example track A**: 112.35 BPM, B0 0.076, bar 2.126 s; big entry bar 8 (17.1 s); quiet 77–94 s; dip 158–160 s; second climax bar 83 (177.4 s); 198.18 s.
  - **Example track B**: 129 BPM, bar 1.875 s; hits bar 8 / 40; accents 29.68 / 44.68 / 58.51 s; music ends ~113 s.
- Mention licensing once when music comes from someone else's video. "[Free] … type beat" uploads usually allow non-commercial use with a producer credit: put the beat's full name in the credits.
- **Getting the track**: you cannot download from music sites. iPhone users can't find app downloads in Files: ask for a screen recording (Control Center → long-press record, microphone off) and take the audio with `ffmpeg -i rec.mov -vn -ac 2 -ar 44100 src.wav`.
- **Re-arranging a borrowed beat** to fit the story (`scripts/arrange.py`): map its sections first with band energy per bar (kick 35–130 Hz, hats > 5 kHz, mids) — a run of 1s in the kick row is a drumless intro/break. Then repeat or drop whole 8-bar phrases on bar lines (12 ms crossfades), e.g. repeat the last 8 bars of the break before the final drop so the drums fall away for the emotional beat and slam back on the payoff. Re-run `audio.py … --grid B0 BP` with the source grid.
- **Half-time trap/hip-hop**: librosa reports ~160 BPM for an 80 BPM groove; use its 4-beat bar (1.49 s) as the cut unit — it feels right.
- **Kick-reactive frames**: `audio.py` writes a 30 fps `kick` envelope; the compositor punches the frame (+1.6 %) and splits colour on strong kicks automatically.
- **No track at all and the user wants it finished now**: compose one in numpy (bells, plucks, pads, strings, flute, drums, a convolution reverb; one section per scene; the motif as two notes). `examples/girl/score_v1.py` is a complete 92 BPM score written from a timeline.

## 4. Production by mode
**A — particles.** Everything in code: particle shapes per chapter, the morph between scenes, overlays.

**B — material.**
- Zip names may be `#Uxxxx`-encoded: decode with `re.sub(r'#U([0-9a-fA-F]{4})', lambda m: chr(int(m.group(1),16)), name)` over `os.walk(topdown=False)`.
- Contact-sheet every image (PIL, `ImageOps.exif_transpose`) and video (`fps=1,scale=256:-1,drawtext=text='%{pts\:hms}':...,tile=10x5`) and Read them.
- Use the brand's own claims verbatim and keep test footnotes. Store links → QR (`qrcode`, verify with `cv2.QRCodeDetector`).
- Cutouts: `rembg` with `~/.u2net/isnet-general-use.onnx` (products) or `u2net_human_seg.onnx` (people); downscale to ~1700 px, crop to alpha bbox.
- Logos: crop → upscale → ink-to-alpha (`alpha = clip((200-L)/110)`) → tint with `source-in`.
- Photos in scenes: drawn through `proj` so they line up with particles; soft shadow; glint = `source-in` diagonal gradient; card turn via scaleX = |cos θ|. Don't move a photo while it dissolves with its previous copy.
- Footage: as clip layers (`bg`), or feathered and `screen`ed onto black for CG on black. **Crop** burned-in captions; never paint boxes over them.

**C — AI plates (the OPUS method).**
1. **Concept doc** (Docs artifact, filled one section per call):
   - logline, motif, one gift/idea per chapter, two voices, ending
   - a drawn beat-map timeline
   - per scene: beat, plate prompt, motion prompt, overlay, subtitles
   - production rules
   Prompts in English, in code blocks.
2. **Plate prompts** (gpt-image-2, 1536×1024):
   - style + scene + motif with its count
   - "lower fifth calm, top-left clear"
   - "no text, no seals, no signatures"
3. **One consistent character**:
   - Pick one gender ("gender-neutral" drifts).
   - Use a fixed description + one identity marker that survives every style (cream knit sweater + thin red string bracelet on the left wrist).
   - Faces never shown.
   - The user generates a character sheet first (back, side, marker close-up) and attaches it as a reference to every plate with her.
   - Accept consistent user changes (hair came back long) and rewrite later prompts to match.
4. **Review the plates** (sheet with 16:9 crop lines at y 80/944 of 1024):
   - stray text or fake seals
   - motif count (a 4th wax seal was removed with `cv2.seamlessClone` of a nearby same-texture patch — try 3–4 offsets; `cv2.inpaint` smears)
   - faces and the marker
   Choose a crop offset per plate so key elements survive 16:9 (default 80, top elements 0).
5. **Start frames**: crop 1536×864 → `upscale.py` (Real-ESRGAN ×4, ~26 s each on 2 CPUs) → Lanczos 2560×1440 JPG q95. Zip them with **`VIDEO_PROMPTS.md`**:
   - one prompt per clip (camera move + ambient motion + "keep the painted texture")
   - a shared negative prompt (face turning, extra people, text, morphing, hair/style change, flicker)
   - B-takes for the opening, density peak and finale
   - 5 s locked-camera season clips
   - a night→dawn time-lapse from the previous scene's plate (it continues seamlessly)
   - object orientation written in for hand-object shots ("the phone screen faces her; we see its back")
   - file names = plate names
   Publish the prompts file as an artifact when asked.
6. **Review the clips** (6 frames per clip: `fps=6/DUR,scale=384:-1,tile=6x1`). First count decodable frames per clip (`ffprobe -count_frames … nb_read_frames`): zips from phones can truncate files (243 → 138 frames). Use the clean part slower rather than asking for a re-upload. Typical input: MiniMax H3 2560×1440 or Hailuo 2.3 1364×768 / 1080p, 24 fps, 10.125 s.
   - Use only the clean part: the diner's neon dots multiplied after ~5 s, so it played at rate .36.
   - Watch for physical errors (a phone held backwards).
   - Treat lucky shifts as story (amber → cyan became the POV switch).
7. **Extract frames**: `ffmpeg -i c.mp4 -vf "scale=1920:1080:flags=lanczos,unsharp=5:5:0.4" -q:v 3 clips/NAME/%04d.jpg` (~40 MB per 10 s clip). Put frame counts in `FILM.clips`.

**C-stills (plates without clips).** Crop nothing — keep the 3:2 plates at 3072×2048 in `plates/`, list them in `FILM.plates`, and use `plate(name, {start, plate, keys, subs})`: `keys` are `[t, cx, cy, viewW]` camera keys inside the painting, `sc.P2(t, u, v)` maps a painting point to the screen so overlays (a glowing window, a mascot's mood colour, ruler lines) stick to it. Grid the plates (10 % lines) once to read coordinates.

**Reference videos the user sends:**
- Identify the music by librosa chroma correlation with known tracks.
- Measure camera motion per shot (OpenCV LK flow + `estimateAffinePartial2D`): scale 1.000 with low inliers = still plus effects; rotation/parallax = image-to-video.
- Map scene starts to bars.
- Then fold what works into the dials — never as a separate version.

## 5. Build on the bundled engine
Files (in `scripts/`):
- `film.html`
- `engine_core.js` (utils, beat grid, palette, text, chat UI, camera, particles, scene helpers, splat buffers)
- your `scenes.js`
- `engine_frame.js` (clips, subtitles, chapters, compositor, smash frames, render entry)
- `render.js`, `stills.js`, `audio.py`, `upscale.py`

Setup:
```bash
mkdir film && cp <skill>/scripts/* film/ && cd film
npm i --silent playwright @fontsource/fraunces @fontsource/jetbrains-mono   # skip playwright if one is already installed
pip install librosa opencv-python pillow numpy   # onnx onnxruntime only for upscale.py
cp scenes.example.js scenes.js && python3 audio.py /path/music .
```

**`scenes.js` contract.**
- First line: `window.FILM = { clips: {NAME: frameCount}, clipFps: 24, flashes: [[bar(8),'255,240,246'], [bar(83),'255,226,190']], dips: [[157.7,160.1]], smash: [[t0, dur, '#fff'|'#000', 'word']], bgTint: [40,22,38] }`. Then `const SC = []` and push scenes in time order.
- A scene is `mk({...})` or `dustScene({...})` with:
  - `name, start` (use `bar(n)`)
  - `init()` (fill base particles with `setB`); `update(t)` (`copyBase` then animate P/B/V); `cam(t)` → `C({...})`
  - `bg(t)` → footage layers `[clip, clipSeconds, alpha, zoom, ox, oy, blurPx]`, optional
  - `over(t, a, tGlobal)` for overlays
  - `subs: [[t0, t1, 'zh with <r>key</r>', 'EN']]`
  - `chap: [num, title, smallLine]`, `voice: 'ai'` for the second voice, `src` (credits line), `rgb(t)` / `shake(t)` amounts
- Local times; beats via `BPr(k)` (k beats after a bar-aligned start) or `bt(k)` (absolute).
- `dustScene({seed, tints: WARM|COOL|TINT, br, sp})` gives the default drifting dust for footage scenes.
- `kit.js` builders: `shot(name, {start, clip, c0, rate, hold, z0, dz, tin, tout, dir, blur(t), filt(t)})` for clips — `tin: 'whip'|'zoom'|'up'|'glitch'` are hard cuts on the bar (`sc.cut`), `'fade'` keeps the cross-fade + light leak; `plate(...)` for stills. Vary the cut type scene to scene; drums entering = zoom/up + flash, drums leaving = fade.
- Layers: clip `[clip, s, alpha, zoom, ox, oy, blur, glitch, cssFilter]`; plate `['!name', cx, cy, viewW, alpha, blur, cssFilter]`.
- Frame hooks (define on `window`): `LETTERBOX(t)` → 0..1 cinema bars (break sections, the card, the ending), `POST(t)` after grading, `TOP(t)` above subtitles (e.g. a black beat before the big hit). `window.CHAPCOL` sets the chapter-number colour.
- Clip rate ≈ clip length / scene length (≈ .585 for 10 s over 17 s). Cut B-takes in mid-scene with `smooth((t-8.2)/.8)` alpha.

**Overlay kit (`engine_core.js` + `kit.js`):**
- `drawChat(ctx, t, msgs, cx, top, bot, a, halfW, header)`: messages `{side:'me'|'ai', t, zh, en, ty (typing start), call:true, on, zhOn}`.
- `drawBubble`, `typingBubble(x, y, a, t, scale, colour)`.
- `typer(t, steps)` + `cursorOn(t)` for drafts typed and deleted; `avatar`.
- `slip(...)`: paper slip stamp-in with a red seal; `card(...)`: glass card.
- `drawRich(str, x, y, font, t, t0, a, per, align, ls, base, pool)`: per-char reveal with coloured keywords and scramble.
- `scramble`, `zText` (depth-of-field word in 3D), `clockStr`, `fmt`.
- Banners, toasts, ledgers, counters, ink stroke reveals (clip-rect wipe + glowing nib), constellations, flying bezier bubbles: write them in `over` with `T`, `rr`, `proj`.
- `kit.js`: `stamp` (comic slam with stroke + sub-line), `toast` (notification), `withCard`/`letterCard`/`zhCard` (paper with ink reveal, Chinese wrap), `ink`/`inkZh` (glowing-nib handwriting, optional tremble), `puff` (mascot blob with mood colours), `paperBurst`, `rising` sparkles, `rain` streaks, `bigGlyph` (one huge outlined character as a thought), `floorCounter` (beat-stepped counter), `glowAt`, `shade`.
- Story props that worked: an answer delivered as a file card (`方案_v1.0.pptx · 19 页`) whose slides fly out one per beat and stack in depth, then the camera dives back to page 4; a word struck through and replaced (交付 → 答案); a volume bar sliding to zero on "the rest is just volume".
- In `over`, `proj(x, y, z)` gives `PR.x/PR.y/PR.k`; 1 world unit = 256.5 px at dist 4; `WX/WY` convert screen ↔ world.
- Map 2D UI onto a projected plane with `ctx.setTransform((X1-X0)/w,(Y1-Y0)/w,(X2-X0)/h,(Y2-Y0)/h,X0,Y0)` from three projected corners.

**Particle shapes built so far** (rebuild as needed):
- cosmic web, galaxy, neuron tree
- text/image sampling (`getImageData` of an offscreen canvas)
- dot-grid planes, beat-grid floor, warp tunnel with velocity trails, potential flow, seal + droplets, lens layers, fog → hex film, butterflies
- heartbeat + sleeper silhouette, ECG trace
- intertwined rings, memory constellation + bezier arcs to a centre
- phone outline, CRT box, seesaw, chat-window slab with z-stacked layers
- three bouncing dots forming a title's “…”

The engine is dark-mode additive; for a light film switch the LUT to `255*exp(-v)` and composite with `multiply`.

## 6. Review, render, QA
- `node stills.js st t1 t2 ...` → tile with PIL → Read. Check every scene mid-point and boundary.
- Render: `nohup node render.js 0 F1 p1.mp4 &` … on 2–3 workers; frames = round(dur·30). Poll with sleeps < 10 min; never `pgrep -f` your own pattern.
  - Footage films take ~0.7 s/frame/worker on 2 CPUs (3:18 ≈ 22 min with 3 workers); particle films ~0.3–0.4.
- Grainy footage films need a higher CRF: crf 24–26 `-preset fast` (2:53 ≈ 220 MB at 24); crf 21 on a 5-minute film ran past 500 MB and 10 min of encoding — run the mux with `nohup`.
- Join: `printf "file p1.mp4\nfile p2.mp4\n..." > cat.txt; ffmpeg -f concat -i cat.txt -i bgm_fade.m4a -map 0:v -map 1:a -c:v libx264 -crf 21 -pix_fmt yuv420p -c:a aac -b:a 224k -shortest -movflags +faststart OUT.mp4` (~300 MB for 3:18).
- To fix one region after a full render, re-render only that worker's range and re-concat.
- QA: grab frames at every boundary, hit, smash and dip **from the final file** and look at them.
- Deliver with SendUserFile (MP4 + source zip without clips/node_modules).

## 7. Pitfalls
- `-(x)**2` is a JS syntax error; use `-((x)**2)`.
- `since/barPulse/beatPulse` take global time (`t + this.start`).
- Additive particles vanish on bright footage: draw key marks as solid shapes there.
- White labels disappear on light plates: the engine gives chapters and subtitles strong dark shadows; give counters the same.
- Keep overlays clear of the subtitle band (y > 900) and the chapter corner; keep cards inside x 120–1800.
- Close-camera dense particle clusters blow out to white; keep dist ≥ 3.4 unless it's a deliberate dive under a flash.
- Rotating rings go edge-on: oscillate instead of spinning.
- Image-to-video errors: reversed objects, extra motif copies late in a clip, faces turning, hair changes. Use the clean part or ask for one reroll.
- Don't state counts or claims you can't support; label correlational studies as correlation.
- Sensitive themes: honest endings, no preaching, no dependency-fostering lines.
- Scenes share one global scope with the engine: names like `PH`, `BB`, `WH`, `BR`, `N`, `D`, `Q` are taken (a clash shows as `Identifier … has already been declared` and `SC is not defined`). Prefix your constants.
- `T()` restores the previous `globalAlpha`, so text inside a fading card fades with it.
- Bright plates + additive flash wash out on big hits: dim that clip (`filt: brightness(.82)`) or tint the flash darker.
- Additive glows sized from plate units explode on a close camera (viewW .3 → 2× scale): size them for the closest framing.

## 8. Hand-off
- One line on what the film is and its length/size.
- The notable moves, scene by scene.
- How the user's material or generations were used, and any flaw noticed.
- What to double-check (claims, music rights).
- One next step (a 9:16 cut, 15/30 s edits, a sequel).
- No step recap.

## Appendix A — Motion lexicon (motion-lexicon by linhuangjie, MIT; full reel with 23 interactive demos at https://pursuerlin.github.io/motion-lexicon/)

The user's reference reel. Every term: **中文** English — 「the vague wish」→ the professional instruction. Use the names when planning scenes and when describing moves to the user.

How to translate to film:
- The reel's web triggers become time. "scroll/drag progress p" → scene-local `p = clamp(t / len)` or a beat-snapped ramp. "pointer" → a scripted path or a projected 3D point. "hover/click" → a beat (`BPr(k)`).
- CSS transforms map to `ctx.translate/scale/rotate`, `ctx.filter = 'blur()'`, `globalCompositeOperation`, or `proj` for real depth.
- Web-only categories (interaction feedback, scroll mechanics, performance) are left out.
- Already built in this engine: scramble decode, typewriter + cursor, count-up, depth tunnel, morphing dot sphere (scene particle morph), vortex/warp tunnel, line drawing, stagger + pop, glitch-in / RGB split, shake, zoom through, match cut, rack focus, DOF, bokeh, grain, light leaks.

#### 缓动与曲线 · Easing & Curves
- **缓动 / 速度曲线** Easing — 「让它动起来更自然一点」→ 这条动效用 ease-out 曲线，起步快、收尾慢
- **线性 / 匀速** Linear — 「就匀速转」→ 匀速（linear）驱动，适合持续型运动
- **缓入 / 加速** Ease-in / Accelerate — 「它走掉的时候」→ 用 ease-in 让它加速离场，像被甩出去
- **缓出 / 减速** Ease-out / Decelerate — 「滑进来但别那么生硬」→ 240ms ease-out 入场，减速落到终点
- **缓入缓出** Ease-in-out — 「两头都慢一点，中间快点」→ 长距离位移用 ease-in-out，起止都柔和
- **缓动强度（次幂族）** Power / Sine · Quad · Cubic · Expo — 「更夸张一点的减速」→ 用 expo-out 而不是 cubic-out，收尾更“抓”
- **三次贝塞尔曲线** Cubic Bézier — 「我想要一条独一无二的曲线」→ 曲线参数 cubic-bezier(0.16, 1, 0.3, 1)
- **不对称缓动** Asymmetric Easing — 「进来温柔一点，出去利落一点」→ 进场 ease-out、退场 ease-in，曲线不对称
- **过冲 / 冲过头** Overshoot — 「到位以后抖一下再停」→ 带 10% overshoot，冲过终点再回落
- **回弹缓出** Ease-out-back — 「啪一下弹进去」→ 卡片用 ease-out-back 弹入，末端轻微回弹
- **反向前摇** Ease-in-back — 「它好像先往后缩了一下」→ 起手用 ease-in-back 做反向预备，再甩出去
- **弹簧物理** Spring — 「像苹果手机上那种自然的滑动」→ 用 spring（stiffness 120 / damping 14）替代固定时长
- **刚度** Stiffness — 「弹得再快一点」→ 把 stiffness 提到 260，回弹更紧
- **阻尼** Damping — 「别晃那么多次」→ 阻尼调到临界附近，只过一次冲就稳住
- **质量** Mass — 「看起来重一点」→ 质量加大到 3，起动变慢、惯性变强
- **落地弹跳** Bounce — 「像球掉在地上弹两下」→ 末端用 bounce-out，落地后衰减弹两次
- **橡皮筋 / 弹性震荡** Elastic — 「果冻一样抖几下」→ elastic-out，末端来回衰减震荡 2~3 次
- **阶梯缓动** Stepped / Steps() — 「要那种一格一格的」→ steps(8) 把运动切成 8 段，逐帧感
- **可中断动效** Interruptible Motion — 「我中途再点它不能卡住」→ 动画可中断，并从当前速度续接（spring 天然支持）

#### 时长与时序 · Duration & Timing
- **时长** Duration — 「快一点，但别太快」→ 时长 200ms（小元素）/ 300ms（面板）
- **延迟** Delay — 「别一起动，错开一点」→ 第二层延迟 60ms 再启动
- **错峰 / 依次入场** Stagger — 「一个一个冒出来」→ 列表项 stagger 40ms 依次入场
- **编排 / 场面调度** Orchestration — 「整段动画要有主次和节奏」→ 按 timeline 编排：背景先行，标题 120ms 跟进，卡片 240ms 收尾
- **填充模式** Fill Mode — 「动完之后别跳回原样」→ animation-fill-mode: both，结束保持终态
- **播放次数** Iteration Count — 「来回动三次就好」→ iteration-count: 3，不无限循环
- **播放方向** Direction / Alternate — 「到边了自己再退回来」→ direction: alternate 做无接缝往返
- **播放速率** Playback Rate — 「整体放慢一点看细节」→ timeScale(0.25) 慢放查看曲线细节
- **时长令牌 / 时长刻度** Motion Token / Timing Scale — 「全站动效时长要统一」→ 统一走 token：xs 100ms / s 200ms / m 320ms / l 480ms
- **感知时长** Perceived Duration — 「明明只有 300ms 却觉得慢」→ 把曲线前段做陡，感知时长会缩短

#### 入场 · Entrance
- **淡入** Fade in — 「让它慢慢显出来」→ 200ms 淡入（可叠加 8px 上移）
- **滑入** Slide in — 「从右边推进来」→ 从右侧 translateX 滑入，ease-out 300ms
- **缩放入场** Scale in — 「从小长出来」→ 从 0.96 scale 放大到 1，配淡入
- **弹出（带过冲）** Pop in — 「就是那种蹦出来的感觉」→ pop-in：scale 0.7→1 + ease-out-back，末端回弹
- **弹跳入场** Bounce in — 「从上面掉下来砸住」→ drop + bounce，落地衰减两次
- **落下入场** Drop in — 「从天上掉下来」→ 从上方 translateY(-12) 落下，ease-out
- **上浮入场** Rise / Slide-up fade — 「轻轻抬上来」→ translateY(14→0) + opacity 0→1，240ms ease-out
- **展开** Unfold / Expand height — 「把它撑开，别突然跳出来」→ 高度从 0 展开（grid-template-rows 或 FLIP）
- **裁切揭示** Clip reveal — 「像被擦出来一样」→ clip-path inset 从下往上揭开
- **遮罩显影** Mask reveal — 「边缘先出来，中间慢慢显」→ 用线性渐变 mask 做扫描式显影
- **虚化显影入场** Blur in / Rack in — 「从糊到清楚」→ blur(12px)→0 + scale 1.06→1 显影入场
- **翻转入场** Flip in — 「像卡片翻面那样进来」→ rotateY(-90deg)→0，带 perspective
- **层叠入场** Stack in — 「几张卡叠在一起依次出来」→ z 轴层叠 + 依次上移，形成 deck 效果
- **擦入 / 划入** Wipe in — 「一道色块扫过去就把内容带出来」→ 色块 wipe 扫过，扫过之后露出新内容
- **故障式入场** Glitch in — 「那种坏掉、信号不好的出现方式」→ RGB 通道分离 + 随机位移，3–5 帧后稳定

#### 出场 · Exit
- **淡出** Fade out — 「让它消失掉」→ 160ms ease-in 淡出后卸载
- **滑出** Slide out — 「把它推走」→ 沿进入方向反向 slide-out + ease-in
- **缩小退场** Scale out / Shrink away — 「缩掉吧」→ scale 1→0.94 + 淡出，暗示回到来源
- **折叠收起** Collapse — 「别了之后下面内容不要跳」→ 高度收起 240ms，让后续内容平滑上移
- **溶解** Dissolve — 「两个画面互相化开」→ cross-dissolve：A 淡出的同时 B 淡入，重叠 200ms
- **卸载前退场** Exit animation before unmount — 「怎么它一下就没了」→ 等退场动画播完（或用 transitionend）再移除 DOM
- **错峰退场** Staggered exit — 「一个一个撤掉」→ 退场也保持 stagger，必要时倒序

#### 变换与三维 · Transform & 3D
- **平移** Translate — 「把它挪个位置」→ translate(x,y) 平移，不走布局
- **缩放** Scale — 「变大一点点」→ scale 1→1.04，别超过 1.1
- **旋转** Rotate — 「转一圈」→ rotate(360deg) 匀速循环
- **斜切** Skew — 「让它有速度感地歪一下」→ skewX 与横向速度联动，形成拖拽感
- **透视** Perspective — 「让 3D 看起来有厚度」→ 父层 perspective: 800px，子元素才具备真实纵深
- **跟随倾斜** 3D Tilt — 「卡片跟着鼠标歪一下」→ 按光标位置映射 rotateX/rotateY ±8°
- **卡片翻面** Card flip — 「翻到背面看详情」→ rotateY(180deg) 换面，配合 backface-visibility
- **变换原点** Transform origin — 「它为什么是往中间缩的，我要从角上缩」→ transform-origin 设为 bottom center，从底部生长
- **来源感知动效** Origin-aware animation — 「菜单要从我点的那个按钮长出来」→ 按触发元素位置动态计算 transform-origin
- **任意轴旋转** rotate3d / axis rotation — 「绕斜着的那根轴翻」→ rotate3d(1,1,0, 180deg) 绕对角轴翻
- **2.5D 分层** 2.5D depth — 「看起来有前后层次」→ translateZ 分层 + 整体 rotateX，做 2.5D 场景

#### 状态切换与转场 · State & Transition
- **交叉淡入淡出** Crossfade — 「两张图之间自然换」→ crossfade 250ms，重叠期各 50% 不透明
- **连续性转场** Continuity transition — 「切换时别让东西乱跳」→ 保持共同元素连续，只让差异部分动
- **形变** Morph — 「圆变成播放键那个三角」→ SVG path morph：圆 ⇄ 三角，同锚点数
- **共享元素转场** Shared element transition — 「点一张缩略图，它要像镜头推进一样变成大图」→ 列表里的图片放大成详情主图，返回时沿原路缩回
- **布局动画** Layout animation — 「加了个东西别整个页面乱跳」→ 有内容新增、删除或改尺寸时，让周围内容平滑让位
- **FLIP 卡片平滑换位** FLIP technique — 「列表重排时我想要丝滑地互换位置」→ 先记下卡片原来的位置，重新排好后再平滑移过去（FLIP）
- **手风琴** Accordion / Collapse — 「点开一段文字能撑开」→ accordion：单开互斥 + 高度补间 + 图标 rotate
- **方向感知转场** Direction-aware transition — 「返回的时候要反着滑回来」→ 前进从右滑入，返回向左滑出（读书写方向）
- **滑动指示条** Sliding indicator — 「分段选项的底色要滑到新选项下面」→ 切换选项时，指示条跟着滑过去，并调整到合适的宽度
- **筛选后平滑补位** Filter reflow — 「筛选一换，留下的卡片别跳，新卡片也别从远处飞来」→ 留下的卡片平滑补位，离开的淡出，新出现的原地显现
- **点击就地展开** Expand on click — 「别跳转新页，在这条里展开」→ 卡片就地展开详情，容器高度与圆角同步过渡

#### 循环与环境动效 · Loop & Ambient
- **循环** Loop / Iteration — 「一直动」→ infinite 循环，接缝处首尾帧必须一致
- **跑马灯** Marquee — 「一排 logo 一直往左走」→ 内容复制一份，translateX(-50%) 无缝循环
- **环绕** Orbit — 「有小点点围着转」→ 多颗卫星不同半径/周期环绕，形成轨道感
- **漂浮** Float — 「让它悬着，轻轻晃」→ float：Y ±6px + 微旋转，3–5s alternate
- **待机呼吸** Idle / Breathing — 「让它看起来是活的，但别明显」→ idle：scale 1→1.015，4.5s 周期
- **加载指示器** Spinner — 「转个圈表示在加载」→ spinner：匀速旋转 + 端点渐变，1s 一轮
- **扫光** Shimmer — 「有一道光慢慢扫过去」→ 渐变背景位移，做扫光效果
- **流动渐变** Animated gradient — 「背景颜色慢慢变」→ 大面积渐变缓慢位移/旋转，15–30s 周期
- **粒子喷发** Particle burst / Confetti — 「成功了撒点花」→ 从成功点向外喷发 30–60 颗粒子，重力+衰减
- **环境动效** Ambient motion — 「背景有点东西在慢慢动」→ 背景层做低对比、长周期的环境运动
- **无接缝循环** Seamless cycle — 「为什么它每次都顿一下」→ 首尾帧状态一致 + 缓动对称，消除接缝

#### 文字动效 · Typography Motion
- **打字机** Typewriter — 「一个字一个字冒出来」→ 逐字 reveal 40ms/字 + 光标闪烁
- **乱码解码** Scramble / Decode — 「花符跳几下变成字」→ 随机字符逐步收敛为目标文本，600ms
- **文字拆分** Split text — 「标题一个字母一个字母进来」→ 按字符（或词）拆分后 stagger 30ms 入场
- **逐行遮罩揭示** Line mask reveal — 「文字一行一行从下面抬上来」→ 每行 overflow hidden，行内容 translateY(100%)→0
- **动态排版** Kinetic typography — 「文字本身当画面主体在动」→ 文字按音节落点做缩放/位移，成为画面主体
- **数字滚动** Number ticker — 「数字像老虎机那样滚上去」→ 每位数字纵向滚动落位，逐位停住
- **数值递增** Count up — 「数字从 0 涨到 892」→ 0→892 用 ease-out 递增，进位不线性
- **等宽数字** Tabular numbers — 「数字跳动的时候整行在抖」→ font-variant-numeric: tabular-nums 固定字宽
- **荧光笔划过** Highlight sweep — 「像荧光笔划过一行字」→ 文字背景 scaleX 0→1 划过，origin left
- **文字故障** Text glitch — 「字有点坏了的感觉」→ 三层错位 + clip-path 抖动，2–4 次后收敛
- **文字翻转替换** Text flip swap — 「这个词自己翻成另一个词」→ 旧词 rotateX(90°) 退出，新词从 -90° 进入
- **光标闪烁** Blinking caret — 「后面那个竖线一闪一闪」→ caret 用 steps(2) 做硬闪，周期 1s

#### 润色与特效 · Polish & FX
- **模糊** Blur — 「虚一点，透出高级感」→ backdrop-filter: blur(20px) 做毛玻璃层
- **裁切路径** Clip-path — 「把图裁成斜的」→ clip-path: polygon() 做斜切与揭示
- **遮罩** Mask — 「边缘淡出到背景里」→ mask-image 渐变让边缘自然消隐
- **描边绘制** Line drawing / SVG stroke — 「线自己画出来」→ stroke-dasharray + dashoffset 描线生长
- **发光** Glow — 「让它发亮」→ 多层 box-shadow 扩散 + 亮度饱和做泛光
- **颗粒噪点** Grain / Noise — 「加点胶片感」→ 低透明度噪点层 + 8 帧位移抖动
- **层级阴影过渡** Elevation / Shadow transition — 「让它看起来浮起来」→ 阴影随 z 层级同步变化（1→3dp）
- **高光扫过** Specular sweep — 「金属那种反了一下光」→ 斜向高光条 600ms 扫过表面
- **色散 / 色差** Chromatic aberration — 「边缘有红蓝分离」→ R/B 通道各偏移 1–3px 叠合
- **玻璃拟态** Glassmorphism — 「那种磨砂半透明的面板」→ 半透明面板 + backdrop-blur + 1px 高光描边
- **景深** Depth of field — 「前面糊掉，后面的清楚」→ 前景 blur(8px)+opacity .5，主体清晰
- **焦外光斑** Bokeh — 「背景那种圆圆的虚化光点」→ 若干大半径模糊圆形，缓慢漂移

#### 镜头与叙事 · Camera & Story
- **推镜** Dolly in / Push in — 「镜头慢慢推近一点」→ 相机沿 Z 轴前推（dolly-in），场景视差自然产生
- **摇镜 / 平移镜头** Pan — 「镜头横着扫过去」→ 相机沿 X 轴平移，扫过长画面
- **甩镜转场** Whip pan — 「猛地甩到下一个画面」→ 高速平移 + 方向性模糊，中段完成换镜
- **穿越式推进** Zoom through — 「一直往画面里钻，钻进去就是下一页」→ scale 推到画面外，同时把下一层接上
- **匹配剪辑** Match cut — 「两个画面里形状一样，看起来像同一个东西」→ 前后镜以同形状/同位置对齐，转场无感
- **硬切** Cut — 「不要动画，直接换」→ 硬切：0ms 切换（这也是一项设计决策）
- **焦点转移** Rack focus — 「焦点从 A 换到 B」→ 两组元素 blur 互补交换，视线随之转移
- **镜头震动** Camera shake — 「砸一下，整个画面抖」→ 整体随机位移 ±6px，衰减 300ms
- **环绕运镜** Orbit camera — 「围着这个东西转一圈看」→ CSS 里没有相机这一层：把整层场景绕 Y 轴反着转，冒充相机环绕
- **拉镜揭示** Reveal / Pull back — 「拉远之后才发现是更大画面的一部分」→ pull-back：局部 scale 1→0.4 露出整体语境

#### 动画原则 · Principles
- **挤压与拉伸** Squash & stretch — 「掉下去的时候像果冻」→ 落地 squash（压扁）+ 起跳 stretch（拉长），体积守恒
- **预备动作** Anticipation — 「动作之前先有个起手」→ 主动作前 100ms 反向预备（下蹲/后摆）
- **跟随与缓冲** Follow-through — 「停下来的时候还有点头」→ 主体停住后附属部分再走 2–3 帧衰减
- **次要动作** Secondary action — 「主体之外还有点小细节在动」→ 主体运动 + 次要元素错 40ms 呼应
- **弧线运动** Arc — 「别直线飞过去，走个弧线」→ X 线性 + Y 缓动 = 抛物线轨迹
- **慢入慢出** Slow in & slow out — 「两头别那么突兀」→ 起止两端各留 2–3 帧渐变速度
- **节奏与时间分配** Timing — 「该快的地方快、该慢的地方慢」→ 重击用 2 帧到位，悬停用 12 帧渐变
- **夸张** Exaggeration — 「再戏剧一点」→ 把幅度/时长推到真实值的 1.3–1.6 倍
- **分镜与聚焦** Staging — 「让它成为视觉重点，别的都别抢」→ 其余元素降透明度与饱和度，只留主体动
- **感知性能** Perceived performance — 「怎么让用户觉得快」→ 乐观更新：先播成功动效，请求失败再回滚
- **有目的的动效** Purposeful animation — 「好看就加呗」→ 这个动效解决的是连续性问题，不是装饰
- **空间一致性** Spatial consistency — 「进去再退出来，东西怎么变了位置」→ 进出使用同一轴向与同一来源点
- **使用频率原则** Frequency of use — 「这个动画我一天看 200 次」→ 高频路径动效 ≤120ms 或直接去掉
- **减弱动效** Reduced motion — 「有人看了会头晕」→ 响应 prefers-reduced-motion，降级为淡入

#### 组合范式 · Compound Patterns
- **光标驱动视线跟随** Cursor-driven gaze tracking — 「让这个角色看着我的鼠标」→ 把指针相对中心的向量映射到瞳孔位移，限幅 + 平滑跟随（lerp 0.16），空闲时做低频游走与眨眼  `const v = norm(pointer - center); ⏎ pupil += (clampLen(v, R) - pupil) * 0.16;  // 每帧平滑`
- **滚动驱动主视觉重组** Scroll-driven pinned hero recomposition — 「滚下去的时候大图别走，下面的东西排进来」→ 主视觉 sticky 钉住并按滚动进度 scale 0.74、左移，内容卡从堆叠态错峰展开成一行  `hero.style.transform = 'scale(${lerp(1, .74, p)}) translateX(${p}%)'; ⏎ card.style.transform = 'translateX(${-(i - mid) * step * (1 - k)}px) scale(${lerp(.94, 1, k)})';`
- **滚动驱动章节覆盖堆叠** Scroll-driven section reveal & card stacking — 「下一屏盖上来，上一屏退下去」→ 每章 sticky 递增 14px 顶部偏移，被覆盖时 scale 0.93 + 亮度衰减  `.sec { position: sticky; top: calc(4px + var(--i) * 14px); height: 118px; margin-bottom: 104px; } ⏎ sec.style.transform = 'scale(${1 - .075 * covered})';`
- **光标驱动微缩景观视差** Cursor-driven miniature scene parallax — 「鼠标一动，箱子里的东西分层跟着动」→ 指针向量按层深分配位移系数（远 0.3 / 近 1.6），容器叠加 rotateY ±6° 做立体盒  `.layer { transform: translate3d(calc(var(--px) * var(--f) * -8px), 0, 0); } ⏎ .diorama { transform: rotateY(calc(var(--px) * 6deg)); transform-style: preserve-3d; }`
- **滚动驱动角色环绕** Scroll-driven character orbit — 「滚一下，模型跟着转」→ 滚动进度 0→1 映射到 rotateY 0→360°，主体 sticky，俯仰固定在 −14°  `fig.style.transform = 'rotateX(-14deg) rotateY(${p * 360}deg)';`
- **悬停触发车门绽放** Hover-triggered door bloom — 「鼠标一放上去，门片一片片张开」→ 悬停时 4 扇门板沿各自铰链轴从闭合旋转展开（rotateY ±102°），错峰 60ms，舱内光晕随开启增强  `.petal { transform-origin: 0 50%; transition: transform .55s var(--emphasized); transition-delay: calc(var(--i) * 45ms); } ⏎ .petal { transform: rotate(var(--a)) translateX(9px) rotateY(-64deg); }   /* 合 */ ⏎ .wrap:hover .petal { transform: rotate(var(--a)) translateX(30px) rotateY(0); } /* 开 */`
- **滚动驱动涡旋穿隧** Scroll-driven vortex transit — 「滚着滚着像在隧道里往前飞」→ 滚动进度驱动 N 层同心环 scale 0.08→3.58 + 旋转，取模循环制造无限纵深  `const t = (p * 1.7 + i / N) % 1; ⏎ ring.style.transform = 'scale(${.08 + t * t * 3.5}) rotate(${t * 80 + i * 18}deg)';`
- **沉浸式漂浮生长** Immersive float & growth — 「点一下，东西掉下来然后长出花草」→ 点击触发：球体落下（重力缓动 + 落地挤压）→ 茎秆 stroke-dashoffset 描边 → 叶片错峰 scale-in  `await ball.animate([{transform:translateY(-46px)},{transform:translateY(0) scale(1.18,.8)}], ⏎   {duration:520, easing:EASE_IN}).finished; ⏎ stem.style.strokeDashoffset = 0;   /* 描边生长 */`
- **旋流光螺旋展示** Scroll-driven helix flow — 「拖一下，东西沿螺旋轨道转着展示」→ 拖拽位移映射为螺旋相位：x=sin θ·R，y 随索引线性偏移，scale/opacity 由 cos θ 给出  `const a = phase + i * (TAU / N); ⏎ x = Math.sin(a) * R;  y = (i - N/2) * 7 + Math.cos(a) * 8; ⏎ scale = .72 + (Math.cos(a) + 1) / 2 * .5;`
- **光标驱动辉光流转** Cursor-driven luminous flow — 「光跟着鼠标走，地面还起雾」→ 指针坐标写入 --lx/--ly 驱动径向光斑，指针速度平滑后映射为雾气上升与最多 1.06 倍推镜  `wrap.style.setProperty("--lx", x + "px"); ⏎ wrap.style.setProperty("--fog", smoothSpeed);  /* 速度→雾浓度 */`
- **光标聚光揭示** Cursor spotlight reveal — 「鼠标像手电筒一样，照到哪才看得到哪」→ 一层与底色同值的遮罩，用 radial-gradient 在指针处挖洞，只改 --lx/--ly 两个变量  `.mask { background: radial-gradient(circle var(--r, 56px) at var(--lx) var(--ly), transparent 0 42%, var(--bg) 62%); }`
- **光标拖尾** Cursor trail — 「鼠标后面拖一串东西」→ N 个粒子做链式追随（每个追前一个，系数 0.28），尺寸与透明度按序号衰减  `for (i = 0; i < N; i++) { p[i] += (target(i) - p[i]) * 0.28; }  // p[0] 追指针，p[i] 追 p[i-1]`
- **悬停扇形展开** Hover fan-out stack — 「一叠卡片悬停时摊开」→ 堆叠态归零位移，悬停时按 index 分配 rotate 与 translateX，错峰 40ms  `.card { transform: rotate(calc(var(--i) * 8deg)) translateX(calc(var(--i) * 15px)); transition-delay: calc(var(--i) * 40ms); }`
- **悬停揭角** Card peel — 「鼠标放上去卡片角会翘起来」→ 右下角三角形从 0 长到 36px，配渐变模拟背面与投影，父层同步裁切出缺口  `.corner { width: 0; height: 0; transition: .42s cubic-bezier(.2,0,0,1); } ⏎ .wrap:hover .corner { width: 34px; height: 34px; background: linear-gradient(315deg, var(--bg) 42%, #fff 42%); }`
- **滚动转横向位移** Scroll-to-horizontal — 「往下滚，内容却往右边走」→ 把纵向滚动进度映射成横向轨道 translateX，容器 sticky 占住视口  `track.style.transform = 'translateX(${-p * (track.scrollWidth - viewport)}px)';`
- **滚动抽帧播放** Scrubbed frame sequence — 「滚一下就像在拖视频进度条」→ 滚动进度取整到 N 帧（steps 语义），每帧只写一次姿态，配帧号读数  `const f = Math.round(p * (N - 1));   // 量化，不要 lerp ⏎ pose(f); readout.textContent = 'f ${String(f + 1).padStart(2, "0")}/${N}';`
- **钉住双栏叙事** Sticky two-column — 「左边图不动，右边一条条滚，图跟着换」→ 左栏 sticky，右栏各步骤到达可视区域顶部时切换左栏内容并交叉淡入  `let active = 0; ⏎ steps.forEach((step, i) => { ⏎   if (step.getBoundingClientRect().top <= viewportTop + 4) active = i; ⏎ }); ⏎ swapVisual(active);`
- **滚动主题渐变** Scroll-linked theme morph — 「滚下去整屏颜色慢慢换掉」→ 把进度落到色标数组上做 RGB 插值，同时联动前景色保证对比度  `const [a, b, t] = locate(stops, p); ⏎ bg.style.background = mixRGB(a.bg, b.bg, t); fg.style.color = mixRGB(a.fg, b.fg, t);`
- **滚动进度环** Scroll progress ring — 「一个圈跟着滚动慢慢填满」→ stroke-dasharray = 周长，dashoffset = 周长 ×(1−进度)，圆心角从 −90° 起算  `const C = 2 * Math.PI * r; ⏎ ring.style.strokeDasharray = C; ⏎ ring.style.strokeDashoffset = C * (1 - p);`
- **悬浮按钮展开面板** FAB to sheet container transform — 「点右下角的圆钮，它自己长成一块面板」→ 同一个元素改宽高与圆角，从圆形展开成面板，内容延迟 120ms 错峰淡入  `.fab { width: 44px; height: 44px; border-radius: 22px; transition: width .38s var(--emphasized), height .38s, border-radius .38s; } ⏎ .fab.open { width: 178px; height: 106px; border-radius: 18px; } ⏎ .row { opacity: 0; transform: translateX(12px); transition-delay: calc(130ms + var(--i) * 65ms); }`
- **按钮三态形变** Button tri-state morph — 「点一下变圈转一转，再变回来说已保存」→ 宽度收拢成圆 → 转圈 → 展开并弹勾，三态之间只动 transform 与宽度，禁止抖动  `btn → width: 44px; border-radius: 50% → spinner → width: auto; ✓ 已保存 → 1.6s 后回 idle`
- **拖拽擦除对比** Drag-to-compare wipe — 「中间一条线，拖开能看到前后两版」→ 把手位移换算成百分比，写入上层 clip-path: inset(0 X% 0 0)，同步给读数
- **滚动驱动逐行遮罩揭示** Scroll-driven line-mask reveal — 「文字一行一行从挡板下面升起来」→ 每行包在 overflow:hidden 的蒙版里，滚动进度按行分配延迟，行内 translateY 100%→0  `.line { overflow: hidden; } ⏎ .line > span { transform: translateY(calc((1 - p) * 100%)); } ⏎ // p = ease(clamp((progress - i * .13) / .34, 0, 1))`
- **滚动速度倾斜跑马灯** Scroll-velocity marquee skew — 「滚快了那排字会斜一下跟着冲」→ 滚动速度平滑后同时喂给位移增量和 skewX，速度归零时两者一起回弹到 0  `vel = lerp(vel, scrollDelta * 0.35, 0.12); ⏎ row.style.transform = 'translateX(${x += base + vel * 2}px) skewX(${-vel * 0.4}deg)';`
- **光标邻近点亮网格** Cursor proximity grid glow — 「鼠标靠近哪格哪格就亮」→ 每格算自己中心到指针的距离，按 (1−d/R)² 衰减映射到亮度、缩放与 Z 位移  `const k = Math.pow(Math.max(0, 1 - dist / R), 2); ⏎ tile.style.transform = 'scale(${1 + k * .28}) translateZ(${k * 26}px)';`
- **液态黏附跟随** Liquid cursor follow — 「有个果冻跟着鼠标，还会被拉长」→ 位置用弹簧追赶指针，速度投影到角度上沿运动方向拉长、垂直方向压扁，保持体积  `pos += (target - pos) * 0.14; ⏎ const v = pos - prev, a = Math.atan2(v.y, v.x), m = Math.min(1, |v| / 18); ⏎ el.style.transform = 'rotate(${a}rad) scale(${1 + m * .5}, ${1 - m * .34})';`
- **滚动驱动图表生长** Scroll-driven chart build — 「滚到这儿，图表一根根长出来」→ 折线用 stroke-dashoffset 描边，柱体按索引错峰 scaleY，数值读数与进度绑定  `line.style.strokeDashoffset = L * (1 - p); ⏎ bar.style.transform = 'scaleY(${ease(clamp((p - i / n * .6) / .4, 0, 1))})';`
- **悬停联动预览卡** Hover-linked floating preview — 「鼠标在列表上滑，旁边跟着飘一张图」→ 预览卡用弹簧跟随指针，换行时只换缩略内容与一次 scale 弹跳，不重新挂载  `card += (pointer + offset - card) * 0.16; ⏎ card.style.transform = 'translate(${card}px) rotate(${vx * .5}deg)'; ⏎ row.onenter = () => thumb.pop();`
- **速度抛掷丢弃** Velocity throw & dismiss — 「拖一下甩出去，卡片跟着转着飞掉」→ 旋转角与横向位移成正比、出手速度决定飞行轨迹，越过阈值才判定为丢弃  `rot = dx * 0.07;                       // 角度来自位移 ⏎ const fly = Math.abs(dx) > 88 || Math.abs(vx) > 20;   // 位移或速度越界才算丢弃 ⏎ if (fly) card.animate([{ transform: 'translate(${vx * 900}px, -60px) rotate(${rot * 6}deg)', opacity: 0 }], …);`
- **乱码解码揭示** Scramble decode reveal — 「字先是一堆乱码，然后一个个定下来」→ 每个字符有各自的锁定时刻，未锁定前每帧随机取字形，整体呈左→右的收敛带  `for (i) if (frame > lockAt[i]) out += target[i]; ⏎         else out += GLYPHS[random()] ;   // 只滚动未锁定位`
- **反向图带** Opposite scroll rails — 「两行图片，一行往左走，一行往右走」→ 同一份滚动进度给两行图带写反方向的 translateX，速度比 1 : 0.62——速度差就是深度  `const m = (p * span) % span; ⏎ rowA.style.transform = 'translateX(${-m}px)';               /* 向左 */ ⏎ rowB.style.transform = 'translateX(${m * 0.62 - span}px)';   /* 向右，慢一档 */`
- **纵深隧道** Scroll depth tunnel — 「往下滚不是往下看，是往里走」→ 每张图一个 z 值，滚动平移相机 z：scale = d / (d + z − cam)，越近越大，过身即出画  `const rel = z - cam;                        /* 相机前进 = cam 增大 */ ⏎ scale = F / (F + rel); ⏎ opacity = rel < 0 ? 0 : clamp(1.2 - rel / 900, 0, 1);`
- **磁吸按钮** Magnetic button — 「鼠标一靠近，按钮就被吸过去」→ 指针进入半径 R 内按 (1−d/R) 衰减拉拽按钮，位移走弹簧插值，离开力场回弹归位  `const pull = d < R ? 1 - d / R : 0;      /* 衰减：边界不跳变 */ ⏎ tx = dx * .58 * pull; ⏎ x += (tx - x) * .18;                     /* 弹簧跟随 */`
- **指针倾斜卡** Pointer tilt card — 「卡片跟着鼠标翻转，表面还有一层反光」→ 指针偏移映射 rotateX(−y·14°) / rotateY(x·16°)，0.14 系数平滑，光斑 radial-gradient 跟随指针  `card.style.transform = ⏎   'perspective(700px) rotateX(${-y * 14}deg) rotateY(${x * 16}deg)';`
- **数字滚动计数** Odometer number roll — 「数字像里程表一样滚上去」→ 每一位是一条 0–9 竖排字带，translateY 滚到目标行，右→左逐位 delay 55ms，过冲曲线收尾  `digit.style.transform = 'translateY(${-n * 10}%)'; ⏎ digit.style.transitionDelay = (cols - 1 - i) * 55 + "ms";`
- **五彩纸屑** Confetti burst — 「点一下，撒出一把会转的彩纸」→ 点击处喷出 26 片刚体：初速随机、每帧 vy += g 重力、绕自身轴旋转，落出容器即回收  `p.vy += .34;  p.x += p.vx;  p.y += p.vy;  p.r += p.vr; ⏎ el.style.transform = 'translate(${p.x}px, ${p.y}px) rotate(${p.r}deg)'; ⏎ if (p.y > H + 30) el.remove();          /* 出界回收 */`
- **滑动标签指示器** Smooth tab indicator — 「点页签，下面那条会自己滑过去」→ 指示器读取目标项的 offsetLeft/offsetWidth 平移到位，内容交叉淡入，指示器带轻微过冲  `ind.style.left = item.offsetLeft + "px"; ⏎ ind.style.width = item.offsetWidth + "px";   /* resize 时重测 */`
- **3D 立体轮播** 3D coverflow carousel — 「中间那张最大最正，两边的斜着排开」→ 每张卡按与焦点的索引差变换：translateX 错位 + translateZ 后退 + rotateY 转向，点击侧卡换焦点  `cards.forEach((c, i) => { ⏎   const off = i - focus; ⏎   c.style.transform = 'translateX(${off * 46}%) translateZ(${-Math.abs(off) * 130}px) rotateY(${off * -32}deg)'; ⏎ });`
- **圆柱卡带** Cylinder photo reel — 「一列照片卷成一个圆筒，拖着它转」→ 每片照片绕中心按 i·36° 环形排布再 translateZ 出半径，拖拽改 rotY，拖速同时驱动标题字距  `reel.style.transform = 'rotateY(${rot}deg)'; ⏎ card.style.transform = 'rotateY(${i * 36}deg) translateZ(${R}px)'; ⏎ title.style.letterSpacing = 3 + Math.min(1, Math.abs(vel) * .35) * 14 + "px";`
- **环形画廊** 3D ring gallery — 「照片围成一圈，转到面前那张才亮」→ 相机在环外：8 张照片按 i·45° 围成圆环，拖拽旋转环体，点击某张即把最短路径转到正面并提亮  `const want = ((-i * 45 % 360) + 360) % 360; ⏎ const cur = ((rot % 360) + 360) % 360; ⏎ let d = want - cur; if (d > 180) d -= 360; if (d < -180) d += 360; ⏎ rotGoal = rot + d;                       /* 最短路径 */`
- **翻页卷曲转场** Page curl transition — 「像翻书一样把下一页翻出来」→ 拖动纸张控制翻页进度与卷曲，松手按速度完成或回弹；支持点击、滚轮和方向键连续翻书  `// WebGL 网格翻书：需实现 deformPaper 与 renderBook ⏎ const progress = clamp((startX - pointerX) / pageWidth, 0, 1); ⏎ for (const vertex of paper.vertices) { ⏎   deformPaper(vertex, { progress, grabY, curl, twist }); ⏎ } ⏎ // 松手后按速度决定目标，再用弹簧接续；不是平面 rotateY ⏎ renderBook({ frontTexture, backTexture, shadowMap });`
- **灵动岛展开转场** Dynamic Island transition — 「通知缩在胶囊里，点一下再展开成控制面板」→ 同一块胶囊容器从提醒态平滑扩展为实时活动，内容随状态接续出现  `.island { transition: width .42s cubic-bezier(.2,.8,.2,1), height .42s; } ⏎ .island.is-open { width: 236px; height: 112px; }`
- **刮开显影** Scratch to reveal — 「用手指擦开表层，下面的图慢慢露出来」→ Canvas 覆层随指针擦除，刮开面积过半后自动清除剩余表层  `ctx.globalCompositeOperation = "destination-out"; ⏎ ctx.lineWidth = 28; ctx.lineCap = "round"; ⏎ ctx.stroke();`
- **粒子球体变形** Morphing dot sphere — 「一颗点组成的球，拖动能转，点一下还能变形」→ 球面采样点投影到画布，拖动改变视角，点击在球体、心形、圆环、立方体、螺旋、星形与星系七种点阵间平滑插值  `// 保持粒子索引不变，从当前坐标接续到新形状 ⏎ points.forEach((p, i) => { ⏎   p.x = lerp(p.x, shapes[selected][i].x, alpha); ⏎   p.y = lerp(p.y, shapes[selected][i].y, alpha); ⏎   p.z = lerp(p.z, shapes[selected][i].z, alpha); ⏎ });`
- **双路牵丝织形** Dual-path ribbon weave — 「两条线从两边长出来，在中间交织成一个形状」→ 两条路径分别描绘并在交叉处错层，光点沿路径移动，最终共同组成图形  `path.style.strokeDasharray = pathLength; ⏎ path.style.strokeDashoffset = pathLength * (1 - progress); ⏎ // 交叉处留出底层间隙，再绘制上层路径`
- **目标扫描与锁定** Target scan & acquire — 「扫过一遍，找到目标后把它框起来」→ 扫描线扫过视野，发现目标后准星对齐，并保持清楚的锁定状态  `state = "scanning"; ⏎ if (scanHits(target)) state = "locked"; ⏎ showReticle(target); // 锁定后保持可见`

## Appendix B — bundled files (`scripts/`)
| File | What it does |
|---|---|
| `audio.py` | Music → `audio.js` (beats, strengths, RMS, 30 fps kick envelope), `bgm.m4a`, `bgm_fade.m4a`, and a grid report (tempo, bar, loudness per bar, big entries, accents, dips). `--grid B0 BP` forces an exact grid. |
| `arrange.py` | Re-arrange a beat on bar lines (`--seg 0-16,16-48,56-64,80-end`). |
| `timeline.py` | `script.json` → `timeline.js`: scene bars and subtitle windows sized by reading speed, with speaker keys. |
| `kit.js` | Shot builders (`shot`, `plate`, `kf`, `spkKeys`) and the overlay kit (stamps, toasts, paper + ink, mascot, rain, bursts, glyphs, counters). |
| `film.html` | The page the renderer opens: fonts + `audio.js` → `engine_core.js` → `kit.js` → `scenes.js` → `engine_frame.js` (add `timeline.js` before `scenes.js` when you use it). |
| `engine_core.js` | Utilities, beat grid, palette, text helpers, chat UI kit, camera/projection, particle buffers, scene helpers, splatting. |
| `engine_frame.js` | Clip and plate layers, speaker-tagged subtitles, chapter labels, the per-frame compositor (footage, hard cuts + glitch slices, kick punch, light leaks, particles, bloom, letterbox, overlays, grain, flashes, smash frames, dips), `frameJPEG`, `ready`. |
| `scenes.example.js` | A minimal two-scene film; copy to `scenes.js` and replace. |
| `render.js` | `node render.js startFrame endFrame out.mp4` — renders a frame range to H.264 via ffmpeg. |
| `stills.js` | `node stills.js outdir t1 t2 …` — JPEG stills for review. |
| `upscale.py` | Real-ESRGAN ×4 without torch (download `realesr-general-x4v3.pth` into `models/`). |

`examples/typing/` holds the scenes and video prompts of 《正在输入… TYPING…》 as a full worked example (plates, clips and music are not included).
`examples/girl/` holds both versions of 《总说「你说得对」的女孩》: the stills-only cut with its script and synthesised score, and the image-to-video cut on a re-arranged beat, with its video prompts.
