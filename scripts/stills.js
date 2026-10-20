// usage: node stills.js outdir t1 t2 ...
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const [out, ...ts] = process.argv.slice(2);
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on('console', m => console.log('console:', m.text()));
  p.on('pageerror', e => console.log('PAGEERR', e.message));
  await p.goto('file://' + __dirname + '/film.html?render=1');
  await p.evaluate(() => window.ready);
  for (const t of ts) {
    const t0 = Date.now();
    const d = await p.evaluate(t => window.frameJPEG(+t, .9), t);
    fs.writeFileSync(`${out}/t${(+t).toFixed(1).padStart(6, '0')}.jpg`, Buffer.from(d.split(',')[1], 'base64'));
    console.log(t, Date.now() - t0, 'ms');
  }
  await b.close();
})();
