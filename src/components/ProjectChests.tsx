"use client";

import { useEffect, useRef, useState } from "react";
import type { Repo } from "@/data/content";
import { playClip } from "@/lib/sfx";
import Chest from "./Chest";
import styles from "./ProjectChests.module.css";

/**
 * Projects page: a grid of chests. Opening one plays the chest sound and shows the
 * project in a frosted-glass window over the blurred page. Closing it closes the chest.
 */
export default function ProjectChests({ items }: { items: Repo[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const lastChest = useRef<HTMLButtonElement | null>(null);
  const item = open !== null ? items[open] : null;

  const openChest = (i: number, el: HTMLButtonElement) => {
    if (open !== null) return;
    lastChest.current = el;
    void playClip("chest-open");
    setOpen(i);
  };

  const close = () => {
    if (open === null) return;
    void playClip("chest-close");
    setOpen(null);
    lastChest.current?.focus();
  };

  // while the window is up: Esc closes it, the page behind doesn't scroll
  useEffect(() => {
    if (open === null) return;
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <>
      <div className={styles.grid}>
        {items.map((p, i) => (
          <button
            key={p.name}
            className={`${styles.slot} ${open === i ? styles.active : ""}`}
            data-sfx // the chest makes its own sound
            onClick={(e) => openChest(i, e.currentTarget)}
            aria-haspopup="dialog"
            aria-label={`Open the ${p.name} chest`}
          >
            <Chest open={open === i} />
            <span className={styles.name}>{p.name}</span>
          </button>
        ))}
      </div>

      {item && (
        <>
          <div className={styles.backdrop} onClick={close} data-sfx-self />
          <div className={styles.center}>
            <div
              className={styles.window}
              role="dialog"
              aria-modal="true"
              aria-labelledby="chest-title"
              onClick={(e) => e.stopPropagation()}
            >
              <header className={styles.bar}>
                <div className={styles.titleRow}>
                  <h2 id="chest-title">{item.name}</h2>
                  {item.language && (
                    <span className={styles.lang}>{item.language}</span>
                  )}
                </div>
                <button
                  ref={closeBtn}
                  className={styles.close}
                  onClick={close}
                  aria-label="Close"
                  data-sfx
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
                    <path
                      fill="currentColor"
                      d="m12 13.414l5.657 5.657a1 1 0 0 0 1.414-1.414L13.414 12l5.657-5.657a1 1 0 0 0-1.414-1.414L12 10.586L6.343 4.929A1 1 0 0 0 4.93 6.343L10.586 12l-5.657 5.657a1 1 0 1 0 1.414 1.414z"
                    />
                  </svg>
                </button>
              </header>

              <div className={styles.body}>
                {item.image && (
                  <a
                    className={styles.shot}
                    href={item.site ?? item.repo}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img src={item.image} alt={`${item.name} screenshot`} />
                  </a>
                )}

                <p className={styles.tagline}>
                  {item.overview?.tagline ?? item.description}
                </p>

                {item.overview?.about.map((t) => (
                  <p key={t.slice(0, 24)} className={styles.about}>
                    {t}
                  </p>
                ))}

                {!!item.overview?.highlights.length && (
                  <>
                    <h3 className={styles.sub}>What it does</h3>
                    <ul className={styles.highlights}>
                      {item.overview.highlights.map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>
                  </>
                )}

                {!!item.overview?.stack.length && (
                  <>
                    <h3 className={styles.sub}>Built with</h3>
                    <ul className={styles.stack}>
                      {item.overview.stack.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              <footer className={styles.actions}>
                {item.site && (
                  <a
                    className={styles.primary}
                    href={item.site}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Visit site <span aria-hidden>↗</span>
                  </a>
                )}
                {item.repo && (
                  <a
                    className={item.site ? styles.secondary : styles.primary}
                    href={item.repo}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                      <path
                        fill="currentColor"
                        d="M12 2C6.475 2 2 6.475 2 12a9.99 9.99 0 0 0 6.838 9.488c.5.087.687-.213.687-.476c0-.237-.013-1.024-.013-1.862c-2.512.463-3.162-.612-3.362-1.175c-.113-.288-.6-1.175-1.025-1.413c-.35-.187-.85-.65-.013-.662c.788-.013 1.35.725 1.538 1.025c.9 1.512 2.338 1.087 2.912.825c.088-.65.35-1.087.638-1.337c-2.225-.25-4.55-1.113-4.55-4.938c0-1.088.387-1.987 1.025-2.688c-.1-.25-.45-1.275.1-2.65c0 0 .837-.262 2.75 1.026a9.3 9.3 0 0 1 2.5-.338c.85 0 1.7.112 2.5.337c1.912-1.3 2.75-1.024 2.75-1.024c.55 1.375.2 2.4.1 2.65c.637.7 1.025 1.587 1.025 2.687c0 3.838-2.337 4.688-4.562 4.938c.362.312.675.912.675 1.85c0 1.337-.013 2.412-.013 2.75c0 .262.188.574.688.474A10.02 10.02 0 0 0 22 12c0-5.525-4.475-10-10-10"
                      />
                    </svg>
                    Read the README on GitHub
                  </a>
                )}
              </footer>
            </div>
          </div>
        </>
      )}
    </>
  );
}
