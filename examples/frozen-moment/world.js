// The frozen pool: water, lane, splash, and the product billboards. Units are metres.
import * as THREE from './three.module.js';
export const W = 1920, H = 1080;
export const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: true });
renderer.setPixelRatio(1); renderer.setSize(W, H, false); renderer.setClearColor('#f3f7fb');
renderer.toneMapping = THREE.NoToneMapping; renderer.outputColorSpace = THREE.SRGBColorSpace;
export const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera(32, W / H, .02, 400);

/* ---------- shared GLSL ---------- */
const SUN = new THREE.Vector3(-.35, .62, -.7).normalize();
const SKY = `
uniform vec3 uSun;
vec3 skyColor(vec3 d){
  float y = clamp(d.y, -1., 1.);
  vec3 hor = vec3(.965,.980,.992), zen = vec3(.83,.92,.985);
  vec3 c = mix(hor, zen, pow(max(y,0.), .55));
  float s = max(dot(normalize(d), uSun), 0.);
  c += vec3(1.,.96,.88) * (pow(s, 600.) * 3. + pow(s, 24.) * .28 + pow(s, 4.) * .10);
  return c;
}`;
const FLOORFN = `
#define TAU 6.28318530718
float caustic(vec2 uv, float time){
  vec2 p = mod(uv * TAU, TAU) - 250.0; vec2 i = p; float c = 1.0; float inten = .005;
  for (int n = 0; n < 4; n++){ float t = time * (1.0 - (3.5 / float(n + 1)));
    i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
    c += 1.0 / length(vec2(p.x / (sin(i.x + t) / inten), p.y / (cos(i.y + t) / inten))); }
  c /= 4.; c = 1.17 - pow(c, 1.4); return pow(abs(c), 8.);
}
vec3 floorColor(vec2 p, float t, float dist){
  vec3 base = vec3(.80,.93,.965);
  vec2 g = abs(fract(p / .25) - .5); float line = smoothstep(.47, .5, max(g.x, g.y));
  base = mix(base, vec3(.70,.86,.91), line * .55 * (1. - smoothstep(2.5, 9., dist)));
  // lane lines (dark navy) under each lane centre, with a T before the wall
  float lx = abs(mod(p.x + 1.25, 2.5) - 1.25);
  float sw = .01 + dist * .012;
  float ln = (1. - smoothstep(.125 - sw, .125 + sw, lx)) * step(2.0, p.y);
  float tb = (1. - smoothstep(.5 - sw, .5 + sw, lx)) * (1. - smoothstep(.125 - sw, .125 + sw, abs(p.y - 2.0)));
  base = mix(base, vec3(.07,.12,.22), max(ln, tb) * mix(.92, .6, smoothstep(4., 30., dist)));
  float c = caustic(p * .55, t * .9) * .55 * (1. - smoothstep(6., 22., dist)) + caustic(p * .23 + 3.1, t * .6) * .35 * (1. - smoothstep(14., 45., dist));
  return base + vec3(1.,1.,.96) * c;
}`;

/* ---------- sky dome ---------- */
const skyMat = new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, uniforms: { uSun: { value: SUN } },
  vertexShader: 'varying vec3 vD; void main(){ vD = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }',
  fragmentShader: `varying vec3 vD; ${SKY} void main(){ gl_FragColor = vec4(skyColor(normalize(vD)), 1.); }` });
const sky = new THREE.Mesh(new THREE.SphereGeometry(300, 32, 16), skyMat); sky.renderOrder = -10; scene.add(sky);

/* ---------- water ---------- */
export const waterU = { uT: { value: 0 }, uCam: { value: new THREE.Vector3() }, uSun: { value: SUN }, uRip: { value: new THREE.Vector4(0, 1.4, -1, 0) }, uRip2: { value: new THREE.Vector4(0, 0, -1, 0) }, uRain: { value: 0 }, uCalm: { value: 1 } };
const waterMat = new THREE.ShaderMaterial({ uniforms: waterU, side: THREE.DoubleSide,
  vertexShader: 'varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }',
  fragmentShader: `
varying vec3 vW; uniform float uT; uniform vec3 uCam; uniform vec4 uRip; uniform vec4 uRip2; uniform float uRain; uniform float uCalm;
${SKY}
${FLOORFN}
float hash21(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float ring(vec2 p, vec4 r){ if (r.z < 0.) return 0.; float d = length(p - r.xy); float front = r.z * 1.7;
  return r.w * .022 * sin(d * 34. - r.z * 20.) * exp(-d * 1.1) * smoothstep(0., .12, r.z) * (1. - smoothstep(front, front + .35, d)) / (1. + r.z * 1.2); }
float hgt(vec2 p, float dist){
  float t = uT, s = 0.;
  float f1 = 1. - smoothstep(25., 90., dist), f2 = 1. - smoothstep(10., 40., dist), f3 = 1. - smoothstep(4., 16., dist), f4 = 1. - smoothstep(1.5, 7., dist), f5 = 1. - smoothstep(.8, 3.5, dist);
  s += .020 * sin(dot(p, vec2(1.3, .4)) * 2.1 + t * 1.7);
  s += .013 * sin(dot(p, vec2(-.6, 1.1)) * 3.3 + t * 2.3) * f1;
  s += .007 * sin(dot(p, vec2(.9, -1.4)) * 6.7 + t * 3.1) * f1;
  s += .0038 * sin(dot(p, vec2(-1.7, -.5)) * 13. + t * 4.5) * f2;
  s += .0022 * sin(dot(p, vec2(.3, 2.1)) * 27. + t * 6.2) * f3;
  s += .0011 * sin(dot(p, vec2(2.0, .7)) * 55. + t * 8.1) * f4;
  s += .0006 * sin(dot(p, vec2(-.8, 1.9)) * 110. + t * 11.) * f5;
  s *= uCalm;
  s += ring(p, uRip) + ring(p, uRip2);
  if (uRain > 0. && dist < 9.){ // rain rings on a jittered grid
    vec2 c = floor(p / .22); for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++){ vec2 cc = c + vec2(float(i), float(j)); float h = hash21(cc);
      vec2 o = (cc + .5 + (vec2(hash21(cc + 7.3), hash21(cc + 2.9)) - .5) * .8) * .22; float ph = fract(uT * .55 + h); float d = length(p - o);
      s += uRain * (1. - smoothstep(4., 9., dist)) * .004 * sin(d * 150. - ph * 22.) * (1. - ph) * smoothstep(ph * .2 + .03, ph * .2, d) ; } }
  return s;
}
void main(){
  vec2 p = vW.xz; float dd = length(uCam - vW); float e = .006 + dd * .0016;
  float h0 = hgt(p, dd), hx = hgt(p + vec2(e, 0.), dd), hz = hgt(p + vec2(0., e), dd);
  vec3 N = normalize(vec3(-(hx - h0) / e, 1., -(hz - h0) / e));
  vec3 V = normalize(uCam - vW); float dist = length(uCam - vW);
  vec3 hor = vec3(.965,.980,.992);
  if (uCam.y < 0.){ // seen from below: bright surface with a soft Snell window
    float k = pow(max(dot(-V, N), 0.), 1.5); vec3 c = mix(vec3(.50,.83,.92), vec3(.97,1.,1.), k);
    c = mix(c, vec3(.62,.88,.94), smoothstep(2., 14., dist)); gl_FragColor = vec4(c, 1.); return; }
  float F = .025 + .975 * pow(1. - max(dot(N, V), 0.), 5.);
  vec3 R = reflect(-V, N); R.y = abs(R.y);
  vec3 skyc = skyColor(R);
  vec3 T = refract(-V, N, 1. / 1.33); float tt = 2.0 / max(-T.y, .08); vec2 fp = p + T.xz * tt;
  vec3 fl = floorColor(fp, uT, dist);
  vec3 under = mix(fl, vec3(.44,.80,.90), 1. - exp(-tt * .16));
  vec3 col = mix(under, skyc, F);
  col = mix(col, hor, smoothstep(18., 110., dist));
  gl_FragColor = vec4(col, 1.);
}` });
export const water = new THREE.Mesh(new THREE.PlaneGeometry(700, 700), waterMat); water.rotation.x = -Math.PI / 2; water.position.set(0, 0, 150); scene.add(water);

/* floor + wall for underwater and POV views */
const floorMat = new THREE.ShaderMaterial({ uniforms: waterU,
  vertexShader: 'varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }',
  fragmentShader: `varying vec3 vW; uniform float uT; uniform vec3 uCam; ${FLOORFN} void main(){ float d = length(uCam - vW); vec3 c = floorColor(vW.xz, uT, d); c = mix(c, vec3(.60,.87,.94), 1. - exp(-d * .07)); gl_FragColor = vec4(c, 1.); }` });
export const floor = new THREE.Mesh(new THREE.PlaneGeometry(120, 160), floorMat); floor.rotation.x = -Math.PI / 2; floor.position.set(0, -2, 78); scene.add(floor);

/* ---------- environment for standard materials ---------- */
{
  const env = new THREE.Scene();
  env.add(new THREE.Mesh(new THREE.SphereGeometry(10, 32, 16), new THREE.ShaderMaterial({ side: THREE.BackSide, uniforms: { uSun: { value: SUN } },
    vertexShader: 'varying vec3 p; void main(){ p = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }',
    fragmentShader: `varying vec3 p; ${SKY} void main(){ vec3 c = p.y > 0. ? skyColor(p) : mix(vec3(.50,.80,.90), vec3(.16,.34,.52), clamp(-p.y * 1.4, 0., 1.));
      c += vec3(.9,.3,.8) * exp(-pow(length(p - normalize(vec3(-1.,.25,.5))), 2.) * 6.) * .8;
      c += vec3(.1,.9,.8) * exp(-pow(length(p - normalize(vec3(1.,.1,.4))), 2.) * 6.) * .8;
      gl_FragColor = vec4(c, 1.); }` })));
  const pm = new THREE.PMREMGenerator(renderer); scene.environment = pm.fromScene(env, .01).texture;
}
scene.add(new THREE.HemisphereLight('#ffffff', '#bfe6f2', 1.0));
const key = new THREE.DirectionalLight('#fffaf0', 1.6); key.position.copy(SUN).multiplyScalar(20); scene.add(key);

/* ---------- pool hardware: wall, deck, blocks, lane ropes ---------- */
const std = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: .55, metalness: 0 }, o));
function wallTex() {
  const c = document.createElement('canvas'); c.width = 2048; c.height = 512; const g = c.getContext('2d');
  g.fillStyle = '#f2f6f9'; g.fillRect(0, 0, 2048, 512);
  g.strokeStyle = 'rgba(120,150,170,.35)'; g.lineWidth = 2; for (let x = 0; x <= 2048; x += 32) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 512); g.stroke(); } for (let y = 0; y <= 512; y += 32) { g.beginPath(); g.moveTo(0, y); g.lineTo(2048, y); g.stroke(); }
  // 8 lanes across 20 m: touch pads with a cross
  for (let k = 0; k < 8; k++) { const cx = (k + .5) * 256; g.fillStyle = '#ffd94a'; g.fillRect(cx - 108, 30, 216, 300); g.fillStyle = '#10182a'; g.fillRect(cx - 12, 60, 24, 240); g.fillRect(cx - 70, 110, 140, 24); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}
const wall = new THREE.Mesh(new THREE.PlaneGeometry(20, 2.4), new THREE.MeshBasicMaterial({ map: wallTex() })); wall.position.set(0, -.9, 0); scene.add(wall);
const deck = new THREE.Mesh(new THREE.BoxGeometry(60, .5, 30), std('#f4f6f8', { roughness: .8 })); deck.position.set(0, .05, -15.001); scene.add(deck);
function numTex(n) { const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d'); g.fillStyle = '#10182a'; g.fillRect(0, 0, 256, 256); g.fillStyle = '#fff'; g.font = '800 190px "Inter Display", Inter, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(String(n), 128, 140); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; }
for (let k = -3; k <= 4; k++) {
  const x = (k - .5) * 2.5 + 1.25 - 1.25 + 0; const bx = k * 2.5 - 1.25 + 1.25;
  const lane = 4 + k; const X = k * 2.5;
  const b = new THREE.Mesh(new THREE.BoxGeometry(.62, .42, .7), std('#e9edf1', { roughness: .4 })); b.position.set(X, .51, -.42); b.rotation.x = .12; scene.add(b);
  const pl = new THREE.Mesh(new THREE.PlaneGeometry(.4, .3), new THREE.MeshBasicMaterial({ map: numTex(lane) })); pl.position.set(X, .5, -.055); scene.add(pl);
}
{ // lane ropes: instanced floats
  const xs = []; for (let k = -4; k <= 3; k++) xs.push(k * 2.5 + 1.25);
  const per = 420, geo = new THREE.CylinderGeometry(.055, .055, .092, 12); geo.rotateX(Math.PI / 2);
  const ropes = new THREE.InstancedMesh(geo, std('#ffffff', { roughness: .35 }), xs.length * per);
  const M = new THREE.Matrix4(), col = new THREE.Color(); let n = 0;
  xs.forEach((x, r) => { for (let i = 0; i < per; i++) { const z = .06 + i * .1; M.makeTranslation(x, .012 + .006 * Math.sin(z * 2.1 + r), z); ropes.setMatrixAt(n, M);
    const near = z < 5; const band = Math.floor(i / 5) % 2; col.set(near ? (band ? '#e3343f' : '#ffffff') : (band ? '#2f8fd8' : '#ffffff')); if (Math.abs(x) < 2 && !near && band) col.set('#f2c230'); ropes.setColorAt(n, col); n++; } });
  ropes.instanceMatrix.needsUpdate = true; ropes.instanceColor.needsUpdate = true; scene.add(ropes);
}

/* ---------- water droplets (custom refractive look) ---------- */
const dropMat = (inst) => new THREE.ShaderMaterial({ transparent: true, depthWrite: false, uniforms: { uSun: { value: SUN }, uCam: waterU.uCam, uA: { value: 1 } },
  vertexShader: `varying vec3 vN; varying vec3 vP; void main(){ ${inst ? 'mat4 m = modelMatrix * instanceMatrix;' : 'mat4 m = modelMatrix;'} vec4 w = m * vec4(position, 1.); vP = w.xyz; vN = normalize(mat3(m) * normal); gl_Position = projectionMatrix * viewMatrix * w; }`,
  fragmentShader: `varying vec3 vN; varying vec3 vP; uniform vec3 uCam; uniform float uA; ${SKY}
vec3 world(vec3 d){ return d.y > 0. ? skyColor(d) : mix(vec3(.55,.86,.94), vec3(.10,.42,.62), clamp(-d.y * 1.5, 0., 1.)); }
void main(){ vec3 N = normalize(vN), V = normalize(uCam - vP); if (dot(N, V) < 0.) N = -N; float nv = max(dot(N, V), 0.); float f = pow(1. - nv, 2.4);
  vec3 R = reflect(-V, N); vec3 T = refract(-V, N, .72); T.y = -T.y; // a drop shows the world upside-down
  vec3 inner = world(T); inner = mix(inner, inner * inner * 1.05, .55);
  vec3 c = mix(inner, world(R), .08 + .6 * f);
  float sp = pow(max(dot(R, uSun), 0.), 140.); float sp2 = pow(max(dot(reflect(-V, -N), uSun), 0.), 30.) * .35;
  float rim = smoothstep(.45, .98, f); c = mix(c, vec3(.05,.22,.36), rim * .55);
  c += vec3(1.) * (sp * 2.2 + sp2);
  float a = clamp(.20 + .78 * smoothstep(.05, .9, f) + sp * 2. + sp2, 0., 1.);
  gl_FragColor = vec4(c, uA * a); }` });
const rnd = (s => () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; })(20261112);
export const SPL = { c: new THREE.Vector3(0, 0, 1.4) };
function makeDrops(n, detail, rmin, rmax, kind) {
  const m = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, detail), kind === 'iri' ? new THREE.MeshPhysicalMaterial({ color: '#eef0ff', metalness: 1, roughness: .06, iridescence: 1, iridescenceIOR: 2.1, iridescenceThicknessRange: [300, 1300], envMapIntensity: 1.3 }) : dropMat(true), n);
  m.frustumCulled = false; m.renderOrder = 5; const D = [];
  for (let i = 0; i < n; i++) { const a = rnd() * 6.2832, r0 = .10 + rnd() * .22, vr = .5 + rnd() * 2.3, vy = 1.6 + rnd() * 3.6, lean = rnd();
    D.push({ x: Math.cos(a) * r0, z: Math.sin(a) * r0, vx: Math.cos(a) * vr * (1 + .5 * lean), vz: Math.sin(a) * vr - .9 * lean, vy, r: rmin + (rmax - rmin) * Math.pow(rnd(), 2.4), t0: rnd() * .12, sq: .75 + rnd() * .6, ph: rnd() * 6.28 }); }
  m.userData.D = D; scene.add(m); return m;
}
export const drops = [makeDrops(1700, 1, .003, .012), makeDrops(170, 3, .010, .028), makeDrops(50, 3, .007, .018, 'iri')];
const M4 = new THREE.Matrix4(), Q = new THREE.Quaternion(), P3 = new THREE.Vector3(), S3 = new THREE.Vector3(), E3 = new THREE.Euler();
// tau: splash age in seconds; grow: 0..1 size fade
export function poseSplash(tau, alive = 1, drift = 0) {
  for (const m of drops) { const D = m.userData.D; m.visible = alive > .001 && tau > 0;
    if (!m.visible) continue;
    for (let i = 0; i < D.length; i++) { const d = D[i], t = Math.max(0, tau - d.t0); let y = d.vy * t - 4.905 * t * t; const born = Math.min(1, t / .05);
      const s = y < -.02 ? 0 : d.r * born * alive;
      P3.set(SPL.c.x + d.x + d.vx * t + .004 * Math.sin(drift * .7 + d.ph), Math.max(y, -.02) + .003 * Math.sin(drift + d.ph * 2.), SPL.c.z + d.z + d.vz * t);
      const st = 1 + Math.min(.9, Math.abs(d.vy - 9.81 * t) * .09) * (d.sq - .6); E3.set(d.ph + drift * .05, d.ph * 2., 0); Q.setFromEuler(E3);
      const dc = P3.distanceTo(camera.position), near = Math.min(1, Math.max(0, (dc - .16) / .16));
      S3.set(s / Math.sqrt(st), s * st, s / Math.sqrt(st)).multiplyScalar(near); M4.compose(P3, Q.identity(), S3); m.setMatrixAt(i, M4); }
    m.instanceMatrix.needsUpdate = true; }
}
// crown sheet
const crownGeo = new THREE.CylinderGeometry(1, 1, 1, 320, 40, true); crownGeo.translate(0, .5, 0);
const crownBase = crownGeo.attributes.position.array.slice();
export const crown = new THREE.Mesh(crownGeo, dropMat(false)); crown.material.side = THREE.DoubleSide; crown.renderOrder = 4; crown.frustumCulled = false; scene.add(crown);
export function poseCrown(tau, alive = 1) {
  crown.visible = tau > 0 && alive > .01 && tau < 1.4; if (!crown.visible) return;
  const p = crownGeo.attributes.position.array, R = .14 + .62 * Math.min(tau, .6), Hh = Math.max(0, 1.5 * tau - 2.4 * tau * tau) * .95;
  for (let i = 0; i < p.length; i += 3) { const x = crownBase[i], y = crownBase[i + 1], z = crownBase[i + 2], a = Math.atan2(z, x);
    const fing = .35 + .65 * Math.pow(.5 + .5 * Math.sin(a * 13. + 1.3 * Math.sin(a * 4.)), 3.);
    const hh = Hh * (y < .55 ? y : .55 + (y - .55) * fing * 2.2) , rr = R * (1 + .5 * y * y + .03 * Math.sin(a * 7. + y * 5.)) * (1 - .1 * Math.sin(a));
    p[i] = SPL.c.x + Math.cos(a) * rr; p[i + 1] = hh - .01; p[i + 2] = SPL.c.z + Math.sin(a) * rr * .9 - .18 * y * Math.min(tau, .4); }
  crownGeo.attributes.position.needsUpdate = true; crownGeo.computeVertexNormals(); crown.material.uniforms.uA.value = alive * .8;
}

/* ---------- billboards: footage with a matte ---------- */
const bbVS = 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }';
const bbFS = `varying vec2 vUv; uniform sampler2D uC; uniform sampler2D uM; uniform float uA; uniform float uHasM; uniform float uFade; uniform vec3 uTint; uniform float uGain;
void main(){ vec4 c = texture2D(uC, vUv); float a = uHasM > .5 ? texture2D(uM, vUv).r : c.a; a = smoothstep(.08, .92, a);
  float f = uFade > 0. ? pow(vUv.y, 1.6) : 1.; vec3 col = c.rgb * uGain + (1. - uGain) * 0.; col = mix(col, uTint, uFade * .25);
  gl_FragColor = vec4(col, a * uA * mix(1., f * .38, step(.001, uFade))); }`;
export function makeBB(aspect = 16 / 9) {
  const mk = (flip) => { const u = { uC: { value: null }, uM: { value: null }, uA: { value: 1 }, uHasM: { value: 1 }, uFade: { value: flip ? 1 : 0 }, uTint: { value: new THREE.Color(.75, .92, .97) }, uGain: { value: 1 } };
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.ShaderMaterial({ uniforms: u, vertexShader: bbVS, fragmentShader: bbFS, transparent: true, depthWrite: false, side: THREE.DoubleSide })); m.visible = false; m.frustumCulled = false; scene.add(m); return m; };
  const bb = { main: mk(false), refl: mk(true), aspect, tc: new THREE.Texture(), tm: new THREE.Texture() };
  for (const t of [bb.tc, bb.tm]) { t.minFilter = THREE.LinearFilter; t.magFilter = THREE.LinearFilter; t.generateMipmaps = false; }
  bb.tc.colorSpace = THREE.NoColorSpace; bb.main.renderOrder = 3; bb.refl.renderOrder = 2; bb.refl.material.depthTest = false;
  for (const m of [bb.main, bb.refl]) { m.material.uniforms.uC.value = bb.tc; m.material.uniforms.uM.value = bb.tm; }
  return bb;
}
const swapImage = (tex, img) => { if (!img || tex.image === img) return; if (tex.image && (tex.image.width !== img.width || tex.image.height !== img.height)) tex.dispose(); tex.image = img; tex.needsUpdate = true; };
export { swapImage };
export function setBBImage(bb, img, matte) {
  swapImage(bb.tc, img); if (matte) swapImage(bb.tm, matte);
  const has = matte ? 1 : 0; bb.main.material.uniforms.uHasM.value = has; bb.refl.material.uniforms.uHasM.value = has;
}
// place: centre position, width in metres, opacity; faces the camera unless a quaternion is given
export function poseBB(bb, pos, width, a, o = {}) {
  const m = bb.main; m.visible = a > .003; bb.refl.visible = false; if (!m.visible) return;
  m.position.copy(pos); m.scale.set(width, width / bb.aspect, 1);
  if (o.quat) m.quaternion.copy(o.quat); else { m.quaternion.copy(camera.quaternion); if (o.roll) m.rotateZ(o.roll); }
  m.material.uniforms.uA.value = a; m.renderOrder = o.order ?? 3;
  if (o.reflect) { const r = bb.refl; r.visible = true; r.position.set(pos.x, -pos.y - (o.reflOff || 0), pos.z); r.scale.set(width, -width / bb.aspect, 1); r.quaternion.copy(m.quaternion); r.quaternion.x *= -1; r.quaternion.z *= -1; r.material.uniforms.uA.value = a * o.reflect; }
}
export function hideBB(bb) { bb.main.visible = false; bb.refl.visible = false; }

/* ---------- exploded lens layers ---------- */
const OUTLINE = [[-1.0, .06], [-.9, .38], [-.55, .5], [0, .54], [.55, .56], [.92, .5], [1.08, .3], [1.12, -.02], [1.0, -.36], [.62, -.56], [.1, -.6], [-.42, -.52], [-.8, -.34]];
export const LENS_OUTLINE = OUTLINE;
function lensGeo() {
  const c = new THREE.CatmullRomCurve3(OUTLINE.map(([x, y]) => new THREE.Vector3(x, y, 0)), true, 'centripetal');
  const P = c.getPoints(720), RA = new Float32Array(721);
  for (let k = 0; k <= 720; k++) { const th = -Math.PI + k / 720 * 2 * Math.PI; let best = 0, bd = 9; for (const p of P) { const a = Math.atan2(p.y, p.x), d = Math.abs(Math.atan2(Math.sin(a - th), Math.cos(a - th))); if (d < bd) { bd = d; best = Math.hypot(p.x, p.y); } } RA[k] = best; }
  const R = th => { const f = (th + Math.PI) / (2 * Math.PI) * 720, i = Math.floor(f), u = f - i; return RA[i] * (1 - u) + RA[Math.min(720, i + 1)] * u; };
  const g = new THREE.SphereGeometry(1, 160, 110), p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i), th = Math.atan2(y, x), rho = Math.min(1, Math.hypot(x, y)), r = R(th) * Math.pow(rho, .9);
    const px = Math.cos(th) * r, py = Math.sin(th) * r, pz = Math.sign(z) * .03 * Math.pow(Math.abs(z), .3); p.setXYZ(i, px, py, pz - .34 * px * px - .12 * py * py); }
  g.computeVertexNormals(); return g;
}
const LG = lensGeo();
const lensU = { uSun: { value: SUN }, uCam: waterU.uCam, uA: { value: 1 } };
const mirrorMat = new THREE.ShaderMaterial({ uniforms: lensU, side: THREE.DoubleSide,
  vertexShader: 'varying vec3 vN; varying vec3 vP; varying vec3 vL; void main(){ vec4 w = modelMatrix * vec4(position, 1.); vP = w.xyz; vL = position; vN = normalize(mat3(modelMatrix) * normal); gl_Position = projectionMatrix * viewMatrix * w; }',
  fragmentShader: `varying vec3 vN; varying vec3 vP; varying vec3 vL; uniform vec3 uCam; ${SKY}
vec3 world(vec3 d){ return d.y > 0. ? skyColor(d) : mix(vec3(.55,.86,.94), vec3(.10,.42,.62), clamp(-d.y * 1.5, 0., 1.)); }
void main(){ vec3 N = normalize(vN), V = normalize(uCam - vP); if (dot(N, V) < 0.) N = -N; float nv = max(dot(N, V), 0.);
  float k = clamp(1. - nv + .22 * vL.x - .15 * vL.y, 0., 1.);
  vec3 iri = mix(vec3(.05,.82,.62), vec3(.16,.50,.98), smoothstep(.02, .32, k)); iri = mix(iri, vec3(.52,.28,.96), smoothstep(.28, .58, k)); iri = mix(iri, vec3(.98,.50,.42), smoothstep(.62, .95, k));
  vec3 R = reflect(-V, N); vec3 env = world(R); float f = pow(1. - nv, 3.);
  vec3 c = iri * (.42 + .62 * env) + env * (.10 + .5 * f);
  c += vec3(1.) * (pow(max(dot(R, uSun), 0.), 200.) * 2.5 + pow(max(dot(R, normalize(vec3(.4,.5,-.75))), 0.), 60.) * .35);
  gl_FragColor = vec4(c, 1.); }` });
export const layers = [new THREE.Mesh(LG, dropMat(false)), new THREE.Mesh(LG, mirrorMat), new THREE.Mesh(LG, dropMat(false))];
layers[0].material.side = layers[2].material.side = THREE.DoubleSide;
layers.forEach((l, i) => { l.visible = false; l.renderOrder = 6 + i; scene.add(l); });

/* ---------- colourway flock + cards ---------- */
export function makeSprite(img, aspect) { const t = new THREE.Texture(img); t.colorSpace = THREE.SRGBColorSpace; t.needsUpdate = true; t.anisotropy = 4;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1 / aspect), new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false, side: THREE.DoubleSide })); m.visible = false; m.renderOrder = 3; scene.add(m); return m; }
export function makeCard(aspect, round = 0) { // footage card with rounded corners (or a round loupe) drawn in the shader
  const u = { uC: { value: new THREE.Texture() }, uA: { value: 1 }, uAsp: { value: aspect }, uRound: { value: round } };
  u.uC.value.minFilter = THREE.LinearFilter; u.uC.value.generateMipmaps = false;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1 / aspect), new THREE.ShaderMaterial({ uniforms: u, transparent: true, side: THREE.DoubleSide, vertexShader: bbVS,
    fragmentShader: `varying vec2 vUv; uniform sampler2D uC; uniform float uA; uniform float uAsp; uniform float uRound;
void main(){ vec2 q = (vUv - .5) * vec2(uAsp, 1.); float d; vec2 uv = vUv;
  if (uRound > .5) { d = length(q) - .5; uv = vec2(.5 + (vUv.x - .5) * (9. / 16.) * 1.0 + .06, vUv.y); } else { vec2 b = vec2(uAsp, 1.) * .5 - .06; d = length(max(abs(q) - b, 0.)) - .06; }
  float a = 1. - smoothstep(-.004, .004, d);
  vec3 c = texture2D(uC, uv).rgb; float edge = smoothstep(uRound > .5 ? -.035 : -.02, uRound > .5 ? -.022 : -.004, d); c = mix(c, vec3(1.), edge * .96); gl_FragColor = vec4(c, a * uA); }` }));
  m.visible = false; m.renderOrder = 3; scene.add(m); return m; }
export { THREE, SUN };
export function render(wt) { waterU.uT.value = wt; waterU.uCam.value.copy(camera.position); renderer.render(scene, camera); return renderer.domElement; }
export function toScreen(v) { P3.copy(v).project(camera); return [(P3.x * .5 + .5) * W, (-P3.y * .5 + .5) * H, P3.z]; }
