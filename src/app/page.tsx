import Cover from "@/components/Cover";
import Profile from "@/components/Profile";
import Work from "@/components/Work";
import Contributions from "@/components/Contributions";
import ProjectChests from "@/components/ProjectChests";
import MotivationVideo from "@/components/MotivationVideo";
import Lantern from "@/components/Lantern";
import Footer from "@/components/Footer";
import AgentView from "@/components/AgentView";
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
        <AgentView />
        <div className="human-only">
          <Work />
          <Contributions />
          <ProjectChests />
          <MotivationVideo className={styles.slotLarge} />
        </div>
      </main>
      <Footer />
    </>
  );
}
