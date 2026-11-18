"use client";

import { useEffect, useRef, useState } from "react";
import type { Repo } from "@/data/content";
import Chest from "./Chest";
import styles from "./ProjectChests.module.css";

/** Projects page: every project sits in a chest. Click one to open it and see what's inside. */
export default function ProjectChests({ items }: { items: Repo[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const lootRef = useRef<HTMLDivElement>(null);

  // bring the opened project into view (it appears below the chests)
  useEffect(() => {
    if (open !== null) lootRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [open]);

  const item = open !== null ? items[open] : null;

  return (
    <section className={styles.section} aria-label="Projects">
      <p className={styles.hint}>{open === null ? "Click a chest to open it" : "Click it again to close"}</p>

      <div className={styles.row}>
        {items.map((p, i) => (
          <button
            key={p.name}
            className={`${styles.slot} ${open === i ? styles.active : ""}`}
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
            aria-controls="chest-loot"
          >
            <Chest open={open === i} />
            <span className={styles.name}>{p.name}</span>
            {p.language && <span className={styles.line}>{p.language}</span>}
          </button>
        ))}
      </div>

      <div id="chest-loot" ref={lootRef} className={styles.loot} aria-live="polite">
        {item && (
          <article key={item.name} className={`card ${styles.reveal} ${styles.card}`}>
            {item.image && (
              <a className={styles.shot} href={item.site ?? item.repo} target="_blank" rel="noreferrer" tabIndex={-1} aria-hidden>
                <img src={item.image} alt="" />
              </a>
            )}
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
          </article>
        )}
      </div>
    </section>
  );
}
