import { contributions } from "@/data/content";
import weeks from "@/data/contributions.json";
import styles from "./Contributions.module.css";

// Contribution levels 0–4 (theme-aware, defined in globals.css)
const LEVELS = ["var(--c0)", "var(--c1)", "var(--c2)", "var(--c3)", "var(--c4)"];
const COLUMN_STEP = 18.68;

export default function Contributions() {
  return (
    <section className={`card ${styles.panel}`}>
      <header className={styles.header}>
        <div>
          <h2 className={styles.total}>{contributions.total}</h2>
          <p className={styles.period}>{contributions.period}</p>
        </div>
        <a className={styles.github} href={contributions.githubHref}>
          <img src="/icons/github-mark.svg" alt="" width={18} height={18} />
          GitHub ↗
        </a>
      </header>

      <div className={styles.scroll}>
        <div className={styles.calendar}>
          <div className={styles.months} aria-hidden>
            {contributions.months.map(([label, week], i) => (
              <span key={i} style={{ left: week * COLUMN_STEP }}>
                {label}
              </span>
            ))}
          </div>
          <div className={styles.grid}>
            {(weeks as number[][]).map((days, w) =>
              days.map((level, d) => (
                <span
                  key={`${w}-${d}`}
                  className={styles.cell}
                  style={{ background: LEVELS[level], gridColumn: w + 1, gridRow: d + 1 }}
                />
              )),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
