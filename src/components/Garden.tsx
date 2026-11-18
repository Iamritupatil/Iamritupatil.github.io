"use client";

import { useEffect, useRef } from "react";
import styles from "./Garden.module.css";

// A pixel-art meadow drawn on a canvas: crisp at any size, and every grass blade
// and flower sways on its own. Seeded random, so it looks the same on every visit.

const U = 8; // CSS px per pixel-art pixel
const ROWS = 22; // canvas height in pixels (22 × 8 = 176px)
const FPS = 12; // pixel art moves in steps; 12fps keeps it chunky and cheap

const GRASS = ["#2f5e1e", "#3f7a28", "#4f8f2f", "#5aa83a", "#6cbf45"];
const TIP = ["#7fd352", "#8fe35e"];

type Sprite = { rows: string[]; colors: Record<string, string> };

const LEAF = { g: "#3f9a2e", G: "#2b7a22" };
const FLOWERS: Sprite[] = [
  {
    // dandelion
    rows: ["..yyy..", ".yyyyy.", "yyyoyyy", ".yyyyy.", "..yyy..", "...g...", "..Gg...", "...g...", "...gG..", "...g...", "...g..."],
    colors: { y: "#f7d33b", o: "#e0861e", ...LEAF },
  },
  {
    // rose bush
    rows: [
      "...rr......",
      "..rRrr..rr.",
      "...rr..rRrr",
      "...g....rr.",
      ".rr.g..g...",
      "rRrr.g.g.rr",
      ".rr..ggg.rRr",
      "..g..Gg..rr.",
      "...g.gGgg...",
      ".rr.ggGg....",
      "rRrrgGgg.rr.",
      ".rrgGgggrRrr",
      "...gGggG.rr.",
      "...gGGgg....",
      "....gGg.....",
      "....gGg.....",
    ],
    colors: { r: "#e0303a", R: "#a8141e", ...LEAF },
  },
  {
    // pink tulip
    rows: ["p.p.p", "ppppp", "pPppp", ".ppp.", "..g..", "..g..", "G.g.G", ".GgG.", "..g..", "..g..", "..g.."],
    colors: { p: "#ffb3c8", P: "#e57a9a", ...LEAF },
  },
  {
    // red tulip
    rows: ["r.r.r", "rrrrr", "rRrrr", ".rrr.", "..g..", "..g..", "..gG.", "G.g..", ".Gg..", "..g..", "..g..", "..g.."],
    colors: { r: "#e8323c", R: "#a8141e", ...LEAF },
  },
  {
    // cornflower
    rows: [".b.b.", "bbBbb", ".bbb.", "..g..", "..gG.", "..g..", ".Gg..", "..g.."],
    colors: { b: "#5b8def", B: "#2f5fc4", ...LEAF },
  },
];

// tiny deterministic random
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

type Blade = { x: number; h: number; color: string; tip: string; phase: number; speed: number; front: boolean };
type Plant = { x: number; sprite: number; phase: number };

function layout(cols: number) {
  const r = rng(7);
  const blades: Blade[] = [];
  for (let x = 0; x < cols; x++) {
    // most columns get one blade, some get a second, a few are low
    const count = r() < 0.25 ? 2 : 1;
    for (let k = 0; k < count; k++) {
      blades.push({
        x,
        h: 3 + Math.floor(r() * 9) + (r() < 0.15 ? 3 : 0),
        color: GRASS[1 + Math.floor(r() * (GRASS.length - 1))],
        tip: TIP[Math.floor(r() * TIP.length)],
        phase: r() * Math.PI * 2,
        speed: 0.8 + r() * 0.6,
        front: r() < 0.35,
      });
    }
  }
  // flowers spread across the width, a little irregular
  const plants: Plant[] = [];
  const spacing = 34;
  for (let x = 6 + Math.floor(r() * 10); x < cols - 8; x += spacing + Math.floor(r() * 20) - 10) {
    plants.push({ x, sprite: Math.floor(r() * FLOWERS.length), phase: r() * Math.PI * 2 });
  }
  return { blades, plants };
}

export default function Garden() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cols = 0;
    let dpr = 1;
    let world = layout(0);
    let visible = true;

    const resize = () => {
      const w = canvas.clientWidth;
      dpr = Math.max(1, Math.round(window.devicePixelRatio || 1));
      cols = Math.ceil(w / U);
      canvas.width = cols * U * dpr;
      canvas.height = ROWS * U * dpr;
      world = layout(cols);
      // where each flower head is (as a fraction of the canvas), so the bee can visit them
      canvas.dataset.flowers = JSON.stringify(
        world.plants.map((p) => [(p.x + 0.5) / cols, (ROWS - FLOWERS[p.sprite].rows.length + 1) / ROWS]),
      );
      draw(performance.now());
    };

    const px = (x: number, y: number, color: string) => {
      ctx.fillStyle = color;
      ctx.fillRect(x * U * dpr, y * U * dpr, U * dpr, U * dpr);
    };

    const sway = (phase: number, speed: number, t: number, amount: number) =>
      still ? 0 : Math.round(Math.sin(t * 0.0018 * speed + phase) * amount);

    const drawBlades = (front: boolean, t: number) => {
      for (const b of world.blades) {
        if (b.front !== front) continue;
        const lean = sway(b.phase + b.x * 0.18, b.speed, t, 1.4);
        for (let i = 0; i < b.h; i++) {
          const y = ROWS - 1 - i;
          // only the upper part of a blade bends
          const off = i > b.h * 0.45 ? lean : 0;
          px(b.x + off, y, i === b.h - 1 ? b.tip : i < 2 ? GRASS[0] : b.color);
        }
      }
    };

    const drawPlants = (t: number) => {
      for (const p of world.plants) {
        const s = FLOWERS[p.sprite];
        const h = s.rows.length;
        const w = s.rows[0].length;
        const lean = sway(p.phase, 1, t, 1.3);
        s.rows.forEach((row, ry) => {
          // the head sways, the base of the stem stays planted
          const off = ry < h * 0.55 ? lean : 0;
          for (let rx = 0; rx < row.length; rx++) {
            const c = s.colors[row[rx]];
            if (c) px(p.x - Math.floor(w / 2) + rx + off, ROWS - h + ry, c);
          }
        });
      }
    };

    function draw(t: number) {
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      // a solid turf line along the bottom
      for (let x = 0; x < cols; x++) {
        px(x, ROWS - 1, GRASS[0]);
        px(x, ROWS - 2, (x * 7) % 5 === 0 ? GRASS[2] : GRASS[1]);
      }
      drawBlades(false, t);
      drawPlants(t);
      drawBlades(true, t);
    }

    let raf = 0;
    let last = 0;
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || t - last < 1000 / FPS) return;
      last = t;
      draw(t);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);
    resize();
    if (!still) raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return <canvas ref={ref} className={styles.garden} data-garden aria-hidden />;
}
