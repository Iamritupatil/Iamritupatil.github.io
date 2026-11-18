"use client";

import { useRef, useState } from "react";
import { contact } from "@/data/content";
import styles from "./Footer.module.css";

const GARDEN = "/images/garden.png";
const GARDEN_WIDTH = 1906;
const SLICE = 22; // each slice of grass sways on its own, in a travelling wave
const SLICES = Math.ceil(GARDEN_WIDTH / SLICE);

export default function Footer() {
  const [copied, setCopied] = useState(false);
  const emailRef = useRef<HTMLSpanElement>(null);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
    } catch {
      // Clipboard blocked: select the text so it can be copied by hand
      const sel = window.getSelection();
      if (sel && emailRef.current) {
        const range = document.createRange();
        range.selectNodeContents(emailRef.current);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.garden} aria-hidden>
        {Array.from({ length: SLICES }, (_, i) => (
          <span
            key={i}
            style={{
              left: i * SLICE,
              backgroundImage: `url(${GARDEN})`,
              backgroundPosition: `${-i * SLICE}px 100%`,
              animationDelay: `${-(i * 0.13).toFixed(2)}s`,
              animationDuration: `${3 + (i % 5) * 0.35}s`,
            }}
          />
        ))}
      </div>

      <div className={`card ${styles.contact}`}>
        <button className={styles.email} onClick={copy} aria-label={`Copy email ${contact.email}`}>
          <span ref={emailRef}>{contact.email}</span>
          <img src="/icons/copy.svg" alt="" width={16} height={16} />
        </button>
        <p className={styles.copyright}>{copied ? "Email copied!" : contact.copyright}</p>
      </div>
    </footer>
  );
}
