"use client";

import { useRef, useState } from "react";
import { toggleTheme } from "@/lib/theme";
import styles from "./Lantern.module.css";

const U = 6; // one pixel-art "pixel", in CSS px
const CHAIN = 96; // resting chain length (short), in CSS px
const MAX_PULL = 90; // how far the chain stretches
const TRIGGER = 45; // pull past this and let go to switch the lights

// Iron lantern, 12 × 16 pixels
const BODY = [
  "....dmmd....",
  "....m..m....",
  "..dmmmmmmd..",
  ".dlllllllld.",
  ".dmmmmmmmmd.",
  ".dmoyyyyomd.",
  ".dmyywwyymd.",
  ".dmywwwwymd.",
  ".dmywwwwymd.",
  ".dmyywwyymd.",
  ".dmoyyyyomd.",
  ".dmoooooomd.",
  ".dmmmmmmmmd.",
  ".dlllllllld.",
  "..dmmmmmmd..",
  "...dddddd...",
];
const COLORS: Record<string, string> = {
  d: "#2b2f38",
  m: "#4a5160",
  l: "#7a8394",
  o: "#e8892b",
  y: "#ffc94d",
  w: "#fff1c2",
};

// One chain tile, 3 × 6 pixels: an open link, then a link seen side-on
const LINK = [".k.", "k.k", "k.k", ".k.", ".K.", ".K."];
const LINK_COLORS: Record<string, string> = { k: "#5a6272", K: "#8a93a3" };

function Pixels({ rows, colors }: { rows: string[]; colors: Record<string, string> }) {
  return (
    <>
      {rows.flatMap((row, y) =>
        [...row].map((c, x) =>
          colors[c] ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={colors[c]} /> : null,
        ),
      )}
    </>
  );
}

/** Hanging lantern: pull it down and let go (or click it) to switch the lights. */
export default function Lantern({ className = "" }: { className?: string }) {
  const [pull, setPull] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startY = useRef<number | null>(null);
  const moved = useRef(false);

  const release = () => {
    if (startY.current === null) return;
    if (pull >= TRIGGER) toggleTheme();
    startY.current = null;
    setDragging(false);
    setPull(0);
  };

  // chain height snaps to whole pixels so links never blur
  const chainPx = Math.round((CHAIN + pull) / U) * U;

  return (
    <button
      type="button"
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
        if (!moved.current) toggleTheme();
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
              <Pixels rows={LINK} colors={LINK_COLORS} />
            </pattern>
          </defs>
          <rect width="3" height={chainPx / U} fill="url(#lantern-link)" />
        </svg>
        <svg
          className={styles.body}
          width={12 * U}
          height={16 * U}
          viewBox="0 0 12 16"
          shapeRendering="crispEdges"
          aria-hidden
        >
          <Pixels rows={BODY} colors={COLORS} />
        </svg>
      </span>
    </button>
  );
}
