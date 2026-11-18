"use client";

import { useState } from "react";
import { profile } from "@/data/content";
import { toggleTheme } from "@/lib/theme";
import styles from "./Cover.module.css";

import FruitRun from "./game/FruitRun";

type Mode = "human" | "agent";

export default function Cover() {
  const [mode, setMode] = useState<Mode>("human");
  const [game, setGame] = useState<string | null>(null); // background of the open game
  const play = () =>
    setGame(document.documentElement.dataset.theme === "light" ? profile.coverLight : profile.cover);

  return (
    <section className={styles.cover}>
      {/* Cave in the dark theme, cherry-blossom meadow in the white theme (swapped in CSS) */}
      <img className={styles.image} src={profile.cover} alt="" aria-hidden onClick={play} />
      <img className={styles.imageLight} src={profile.coverLight} alt="" aria-hidden onClick={play} />

      <div className={styles.switch} role="tablist" aria-label="View mode">
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

      <button className={styles.play} onClick={play}>
        <span aria-hidden>▶</span> Play Fruit Run
      </button>

      {game && <FruitRun background={game} onClose={() => setGame(null)} />}
    </section>
  );
}
