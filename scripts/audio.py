#!/usr/bin/env python3
"""python3 audio.py music.(mp4|m4a|wav) out_dir  -> out_dir/audio.js, bgm.m4a, bgm_fade.m4a, grid report"""
import sys, os, json, subprocess, numpy as np, librosa
src, out = sys.argv[1], sys.argv[2]; os.makedirs(out, exist_ok=True)
wav = os.path.join(out, 'a.wav')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-ac', '1', '-ar', '22050', wav], check=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-vn', '-c:a', 'aac', '-b:a', '256k', os.path.join(out, 'bgm.m4a')], check=True)
y, sr = librosa.load(wav, sr=22050); dur = len(y) / sr
tempo, b = librosa.beat.beat_track(y=y, sr=sr, tightness=200); bt = librosa.frames_to_time(b, sr=sr)
oenv = librosa.onset.onset_strength(y=y, sr=sr); bstr = [float(oenv[min(len(oenv) - 1, f)]) for f in b]
m = max(bstr) or 1; bstr = [round(v / m, 3) for v in bstr]
rms = librosa.feature.rms(y=y, hop_length=sr // 4)[0]; rms = (rms / (rms.max() or 1)).round(3).tolist()
json.dump({'beats': [round(float(t), 4) for t in bt], 'bstr': bstr, 'dur': round(dur, 3), 'rms': rms}, open(os.path.join(out, 'audio.json'), 'w'))
open(os.path.join(out, 'audio.js'), 'w').write('window.AUDIO=' + open(os.path.join(out, 'audio.json')).read() + ';')
i = np.arange(len(bt)); BP, B0 = np.polyfit(i, bt, 1); bar = 4 * BP
# music end (last time rms > 5% of max) and fade
active = np.where(np.array(rms) > .05)[0]; mend = (active[-1] + 1) / 4 if len(active) else dur
fade = min(2.5, dur * .02)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', os.path.join(out, 'bgm.m4a'), '-af', f'afade=t=out:st={dur - fade:.2f}:d={fade:.2f}', '-c:a', 'aac', '-b:a', '256k', os.path.join(out, 'bgm_fade.m4a')], check=True)
print(f'tempo {float(np.atleast_1d(tempo)[0]):.2f} BPM | BP {BP:.5f} | B0 {B0:.4f} | bar {bar:.3f}s | phrase(8 bars) {8 * bar:.2f}s | dur {dur:.2f}s | music ends ~{mend:.1f}s')
# loudness per bar, accents, quiet stretches -> use to place hits, the quiet chapter, the dip
r = np.array(rms); nb = int(dur / bar)
lv = [float(r[int((B0 + k * bar) * 4):int((B0 + (k + 1) * bar) * 4)].mean()) if int((B0 + k * bar) * 4) < len(r) else 0 for k in range(nb)]
print('loudness per bar (0-9):', ''.join(str(min(9, int(v * 10))) for v in lv))
jumps = [k for k in range(1, nb) if lv[k] - lv[k - 1] > .12]
print('big entries at bars:', jumps, '->', [round(float(B0 + k * bar), 2) for k in jumps], 's')
pk = librosa.util.peak_pick(oenv, pre_max=20, post_max=20, pre_avg=40, post_avg=40, delta=oenv.std() * 2.5, wait=40)
acc = librosa.frames_to_time(pk, sr=sr)
off = [(round(float(t), 2), round(float((t - B0) / bar), 2)) for t in acc if abs(((t - B0) / bar) % 1 - .5) < .45 and abs(((t - B0) / bar) % 1) > .08]
print('accents (time, bar):', [(round(float(t), 2), round(float((t - B0) / bar), 2)) for t in acc][:40])
dips = [round(i / 4, 2) for i in range(1, len(r) - 1) if r[i] < .08 and r[i - 1] >= .08 and i / 4 < dur - 4]
print('dips (rms drop) at s:', dips[:10])
