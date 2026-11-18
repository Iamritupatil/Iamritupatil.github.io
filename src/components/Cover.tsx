"use client";

import { useEffect, useState } from "react";
import { profile } from "@/data/content";
import { toggleTheme } from "@/lib/theme";
import { playClip, setSound, soundOn } from "@/lib/sfx";
import FruitRun from "./game/FruitRun";
import styles from "./Cover.module.css";

type Mode = "human" | "agent";
const SLIDE_MS = 5000;

export default function Cover() {
  const [mode, setMode] = useState<Mode>("human");
  const [slide, setSlide] = useState(0);
  const [game, setGame] = useState<string | null>(null); // background of the open game
  const [sound, setSoundState] = useState(true);
  const banners = profile.banners;

  // Speaker button state (stored per visitor)
  useEffect(() => {
    const sync = () => setSoundState(soundOn());
    sync();
    window.addEventListener("soundchange", sync);
    return () => window.removeEventListener("soundchange", sync);
  }, []);

  // Banner slideshow (paused while the game is open or the tab is hidden)
  useEffect(() => {
    if (game || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      if (!document.hidden) setSlide((s) => (s + 1) % banners.length);
    }, SLIDE_MS);
    return () => clearInterval(id);
  }, [game, banners.length]);

  // Agent mode swaps the page for a plain, machine-readable profile (see AgentView)
  useEffect(() => {
    document.documentElement.dataset.mode = mode;
    if (mode === "agent") document.getElementById("agent-view")?.scrollIntoView({ block: "start" });
  }, [mode]);

  const play = () => setGame(banners[slide].src);

  // While the game is open the profile row moves out from under the banner
  useEffect(() => {
    if (game) document.documentElement.dataset.playing = "";
    else delete document.documentElement.dataset.playing;
  }, [game]);

  return (
    <section className={styles.cover}>
      {banners.map((b, i) => (
        <img
          key={b.src}
          className={`${styles.image} ${i === slide ? styles.shown : ""}`}
          src={b.src}
          alt={i === slide ? b.alt : ""}
          aria-hidden={i !== slide}
          style={{ objectPosition: b.position }}
          loading={i === 0 ? "eager" : "lazy"}
          onClick={play}
        />
      ))}

      <div className={styles.switch} role="tablist" aria-label="Who is reading">
        <span className={`${styles.pill} ${mode === "agent" ? styles.pillAgent : ""}`} aria-hidden />
        <button
          role="tab"
          aria-selected={mode === "human"}
          className={`${styles.option} ${styles.human} ${mode === "human" ? styles.active : ""}`}
          onClick={() => setMode("human")}
        >
          Human
        </button>
        <button
          role="tab"
          aria-selected={mode === "agent"}
          aria-controls="agent-view"
          className={`${styles.option} ${styles.agent} ${mode === "agent" ? styles.active : ""}`}
          onClick={() => setMode("agent")}
        >
          Agent
        </button>
      </div>

      {/* Sun in the dark theme, moon in the light theme (swapped in CSS, no flash) */}
      <button
        className={styles.sound}
        aria-label={sound ? "Turn sound off" : "Turn sound on"}
        aria-pressed={sound}
        onClick={() => setSound(!sound)}
      >
        <svg width="20" height="20" viewBox="0 0 10 10" shapeRendering="crispEdges" aria-hidden>
          <path d="M1 4h2v2H1zM3 3h1v4H3zM4 2h1v6H4z" fill="#BBC3AE" />
          {sound ? (
            <path d="M6 4h1v2H6zM8 2h1v1H8zM8 7h1v1H8zM9 3h1v4H9z" fill="#E4BD66" />
          ) : (
            <path d="M6 3h1v1H6zM7 4h1v2H7zM6 6h1v1H6zM8 3h1v1H8zM8 6h1v1H8z" fill="#c85a5a" />
          )}
        </svg>
      </button>

      <button
        className={styles.theme}
        aria-label="Switch the lights"
        data-sfx // plays the lantern instead of the click
        onClick={() => {
          toggleTheme();
          void playClip("lantern");
        }}
      >
        <img className={styles.sun} src="/icons/sun.svg" alt="" width={24} height={24} />
        <img className={styles.moon} src="/icons/moon.svg" alt="" width={24} height={24} />
      </button>

      <div className={styles.dots} aria-hidden>
        {banners.map((b, i) => (
          <span key={b.src} className={i === slide ? styles.dotOn : undefined} />
        ))}
      </div>

      <button className={styles.play} onClick={play}>
        <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
          <path fill="#F2C55C" d="M7.436 3.495c.337.073.668.257.979.397l1.495.701a68 68 0 0 1 8.355 4.823l1.354.945c.544.392 1.131.755 1.205 1.486c.02.195.001.395-.057.583c-.176.567-.686.867-1.141 1.195l-.842.594a68 68 0 0 1-5.43 3.374a65 65 0 0 1-4.508 2.309c-.473.219-1.158.614-1.687.626a1.47 1.47 0 0 1-.766-.196c-.721-.417-.734-1.125-.809-1.864l-.095-1.032a67 67 0 0 1-.047-10.27l.142-1.642c.085-.833.133-1.649 1.05-1.977a1.47 1.47 0 0 1 .802-.052" />
        </svg>
        Play Fruit Run
      </button>

      {game && <FruitRun background={game} onClose={() => setGame(null)} />}
    </section>
  );
}
