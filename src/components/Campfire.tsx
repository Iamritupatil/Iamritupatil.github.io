"use client";

import { useEffect, useRef, useState } from "react";
import { campfire } from "@/data/content";
import { soundOn, startCampfire } from "@/lib/sfx";
import styles from "./Campfire.module.css";

// MingCute icons (Iconify): fire-fill, stop-circle-fill
const FIRE = "m14.995 6.287l.731-1.475c.588.588 1.189 1.161 1.727 1.796a18.4 18.4 0 0 1 1.98 2.837c1.378 2.435 2.018 4.997 1.224 7.753a6.23 6.23 0 0 1-3.4 3.974c-1.305.608-2.709.774-4.123.93c.966-.606 1.47-1.253 1.866-2.329c.386-1.05.293-2.043-.217-3.039c-.408-.797-1.069-1.428-1.484-2.222c-.333-.637-.527-1.359-.752-2.033c-1.001.626-2.021 1.226-2.881 2.046c-1.495 1.426-2.321 3.237-1.51 5.248c.174.429.417.823.712 1.18c.38.458.83.81 1.327 1.13c-1.376-.152-2.445-.334-3.675-1.019c-3.214-1.79-4.599-5.347-3.014-8.739c.528-1.13 1.311-2.125 2.2-2.993l1.139-1.051q.67-.662 1.243-1.407c.78-1.013 1.448-2.152 1.784-3.394c.157-.58.307-1.635.383-2.093c.439.263 1.391.81 1.897 1.177c1.36.988 2.199 2.191 2.843 3.723";
const STOP = "M12.746 2.027a10 10 0 0 1 4.699 1.584c5.563 3.618 6.124 11.579 1.116 15.936a10 10 0 0 1-2.998 1.8a10.1 10.1 0 0 1-4.309.626a10 10 0 0 1-4.699-1.584C.992 16.771.431 8.81 5.439 4.453a10 10 0 0 1 2.998-1.8a10.1 10.1 0 0 1 4.309-.626M10 8c-1.146.046-1.954.854-2 2v4c.017.43.129.83.386 1.181c.385.526.973.793 1.614.819h4c.43-.017.83-.129 1.181-.386c.526-.385.793-.973.819-1.614v-4c-.046-1.146-.854-1.954-2-2Z";

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
        <img className={styles.media} src={campfire.src} alt="" width={400} height={225} loading="lazy" />
      )}
      <canvas ref={snowRef} className={styles.snow} aria-hidden />
      <button className={`${styles.sound} ${listening ? styles.on : ""}`} onClick={toggle} aria-pressed={listening}>
        <svg className={styles.icon} width="18" height="18" viewBox="0 0 24 24" aria-hidden>
          <path fill="currentColor" d={listening ? STOP : FIRE} />
        </svg>
        {listening ? "Stop the fire" : "Sit by the fire"}
      </button>
    </section>
  );
}
