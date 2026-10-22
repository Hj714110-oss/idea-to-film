#!/usr/bin/env python3
"""Final soundtrack: the re-arranged 雨瘾 beat + a 5.5 s rain tail for the credits.
Writes film/bgm.m4a and film/audio.js (exact bar grid of the beat + a 30 fps kick envelope for beat-reactive camera punches)."""
import json, numpy as np, soundfile as sf, subprocess
from scipy.signal import butter, sosfilt
y, sr = sf.read('music/arranged.wav'); B0, BP = 0.1802, 0.373579
rng = np.random.default_rng(23)
def band(x, lo, hi): return sosfilt(butter(2, [lo / (sr / 2), hi / (sr / 2)], btype='band', output='sos'), x)
# rain: soft hiss + sparse droplets; a whisper of it under the intro and the break, then alone in the tail
TAIL = 5.5; n = len(y) + int(TAIL * sr)
rain = band(rng.standard_normal(n), 900, 7000) * .5 + band(rng.standard_normal(n), 200, 900) * .25
for i in rng.integers(0, n - 2000, int(n / sr * 14)):
    d = np.exp(-np.arange(1500) / 120) * rng.uniform(.3, 1); rain[i:i + 1500] += band(rng.standard_normal(1500), 2000, 8000) * d * .6
rain /= np.abs(rain).max()
env = np.zeros(n); t = np.arange(n) / sr
def seg(a, b, lvl, f=1.5): m = (t >= a - f) & (t <= b + f); env[m] = np.maximum(env[m], lvl * np.clip(np.minimum((t[m] - a + f) / f, (b + f - t[m]) / f), 0, 1))
seg(0, 23.5, .06); seg(71.9, 95.5, .07); seg(len(y) / sr - 1, n / sr, .09, 1.0)
env[-int(1.6 * sr):] *= np.linspace(1, 0, int(1.6 * sr))
mix = np.zeros((n, 2)); mix[:len(y)] = y
mix[:, 0] += rain * env; mix[:, 1] += np.roll(rain, 4410) * env
mix /= max(1, np.abs(mix).max() / .98)
sf.write('final.wav', mix, sr)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', 'final.wav', '-c:a', 'aac', '-b:a', '256k', 'film/bgm.m4a'], check=True)
dur = n / sr
# kick envelope at 30 fps: low-band energy, normalised, fast attack / quick decay
lo = band(y.mean(1), 35, 130) ** 2; hop = sr // 30
e = np.array([lo[i * hop:(i + 1) * hop].mean() for i in range(int(len(y) / hop))]); e = np.sqrt(e); e /= np.percentile(e, 99.5)
on = np.maximum(0, np.diff(e, prepend=0)); k = np.zeros_like(on); acc = 0
for i, v in enumerate(on): acc = max(acc * .72, min(1, v * 2.2)); k[i] = acc
k = np.concatenate([k, np.zeros(int(TAIL * 30) + 2)])
rms = [float(np.sqrt((mix[int(i * sr / 4):int((i + 1) * sr / 4)] ** 2).mean())) for i in range(int(dur * 4))]; m = max(rms)
beats = [round(B0 + i * BP, 4) for i in range(int((dur - B0) / BP))]
open('film/audio.js', 'w').write('window.AUDIO=' + json.dumps({'beats': beats, 'bstr': [1] * len(beats), 'dur': round(dur, 3), 'rms': [round(r / m, 3) for r in rms], 'kick': [round(float(x), 3) for x in k]}) + ';')
print('dur', round(dur, 2), 'kicks>0.5:', int((k > .5).sum()))
