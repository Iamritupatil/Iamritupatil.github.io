// Little sound effects. The Minecraft-style clips live in public/sounds and play
// through <audio>; the game's blips are synthesized with the Web Audio API.
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

/**
 * Looping campfire + snowfall ambience. Returns a function that fades it out.
 * Fire: a low warm rumble plus random wood crackles and pops.
 * Snow: a very soft, slowly breathing hiss of wind.
 */
export function startCampfire(): (() => void) | null {
  const c = ac();
  if (!c) return null;
  const master = c.createGain();
  master.gain.setValueAtTime(0.0001, c.currentTime);
  master.gain.exponentialRampToValueAtTime(1, c.currentTime + 1.2);
  master.connect(c.destination);

  const loopNoise = () => {
    const s = c.createBufferSource();
    s.buffer = noiseBuffer(c);
    s.loop = true;
    s.start();
    return s;
  };

  // fire rumble
  const rumble = loopNoise();
  const rumbleF = c.createBiquadFilter();
  rumbleF.type = "lowpass";
  rumbleF.frequency.value = 260;
  const rumbleG = c.createGain();
  rumbleG.gain.value = 0.16;
  rumble.connect(rumbleF).connect(rumbleG).connect(master);
  const flick = c.createOscillator();
  const flickG = c.createGain();
  flick.frequency.value = 0.7;
  flickG.gain.value = 0.05;
  flick.connect(flickG).connect(rumbleG.gain);
  flick.start();

  // snowy wind: soft hiss that slowly swells and fades
  const wind = loopNoise();
  const windF = c.createBiquadFilter();
  windF.type = "bandpass";
  windF.frequency.value = 700;
  windF.Q.value = 0.6;
  const windG = c.createGain();
  windG.gain.value = 0.035;
  wind.connect(windF).connect(windG).connect(master);
  const breathe = c.createOscillator();
  const breatheG = c.createGain();
  breathe.frequency.value = 0.08;
  breatheG.gain.value = 0.02;
  breathe.connect(breatheG).connect(windG.gain);
  const sweep = c.createGain();
  sweep.gain.value = 250;
  breathe.connect(sweep).connect(windF.frequency);
  breathe.start();

  // crackles: little bursts at random times, now and then a bigger pop
  let timer = 0;
  const crackle = () => {
    const out = master;
    const t = c.currentTime;
    const n = 1 + Math.floor(Math.random() * 3);
    for (let i = 0; i < n; i++) {
      const s = c.createBufferSource();
      s.buffer = noiseBuffer(c);
      const f = c.createBiquadFilter();
      f.type = "bandpass";
      f.frequency.value = 1800 + Math.random() * 3500;
      f.Q.value = 3;
      const g = c.createGain();
      const at = t + i * (0.015 + Math.random() * 0.04);
      const big = Math.random() < 0.12;
      const vol = big ? 0.5 : 0.08 + Math.random() * 0.14;
      const dur = big ? 0.06 : 0.012 + Math.random() * 0.025;
      g.gain.setValueAtTime(vol, at);
      g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
      s.connect(f).connect(g).connect(out);
      s.start(at, Math.random() * 0.8);
      s.stop(at + dur + 0.02);
    }
    timer = window.setTimeout(crackle, 60 + Math.random() * 380);
  };
  crackle();

  return () => {
    clearTimeout(timer);
    const t = c.currentTime;
    master.gain.cancelScheduledValues(t);
    master.gain.setValueAtTime(master.gain.value, t);
    master.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
    window.setTimeout(() => {
      [rumble, wind, flick, breathe].forEach((n) => {
        try {
          n.stop();
        } catch {}
      });
      master.disconnect();
    }, 700);
  };
}

export const sfx = {
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

// ---- recorded clips (public/sounds) ----

export type Clip = "click" | "chest-open" | "chest-close" | "lantern" | "totem";

const VOLUME: Record<Clip, number> = {
  click: 0.45,
  "chest-open": 0.7,
  "chest-close": 0.6,
  lantern: 0.8,
  totem: 0.3, // the totem is loud: keep it well down
};
const SOUNDS = process.env.NEXT_PUBLIC_PREVIEW ? "sounds/" : "/sounds/";
const clips = new Map<Clip, HTMLAudioElement>();

function clip(name: Clip) {
  let a = clips.get(name);
  if (!a) {
    a = new Audio(SOUNDS + name + ".mp3");
    a.preload = "auto";
    clips.set(name, a);
  }
  return a;
}

/** Load clips ahead of time so the first play has no delay. */
export function preloadClips(...names: Clip[]) {
  if (typeof window === "undefined") return;
  names.forEach((n) => clip(n).load());
}

/** Play a clip (overlapping plays get their own copy). Resolves false if muted or blocked. */
export function playClip(name: Clip): Promise<boolean> {
  if (typeof window === "undefined" || !soundOn()) return Promise.resolve(false);
  const base = clip(name);
  const a = base.paused ? base : (base.cloneNode() as HTMLAudioElement);
  a.volume = VOLUME[name];
  a.currentTime = 0;
  return a.play().then(
    () => true,
    () => false,
  );
}
