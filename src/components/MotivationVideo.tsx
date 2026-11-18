import { motivationVideo } from "@/data/content";
import styles from "./Slots.module.css";

export default function MotivationVideo({ className = "" }: { className?: string }) {
  return (
    <section className={`card ${styles.video} ${className}`} aria-label="Motivation video">
      {motivationVideo.src ? (
        <video
          src={motivationVideo.src}
          poster={motivationVideo.poster || undefined}
          autoPlay
          muted
          loop
          playsInline
          controls
        />
      ) : (
        <p className={styles.empty}>Motivational video</p>
      )}
    </section>
  );
}
