"use client";

import { useState } from "react";
import type { Repo } from "@/data/content";
import Chest from "./Chest";
import styles from "./ProjectChests.module.css";

/** Projects page: a grid of chests. Opening one shows that project in the panel below. */
export default function ProjectChests({ items }: { items: Repo[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const item = open !== null ? items[open] : null;

  return (
    <>
      <div className={styles.grid}>
        {items.map((p, i) => (
          <button
            key={p.name}
            className={`${styles.slot} ${open === i ? styles.active : ""}`}
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
            aria-controls="chest-loot"
            aria-label={`${open === i ? "Close" : "Open"} the ${p.name} chest`}
          >
            <Chest open={open === i} />
            <span className={styles.name}>{p.name}</span>
          </button>
        ))}
      </div>

      <div id="chest-loot" className={`card ${styles.loot}`} aria-live="polite">
        {!item ? (
          <p className={styles.empty}>Open a chest to see what&rsquo;s inside.</p>
        ) : (
          <article key={item.name} className={styles.reveal}>
            {item.image && (
              <a className={styles.shot} href={item.site ?? item.repo} target="_blank" rel="noreferrer" tabIndex={-1} aria-hidden>
                <img src={item.image} alt="" />
              </a>
            )}
            <div className={styles.info}>
              <div className={styles.cardHead}>
                <h2>{item.name}</h2>
                {item.language && <span className={styles.lang}>{item.language}</span>}
              </div>
              {item.description && <p className={styles.desc}>{item.description}</p>}
              <div className={styles.links}>
                {item.site && (
                  <a href={item.site} target="_blank" rel="noreferrer">
                    Visit <span aria-hidden>↗</span>
                  </a>
                )}
                {item.repo && (
                  <a href={item.repo} target="_blank" rel="noreferrer">
                    GitHub <span aria-hidden>↗</span>
                  </a>
                )}
              </div>
            </div>
          </article>
        )}
      </div>
    </>
  );
}
