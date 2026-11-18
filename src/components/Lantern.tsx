"use client";

import { useRef, useState } from "react";
import { toggleTheme } from "@/lib/theme";
import { playClip } from "@/lib/sfx";
import styles from "./Lantern.module.css";

const U = 6; // one chain pixel, in CSS px
const CHAIN = 84; // resting chain length (short), in CSS px
const MAX_PULL = 90; // how far the chain stretches
const TRIGGER = 45; // pull past this and let go to switch the lights

// One chain tile, 3 × 6 pixels: an open link, then a link seen side-on
const LINK = [".k.", "k.k", "k.k", ".k.", ".K.", ".K."];
const LINK_COLORS: Record<string, string> = { k: "#5a6272", K: "#8a93a3" };

const tex = (name: string) => `url(/images/lantern/${name}.png)`;
type Face = "front" | "back" | "left" | "right" | "top" | "bottom";

/** A textured cuboid; the box's class sets its size (--w, --h) and position. */
function Box({ className, faces }: { className: string; faces: Partial<Record<Face, string>> }) {
  return (
    <span className={`${styles.box} ${className}`}>
      {(Object.keys(faces) as Face[]).map((f) => (
        <span key={f} className={`${styles.face} ${styles[f]}`} style={{ backgroundImage: tex(faces[f]!) }} />
      ))}
    </span>
  );
}

/** Hanging Minecraft lantern: pull it down and let go (or click it) to switch the lights. */
export default function Lantern({ className = "" }: { className?: string }) {
  const [pull, setPull] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startY = useRef<number | null>(null);
  const moved = useRef(false);

  const switchLights = () => {
    toggleTheme();
    void playClip("lantern");
  };

  const release = () => {
    if (startY.current === null) return;
    if (pull >= TRIGGER) switchLights();
    startY.current = null;
    setDragging(false);
    setPull(0);
  };

  // chain height snaps to whole pixels so links never blur
  const chainPx = Math.round((CHAIN + pull) / U) * U;

  return (
    <button
      type="button"
      data-sfx // has its own sound: no click
      className={`${styles.lantern} ${dragging ? styles.dragging : ""} ${className}`}
      aria-label="Pull the lantern to switch the lights"
      title="Pull me"
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        startY.current = e.clientY;
        moved.current = false;
        setDragging(true);
      }}
      onPointerMove={(e) => {
        if (startY.current === null) return;
        const dy = Math.max(0, Math.min(MAX_PULL, e.clientY - startY.current));
        if (dy > 4) moved.current = true;
        setPull(dy);
      }}
      onPointerUp={release}
      onPointerCancel={release}
      onClick={() => {
        // Keyboard / plain click toggles too; a drag already handled it on release.
        if (!moved.current) switchLights();
        moved.current = false;
      }}
    >
      <span className={styles.swing}>
        {/* the chain stays fixed at the top and stretches as you pull */}
        <svg
          className={styles.chain}
          width={3 * U}
          height={chainPx}
          viewBox={`0 0 3 ${chainPx / U}`}
          shapeRendering="crispEdges"
          aria-hidden
        >
          <defs>
            <pattern id="lantern-link" width="3" height="6" patternUnits="userSpaceOnUse">
              {LINK.flatMap((row, y) =>
                [...row].map((c, x) =>
                  LINK_COLORS[c] ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={LINK_COLORS[c]} /> : null,
                ),
              )}
            </pattern>
          </defs>
          <rect width="3" height={chainPx / U} fill="url(#lantern-link)" />
        </svg>
        <span className={styles.model} aria-hidden>
          <span className={styles.glow} />
          <span className={styles.scene}>
            <Box className={styles.cap} faces={{ front: "cap-side", back: "cap-side", left: "cap-side", right: "cap-side", top: "cap-top" }} />
            <Box className={styles.body} faces={{ front: "side", back: "side", left: "side", right: "side", top: "top", bottom: "top" }} />
          </span>
        </span>
      </span>
    </button>
  );
}
