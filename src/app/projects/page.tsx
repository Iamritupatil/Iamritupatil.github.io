import type { Metadata } from "next";
import Footer from "@/components/Footer";
import ProjectChests from "@/components/ProjectChests";
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

        <ProjectChests items={allProjects} />
      </main>
      <Footer />
    </>
  );
}
