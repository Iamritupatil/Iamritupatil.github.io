"use client";

import { useRef, useState } from "react";
import { contact } from "@/data/content";
import styles from "./Footer.module.css";

const GARDEN = "/images/garden.png";
const GARDEN_WIDTH = 1906;
const SLICE = 22; // grass sways in narrow strips, in a travelling wave
// Each flower (x ranges in the 1906px garden) gets one whole strip, so it sways in one piece
const FLOWERS: [number, number][] = [
  [52, 212], // yellow flower
  [272, 440], // rose bush
  [1480, 1676], // pink tulip
  [1680, 1874], // red tulip
];
const SLICES: { left: number; width: number; flower: boolean }[] = (() => {
  const out: { left: number; width: number; flower: boolean }[] = [];
  let x = 0;
  while (x < GARDEN_WIDTH) {
    const f = FLOWERS.find(([a]) => a >= x && a < x + SLICE);
    if (f && x < f[0]) {
      out.push({ left: x, width: f[0] - x, flower: false });
      x = f[0];
    }
    const inFlower = FLOWERS.find(([a, b]) => x >= a && x < b);
    if (inFlower) {
      out.push({ left: x, width: inFlower[1] - x, flower: true });
      x = inFlower[1];
    } else {
      const w = Math.min(SLICE, GARDEN_WIDTH - x);
      out.push({ left: x, width: w, flower: false });
      x += w;
    }
  }
  return out;
})();

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
        {SLICES.map((s, i) => (
          <span
            key={i}
            className={s.flower ? styles.flower : undefined}
            style={{
              // strips overlap 3px on each side so no gap opens while they sway
              left: s.left - 3,
              width: s.width + 6,
              backgroundImage: `url(${GARDEN})`,
              backgroundPosition: `${-(s.left - 3)}px 100%`,
              animationDelay: `${-((s.left / SLICE) * 0.13).toFixed(2)}s`,
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
