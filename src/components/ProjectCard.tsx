import type { Project } from "@/data/content";
import XEmbed from "./XEmbed";
import YouTubeEmbed from "./YouTubeEmbed";
import { isXPost, youTubeId } from "@/lib/video";
import styles from "./ProjectCard.module.css";

export default function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  const { primary, site, video } = project;
  return (
    <article className={`card ${styles.project} ${featured ? styles.featured : ""}`}>
      <div className={styles.body}>
        {!featured && project.image && (
          <a
            className={styles.shot}
            href={primary?.href ?? site?.href ?? "#"}
            target="_blank"
            rel="noreferrer"
            tabIndex={-1}
            aria-hidden
          >
            <img src={project.image} alt="" loading="lazy" />
          </a>
        )}
        <h3 className={styles.name}>{project.name}</h3>
        <p className={styles.description}>
          {project.description.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </p>
        {(primary || site) && (
          <div className={styles.actions}>
            {primary && (
              <a
                className={`${styles.download} ${primary.icon ? "" : styles.noIcon}`}
                href={primary.href}
                target={primary.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
              >
                {primary.icon === "apple" && <img src="/icons/apple.svg" alt="" width={20} height={20} />}
                {primary.label}
              </a>
            )}
            {site && (
              <a className={styles.site} href={site.href} target="_blank" rel="noreferrer">
                {site.label}
                <img src="/icons/link-out.svg" alt="" width={14} height={14} />
              </a>
            )}
          </div>
        )}
      </div>

      {featured && (
        <div className={`${styles.launch} ${video ? styles.hasVideo : ""} ${video && isXPost(video) ? styles.launchX : ""}`}>
          {!video ? (
            <span className={styles.launchEmpty}>Launch video</span>
          ) : youTubeId(video) ? (
            <YouTubeEmbed id={youTubeId(video)!} title={`${project.name} launch video`} />
          ) : isXPost(video) ? (
            <XEmbed url={video} />
          ) : (
            <video src={video} autoPlay muted loop playsInline controls />
          )}
        </div>
      )}
    </article>
  );
}
