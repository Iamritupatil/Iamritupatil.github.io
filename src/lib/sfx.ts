// Little sound effects, synthesized with the Web Audio API (no audio files).
// Browsers only allow sound after the visitor has clicked or tapped, which every
// effect here follows. A visitor can mute everything with the speaker button.

const KEY = "sound";
let ctx: AudioContext | null = null;
let noise: AudioBuffer | null = null;

export function soundOn(): boolean {
  try {
    return localStorage.getItem(KEY) !== "off";
  } catch {
    return true;
  }
}

export function setSound(on: boolean) {
  try {
    localStorage.setItem(KEY, on ? "on" : "off");
  } catch {}
  window.dispatchEvent(new Event("soundchange"));
}

function ac(): AudioContext | null {
  if (typeof window === "undefined" || !soundOn()) return null;
  try {
    if (!ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx = new AC();
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function noiseBuffer(c: AudioContext) {
  if (!noise) {
    noise = c.createBuffer(1, c.sampleRate, c.sampleRate);
    const d = noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  return noise;
}

/** A tone that glides between two pitches and fades out. */
function tone(c: AudioContext, opts: { type: OscillatorType; from: number; to: number; at?: number; dur: number; vol: number; filter?: BiquadFilterNode }) {
  const t = c.currentTime + (opts.at ?? 0);
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = opts.type;
  o.frequency.setValueAtTime(opts.from, t);
  o.frequency.exponentialRampToValueAtTime(Math.max(1, opts.to), t + opts.dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(opts.vol, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + opts.dur);
  o.connect(g);
  if (opts.filter) {
    g.connect(opts.filter);
    opts.filter.connect(c.destination);
  } else g.connect(c.destination);
  o.start(t);
  o.stop(t + opts.dur + 0.05);
}

/** A burst of filtered noise (thuds, crunches, clicks). */
function burst(c: AudioContext, opts: { at?: number; dur: number; vol: number; type: BiquadFilterType; freq: number; q?: number }) {
  const t = c.currentTime + (opts.at ?? 0);
  const src = c.createBufferSource();
  src.buffer = noiseBuffer(c);
  const f = c.createBiquadFilter();
  f.type = opts.type;
  f.frequency.value = opts.freq;
  f.Q.value = opts.q ?? 1;
  const g = c.createGain();
  g.gain.setValueAtTime(opts.vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + opts.dur);
  src.connect(f).connect(g).connect(c.destination);
  src.start(t, Math.random() * 0.5);
  src.stop(t + opts.dur + 0.02);
}

/** Wooden creak: a rough, wobbling low tone through a narrow filter. */
function creak(c: AudioContext, from: number, to: number, dur: number, vol: number, at = 0) {
  const t = c.currentTime + at;
  const o = c.createOscillator();
  o.type = "sawtooth";
  o.frequency.setValueAtTime(from, t);
  o.frequency.linearRampToValueAtTime(to, t + dur);
  const f = c.createBiquadFilter();
  f.type = "bandpass";
  f.frequency.value = 900;
  f.Q.value = 6;
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.04);
  g.gain.linearRampToValueAtTime(vol * 0.6, t + dur * 0.7);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  // fast wobble gives the "ratchety" wood sound
  const lfo = c.createOscillator();
  const lfoGain = c.createGain();
  lfo.frequency.value = 38;
  lfoGain.gain.value = vol * 0.5;
  lfo.connect(lfoGain).connect(g.gain);
  o.connect(f).connect(g).connect(c.destination);
  o.start(t);
  lfo.start(t);
  o.stop(t + dur + 0.05);
  lfo.stop(t + dur + 0.05);
}

export const sfx = {
  chestOpen() {
    const c = ac();
    if (!c) return;
    creak(c, 150, 105, 0.42, 0.22);
    burst(c, { at: 0.36, dur: 0.12, vol: 0.35, type: "lowpass", freq: 380 });
    tone(c, { type: "sine", from: 120, to: 70, at: 0.36, dur: 0.15, vol: 0.25 });
  },
  chestClose() {
    const c = ac();
    if (!c) return;
    creak(c, 110, 150, 0.22, 0.16);
    burst(c, { at: 0.2, dur: 0.14, vol: 0.45, type: "lowpass", freq: 300 });
    tone(c, { type: "sine", from: 110, to: 55, at: 0.2, dur: 0.18, vol: 0.32 });
  },
  /** Metal chain links knocking together. */
  chainClink() {
    const c = ac();
    if (!c) return;
    [0, 0.05, 0.11].forEach((at, i) => {
      tone(c, { type: "triangle", from: 2600 + i * 420, to: 2200 + i * 300, at, dur: 0.09, vol: 0.06 });
      tone(c, { type: "sine", from: 4200 - i * 300, to: 3900, at, dur: 0.06, vol: 0.03 });
    });
  },
  /** Lantern light switching on or off. */
  lightSwitch() {
    const c = ac();
    if (!c) return;
    burst(c, { dur: 0.03, vol: 0.4, type: "highpass", freq: 2500 });
    tone(c, { type: "sine", from: 180, to: 90, dur: 0.1, vol: 0.2 });
    tone(c, { type: "triangle", from: 1800, to: 1400, at: 0.03, dur: 0.18, vol: 0.05 });
  },
  jump() {
    const c = ac();
    if (!c) return;
    tone(c, { type: "square", from: 260, to: 620, dur: 0.13, vol: 0.05 });
  },
  /** Crunchy bite + a little "ding" for the points. */
  eat(points = 10) {
    const c = ac();
    if (!c) return;
    [0, 0.07, 0.14].forEach((at) => burst(c, { at, dur: 0.05, vol: 0.22, type: "bandpass", freq: 1400 + Math.random() * 600, q: 2 }));
    const high = points >= 25 ? 1320 : points >= 15 ? 1100 : 880;
    tone(c, { type: "square", from: high, to: high * 1.5, at: 0.05, dur: 0.12, vol: 0.035 });
  },
  hurt() {
    const c = ac();
    if (!c) return;
    burst(c, { dur: 0.18, vol: 0.5, type: "lowpass", freq: 500 });
    tone(c, { type: "square", from: 420, to: 70, at: 0.05, dur: 0.55, vol: 0.06 });
  },
  start() {
    const c = ac();
    if (!c) return;
    [523, 659, 784].forEach((f, i) => tone(c, { type: "square", from: f, to: f, at: i * 0.07, dur: 0.1, vol: 0.04 }));
  },
};
