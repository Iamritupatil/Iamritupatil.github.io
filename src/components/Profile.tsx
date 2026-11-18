import { profile, socials } from "@/data/content";
import styles from "./Profile.module.css";

export default function Profile() {
  return (
    <section className={styles.profile}>
      <div className={styles.header}>
        <div className={styles.avatar}>
          <img src={profile.photo} alt={profile.name} />
        </div>
        <div className={styles.identity}>
          <h1 className={styles.name}>{profile.name}</h1>
          <p className={styles.location}>
            <span className={styles.pin}>
              <img src="/icons/location.svg" alt="" width={15} height={17} />
            </span>
            {profile.location}
          </p>
        </div>
      </div>

      <p className={styles.intro}>{profile.intro}</p>

      <ul className={styles.socials}>
        {socials.map((s) => (
          <li key={s.name}>
            <a href={s.href} aria-label={s.name} className={styles.social}>
              <img src={s.icon} alt="" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
