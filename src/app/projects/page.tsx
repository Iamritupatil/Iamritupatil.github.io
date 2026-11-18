import type { Metadata } from "next";
import Footer from "@/components/Footer";
import ProjectChests from "@/components/ProjectChests";
import { routes, topProjects } from "@/data/content";
import styles from "./projects.module.css";

export const metadata: Metadata = {
  title: "Projects · Ritu Patil",
  description: "What Ritu Patil has built: AgentGate, Patchline, Notchman, MiniClay AI and more.",
};

export default function Projects() {
  return (
    <>
      <main className={styles.page}>
        <a className={styles.back} href={routes.home}>
          <span aria-hidden>←</span> Home
        </a>
        <header className={styles.header}>
          <h1>What I&rsquo;ve built.</h1>
          <p>
            Few commercial products, some hackathon projects
            <br />
            and some random tools.
          </p>
        </header>

        <section className={styles.top} aria-labelledby="top-projects">
          <h2 id="top-projects" className={styles.topTitle}>
            <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden>
              <g fill="#e8663b">
                {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
                  <rect key={a} x="10.6" y="1.5" width="2.8" height="9.5" rx="1.4" transform={`rotate(${a} 12 12)`} />
                ))}
                <circle cx="12" cy="12" r="3" />
              </g>
            </svg>
            Top Projects
          </h2>
          <ProjectChests items={topProjects} />
        </section>
      </main>
      <Footer />
    </>
  );
}
