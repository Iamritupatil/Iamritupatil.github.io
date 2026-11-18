"use client";

import { useEffect, useState } from "react";
import { profile } from "@/data/content";
import { toggleTheme } from "@/lib/theme";
import FruitRun from "./game/FruitRun";
import styles from "./Cover.module.css";

type Mode = "human" | "agent";
const SLIDE_MS = 5000;

export default function Cover() {
  const [mode, setMode] = useState<Mode>("human");
  const [slide, setSlide] = useState(0);
  const [game, setGame] = useState<string | null>(null); // background of the open game
  const banners = profile.banners;

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
      <button className={styles.theme} aria-label="Switch the lights" onClick={() => toggleTheme()}>
        <img className={styles.sun} src="/icons/sun.svg" alt="" width={24} height={24} />
        <img className={styles.moon} src="/icons/moon.svg" alt="" width={24} height={24} />
      </button>

      <div className={styles.dots} aria-hidden>
        {banners.map((b, i) => (
          <span key={b.src} className={i === slide ? styles.dotOn : undefined} />
        ))}
      </div>

      <button className={styles.play} onClick={play}>
        <span aria-hidden>▶</span> Play Fruit Run
      </button>

      {game && <FruitRun background={game} onClose={() => setGame(null)} />}
    </section>
  );
}
