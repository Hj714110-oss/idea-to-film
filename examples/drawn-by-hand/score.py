#!/usr/bin/env python3
"""Original stand-in score (used before the real track arrived) for 'A Mind, Drawn by Hand' — 112.35 BPM grid (B0 .076), 198.18 s.
Structure mirrors the 3:18 Track A grid: cold intro 0-8, big entry bar 8, quiet bars 36-44,
turn 60-68, silent dip 157.7-160.1 s, build 75-83, climax bar 83, piano tail."""
import numpy as np, json, subprocess, sys
from scipy.signal import fftconvolve, butter, sosfilt
SR = 44100; DUR = 198.18; BP = 60 / 112.35; B0 = 0.076; BAR = 4 * BP
n = int(DUR * SR); L = np.zeros(n); Rr = np.zeros(n)
rng = np.random.default_rng(7)
def bt(b): return B0 + b * BP          # beat index -> seconds
def add(sig, t, pan=0.0, g=1.0):
    i = int(t * SR)
    if i >= n or i + len(sig) <= 0: return
    s = sig[:max(0, n - i)] * g
    if i < 0: s = s[-i:]; i = 0
    L[i:i + len(s)] += s * np.sqrt(.5 * (1 - pan)); Rr[i:i + len(s)] += s * np.sqrt(.5 * (1 + pan))
def env(d, a=.005, r=None):
    m = int(d * SR); e = np.ones(m); k = max(1, int(a * SR)); e[:k] = np.linspace(0, 1, k)
    return e
def hz(m): return 440 * 2 ** ((m - 69) / 12)
T_ = lambda d: np.arange(int(d * SR)) / SR
def piano(m, d=2.4, v=.3):
    t = T_(d); f = hz(m); s = np.zeros_like(t)
    for h, a in [(1, 1), (2, .45), (3, .22), (4, .12), (5, .06), (6, .03)]:
        fh = f * h * (1 + .0004 * h * h)
        s += a * np.sin(2 * np.pi * fh * t) * np.exp(-t * (1.1 + .9 * h) * (f / 440) ** .25)
    att = np.minimum(1, t / .004); return v * s * att * np.exp(-t * .35)
def pad(ms, d, v=.06, bright=.5):
    t = T_(d); s = np.zeros_like(t)
    for m in ms:
        for det in (-.07, 0, .07):
            f = hz(m + det)
            for h in range(1, 6): s += (bright ** (h - 1)) / h * np.sin(2 * np.pi * f * h * t + rng.random() * 6)
    a = np.minimum(1, t / .9) * np.minimum(1, (d - t) / .9)
    return v * s * a / len(ms)
def bass(m, d, v=.32):
    t = T_(d); f = hz(m); s = np.sin(2 * np.pi * f * t) + .25 * np.sin(4 * np.pi * f * t)
    return v * s * np.minimum(1, t / .01) * np.exp(-t * 1.2) * np.minimum(1, (d - t) / .05)
def kick(v=.9):
    t = T_(.5); f = 45 + 95 * np.exp(-t * 28); ph = 2 * np.pi * np.cumsum(f) / SR
    return v * np.sin(ph) * np.exp(-t * 7.5)
def noise(d): return rng.standard_normal(int(d * SR))
def bp(x, lo, hi, o=2): return sosfilt(butter(o, [lo, hi], 'band', fs=SR, output='sos'), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, 'high', fs=SR, output='sos'), x)
def lp(x, f, o=2): return sosfilt(butter(o, f, 'low', fs=SR, output='sos'), x)
CLAP = bp(noise(.25), 900, 3200) * np.exp(-T_(.25) * 18) * .35
SNR = (bp(noise(.22), 1200, 6000) * .6 + np.sin(2 * np.pi * 190 * T_(.22)) * .4) * np.exp(-T_(.22) * 16) * .4
HAT = hp(noise(.07), 7000) * np.exp(-T_(.07) * 60) * .16
SHK = hp(noise(.12), 5000) * np.exp(-T_(.12) * 30) * .07
def bell(m, d=2.5, v=.12):
    t = T_(d); f = hz(m); mod = np.sin(2 * np.pi * f * 3.5 * t) * 2.2 * np.exp(-t * 2)
    return v * np.sin(2 * np.pi * f * t + mod) * np.exp(-t * 1.6)
def glass(m, v=.09):
    t = T_(1.6); f = hz(m); return v * (np.sin(2 * np.pi * f * t) + .3 * np.sin(2 * np.pi * f * 2.76 * t)) * np.exp(-t * 3)
def crash(v=.35):
    t = T_(3); return v * hp(noise(3), 4000) * np.exp(-t * 1.3)
def riser(d, v=.25):
    t = T_(d); x = hp(noise(d), 800) * (t / d) ** 2.2; return v * bp(x, 600, 9000)

# chords (D major): Bm7, Gmaj7, D, A  | turn: Bm, F#m, G, Em
PROG = [[47, 59, 62, 66, 69], [43, 59, 62, 66, 67], [38, 57, 62, 66, 69], [45, 57, 61, 64, 69]]
TURN = [[47, 59, 62, 66], [42, 57, 61, 66], [43, 59, 62, 67], [40, 59, 64, 67]]
MEL = [(0, 78), (1, 76), (1.5, 74), (2, 76), (3, 69), (4, 74), (5, 76), (6, 78), (6.5, 81), (7, 78)]
MEL2 = [(0, 81), (1, 78), (2, 76), (2.5, 78), (3, 74), (4, 76), (5, 74), (6, 71), (7, 73)]
NB = int((DUR - B0) / BAR) + 1
for b in range(NB):
    t0 = B0 + b * BAR
    if t0 > DUR: break
    ch = PROG[b % 4]
    inDip = 157.7 <= t0 + BAR and t0 < 160.1
    # ---- sections
    if b < 8:          # cold intro: drone + glass pings + ticks
        add(pad([ch[0] + 12, ch[2], ch[3]], BAR + .9, .035, .25), t0, 0)
        for k in range(4):
            if (b * 4 + k) % 3 == 0: add(glass([86, 90, 93, 88][(b + k) % 4]), bt(b * 4 + k) + .01, (k - 1.5) / 2)
        for k in range(8): add(HAT * .5, B0 + b * BAR + k * BP / 2, .3)
        if b >= 6: add(riser(BAR, .12), t0, 0)
        continue
    if 36 <= b < 44:   # quiet: piano + pad only
        add(pad(ch[1:], BAR + .9, .05, .35), t0)
        add(piano(ch[0] + 12, 3.5, .18), t0, -.2)
        for i, (k, m) in enumerate(MEL if b % 2 == 0 else MEL2):
            if k % 2 == 0 or b % 2: add(piano(m - 12 if b < 40 else m, 2.6, .17), t0 + k * BP / 2 + .006 * i, .25)
        continue
    if 60 <= b < 68:   # turn: darker progression, stutter, sub
        tc = TURN[b % 4]; add(pad(tc[1:], BAR + .9, .07, .6), t0)
        add(bass(tc[0] - 12, BAR, .4), t0)
        for k in range(4): add(kick(.8), bt(b * 4 + k))
        for k in range(16):
            if (k * 7 + b) % 5 == 0: add(glass(tc[1 + k % 3] + 24, .07), B0 + b * BAR + k * BP / 4, (k % 3 - 1) * .7)
        add(CLAP, bt(b * 4 + 1)); add(CLAP, bt(b * 4 + 3))
        for k in range(8): add(HAT, B0 + b * BAR + k * BP / 2 + BP / 4, .4)
        if b == 67: add(riser(BAR, .2), t0)
        continue
    if 68 <= b < 75:   # pull back + silent dip
        if inDip: continue
        add(pad(ch[1:], BAR + .9, .05, .3), t0)
        add(piano(ch[1], 3, .15), t0)
        if b >= 70: add(kick(.45), t0); add(kick(.35), t0 + 2 * BP)
        continue
    # ---- groove sections (8-36, 44-60, 75-83, 83-end)
    climax = b >= 83; build = 75 <= b < 83; dense = 44 <= b < 60
    end = b >= 91
    add(pad(ch[1:], BAR + .9, .06 if not climax else .075, .5), t0)
    if end:
        add(piano(62, 6, .25), t0); add(piano(66, 6, .18), t0 + .02); add(piano(69, 6, .16), t0 + .04); add(bell(86, 5, .08), t0)
        continue
    add(bass(ch[0] - 12, BP * 1.6), t0); add(bass(ch[0] - 12, BP * 1.4), t0 + 2.5 * BP, g=.8)
    # piano comp
    for k in (0, 1.5, 3):
        for j, m in enumerate(ch[1:]): add(piano(m, 1.6, .07), t0 + k * BP + j * .008, (j - 1.5) * .3)
    mel = MEL if (b // 2) % 2 == 0 else MEL2
    if b % 2 == 0 or dense or climax:
        for k, m in mel:
            if (b % 2 == 1) and k < 4: continue
            if (b % 2 == 0) and k >= 4 and not (dense or climax): continue
            add(piano(m, 2.2, .16), t0 + (k % 4) * BP, .2)
    # drums
    if build:
        q = 4 if b < 81 else 8
        for k in range(q): add(kick(.75), t0 + k * BAR / q)
        if b >= 79:
            r = 8 if b < 81 else 16
            for k in range(r): add(SNR * (.4 + .6 * k / r), t0 + k * BAR / r)
        if b == 81: add(riser(2 * BAR, .3), t0)
        for k in range(8): add(SHK, t0 + k * BP / 2)
    else:
        add(kick(), t0); add(kick(.75), t0 + 2 * BP)
        if dense or climax: add(kick(.55), t0 + 2.75 * BP)
        add(CLAP, t0 + BP); add(CLAP, t0 + 3 * BP)
        for k in range(8): add(HAT * (1 if k % 2 else .55), t0 + k * BP / 2, .35)
        if dense or climax:
            for k in range(16): add(SHK, t0 + k * BP / 4, -.3)
            arp = [ch[1] + 12, ch[2] + 12, ch[3] + 12, ch[2] + 24]
            for k in range(8): add(bell(arp[k % 4], .8, .05), t0 + k * BP / 2, (k % 2 - .5))
    if climax:
        add(pad([m + 12 for m in ch[1:]], BAR + .9, .04, .7), t0)
        if b % 4 == 0: add(bell(ch[2] + 24, 3, .1), t0)
# big hits
for b in (8, 44, 83): add(crash(), bt(4 * b)); add(kick(1.0), bt(4 * b))
add(crash(.25), bt(4 * 60)); add(crash(.2), bt(4 * 75))
# reverb
ir_t = T_(2.8); ir = rng.standard_normal(len(ir_t)) * np.exp(-ir_t * 2.4); ir = lp(ir, 6000); ir /= np.abs(ir).sum() ** .5 * 6
wetL = fftconvolve(L, ir)[:n]; wetR = fftconvolve(Rr, ir[::-1].copy() * .98 + np.roll(ir, 37) * .02)[:n]
# keep the dip silent (after reverb)
outL = L + wetL * .55; outR = Rr + wetR * .55
dip0, dip1 = int(157.7 * SR), int(160.1 * SR)
g = np.ones(n); g[dip0:dip1] = np.linspace(1, .05, dip1 - dip0) ** 2; g[dip1:dip1 + 2000] = np.linspace(.05, 1, 2000)
outL *= g; outR *= g
st = np.stack([outL, outR], 1); st = np.tanh(st / (np.abs(st).max() * .62)) * .9
fo = int(2.5 * SR); st[-fo:] *= np.linspace(1, 0, fo)[:, None]
import wave
pcm = (st * 32767).astype('<i2')
with wave.open('score.wav', 'wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', 'score.wav', '-c:a', 'aac', '-b:a', '256k', 'bgm_fade.m4a'], check=True)
# audio.js with the exact grid
mono = st.mean(1); hop = SR // 4
rms = np.sqrt(np.convolve(mono ** 2, np.ones(hop) / hop, 'same')[::hop]); rms = (rms / rms.max()).round(3).tolist()
beats = [round(B0 + k * BP, 4) for k in range(int((DUR - B0) / BP) + 1)]
json.dump({'beats': beats, 'bstr': [1] * len(beats), 'dur': DUR, 'rms': rms}, open('audio.json', 'w'))
open('audio.js', 'w').write('window.AUDIO=' + open('audio.json').read() + ';')
lv = [np.mean(rms[int((B0 + k * BAR) * 4):int((B0 + (k + 1) * BAR) * 4)] or [0]) for k in range(int(DUR / BAR))]
print('loudness per bar:', ''.join(str(min(9, int(v * 10))) for v in lv))
