import type { Metadata } from "next";
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
      <h1 className={styles.code}>404</h1>
      <a className={styles.home} href={routes.home}>
        <span aria-hidden>←</span> Home
      </a>
      <TotemPop />
    </main>
  );
}
