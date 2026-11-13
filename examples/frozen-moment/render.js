// node render.js startFrame endFrame out.mp4
const { chromium } = require('playwright'); const { spawn } = require('child_process'); const fs = require('fs');
(async () => { const [a, b, out] = process.argv.slice(2); const FPS = 30, tmp = out.replace(/\.mp4$/, '.part.mp4');
  const br = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await br.newPage({ viewport: { width: 1920, height: 1080 } }); p.on('pageerror', e => console.log('PAGEERR', e.message));
  await p.goto('http://localhost:8791/film.html'); await p.evaluate(() => window.ready);
  const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', String(FPS), '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', '-r', String(FPS), tmp], { stdio: ['pipe', 'inherit', 'inherit'] });
  const t0 = Date.now();
  for (let f = +a; f < +b; f++) { const d = await p.evaluate(t => window.frameJPEG(t, .94), f / FPS); const buf = Buffer.from(d.split(',')[1], 'base64');
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r)); if (f % 150 === 0) console.log(out, f, ((Date.now() - t0) / 1000).toFixed(0) + 's'); }
  ff.stdin.end(); const code = await new Promise(r => ff.on('close', r)); await br.close(); if (code === 0) fs.renameSync(tmp, out); console.log('done', out, code); })();
