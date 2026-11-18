"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Bee.module.css";

const tex = (name: string) => ({ backgroundImage: `url(/images/bee/${name}.png)` });

/**
 * A little Minecraft bee that lives on the page itself (it scrolls with the content,
 * like everything else). It wanders around, now and then follows the pointer for a
 * few seconds, and visits the flowers in the garden at the bottom to drink nectar.
 * It never blocks clicks and stays away for visitors who prefer reduced motion.
 */
export default function Bee() {
  const root = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setOn(true);
  }, []);

  useEffect(() => {
    if (!on) return;
    const el = root.current!;
    const bee = body.current!;
    const M = 40; // keep this far from the page edges
    const pageW = () => document.documentElement.clientWidth;
    const pageH = () => document.documentElement.scrollHeight;
    const clampX = (x: number) => Math.max(M, Math.min(pageW() - M, x));
    const clampY = (y: number) => Math.max(M, Math.min(pageH() - M, y));

    // flower heads in the garden, in page coordinates
    const flowers = () => {
      const g = document.querySelector<HTMLCanvasElement>("[data-garden]");
      if (!g?.dataset.flowers) return [];
      const r = g.getBoundingClientRect();
      return (JSON.parse(g.dataset.flowers) as [number, number][]).map(([fx, fy]) => ({
        x: r.left + scrollX + fx * r.width,
        y: r.top + scrollY + fy * r.height - 10,
      }));
    };

    // somewhere new nearby; often a flower if the garden is close enough
    const nextTarget = (from: { x: number; y: number }) => {
      const fl = flowers();
      const near = fl.filter((f) => Math.abs(f.y - from.y) < 900);
      // a nearby flower often; now and then the long trip down to the garden
      const pool = near.length && Math.random() < 0.45 ? near : Math.random() < 0.15 ? fl : [];
      if (pool.length) return { ...pool[Math.floor(Math.random() * pool.length)], flower: true };
      return {
        x: clampX(from.x + (Math.random() - 0.5) * 900),
        y: clampY(from.y + (Math.random() - 0.5) * 700),
        flower: false,
      };
    };

    const pos = { x: pageW() * 0.82, y: 260 };
    const vel = { x: -20, y: 10 };
    let target = nextTarget(pos);
    let pointer: { x: number; y: number; at: number } | null = null; // viewport coords
    let mode: "wander" | "follow" = "wander";
    let modeUntil = performance.now() + 12000 + Math.random() * 10000;
    let restUntil = 0;
    let yaw = -60;
    let last = performance.now();
    let raf = 0;

    const onMove = (e: PointerEvent) => (pointer = { x: e.clientX, y: e.clientY, at: performance.now() });
    window.addEventListener("pointermove", onMove, { passive: true });

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      // now and then follow the pointer for a few seconds (only if it's on screen near the bee)
      const p = pointer && now - pointer.at < 8000 ? { x: pointer.x + scrollX, y: pointer.y + scrollY } : null;
      if (now > modeUntil) {
        mode = mode === "wander" && p && Math.hypot(p.x - pos.x, p.y - pos.y) < 900 ? "follow" : "wander";
        modeUntil = now + (mode === "follow" ? 5000 + Math.random() * 4000 : 14000 + Math.random() * 14000);
        if (mode === "wander") target = nextTarget(pos);
      }

      let goal: { x: number; y: number } = target;
      let speed = target.flower ? 90 : 70;
      if (mode === "follow" && p) {
        goal = { x: p.x + (pos.x < p.x ? -46 : 46), y: p.y - 28 }; // beside the pointer, not on it
        speed = 120;
      }

      const dx = goal.x - pos.x;
      const dy = goal.y - pos.y;
      const dist = Math.hypot(dx, dy);
      const resting = mode === "wander" && dist < 10;
      if (resting) {
        // arrived: drink from the flower for a few seconds, or just hover a moment
        if (!restUntil) restUntil = now + (target.flower ? 3000 + Math.random() * 3000 : 600 + Math.random() * 2000);
        if (now > restUntil) {
          restUntil = 0;
          target = nextTarget(pos);
        }
      }

      // steer smoothly towards the goal
      const want = dist > 3 ? speed * Math.min(1, dist / 60) : 0;
      const k = Math.min(1, dt * 2.2);
      vel.x += ((dist ? (dx / dist) * want : 0) - vel.x) * k;
      vel.y += ((dist ? (dy / dist) * want : 0) - vel.y) * k;
      pos.x = clampX(pos.x + vel.x * dt);
      pos.y = clampY(pos.y + vel.y * dt);

      // face where it's flying (three-quarter view) and bob; on a flower, a small busy wiggle
      if (Math.abs(vel.x) > 6) yaw += ((vel.x > 0 ? 60 : -60) - yaw) * Math.min(1, dt * 5);
      const onFlower = resting && target.flower;
      const bob = onFlower ? Math.sin(now / 90) * 1.2 : Math.sin(now / 260) * 3;
      const pitch = onFlower ? 14 : Math.max(-20, Math.min(20, -vel.y * 0.15));
      el.style.transform = `translate(${pos.x}px, ${pos.y + bob}px)`;
      bee.style.transform = `rotateX(${-18 + pitch * 0.5}deg) rotateY(${yaw}deg)`;

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onVis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [on]);

  if (!on) return null;
  return (
    <div ref={root} className={styles.bee} data-bee aria-hidden>
      <div className={styles.shadowless}>
        <div ref={body} className={styles.model}>
          <span className={`${styles.face} ${styles.front}`} style={tex("front")} />
          <span className={`${styles.face} ${styles.back}`} style={tex("back")} />
          <span className={`${styles.face} ${styles.right}`} style={tex("right")} />
          <span className={`${styles.face} ${styles.left}`} style={tex("left")} />
          <span className={`${styles.face} ${styles.top}`} style={tex("top")} />
          <span className={`${styles.face} ${styles.bottom}`} style={tex("bottom")} />
          <span className={`${styles.face} ${styles.antennae}`} style={tex("antennae")} />
          <span className={`${styles.face} ${styles.wing} ${styles.wingR}`} style={tex("wing")} />
          <span className={`${styles.face} ${styles.wing} ${styles.wingL}`} style={tex("wing")} />
        </div>
      </div>
    </div>
  );
}
