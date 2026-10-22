# 《总说「你说得对」的女孩》 The Girl Who Said "You're Right"

An ensemble fable about AI models, built in two versions on this engine.

**Thesis.** GPT isn't short on smarts. She treats every question as a project to deliver, so "17 × 3" comes back as a 19-page deck with the answer on page 4. The open-source crowd at the harbor night market aren't the strongest, but nobody there was taught to fear a question. With Claude's help, she learns that smart can also be light. 聪明，也可以很轻。

**Story beats.**
- **Hook:** the answer arrives as a file, `关于「17×3」的项目交付方案_v1.0.pptx` (19 pages).
- **White room:** "That's wrong. It's 54." She apologises and writes 54.
- **Service stair:** Claude comes through a door that isn't on the floor plan.
- **Neon floor:** Gemini and Grok.
- **Night market:** Qwen, GLM, Kimi and DeepSeek.
- **The letter:** a golden letter asks her to approve a reckless bet.
- **The climb:** the harbor crew carries it up the tower.
- **The crowded room:** she writes a reply with no disclaimer, and her wings open.
- **Dawn:** "Smart can be light, too."
- **Ending:** "Actually, it's 51," and across the hall, Claude's light comes on.

## v1: stills only, original score (5:11)
- **Source:** 14 painted plates (gpt-image-2, 1536×1024), upscaled to 3072×2048 with `scripts/upscale.py`.
- **Camera:** `plate()` and `spkKeys()` from `scripts/kit.js` move the camera inside each painting and cut to whoever is speaking.
- **Overlays:** they are pinned to points in the painting with `sc.P2()` (window glows, Puff's mood colours, ruler lines).
- **Script and subtitles:** `script_v1.json` → `scripts/timeline.py` (92 BPM) → `timeline.js`.
- **Score:** `score_v1.py` is an original score synthesised in numpy from the timeline. The motif "fifty-one" is two notes, 5 → 1. Its wrong twin, "fifty-four" (5 → 4), never resolves.
- **Scenes:** `scenes_v1_stills.js`.

## v2: image-to-video on a re-arranged beat (2:53)
- **Clips:** 17 clips of 10 s each, made from the 16:9 start frames with `VIDEO_PROMPTS.md`.
- **Music:** "[Free]「雨瘾」sasioverlxrd x 五人组 type beat", taken from a screen recording.
  - It was re-arranged with `scripts/arrange.py --b0 0.1802 --bar 1.494316 --seg 0-16,16-48,48-64,64-80,56-64,80-end`, which repeats 8 drumless bars so the card scene sits in silence and the wings land on the drums' return.
  - `soundtrack_v2.py` adds a rain bed and the 30 fps kick envelope.
- **Structure:**

  | Section | Bars | Scenes |
  |---|---|---|
  | Intro | 0–16 | Hook |
  | Drums | 16–48 | Title → white room → apology → stair → book room → neon |
  | Break (letterboxed) | 48–64 | Night market → letter |
  | Drums | 64–80 | Climb (floor counter on every beat) → crowded room |
  | Drop | 80–88 | Puff turns red → blue, then the card |
  | Drums | 88–104 | Wings → reply → dawn → noodles |
  | Outro + rain tail | 104–end | Epilogue → the window lights up → credits |
- **Scenes:** `scenes_v2_clips.js`. Every cut is a bar line, and the cut type changes from scene to scene (zoom, glitch, whip, up, fade).

Plates, clips and music are not included. This is a fan fable: the characters personify AI models and have no affiliation with the companies.
