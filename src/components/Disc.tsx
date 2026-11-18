"use client";

import { useState } from "react";
import styles from "./Disc.module.css";

const TRACK = "https://open.spotify.com/embed/track/72P5fXOZl6qWnq4HY5UuQS?utm_source=generator&theme=0";

/** A Minecraft music disc that slowly turns; click it to open the Spotify player. */
export default function Disc() {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.wrap}>
      <button
        className={`${styles.disc} ${open ? styles.playing : ""}`}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={open ? "Hide the music player" : "Play a song"}
        title={open ? "Hide the player" : "Play a song"}
      >
        <img src="/images/disc.png" alt="" width={15} height={10} />
      </button>
      {open && (
        <div className={styles.player}>
          <iframe
            src={TRACK}
            title="Spotify player"
            width="100%"
            height="152"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
}
