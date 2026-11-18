"use client";

import { useRef, useState } from "react";
import { toggleTheme } from "@/lib/theme";
import styles from "./Lantern.module.css";

const MAX_PULL = 90; // px the chain stretches
const TRIGGER = 45; // pull past this and let go to switch the lights

/** Hanging lantern: pull it down and release (or click it) to toggle the theme. */
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

  return (
    <button
      type="button"
      className={`${styles.lantern} ${dragging ? styles.dragging : ""} ${className}`}
      aria-label="Pull the lantern to switch the lights"
      title="Pull me"
      style={{ transform: `translateY(${pull}px)` }}
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
      <img src="/images/lantern.png" alt="" draggable={false} />
    </button>
  );
}
