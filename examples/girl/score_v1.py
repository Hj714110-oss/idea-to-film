#!/usr/bin/env python3
"""Original score for 《总说「你说得对」的女孩》 — synthesised from scratch (no samples).
92 BPM, C major / A minor. Motif "fifty-one": scale degree 5 -> 1 (G -> C). Its wrong twin, "fifty-four", is 5 -> 4 (G -> F) and never resolves.
Arrangement follows timeline.json (one section per scene). Writes bgm.wav + audio.js (exact beat grid)."""
import json, numpy as np
from scipy.io import wavfile
from scipy.signal import fftconvolve, butter, sosfilt

TL = json.load(open('timeline.json')); BPM = TL['bpm']; BEAT = 60 / BPM; BAR = 4 * BEAT
SR = 44100; DUR = TL['bars'] * BAR + 0.4
N = int(SR * DUR); L = np.zeros(N); R = np.zeros(N); VL = np.zeros(N); VR = np.zeros(N)   # dry + reverb send
rng = np.random.default_rng(51)
mtof = lambda m: 440 * 2 ** ((m - 69) / 12)
SCN = {s['name']: s for s in TL['scenes']}
def st(name): return SCN[name]['bar'] * BAR
def sub(name, k, end=False): s = SCN[name]; return st(name) + s['subs'][k][1 if end else 0]

def add(sig, t, pan=0.0, gain=1.0, verb=0.25):
    i = int(t * SR)
    if i >= N or i + len(sig) <= 0: return
    j0 = max(0, -i); s = sig[j0:]; i = max(0, i); s = s[:N - i] * gain
    gl, gr = np.sqrt(0.5 * (1 - pan)), np.sqrt(0.5 * (1 + pan))
    L[i:i + len(s)] += s * gl; R[i:i + len(s)] += s * gr
    if verb: VL[i:i + len(s)] += s * gl * verb; VR[i:i + len(s)] += s * gr * verb

def ar(n, a, d):
    t = np.arange(n) / SR; return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d)
def lp(x, fc):
    return sosfilt(butter(2, fc / (SR / 2), output='sos'), x)
def noise(dur, lo, hi):
    n = int(SR * dur); x = rng.standard_normal(n); X = np.fft.rfft(x); fr = np.fft.rfftfreq(n, 1 / SR)
    X[(fr < lo) | (fr > hi)] = 0; y = np.fft.irfft(X, n); return y / (np.abs(y).max() + 1e-9)

# ---------- instruments ----------
def bell(f, dur=2.2, v=.16):           # music box / celesta
    n = int(SR * dur); t = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * t) + .3 * np.sin(2 * np.pi * f * 3.01 * t) * np.exp(-t * 6) + .08 * np.sin(2 * np.pi * f * 5.43 * t) * np.exp(-t * 10)
    return s * ar(n, .002, .7) * v
def piano(f, dur=2.5, v=.15):
    n = int(SR * dur); t = np.arange(n) / SR; s = np.zeros(n)
    for h, a in [(1, 1), (2, .45), (3, .22), (4, .1), (5, .05)]: s += a * np.sin(2 * np.pi * f * h * (1 + .0004 * h * h) * t) * np.exp(-t * (1.2 + h * .9))
    return s * np.minimum(1, t / .004) * v
def pluck(f, dur=.9, v=.11, bright=1.0):  # Karplus-ish guitar / koto
    n = int(SR * dur); p = max(2, int(SR / f)); buf = rng.uniform(-1, 1, p); out = np.zeros(n)
    for i in range(0, n, p):
        k = min(p, n - i); out[i:i + k] = buf[:k]; buf = .5 * (buf + np.roll(buf, -1)) * (.996 if bright > .5 else .985)
    return out * v * np.exp(-np.arange(n) / SR * 1.2)
def pad(freqs, dur, v=.05, att=.35, rel=.3, cut=2200):
    n = int(SR * dur); t = np.arange(n) / SR; s = np.zeros(n)
    for f in freqs:
        for det in (-.005, 0, .005): s += ((f * (1 + det) * t + rng.random()) % 1) * 2 - 1
    e = np.minimum(1, t / (dur * att)) * np.minimum(1, (dur - t) / (dur * rel))
    return lp(s, cut) * e * v / len(freqs)
def strings(freqs, dur, v=.06):
    n = int(SR * dur); t = np.arange(n) / SR; s = np.zeros(n)
    for f in freqs:
        vib = 1 + .003 * np.sin(2 * np.pi * 5.2 * t + rng.random() * 6)
        for det in (-.004, .004): ph = 2 * np.pi * np.cumsum(f * (1 + det) * vib) / SR; s += np.sin(ph) + .35 * np.sin(2 * ph) + .15 * np.sin(3 * ph)
    e = np.minimum(1, t / min(.9, dur * .4)) * np.minimum(1, (dur - t) / min(.8, dur * .3))
    return s * e * v / len(freqs)
def flute(f, dur, v=.09):
    n = int(SR * dur); t = np.arange(n) / SR; vib = 1 + .006 * np.sin(2 * np.pi * 5 * t) * np.minimum(1, t / .3)
    ph = 2 * np.pi * np.cumsum(f * vib) / SR; s = np.sin(ph) + .12 * np.sin(2 * ph) + .06 * noise(dur, 1500, 6000)
    return s * np.minimum(1, t / .06) * np.minimum(1, (dur - t) / .08) * v
def bass(f, dur, v=.3):
    n = int(SR * dur); t = np.arange(n) / SR; s = np.sin(2 * np.pi * f * t) + .25 * np.sin(4 * np.pi * f * t)
    return s * np.minimum(1, t / .01) * np.minimum(1, (dur - t) / .04) * v
def kick(v=.8):
    n = int(SR * .4); t = np.arange(n) / SR; f = 46 + 100 * np.exp(-t * 26); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 8) * v
def tom(f=110, v=.4):
    n = int(SR * .5); t = np.arange(n) / SR; ff = f * (1 + .5 * np.exp(-t * 30)); return np.sin(2 * np.pi * np.cumsum(ff) / SR) * np.exp(-t * 7) * v
def clap(v=.3):
    s = noise(.22, 900, 6000); t = np.arange(len(s)) / SR
    return s * (np.exp(-t * 22) + .6 * np.exp(-((t - .012) * 300) ** 2) + .5 * np.exp(-((t - .024) * 300) ** 2)) * v
def hat(v=.05, open_=False):
    s = noise(.3 if open_ else .06, 7000, 16000); t = np.arange(len(s)) / SR; return s * np.exp(-t * (12 if open_ else 60)) * v
def crash(v=.22):
    s = noise(2.5, 3000, 16000); t = np.arange(len(s)) / SR; return s * np.exp(-t * 1.6) * v
def riser(dur, v=.18):
    s = noise(dur, 500, 11000); t = np.arange(len(s)) / SR; return s * (t / dur) ** 2.3 * v
def whoosh(dur=.6, v=.14, up=True):
    s = noise(dur, 600, 9000) * np.hanning(int(SR * dur)); return s * v
def tone(f0, f1, dur, v):
    n = int(SR * dur); t = np.arange(n) / SR; f = f0 * (f1 / f0) ** (t / dur); return np.sin(2 * np.pi * np.cumsum(f) / SR) * ar(n, .004, dur / 2.5) * v

# ---------- sfx ----------
def ding(t, col='y'):      # Puff's alarm: two bright notes, a fourth apart
    base = {'y': 88, 'o': 86, 'r': 84}[col]
    add(bell(mtof(base), 1.2, .13), t, .45, verb=.4); add(bell(mtof(base + 5), 1.4, .12), t + .11, .45, verb=.4)
def scratch(t, dur=1.0, v=.05):
    n = int(SR * dur); s = noise(dur, 2500, 9000) * (0.4 + 0.6 * np.abs(np.sin(np.arange(n) / SR * 2 * np.pi * 5.5)))
    add(s * np.minimum(1, np.arange(n) / SR / .05) * np.minimum(1, (dur - np.arange(n) / SR) / .1) * v, t, -.15, verb=.05)
def thump(t, v=.25):
    add(tom(70, v), t, verb=.15); add(noise(.12, 200, 1200) * ar(int(SR * .12), .002, .03) * .1, t, verb=.15)
def shimmer(t, dur=2.0, v=.05, base=84):
    for k in range(int(dur * 9)):
        add(bell(mtof(base + [0, 2, 4, 7, 9, 12, 14][int(rng.random() * 7)]), .9, v * (.4 + .6 * rng.random())), t + k / 9 + rng.random() * .05, rng.uniform(-.7, .7), verb=.6)
def whisper(t, dur=3.0, v=.06):
    s = noise(dur, 1800, 7000); tt = np.arange(len(s)) / SR; e = np.sin(np.pi * tt / dur) ** 2 * (0.5 + 0.5 * np.sin(2 * np.pi * 3.1 * tt) ** 2)
    add(s * e * v, t, -.5, verb=.6); add(s[::-1] * e * v * .8, t + .3, .5, verb=.6)
def pop(t, v=.09): add(tone(500, 1500, .12, v), t, .2, verb=.2)
def motif(t, last=72, v=.17, inst=bell, pan=0):     # G -> C  (or G -> F for "54")
    add(inst(mtof(67 + 12 * (last >= 72 and False)), 2.2, v), t, pan, verb=.45); add(inst(mtof(last), 3.2, v * 1.05), t + BEAT, pan, verb=.5)

# ---------- harmony ----------
CH = {'C': [48, 60, 64, 67], 'Am': [45, 57, 60, 64], 'F': [41, 57, 60, 65], 'G': [43, 55, 59, 62], 'Em': [40, 55, 59, 64], 'Dm': [38, 57, 62, 65],
      'G/B': [47, 55, 59, 62], 'Fmaj7': [41, 57, 60, 64], 'Am9': [45, 59, 60, 64], 'Bb': [46, 58, 62, 65], 'E': [40, 56, 59, 64], 'Dm7': [38, 57, 60, 65],
      'G7': [43, 53, 59, 62], 'Cmaj7': [48, 59, 64, 67], 'A7': [45, 55, 61, 64], 'Csus': [48, 60, 65, 67], 'Fadd9': [41, 60, 65, 67]}
THEME = [[(0, 76, 1), (1, 74, 1), (2, 72, 1), (3, 67, 1)], [(0, 69, 1.5), (1.5, 72, .5), (2, 74, 1), (3, 76, 1)],
         [(0, 77, 1), (1, 76, 1), (2, 74, 1), (3, 72, 1)], [(0, 74, 2), (2, 67, 1), (3, 72, 1)]]
THEME_CH = ['C', 'Am', 'F', 'G']

def bars_of(name):
    s = SCN[name]; return [(st(name) + k * BAR, k) for k in range(s['bars'])]
def play_theme(name, inst=bell, v=.13, oct=0, bars=None, chords=True):
    for t0, k in bars_of(name):
        if bars is not None and k not in bars: continue
        for b, m, d in THEME[k % 4]: add(inst(mtof(m + oct), max(1.2, d * BEAT * 2.2), v), t0 + b * BEAT, .1, verb=.4)
def arp(t0, ch, inst=pluck, v=.08, pattern=(1, 2, 3, 2, 1, 2, 3, 2), step=.5, oct=0, pan=0):
    for i, idx in enumerate(pattern): add(inst(mtof(CH[ch][idx] + oct), 1.0, v), t0 + i * step * BEAT, pan + (.25 if i % 2 else -.25), verb=.3)
def drums(t0, kind='soft', fill=False):
    for b in range(4):
        tb = t0 + b * BEAT
        if kind == 'four': add(kick(.75), tb, verb=0); add(hat(.04), tb + BEAT / 2, .3, verb=0)
        elif kind == 'soft':
            if b in (0, 2): add(kick(.55), tb, verb=0)
        elif kind == 'big':
            if b in (0, 2) or (b == 3 and fill): add(kick(.85), tb, verb=0)
            if b in (1, 3): add(clap(.28), tb, .05, verb=.15)
            add(hat(.04), tb, .3, verb=0); add(hat(.03), tb + BEAT / 2, .3, verb=0)
        if kind in ('four',) and b in (1, 3): add(clap(.24), tb, .05, verb=.15)
        if kind == 'hand': add(tom(150 if b % 2 else 105, .22), tb, -.2, verb=.1); add(tom(190, .12), tb + BEAT * .75, .2, verb=.1)

# ================= sections =================
# hook (5 bars): clockwork music box, the quill, Puff's ding, the buried 51
h = st('hook')
for t0, k in bars_of('hook'):
    if k < 4:
        ch = ['Fmaj7', 'Cmaj7', 'Fmaj7', 'G'][k]
        for i, m in enumerate([0, 2, 1, 3, 0, 2, 1, 3]): add(bell(mtof(CH[ch][1 + m % 3] + 12), 1.1, .07), t0 + i * BEAT / 2, (.3 if i % 2 else -.3), verb=.35)
        for b in range(4): add(hat(.022), t0 + b * BEAT, .4, verb=0)    # tick
        add(pad([mtof(n) for n in CH[ch][1:]], BAR, .03, .2, .2), t0)
thump(h + .5); scratch(h + 1.0, .7); [scratch(h + x, .25, .035) for x in (1.8, 2.4, 3.0, 3.6, 4.0)]
ding(h + 4.6, 'y'); scratch(h + 5.6, .8); add(whoosh(.5, .07), h + 8.0, verb=.2)
motif(h + 4 * BAR - 2 * BEAT, 72, .2)                     # G -> C on the found "51"
add(riser(2 * BEAT, .16), h + 4 * BAR + 2 * BEAT, verb=.1)

# title (6): first big entry
add(crash(.2), st('title')); add(kick(.9), st('title'), verb=0)
TC = ['C', 'G/B', 'Am', 'F', 'C', 'G']
for t0, k in bars_of('title'):
    ch = TC[k]; add(strings([mtof(n) for n in CH[ch][1:]], BAR * 1.05, .07), t0, verb=.5); add(bass(mtof(CH[ch][0] - 12), BAR * .95, .22), t0, verb=.05)
    arp(t0, ch, v=.06); drums(t0, 'soft')
play_theme('title', bell, .12)

# white room (5): cold, sparse; the letter; the guardians' whisper
for t0, k in bars_of('white'):
    ch = ['Am9', 'Fmaj7', 'Am9', 'Fmaj7', 'Am9'][k]; add(pad([mtof(n + 12) for n in CH[ch][1:]], BAR * 1.02, .06, .3, .3, 3500), t0)
    for b in range(4): add(hat(.018), t0 + b * BEAT, .4, verb=0)
    add(bell(mtof(CH[ch][3] + 12), 2, .09), t0 + BEAT * 2.5, -.3, verb=.6)
thump(sub('white', 1) - .4); whisper(sub('white', 2) - .2, 3.6, .07)
add(bass(mtof(33), BAR * 2, .16), sub('white', 2), verb=.2)

# apology (4): drone + tremolo; the wrong motif (G -> F, unresolved)
a0 = st('apology')
for t0, k in bars_of('apology'):
    s = strings([mtof(45), mtof(57), mtof(60)], BAR * 1.02, .08); s *= .7 + .3 * np.sin(2 * np.pi * 7 * np.arange(len(s)) / SR); add(s, t0, verb=.5)
scratch(a0 + .8, 2.6, .045); motif(sub('apology', 1) - .2, 65, .15, piano)

# service stair (5): warmth arrives — the real motif
for t0, k in bars_of('stair'):
    ch = ['F', 'C', 'Am', 'G', 'F'][k]; arp(t0, ch, v=.075); add(pad([mtof(n) for n in CH[ch][1:]], BAR * 1.02, .035), t0)
    if k >= 2: add(bass(mtof(CH[ch][0] - 12), BAR * .9, .16), t0)
motif(sub('stair', 0), 72, .2, piano)

# books (12): warm conversation, brushed pulse from bar 4
BC = ['Am', 'F', 'C', 'G']
for t0, k in bars_of('books'):
    ch = BC[k % 4]; arp(t0, ch, v=.065, pattern=(1, 3, 2, 3, 1, 3, 2, 3)); add(pad([mtof(n) for n in CH[ch][1:]], BAR * 1.02, .032), t0)
    add(bass(mtof(CH[ch][0] - 12), BAR * .9, .15), t0)
    if 3 <= k < 11: drums(t0, 'soft')
    if k in (5, 9): play_theme('books', piano, .07, bars=[k])
pop(sub('books', 7, True) - .6)

# neon (4): bouncy four-on-the-floor
NC = ['Dm7', 'G7', 'Cmaj7', 'A7']
for t0, k in bars_of('neon'):
    ch = NC[k]; drums(t0, 'four')
    for b in range(8): add(bass(mtof(CH[ch][0] - 12 + (12 if b % 2 else 0)), BEAT * .4, .2), t0 + b * BEAT / 2, verb=0)
    arp(t0, ch, inst=lambda f, d, v: bell(f, .5, v), v=.06, pattern=(1, 2, 3, 2, 3, 2, 1, 3), oct=12)
add(kick(1), sub('neon', 1), verb=0); add(crash(.16), sub('neon', 1)); add(clap(.4), sub('neon', 1), verb=.3)

# harbor (11): lanterns — pentatonic koto plucks over hand drums
PENT = [60, 62, 64, 67, 69, 72, 74, 76]
HC = ['C', 'Am', 'F', 'C', 'C', 'Am', 'F', 'G', 'Am', 'F', 'C']
for t0, k in bars_of('harbor'):
    ch = HC[k]; add(pad([mtof(n) for n in CH[ch][1:]], BAR * 1.02, .03, .3, .3, 1600), t0); add(bass(mtof(CH[ch][0] - 12), BAR * .9, .14), t0)
    if k < 10: drums(t0, 'hand')
    for i in range(8):
        if rng.random() < .7: add(pluck(mtof(PENT[int(rng.random() * 8)]), 1.2, .07), t0 + i * BEAT / 2, rng.uniform(-.5, .5), verb=.4)

# letter (8): the dip — near silence, the letter falling; a heartbeat; resolve to climb
l0 = st('letter'); shimmer(l0, 2.2, .05, 79)
for t0, k in bars_of('letter'):
    ch = ['Am', 'Am', 'F', 'F', 'Am', 'F', 'G', 'G'][k]
    add(pad([mtof(n) for n in CH[ch][1:]], BAR * 1.02, .04 + .005 * k, .3, .3, 1400), t0)
    if k >= 2: add(kick(.4), t0, verb=0); add(kick(.28), t0 + BEAT * .75, verb=0)    # heartbeat
    if k >= 4: add(bass(mtof(CH[ch][0] - 12), BAR * .9, .12), t0)
add(riser(BAR * 2, .14), l0 + 6 * BAR)

# climb (8): flute rope of notes + toms, building
CC = ['F', 'G', 'Am', 'Am', 'F', 'G', 'C', 'E']
FL = [[69, 72, 74, 76], [74, 76, 79, 81], [76, 74, 72, 69], [72, 74, 76, 79], [77, 76, 74, 72], [74, 76, 79, 83], [84, 79, 76, 72], [80, 83, 88, 88]]
for t0, k in bars_of('climb'):
    ch = CC[k]; add(strings([mtof(n) for n in CH[ch][1:]], BAR * 1.02, .06 + .005 * k), t0, verb=.4)
    for b in range(8): add(bass(mtof(CH[ch][0] - 12), BEAT * .42, .2), t0 + b * BEAT / 2, verb=0)
    for i, m in enumerate(FL[k]): add(flute(mtof(m), BEAT * .95, .08), t0 + i * BEAT, .2, verb=.45)
    add(kick(.7), t0, verb=0); add(kick(.6), t0 + 2 * BEAT, verb=0)
    for b in range(4): add(tom(120 + 30 * (b % 2), .15 + .02 * k), t0 + b * BEAT + BEAT / 2, -.2, verb=.1)
    add(hat(.03), t0 + BEAT, .3, verb=0); add(hat(.03), t0 + 3 * BEAT, .3, verb=0)
add(riser(BAR, .2), st('climb') + 7 * BAR)

# crowd (13): tension — pulsing A, Bb crushing it; Puff cycling; drop at "I'm not going to write it for you"; calm at "It's okay"
c0 = st('crowd'); drop = sub('crowd', 6); calm = sub('crowd', 10)
for t0, k in bars_of('crowd'):
    ch = ['Am', 'Bb', 'Am', 'Bb', 'Dm', 'Bb', 'E', 'E', 'Am', 'F', 'F', 'C', 'C'][k]
    if t0 < drop - .1:
        for b in range(8): add(bass(mtof(45 - 12 + (1 if ch == 'Bb' else 0)), BEAT * .38, .18), t0 + b * BEAT / 2, verb=0)
        add(strings([mtof(n + 12) for n in CH[ch][1:]], BAR * 1.02, .055), t0, verb=.35)
        for b in range(4): add(hat(.03), t0 + b * BEAT, .4, verb=0)
        add(kick(.5), t0, verb=0)
    else:
        add(pad([mtof(n) for n in CH[ch][1:]], BAR * 1.02, .05, .3, .3, 1500), t0)
        if t0 >= calm - BAR: add(bell(mtof(CH[ch][3] + 12), 2.4, .05), t0 + BEAT, verb=.6)
ding(sub('crowd', 1) + .3, 'y'); ding(sub('crowd', 2) + .3, 'o'); ding(sub('crowd', 3) + .2, 'r'); ding(sub('crowd', 4) + .2, 'r')
add(strings([mtof(53), mtof(60), mtof(65), mtof(69)], 5.0, .06), calm, verb=.6)

# card (6): writing; near silence; send; one empty beat
k0 = st('card'); kend = st('wings')
for t0, k in bars_of('card'):
    ch = ['F', 'C', 'Am', 'G', 'F', 'G'][k]
    add(pad([mtof(n) for n in CH[ch][1:]], BAR * 1.02, .045, .3, .3, 1300), t0)
    add(piano(mtof(CH[ch][1]), 3, .08), t0, verb=.5); add(piano(mtof(CH[ch][3] + 12), 3, .065), t0 + 2 * BEAT, verb=.5)
for x in np.arange(k0 + 1.0, k0 + 12.0, .9): scratch(x, .7, .03)
add(whoosh(.9, .16), kend - 2.2, verb=.5); add(riser(1.4, .1), kend - 1.6)

# wings (4): the big hit
add(crash(.3), kend); add(kick(1.0), kend, verb=0); add(whoosh(1.4, .2), kend, verb=.6)
for i in range(18): add(noise(.08, 2000, 8000) * ar(int(SR * .08), .002, .02) * .05, kend + .05 + i * .07 + rng.random() * .04, rng.uniform(-.8, .8), verb=.3)   # paper
WC = ['F', 'G', 'Am', 'C']
for t0, k in bars_of('wings'):
    ch = WC[k]; add(strings([mtof(n) for n in CH[ch][1:]] + [mtof(CH[ch][1] + 12)], BAR * 1.04, .11), t0, verb=.5)
    add(bass(mtof(CH[ch][0] - 12), BAR * .95, .26), t0); drums(t0, 'big', k == 3)
    for b, m, d in THEME[k % 4]: add(bell(mtof(m + 12), 2, .1), t0 + b * BEAT, verb=.45); add(strings([mtof(m)], d * BEAT * 1.1, .06), t0 + b * BEAT, verb=.4)

# reply (4): bright
shimmer(st('reply'), 1.6, .045, 84)
for t0, k in bars_of('reply'):
    ch = ['C', 'G/B', 'Am', 'F'][k]; add(strings([mtof(n) for n in CH[ch][1:]], BAR * 1.02, .07), t0, verb=.5); add(bass(mtof(CH[ch][0] - 12), BAR * .9, .2), t0)
    arp(t0, ch, inst=lambda f, d, v: bell(f, .9, v), v=.06, oct=12); drums(t0, 'soft')

# dawn (9): gentle, no drums
DC = ['F', 'C', 'G', 'Am', 'F', 'C', 'Dm', 'G', 'Csus']
for t0, k in bars_of('dawn'):
    ch = DC[k]; add(pad([mtof(n) for n in CH[ch][1:]], BAR * 1.02, .034, .3, .3, 1800), t0); add(bass(mtof(CH[ch][0] - 12), BAR * .9, .12), t0)
    arp(t0, ch, v=.06, pattern=(1, 2, 3, 2, 3, 2, 1, 2))
    if k in (2, 6): play_theme('dawn', piano, .06, bars=[k])

# glide (4): second climax — theme in full
g0 = st('glide'); add(crash(.24), g0); add(kick(.9), g0, verb=0); add(whoosh(1.2, .14), g0 + BAR * 2, verb=.5)
for t0, k in bars_of('glide'):
    ch = THEME_CH[k]; add(strings([mtof(n) for n in CH[ch][1:]] + [mtof(CH[ch][1] + 12)], BAR * 1.04, .1), t0, verb=.5)
    add(bass(mtof(CH[ch][0] - 12), BAR * .95, .24), t0); drums(t0, 'big', k == 3); arp(t0, ch, v=.05, oct=12)
play_theme('glide', bell, .14, oct=12); play_theme('glide', flute, .06)

# epi (5): music box returns; the motif resolves; Puff stays quiet
e0 = st('epi')
for t0, k in bars_of('epi'):
    ch = ['Fmaj7', 'Cmaj7', 'Fmaj7', 'G', 'C'][k]
    for i, m in enumerate([0, 2, 1, 3, 0, 2, 1, 3]): add(bell(mtof(CH[ch][1 + m % 3] + 12), 1.1, .06), t0 + i * BEAT / 2, (.3 if i % 2 else -.3), verb=.4)
    add(pad([mtof(n) for n in CH[ch][1:]], BAR * 1.02, .03, .3, .3, 1800), t0)
thump(sub('epi', 0) - .4); scratch(sub('epi', 1) + .2, 3.0, .03); motif(sub('epi', 1) + .1, 72, .17, piano)

# light (6): the orange window — last motif, ring-out, silence for credits
lt0 = sub('light', 0)
for t0, k in bars_of('light'):
    if k < 4: add(strings([mtof(n) for n in CH['C'][1:]] + [mtof(72)], BAR * 1.05, .06 - .012 * k), t0, verb=.6)
motif(lt0 + .2, 72, .19)
for i, m in enumerate([60, 64, 67, 72, 76, 79]): add(bell(mtof(m), 4, .07), lt0 + 2 * BEAT + .2 + i * .07, (i / 5 - .5), verb=.6)

# ---------- master ----------
ir_n = int(SR * 2.6); irt = np.arange(ir_n) / SR
ir = rng.standard_normal((2, ir_n)) * np.exp(-irt / .75); ir[:, :int(SR * .02)] *= np.linspace(0, 1, int(SR * .02))
ir /= np.sqrt((ir ** 2).sum(1, keepdims=True))
WL = fftconvolve(lp(VL, 7000), ir[0])[:N] * .55; WR = fftconvolve(lp(VR, 7000), ir[1])[:N] * .55
mix = np.stack([L + WL, R + WR], 1)
mix = np.tanh(mix * 1.6) / np.tanh(1.6)
mix /= max(1e-9, np.abs(mix).max()) / .9
wavfile.write('bgm.wav', SR, (mix * 32767).astype(np.int16))
# exact beat grid + loudness for the engine
rms = [float(np.sqrt((mix[int(i * SR / 4):int((i + 1) * SR / 4)] ** 2).mean())) for i in range(int(DUR * 4))]
m = max(rms); rms = [round(r / m, 3) for r in rms]
beats = [round(k * BEAT, 4) for k in range(int(DUR / BEAT))]
open('audio.js', 'w').write('window.AUDIO=' + json.dumps({'beats': beats, 'bstr': [1] * len(beats), 'dur': round(DUR, 3), 'rms': rms}) + ';')
print('wrote bgm.wav', round(DUR, 1), 's')
