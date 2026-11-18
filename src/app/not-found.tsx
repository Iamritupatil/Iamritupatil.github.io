import type { Metadata } from "next";
import Garden from "@/components/Garden";
import TotemPop from "@/components/TotemPop";
import { routes } from "@/data/content";
import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: "404 · Ritu Patil",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main className={styles.page}>
      <h1 className={styles.code} aria-label="404">
        <span aria-hidden>4</span>
        {/* the 0 is a dead face: two ✕ eyes */}
        <span className={styles.zero} aria-hidden>
          0
          <svg className={styles.face} viewBox="0 0 40 20" aria-hidden>
            <path d="M6 4l8 8M14 4l-8 8M26 4l8 8M34 4l-8 8" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" />
          </svg>
        </span>
        <span aria-hidden>4</span>
      </h1>
      <a className={styles.home} href={routes.home}>
        <span aria-hidden>←</span> Home
      </a>
      <div className={styles.garden}>
        <Garden />
      </div>
      <TotemPop />
    </main>
  );
}
