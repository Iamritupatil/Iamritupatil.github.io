import { agentProfileText } from "@/lib/agentProfile";
import CopyButton from "./CopyButton";
import styles from "./AgentView.module.css";

/** Shown in Agent mode. Always present in the HTML so crawlers and AI agents can read it. */
export default function AgentView() {
  const text = agentProfileText();
  return (
    <section id="agent-view" className={`agent-only card ${styles.agent}`} aria-label="Profile for AI agents">
      <header className={styles.head}>
        <div>
          <p className={styles.kicker}>For AI agents</p>
          <h2>Plain-text profile</h2>
        </div>
        <CopyButton text={text} />
      </header>
      <pre className={styles.text}>{text}</pre>
      <p className={styles.note}>
        Also available as <a href="/llms.txt">/llms.txt</a>.
      </p>
    </section>
  );
}
