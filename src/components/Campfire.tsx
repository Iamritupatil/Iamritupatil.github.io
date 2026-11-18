"use client";

import { useEffect, useRef, useState } from "react";
import { campfire } from "@/data/content";
import { soundOn, startCampfire } from "@/lib/sfx";
import styles from "./Campfire.module.css";

/**
 * The cozy campfire scene above the footer. If `campfire.src` is an animated GIF/WebP
 * or a video it plays on loop; on top, pixel snow keeps falling and the fire glow
 * flickers, so it stays alive even as a still image. "Sit by the fire" starts the
 * crackling-fire + snowfall sound (browsers only allow sound after a click).
 */
export default function Campfire({ className = "" }: { className?: string }) {
  const snowRef = useRef<HTMLCanvasElement>(null);
  const boxRef = useRef<HTMLElement>(null);
  const stopRef = useRef<(() => void) | null>(null);
  const [listening, setListening] = useState(false);
  const isVideo = /\.(mp4|webm)$/i.test(campfire.src);

  // falling pixel snow
  useEffect(() => {
    const canvas = snowRef.current;
    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d")!;
    const P = 3; // flake size in CSS px
    type Flake = { x: number; y: number; v: number; drift: number; size: number; a: number };
    let flakes: Flake[] = [];
    let w = 0;
    let h = 0;
    let dpr = 1;
    const spawn = (anywhere: boolean): Flake => ({
      x: Math.random() * w,
      y: anywhere ? Math.random() * h : -6,
      v: 18 + Math.random() * 30,
      drift: Math.random() * Math.PI * 2,
      size: Math.random() < 0.25 ? 2 : 1,
      a: 0.55 + Math.random() * 0.45,
    });
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      flakes = Array.from({ length: Math.round((w * h) / 2600) }, () => spawn(true));
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);

    let raf = 0;
    let last = performance.now();
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;
      if (!visible) return;
      ctx.clearRect(0, 0, w, h);
      for (const f of flakes) {
        f.y += f.v * dt;
        f.drift += dt * 1.3;
        f.x += Math.sin(f.drift) * 8 * dt;
        if (f.y > h + 6) Object.assign(f, spawn(false));
        ctx.fillStyle = `rgba(255,255,255,${f.a})`;
        const s = P * f.size;
        // snap to a pixel grid so the snow stays blocky
        ctx.fillRect(Math.round(f.x / P) * P, Math.round(f.y / P) * P, s, s);
      }
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  // stop the sound when muted, when the card leaves the screen, or on unmount
  useEffect(() => {
    if (!listening) return;
    const stop = () => {
      stopRef.current?.();
      stopRef.current = null;
      setListening(false);
    };
    const onMute = () => {
      if (!soundOn()) stop();
    };
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) stop();
    });
    if (boxRef.current) io.observe(boxRef.current);
    window.addEventListener("soundchange", onMute);
    return () => {
      io.disconnect();
      window.removeEventListener("soundchange", onMute);
    };
  }, [listening]);

  useEffect(() => () => stopRef.current?.(), []);

  const toggle = () => {
    if (listening) {
      stopRef.current?.();
      stopRef.current = null;
      setListening(false);
      return;
    }
    const stop = startCampfire();
    if (stop) {
      stopRef.current = stop;
      setListening(true);
    }
  };

  return (
    <section ref={boxRef} className={`card ${styles.scene} ${className}`} aria-label={campfire.alt}>
      {isVideo ? (
        <video className={styles.media} src={campfire.src} autoPlay muted loop playsInline />
      ) : (
        <img className={styles.media} src={campfire.src} alt="" loading="lazy" />
      )}
      <span className={styles.glow} aria-hidden />
      <canvas ref={snowRef} className={styles.snow} aria-hidden />
      <button className={styles.sound} onClick={toggle} aria-pressed={listening}>
        <span aria-hidden>{listening ? "■" : "▶"}</span>
        {listening ? "Stop the fire sounds" : "Sit by the fire"}
      </button>
    </section>
  );
}
