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
      <TotemPop />
      <p className={styles.code}>404</p>
      <h1 className={styles.title}>You fell into the void.</h1>
      <p className={styles.text}>
        Lucky you had a totem. This page doesn&rsquo;t exist, but you live to click another day.
      </p>
      <a className={styles.home} href={routes.home}>
        <span aria-hidden>←</span> Back home
      </a>
    </main>
  );
}
