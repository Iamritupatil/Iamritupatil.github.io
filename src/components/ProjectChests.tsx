"use client";

import { useState } from "react";
import { projects, routes, type Project } from "@/data/content";
import { sfx } from "@/lib/sfx";
import Chest from "./Chest";
import ProjectCard from "./ProjectCard";
import styles from "./ProjectChests.module.css";

const CHESTS: { project: Project; featured: boolean }[] = [
  { project: projects.featured, featured: true },
  ...projects.pair.map((project) => ({ project, featured: false })),
];

/** Projects as chests: click one to open it and see the project inside. */
export default function ProjectChests() {
  const [open, setOpen] = useState<number | null>(null);

  const toggle = (i: number) => {
    if (open === i) {
      sfx.chestClose();
      setOpen(null);
    } else {
      if (open !== null) sfx.chestClose();
      sfx.chestOpen();
      setOpen(i);
    }
  };

  return (
    <section className={styles.section} aria-labelledby="projects-title">
      <div className={styles.head}>
        <h2 id="projects-title" className={styles.title}>
          Projects
        </h2>
        <p className={styles.hint}>{open === null ? "Click a chest to open it" : "Click it again to close"}</p>
      </div>

      <div className={styles.row}>
        {CHESTS.map(({ project }, i) => (
          <button
            key={project.name}
            className={`${styles.slot} ${open === i ? styles.active : ""}`}
            onClick={() => toggle(i)}
            aria-expanded={open === i}
            aria-controls="chest-loot"
          >
            <Chest open={open === i} />
            <span className={styles.name}>{project.name}</span>
            <span className={styles.line}>{project.description[0]}</span>
          </button>
        ))}
      </div>

      <div id="chest-loot" className={styles.loot} aria-live="polite">
        {open !== null && (
          <div key={open} className={styles.reveal}>
            <ProjectCard project={CHESTS[open].project} featured={CHESTS[open].featured} />
          </div>
        )}
      </div>

      <a className={styles.all} href={routes.projects}>
        All projects <span aria-hidden>→</span>
      </a>
    </section>
  );
}
