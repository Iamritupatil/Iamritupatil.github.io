"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Bee.module.css";

const tex = (name: string) => ({ backgroundImage: `url(/images/bee/${name}.png)` });
const SPEED = 70; // px per second while wandering
const FOLLOW_SPEED = 120;

/**
 * A little Minecraft bee that wanders around the screen. Now and then it gets
 * curious and follows the pointer for a few seconds, keeping a polite distance.
 * It never blocks clicks and stays still for visitors who prefer reduced motion.
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
    const vw = () => window.innerWidth;
    const vh = () => window.innerHeight;
    const margin = 40;
    const randomSpot = () => ({
      x: margin + Math.random() * (vw() - margin * 2),
      y: margin + Math.random() * (vh() - margin * 2),
    });

    const pos = { x: vw() * 0.85, y: vh() * 0.3 };
    const vel = { x: -20, y: 10 };
    let target = randomSpot();
    let pointer: { x: number; y: number } | null = null;
    let mode: "wander" | "follow" = "wander";
    let modeUntil = performance.now() + 12000 + Math.random() * 10000;
    let pauseUntil = 0;
    let yaw = -60;
    let last = performance.now();
    let raf = 0;

    const onMove = (e: PointerEvent) => (pointer = { x: e.clientX, y: e.clientY });
    window.addEventListener("pointermove", onMove, { passive: true });

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      // switch between wandering and following the pointer every so often
      if (now > modeUntil) {
        mode = mode === "wander" && pointer ? "follow" : "wander";
        modeUntil = now + (mode === "follow" ? 5000 + Math.random() * 4000 : 14000 + Math.random() * 14000);
        if (mode === "wander") target = randomSpot();
      }

      let goal = target;
      let speed = SPEED;
      if (mode === "follow" && pointer) {
        // hover beside the pointer, not on top of it
        goal = { x: pointer.x + (pos.x < pointer.x ? -46 : 46), y: pointer.y - 28 };
        speed = FOLLOW_SPEED;
      }

      const dx = goal.x - pos.x;
      const dy = goal.y - pos.y;
      const dist = Math.hypot(dx, dy);

      if (mode === "wander" && dist < 12) {
        // arrived: hover for a moment, then pick somewhere new
        if (!pauseUntil) pauseUntil = now + 600 + Math.random() * 2200;
        if (now > pauseUntil) {
          pauseUntil = 0;
          target = randomSpot();
        }
      }

      // steer smoothly towards the goal
      const want = dist > 4 ? speed * Math.min(1, dist / 60) : 0;
      const wx = dist ? (dx / dist) * want : 0;
      const wy = dist ? (dy / dist) * want : 0;
      const k = Math.min(1, dt * 2.2);
      vel.x += (wx - vel.x) * k;
      vel.y += (wy - vel.y) * k;
      pos.x += vel.x * dt;
      pos.y += vel.y * dt;
      pos.x = Math.max(8, Math.min(vw() - 8, pos.x));
      pos.y = Math.max(8, Math.min(vh() - 8, pos.y));

      // face where it's flying (three-quarter view), bob up and down
      if (Math.abs(vel.x) > 6) yaw += ((vel.x > 0 ? 60 : -60) - yaw) * Math.min(1, dt * 5);
      const bob = Math.sin(now / 260) * 3;
      const pitch = Math.max(-20, Math.min(20, -vel.y * 0.15));
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
