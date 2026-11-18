// Fruit Run — a tiny endless runner played inside the banner.
// A caveman runs through the lofi cave, jumps over rocks and eats fruit for points.
// Everything is drawn as pixel art on one canvas; no assets besides the banner photo.

import { sfx } from "@/lib/sfx";

type Palette = Record<string, string>;
type Sprite = { w: number; h: number; img: HTMLCanvasElement };

function sprite(rows: string[], pal: Palette): Sprite {
  const w = Math.max(...rows.map((r) => r.length));
  const h = rows.length;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const col = pal[row[x]];
      if (col) {
        ctx.fillStyle = col;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  });
  return { w, h, img: c };
}

const CAVEMAN: Palette = { h: "#3b2314", s: "#e0a46e", S: "#b97a4a", e: "#111111", f: "#a0522d", F: "#d08a4a", b: "#f2ead3" };
const TOP = [
  "....hhhhhh....",
  "...hhhhhhhh...",
  "..hhhhsssssh..",
  "..hhhsssesss..",
  "..hhhssssssss.",
  "...hhsssSSs...",
  "....hsssss....",
  "...ffFFFff....",
  "..ffFFFFfffss.",
  ".sffFFfffff.bb",
  "ss.ffffffff.bb",
  "...ffFfFfFf...",
];
const LEGS_A = ["....ssss.ss...", "...ss....ss...", "..ss......ss..", ".SS.......SS.."];
const LEGS_B = [".....sssss....", ".....ss.ss....", "....ss..ss....", "...SS...SS...."];
const LEGS_JUMP = ["...ssssssss...", "..ss.....ss...", ".SS......SS...", ".............."];

const FRUITS: { points: number; weight: number; rows: string[]; pal: Palette }[] = [
  {
    points: 10,
    weight: 5,
    rows: ["......g.", ".....yy.", "....yyY.", "...yyyY.", "..yyyY..", ".yyyY...", "yyY.....", "........"],
    pal: { y: "#f5d142", Y: "#c9a227", g: "#5b8c2a" },
  },
  {
    points: 15,
    weight: 3,
    rows: ["....ng..", "..rrnrr.", ".rwrrrrr", ".rwrrrrR", ".rrrrrrR", ".rrrrrRR", "..rrrRR.", "...RRR.."],
    pal: { r: "#e23b3b", R: "#a52020", w: "#ffb3b3", g: "#4caf50", n: "#6b4423" },
  },
  {
    points: 25,
    weight: 1,
    rows: ["....g...", "...g....", "..ppp...", ".plpppp.", ".ppPppP.", "..pppP..", "...pP...", "........"],
    pal: { p: "#9b59c6", P: "#5e2a85", l: "#d0a6ee", g: "#4caf50" },
  },
];

const STONE: Palette = { k: "#6b6f76", K: "#4a4d52", L: "#9aa0a8" };
const OBSTACLES = [
  ["....kkkk....", "..kkLLkkkk..", ".kkLkkkkkKk.", ".kLkkkkkkKK.", "kkkkkkkkkKKK", "kkkkkkkKKKKK", "KKKKKKKKKKKK"],
  ["...LL...", "...Lk...", "..Lkk...", "..Lkk...", "..LkkK..", ".LkkkK..", ".LkkkK..", ".LkkkKK.", "LkkkkKK.", "LkkkkkKK", "kkkkkkKK", "KKKKKKKK"],
];

const LOGICAL_H = 100; // the banner is always 100 "pixels" tall
const GROUND = 84; // y of the ground line
const GRAVITY = 900;
const JUMP_V = 300;
const JUMP_CUT = 140; // releasing early cuts the jump short
const BEST_KEY = "fruitrun-best";

type Thing = { x: number; y: number; s: Sprite; points?: number; bob?: number };
type Popup = { x: number; y: number; text: string; t: number };

export type FruitRunOptions = { background?: string; onExit?: () => void };

export function startFruitRun(canvas: HTMLCanvasElement, opts: FruitRunOptions = {}): () => void {
  const ctx = canvas.getContext("2d")!;
  const frames = {
    a: sprite([...TOP, ...LEGS_A], CAVEMAN),
    b: sprite([...TOP, ...LEGS_B], CAVEMAN),
    jump: sprite([...TOP, ...LEGS_JUMP], CAVEMAN),
  };
  const fruitSprites = FRUITS.map((f) => ({ ...f, s: sprite(f.rows, f.pal) }));
  const fruitBag = fruitSprites.flatMap((f) => Array(f.weight).fill(f));
  const rocks = OBSTACLES.map((r) => sprite(r, STONE));

  let bg: HTMLImageElement | null = null;
  if (opts.background) {
    const img = new Image();
    img.onload = () => (bg = img);
    img.src = opts.background;
  }

  let best = 0;
  try {
    best = Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch {}

  // view
  let W = 300;
  let dpr = 1;
  const resize = () => {
    const r = canvas.getBoundingClientRect();
    if (!r.width || !r.height) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const scale = r.height / LOGICAL_H;
    W = Math.ceil(r.width / scale);
    canvas.width = Math.round(r.width * dpr);
    canvas.height = Math.round(r.height * dpr);
    ctx.setTransform(dpr * scale, 0, 0, dpr * scale, 0, 0);
    ctx.imageSmoothingEnabled = false;
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  // state
  let mode: "ready" | "running" | "over" = "ready";
  let overAt = 0;
  let t = 0;
  let distance = 0;
  let fruitPoints = 0;
  let speed = 110;
  let y = GROUND;
  let vy = 0;
  let onGround = true;
  let held = false;
  let nextRock = 200;
  let nextFruit = 80;
  let animT = 0;
  let things: Thing[] = [];
  let fruits: Thing[] = [];
  let popups: Popup[] = [];
  let dust: { x: number; y: number; t: number }[] = [];
  const PX = 30; // player x

  const score = () => Math.floor(distance / 8) + fruitPoints;
  const rand = (a: number, b: number) => a + Math.random() * (b - a);

  const reset = () => {
    t = distance = fruitPoints = 0;
    speed = 110;
    y = GROUND;
    vy = 0;
    onGround = true;
    nextRock = 220;
    nextFruit = 60;
    things = [];
    fruits = [];
    popups = [];
    dust = [];
  };

  const press = () => {
    if (mode === "ready") {
      reset();
      mode = "running";
      sfx.start();
    } else if (mode === "over") {
      if (performance.now() - overAt < 450) return; // don't restart by accident
      reset();
      mode = "running";
      sfx.start();
      return;
    }
    if (mode === "running" && onGround) {
      sfx.jump();
      vy = -JUMP_V;
      onGround = false;
    }
    held = true;
  };
  const release = () => {
    held = false;
    if (vy < -JUMP_CUT) vy = -JUMP_CUT;
  };

  const gameOver = () => {
    sfx.hurt();
    mode = "over";
    overAt = performance.now();
    const s = score();
    if (s > best) {
      best = s;
      try {
        localStorage.setItem(BEST_KEY, String(best));
      } catch {}
    }
  };

  const hit = (ax: number, ay: number, aw: number, ah: number, bx: number, by: number, bw: number, bh: number) =>
    ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;

  const update = (dt: number) => {
    if (mode !== "running") return;
    t += dt;
    speed = Math.min(260, 110 + t * 4);
    const dx = speed * dt;
    distance += dx;

    // player
    if (!held && vy < -JUMP_CUT) vy = -JUMP_CUT;
    vy += GRAVITY * dt;
    y += vy * dt;
    if (y >= GROUND) {
      if (!onGround) for (let i = 0; i < 4; i++) dust.push({ x: PX + 4 + i * 2, y: GROUND, t: 0 });
      y = GROUND;
      vy = 0;
      onGround = true;
    }
    animT += dt * (speed / 110);

    // spawn rocks: always leave enough room to land and jump again
    nextRock -= dx;
    if (nextRock <= 0) {
      const s = rocks[Math.random() < 0.65 ? 0 : 1];
      things.push({ x: W + 8, y: GROUND - s.h, s });
      if (speed > 170 && Math.random() < 0.25) things.push({ x: W + 8 + s.w, y: GROUND - rocks[0].h, s: rocks[0] });
      const airDistance = speed * ((2 * JUMP_V) / GRAVITY);
      nextRock = airDistance + 40 + rand(0, 160);
    }
    // spawn fruit: low ones are free, high ones need a jump
    nextFruit -= dx;
    if (nextFruit <= 0) {
      const high = Math.random() < 0.55;
      const n = 1 + Math.floor(Math.random() * 3);
      for (let i = 0; i < n; i++) {
        const f = fruitBag[Math.floor(Math.random() * fruitBag.length)];
        fruits.push({ x: W + 8 + i * 14, y: high ? GROUND - 44 - (i === 1 ? 5 : 0) : GROUND - 13, s: f.s, points: f.points, bob: Math.random() * 6 });
      }
      nextFruit = rand(110, 230);
    }

    for (const o of things) o.x -= dx;
    for (const f of fruits) f.x -= dx;
    things = things.filter((o) => o.x + o.s.w > -10);
    fruits = fruits.filter((f) => f.x + f.s.w > -10);

    // collisions (boxes trimmed a little so near-misses feel fair)
    const p = frames.a;
    const pbx = PX + 3, pby = y - p.h + 2, pbw = p.w - 6, pbh = p.h - 2;
    for (const o of things) {
      if (hit(pbx, pby, pbw, pbh, o.x + 2, o.y + 2, o.s.w - 4, o.s.h - 2)) return gameOver();
    }
    fruits = fruits.filter((f) => {
      if (hit(pbx - 2, pby - 2, pbw + 4, pbh + 4, f.x, f.y, f.s.w, f.s.h)) {
        fruitPoints += f.points!;
        sfx.eat(f.points);
        popups.push({ x: f.x, y: f.y, text: `+${f.points}`, t: 0 });
        return false;
      }
      return true;
    });

    if (onGround && Math.random() < dt * 12) dust.push({ x: PX + 2, y: GROUND - 1, t: 0 });
    for (const d of dust) {
      d.t += dt;
      d.x -= dx * 0.6;
    }
    dust = dust.filter((d) => d.t < 0.35);
    for (const pp of popups) pp.t += dt;
    popups = popups.filter((pp) => pp.t < 0.8);
  };

  const text = (s: string, x: number, yy: number, size: number, align: CanvasTextAlign = "left", color = "#f4f1ea") => {
    ctx.font = `bold ${size}px ui-monospace, "SFMono-Regular", Menlo, monospace`;
    ctx.textAlign = align;
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillText(s, x + 0.6, yy + 0.6);
    ctx.fillStyle = color;
    ctx.fillText(s, x, yy);
  };

  const draw = (now: number) => {
    // background: the banner photo, dimmed
    ctx.fillStyle = "#14100c";
    ctx.fillRect(0, 0, W, LOGICAL_H);
    if (bg) {
      const s = Math.max(W / bg.width, LOGICAL_H / bg.height);
      const bw = bg.width * s, bh = bg.height * s;
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(bg, (W - bw) / 2, (LOGICAL_H - bh) / 2, bw, bh);
      ctx.imageSmoothingEnabled = false;
    }
    ctx.fillStyle = "rgba(8,6,4,0.55)";
    ctx.fillRect(0, 0, W, LOGICAL_H);

    // ground tiles scroll with distance
    const off = Math.floor(distance) % 16;
    for (let x = -off; x < W + 16; x += 16) {
      ctx.fillStyle = "#4a3020";
      ctx.fillRect(x, GROUND, 16, LOGICAL_H - GROUND);
      ctx.fillStyle = "#5aa83a";
      ctx.fillRect(x, GROUND, 16, 2);
      ctx.fillStyle = "#3f7a28";
      ctx.fillRect(x, GROUND + 2, 16, 1);
      ctx.fillRect(x + 3, GROUND - 1, 1, 1);
      ctx.fillRect(x + 11, GROUND - 2, 1, 2);
      ctx.fillStyle = "#3a2416";
      ctx.fillRect(x + 4, GROUND + 6, 2, 1);
      ctx.fillRect(x + 12, GROUND + 10, 1, 1);
      ctx.fillRect(x + 8, GROUND + 14, 2, 1);
    }

    for (const o of things) ctx.drawImage(o.s.img, Math.round(o.x), Math.round(o.y));
    for (const f of fruits) {
      const bobY = Math.round(Math.sin(now / 220 + (f.bob || 0)) * 1.5);
      ctx.drawImage(f.s.img, Math.round(f.x), Math.round(f.y + bobY));
    }
    ctx.fillStyle = "rgba(210,190,160,0.6)";
    for (const d of dust) ctx.fillRect(Math.round(d.x), Math.round(d.y - d.t * 8), 1, 1);

    const frame = !onGround ? frames.jump : mode !== "running" ? frames.a : Math.floor(animT * 10) % 2 ? frames.a : frames.b;
    ctx.drawImage(frame.img, PX, Math.round(y - frame.h));

    for (const pp of popups) text(pp.text, pp.x, pp.y - pp.t * 14, 6, "left", "#f5d142");

    // HUD
    const pad = (n: number) => String(n).padStart(5, "0");
    text(`${pad(score())}  HI ${pad(best)}`, 8, 12, 7); // top-left, clear of the close button

    if (mode === "ready") {
      text("FRUIT RUN", W / 2, 34, 14, "center", "#f5d142");
      text("Jump the rocks, eat the fruit", W / 2, 47, 6, "center");
      if (Math.floor(now / 500) % 2 === 0) text("Press space or tap to start", W / 2, 62, 6, "center", "#cfe8c0");
    } else if (mode === "over") {
      text("GAME OVER", W / 2, 34, 12, "center", "#ff8a8a");
      text(`Score ${score()}  ·  Best ${best}`, W / 2, 47, 6, "center");
      if (Math.floor(now / 500) % 2 === 0) text("Tap to run again", W / 2, 62, 6, "center", "#cfe8c0");
    }
  };

  // input
  const isJumpKey = (e: KeyboardEvent) => e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW";
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.code === "Escape") {
      opts.onExit?.();
      return;
    }
    if (!isJumpKey(e)) return;
    e.preventDefault();
    if (!e.repeat) press();
  };
  const onKeyUp = (e: KeyboardEvent) => {
    if (isJumpKey(e)) release();
  };
  const onPointerDown = (e: PointerEvent) => {
    e.preventDefault();
    press();
  };
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointerup", release);
  canvas.addEventListener("pointercancel", release);

  // loop (dt is clamped so a background tab doesn't teleport the runner)
  let raf = 0;
  let last = performance.now();
  const loop = (now: number) => {
    const dt = Math.min(0.033, (now - last) / 1000);
    last = now;
    update(dt);
    draw(now);
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);

  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("keyup", onKeyUp);
    canvas.removeEventListener("pointerdown", onPointerDown);
    canvas.removeEventListener("pointerup", release);
    canvas.removeEventListener("pointercancel", release);
  };
}
