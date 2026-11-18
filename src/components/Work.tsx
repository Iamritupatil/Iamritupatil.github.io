import { work } from "@/data/content";
import styles from "./Work.module.css";

export default function Work() {
  return (
    <section className={styles.work}>
      <h2 className={styles.title}>Work</h2>
      <div className={styles.cards}>
        {work.map((w) => {
          const body = (
            <>
              <span className={styles.logo} style={{ background: w.tint }} aria-hidden>
                {w.mark}
              </span>
              <div className={styles.text}>
                <h3 className={styles.org}>{w.org}</h3>
                <p className={styles.role}>
                  {w.role}
                  {w.period && <span className={styles.now}>{w.period}</span>}
                </p>
              </div>
            </>
          );
          return w.href ? (
            <a key={w.org} className={`${styles.card} ${styles.link}`} href={w.href} target="_blank" rel="noreferrer">
              {body}
            </a>
          ) : (
            <article key={w.org} className={styles.card}>
              {body}
            </article>
          );
        })}
      </div>
    </section>
  );
}
