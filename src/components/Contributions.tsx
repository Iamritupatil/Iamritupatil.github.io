"use client";

import { useEffect, useState } from "react";
import { contributions, github } from "@/data/content";
import styles from "./Contributions.module.css";

// Contribution levels 0–4 (theme-aware, defined in globals.css)
const LEVELS = ["var(--c0)", "var(--c1)", "var(--c2)", "var(--c3)", "var(--c4)"];
const COLUMN_STEP = 18.68;
const WEEKS = 53;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// Public, CORS-enabled mirror of the GitHub contribution calendar
const API = `https://github-contributions-api.jogruber.de/v4/${github.username}?y=last`;
const CACHE = "contributions";

type Day = { date: string; count: number; level: number };
type Calendar = { total: number; days: Day[] };

/** Lay the days out in GitHub's grid: one column per week, Sunday on top. */
function layout(days: Day[]) {
  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));
  const first = new Date(sorted[0].date + "T00:00:00Z").getUTCDay();
  const cells = sorted.map((d, i) => ({ ...d, week: Math.floor((i + first) / 7), weekday: (i + first) % 7 }));
  const shift = Math.max(0, cells[cells.length - 1].week - (WEEKS - 1)); // keep the newest 53 weeks
  const placed = cells.map((c) => ({ ...c, week: c.week - shift })).filter((c) => c.week >= 0);
  // month label above the week that holds the 1st of each month
  const months: [string, number][] = [];
  for (const c of placed) {
    if (c.date.endsWith("-01")) {
      const prev = months[months.length - 1];
      if (!prev || c.week - prev[1] >= 3) months.push([MONTHS[Number(c.date.slice(5, 7)) - 1], c.week]);
    }
  }
  return { placed, months };
}

export default function Contributions() {
  const [cal, setCal] = useState<Calendar | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CACHE);
      if (saved) setCal(JSON.parse(saved));
    } catch {}
    fetch(API)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data: { total: Record<string, number>; contributions: Day[] }) => {
        if (!data.contributions?.length) throw new Error("empty");
        const next = { total: data.total.lastYear ?? data.contributions.reduce((n, d) => n + d.count, 0), days: data.contributions };
        setCal(next);
        try {
          localStorage.setItem(CACHE, JSON.stringify(next));
        } catch {}
      })
      .catch(() => setFailed(true));
  }, []);

  const grid = cal ? layout(cal.days) : null;

  return (
    <section className={`card ${styles.panel}`}>
      <header className={styles.header}>
        <div>
          <h2 className={styles.total}>
            {cal ? `${cal.total.toLocaleString("en-US")} contributions` : failed ? "My contributions" : "Loading contributions…"}
          </h2>
          <p className={styles.period}>{contributions.period}</p>
        </div>
        <a className={styles.github} href={contributions.githubHref} target="_blank" rel="noreferrer">
          <img src="/icons/github-mark.svg" alt="" width={18} height={18} />
          GitHub ↗
        </a>
      </header>

      <div className={styles.scroll}>
        <div className={styles.calendar}>
          <div className={styles.months} aria-hidden>
            {grid?.months.map(([label, week]) => (
              <span key={`${label}-${week}`} style={{ left: week * COLUMN_STEP }}>
                {label}
              </span>
            ))}
          </div>
          <div className={`${styles.grid} ${grid ? "" : styles.loading}`}>
            {grid
              ? grid.placed.map((c) => (
                  <span
                    key={c.date}
                    className={styles.cell}
                    title={`${c.count} contribution${c.count === 1 ? "" : "s"} on ${c.date}`}
                    style={{ background: LEVELS[c.level], gridColumn: c.week + 1, gridRow: c.weekday + 1 }}
                  />
                ))
              : Array.from({ length: WEEKS * 7 }, (_, i) => (
                  <span key={i} className={styles.cell} style={{ background: LEVELS[0] }} />
                ))}
          </div>
        </div>
      </div>
    </section>
  );
}
