"use client";

import { useState } from "react";
import styles from "./YouTubeEmbed.module.css";

/**
 * Click-to-load YouTube player: shows the thumbnail and a play button, and only
 * loads YouTube's iframe once someone presses play (keeps the page fast).
 */
export default function YouTubeEmbed({ id, title }: { id: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  const watchUrl = `https://www.youtube.com/watch?v=${id}`;

  if (playing) {
    return (
      <iframe
        className={styles.frame}
        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    );
  }

  return (
    <div className={styles.poster} style={{ backgroundImage: `url(https://i.ytimg.com/vi/${id}/hqdefault.jpg)` }}>
      <button className={styles.play} onClick={() => setPlaying(true)} aria-label={`Play: ${title}`}>
        <span aria-hidden>▶</span>
      </button>
      <a className={styles.watch} href={watchUrl} target="_blank" rel="noreferrer">
        Watch on YouTube ↗
      </a>
    </div>
  );
}
