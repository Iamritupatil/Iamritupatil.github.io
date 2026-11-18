import Cover from "@/components/Cover";
import Profile from "@/components/Profile";
import Work from "@/components/Work";
import Contributions from "@/components/Contributions";
import ProjectCard from "@/components/ProjectCard";
import MotivationVideo from "@/components/MotivationVideo";
import Lantern from "@/components/Lantern";
import Footer from "@/components/Footer";
import { projects, routes } from "@/data/content";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <main className={styles.page}>
        <div className={styles.lantern}>
          <Lantern />
        </div>
        <Cover />
        <Profile />
        <Work />
        <Contributions />

        <section className={styles.projects}>
          <ProjectCard project={projects.featured} featured />
          <div className={styles.pair}>
            <ProjectCard project={projects.pair[0]} />
            <ProjectCard project={projects.pair[1]} />
          </div>
          <a className={styles.allProjects} href={routes.projects}>
            All projects <span aria-hidden>→</span>
          </a>
        </section>
        <MotivationVideo className={styles.slotLarge} />
      </main>
      <Footer />
    </>
  );
}
