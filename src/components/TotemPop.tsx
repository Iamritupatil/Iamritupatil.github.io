"use client";

import { useCallback, useEffect, useRef } from "react";
import { playClip, preloadClips } from "@/lib/sfx";
import styles from "./TotemPop.module.css";

const DURATION = 2000; // Minecraft: 40 game ticks = 2 seconds
const LAYERS = 8; // stacked copies give the sprite Minecraft's 1-pixel item thickness

/**
 * Minecraft's totem-of-undying animation, using the game's own motion
 * (GameRenderer.renderItemActivationAnimation): the item flies from far away up to
 * the screen and back, spinning 900° around its vertical axis, wobbling, and drifting
 * towards a random corner, over 40 ticks.
 */
export default function TotemPop() {
  const item = useRef<HTMLDivElement>(null);
  const blur = useRef<HTMLDivElement>(null);
  const raf = useRef(0);

  const run = useCallback((withSound: boolean) => {
    const el = item.current;
    if (!el) return;
    cancelAnimationFrame(raf.current);
    if (withSound) void playClip("totem");
    blur.current?.setAttribute("data-on", ""); // the page goes blurry while the totem pops
    const offX = Math.random() * 2 - 1;
    const offY = Math.random() * 2 - 1;
    const start = performance.now();
    const frame = (now: number) => {
      const f = Math.min(1, (now - start) / DURATION);
      const f1 = f * f;
      const f2 = f * f1;
      const f3 = 10.25 * f2 * f1 - 24.95 * f1 * f1 + 25.5 * f2 - 13.8 * f1 + 4 * f;
      const f4 = f3 * Math.PI;
      const z = -10 + 9 * Math.sin(f4); // distance from the camera: -10 (far) … -1 (in your face)
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const swing = Math.abs(Math.sin(f4 * 2));
      const k = 2.5 / -z; // perspective
      const x = offX * (vw / 4) * swing * k;
      const y = offY * (vh / 4) * swing * k;
      const scale = 1 / -z; // 0.1 when far, 1 (its sharp full size) when closest
      const spin = 900 * Math.abs(Math.sin(f4));
      const wobble = 6 * Math.cos(f * 8);
      el.style.opacity = f >= 1 ? "0" : "1";
      if (f > 0.85) blur.current?.removeAttribute("data-on");
      el.style.transform = `translate(${x}px, ${y}px) scale(${scale}) rotateY(${spin}deg) rotateZ(${wobble}deg)`;
      if (f < 1) raf.current = requestAnimationFrame(frame);
    };
    raf.current = requestAnimationFrame(frame);
  }, []);

  useEffect(() => {
    preloadClips("totem");
    // Browsers block sound until the visitor interacts: if it can't play on load,
    // the first click or key press uses the totem again, with sound.
    let waiting = false;
    const again = (e: Event) => {
      if ((e.target as Element | null)?.closest?.("a")) return;
      stop();
      run(true);
    };
    const stop = () => {
      window.removeEventListener("pointerdown", again);
      window.removeEventListener("keydown", again);
    };
    run(false);
    playClip("totem").then((played) => {
      if (played || waiting) return;
      waiting = true;
      window.addEventListener("pointerdown", again);
      window.addEventListener("keydown", again);
    });
    return () => {
      stop();
      cancelAnimationFrame(raf.current);
    };
  }, [run]);

  return (
    <>
    <div ref={blur} className={styles.blur} aria-hidden />
    <div className={styles.overlay} aria-hidden>
      <div ref={item} className={styles.item}>
        {Array.from({ length: LAYERS }, (_, i) => (
          <img
            key={i}
            src="/images/totem.png"
            alt=""
            className={styles.layer}
            style={{
              transform: `translateZ(${(i - (LAYERS - 1) / 2) * 0.9}px)`,
              filter: i === 0 || i === LAYERS - 1 ? undefined : "brightness(0.62)",
            }}
          />
        ))}
      </div>
    </div>
    </>
  );
}
