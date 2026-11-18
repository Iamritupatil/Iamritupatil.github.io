import type { Metadata } from "next";
import Footer from "@/components/Footer";
import { allProjects, github, routes } from "@/data/content";
import styles from "./projects.module.css";

export const metadata: Metadata = {
  title: "Projects · Ritu Patil",
  description: "Things Ritu Patil has built: AgentGate, Patchline, Notchman, MiniClay AI and more.",
};

export default function Projects() {
  return (
    <>
      <main className={styles.page}>
        <a className={styles.back} href={routes.home}>
          <span aria-hidden>←</span> Ritu Patil
        </a>
        <header className={styles.header}>
          <h1>Projects</h1>
          <p>
            Pinned on{" "}
            <a href={github.url} target="_blank" rel="noreferrer">
              GitHub
            </a>
            , plus what I&rsquo;m building now.
          </p>
        </header>

        <ul className={styles.grid}>
          {allProjects.map((p) => (
            <li key={p.name} className={`card ${styles.item}`}>
              {p.image && (
                <a className={styles.shot} href={p.site ?? p.repo} target="_blank" rel="noreferrer" tabIndex={-1} aria-hidden>
                  <img src={p.image} alt="" loading="lazy" />
                </a>
              )}
              <div className={styles.head}>
                <h2>{p.name}</h2>
                {p.language && <span className={styles.lang}>{p.language}</span>}
              </div>
              {p.description && <p className={styles.desc}>{p.description}</p>}
              <div className={styles.links}>
                {p.site && (
                  <a href={p.site} target="_blank" rel="noreferrer">
                    Visit <span aria-hidden>↗</span>
                  </a>
                )}
                {p.repo && (
                  <a href={p.repo} target="_blank" rel="noreferrer">
                    GitHub <span aria-hidden>↗</span>
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </>
  );
}
