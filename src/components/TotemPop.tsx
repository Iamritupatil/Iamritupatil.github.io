"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { playClip, preloadClips } from "@/lib/sfx";
import styles from "./TotemPop.module.css";

const COLORS = ["#8ee53f", "#5fbf2a", "#3e9a22", "#f5e05a", "#e6b632", "#c9f27a"];

// Seeded so the server and the browser draw the same burst
function burst(seed: number) {
  let s = seed;
  const rnd = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
  return Array.from({ length: 64 }, (_, i) => {
    const angle = rnd() * Math.PI * 2;
    const dist = 120 + rnd() * 260;
    return {
      "--dx": `${Math.cos(angle) * dist}px`,
      "--dy": `${Math.sin(angle) * dist * 0.75 - 60}px`,
      "--size": `${8 + Math.floor(rnd() * 3) * 3}px`,
      "--delay": `${0.12 + rnd() * 0.25}s`,
      "--dur": `${0.9 + rnd() * 0.9}s`,
      background: COLORS[i % COLORS.length],
    } as CSSProperties;
  });
}

/**
 * Minecraft's "totem of undying" moment for the 404 page: the totem flies up at you,
 * spins, and a burst of green and gold particles goes off, with the totem sound.
 * Browsers block sound until the visitor interacts, so if it couldn't play on load,
 * the first click or key press pops the totem again with sound.
 */
export default function TotemPop() {
  const [round, setRound] = useState(0);
  const last = useRef(0);
  const pop = () => {
    if (Date.now() - last.current < 400) return; // pointerdown + click of one tap
    last.current = Date.now();
    setRound((r) => r + 1);
    void playClip("totem");
  };

  const popRef = useRef(pop);
  popRef.current = pop;

  useEffect(() => {
    preloadClips("totem");
    let armed = false;
    const again = (e: Event) => {
      if ((e.target as Element | null)?.closest?.("a")) return; // leaving: don't pop
      cleanup();
      popRef.current();
    };
    const cleanup = () => {
      window.removeEventListener("pointerdown", again);
      window.removeEventListener("keydown", again);
    };
    playClip("totem").then((played) => {
      if (played || armed) return;
      armed = true;
      window.addEventListener("pointerdown", again);
      window.addEventListener("keydown", again);
    });
    return cleanup;
  }, []);

  return (
    <button
      type="button"
      data-sfx // plays the totem, not the click
      className={styles.stage}
      aria-label="Use the totem again"
      title="Use the totem again"
      onClick={pop}
    >
      <span key={round} className={styles.anim}>
        <span className={styles.flash} />
        <span className={styles.particles} aria-hidden>
          {burst(round * 7919 + 1).map((style, i) => (
            <i key={i} style={style} />
          ))}
        </span>
        <img className={styles.totem} src="/images/totem.png" alt="Totem of undying" width={189} height={191} />
      </span>
    </button>
  );
}
