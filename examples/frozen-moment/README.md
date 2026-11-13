# 《0.01》 — a frozen-moment product film (Mode D)

A 1:45 launch film for a pair of racing goggles. The whole film happens inside one hundredth of a second:
time stops at 23.90, 0.01 s before the wall, and one continuous camera flies through that frozen instant in a
sunlit pool. The product is the real one, cut out of its CG footage and hung in the frozen splash.

整部片子发生在 0.01 秒里：时间停在 23.90，一个不剪断的镜头穿过被定格的泳池。产品是真实素材抠出来的，悬在凝固的水花中间。

This folder is the direction and the 3D world exactly as rendered, with brand names replaced by placeholders.
Footage, photos, logos and music are **not** included.

## Why this mode exists

The first cut of this film was a clean slide-style edit (headline left, object right, fade, repeat). The client's
verdict: "a bit plain". What fixed it was structural, not decorative:

| Problem | Fix |
|---|---|
| Reads as a deck: eleven pages with fades | One world, one camera, no cuts (the only cut hides in the white flash of the wall touch) |
| The camera never moves | Every chapter is a camera move to something *found* in the frozen moment |
| A feature list, no arc | A race: last 15 m → freeze at 23.90 → the tour → time restarts → 23.91 |
| The hero is an abstract shape | The real product, keyed out of its footage, as a giant in macro shots |
| Nothing surprising | Leaving the swimmer's eyes *through the lens*; flying a tunnel of 43 colourways; fog clearing from the inside |

## Timeline (105 BPM, bar = 2.286 s)

| Bars | Music | What happens |
|---|---|---|
| 0–4 | intro, no drums | POV through the lens: the last 15 metres, race clock running |
| 4 | drums enter | **Freeze.** Splash erupts and stops; camera exits through the lens and whips round to the goggles |
| 5–8 | verse | Giant wordmark rises from the water; "这 0.01 秒里，藏着一副泳镜的全部。" |
| 8–12 | verse | Curve lens (macro, bigger than the screen) · cushion (round loupe) |
| 12–16 | chorus | Three lens layers float apart, slam together on bar 14 |
| 16–18 | chorus | Anti-fog, seen from inside: the view fogs, one film of water clears it |
| 18–22 | chorus | Fly up the lane through a helix of colourways; they assemble into a wall |
| 22–28 | chorus | Adjusters as hanging cards · badges popping up on the lane rope, one per beat · "If you are —" |
| 28–32 | breakdown | The held breath: wide shot from above, "还差 0.01 秒。", then dive back into the lens |
| 32–36 | chorus 2 | Time restarts, lunge, **touch → 23.91**; three giant macros in the sky, one per bar |
| 36–46 | chorus 2 / outro | Lock-up over calm water with rain rings: wordmark, slogan, logo, QR |

The clock in the corner stays red at 23.90 for the whole tour, and the progress ruler runs from 23.900 to 23.910.

## Files

| File | What it is |
|---|---|
| `world.js` | The pool: water shader (fake refraction to a procedural floor, caustics, splash and rain rings), sky, lane ropes, wall and blocks, ballistic droplets + crown, footage billboards with mattes and reflections, lens layers, sprites and cards |
| `film.js` | The direction: key times on the bar grid, the camera spline, time warps (`tau1`, `tau2`, `waveT`), `stage(t)` posing the world, and the 2D HUD (type, clock, ruler, lens frame, fog) |
| `matte.py` | Keys footage shot on pure black into per-frame mattes (fills small holes, drops specks, feathers) |
| `film.html`, `stills.js`, `render.js` | Page, still review, and the frame → ffmpeg renderer |

## Running it with your own material

```bash
npm i three playwright @fontsource/jetbrains-mono && npx playwright install chromium
cp node_modules/three/build/three.module.js node_modules/three/build/three.core.js .
# footage as frame sequences at 24 fps: clips/<name>/0001.jpg ...   (hero, front, curve, cushion, belt, nosecg, bridgehow, straphow)
python3 matte.py clips matte hero front curve cushion belt nosecg       # product on black -> mattes
# cut-out product photos: cut/<name>.png, listed in cwmeta.js as  window.CW = [[name, w, h, [r,g,b]], ...]
# assets/: wordmark.png and logo_white.png (white on transparent), qr.png, badge0..6.png
python3 ../../scripts/arrange.py src.wav edit.wav --b0 0.013 --bar 2.285714 --seg 12-40,40-43,47-48,64-78   # shorten on bar lines
python3 -m http.server 8791 &                                           # ES modules need http
node stills.js stills 2 9.5 12 20 30 38.6 44 58 68 75 90                # look before you render
node render.js 0 1577 p1.mp4 & node render.js 1577 3154 p2.mp4          # two workers
printf "file p1.mp4\nfile p2.mp4\n" > cat.txt
ffmpeg -f concat -i cat.txt -i edit.wav -map 0:v -map 1:a -c:v libx264 -crf 21 -pix_fmt yuv420p -c:a aac -b:a 256k -shortest out.mp4
```

Fonts: Inter / Inter Display and Noto Sans CJK SC installed on the system, JetBrains Mono from Fontsource.
On a machine without a GPU, launch Chromium with `--use-gl=swiftshader --enable-unsafe-swiftshader` (already in
the scripts); expect about 1.5 s per 1080p frame per worker.

## Lessons worth keeping

- **Billboards are enough.** Footage on a camera-facing plane reads as 3D if the clip itself turns: scrub the clip's frames with the orbit (frontal → three-quarter as the camera swings).
- **Macro billboards must be larger than the screen**, placed so the footage's own frame edges stay off-screen. A cropped strap at the edge of the plane gives the trick away.
- **A dark macro is heavy in a bright film.** Show it inside a round loupe instead of full-frame.
- **Fade wave octaves, floor lines and caustics with distance**, or the water aliases into dots.
- **Droplets**: refract the world upside-down, darken the rim, add a hard sun highlight. Cull the ones within 16 cm of the lens.
- **Camera spline**: non-uniform Catmull-Rom with tension 0.7; zero the tangent wherever two neighbouring keys are equal, or the camera drifts before a hold. Never let the look-target pass through the camera: swing it out sideways for a 180° turn.
- **WebGL 2**: swapping a texture's image for one of a different size needs `texture.dispose()` first, or the old picture stays.
- **Legibility on a moving bright world**: dark type with a white glow plate behind it, not boxes.
