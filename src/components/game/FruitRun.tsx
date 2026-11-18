"use client";

import { useEffect, useRef } from "react";
import { startFruitRun } from "./engine";
import styles from "./FruitRun.module.css";

export default function FruitRun({ background, onClose }: { background?: string; onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.focus();
    return startFruitRun(canvas, { background, onExit: () => closeRef.current() });
  }, [background]);

  return (
    <div className={styles.game}>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        tabIndex={0}
        aria-label="Fruit Run game. Press space or tap to jump. Escape closes it."
      />
      <button className={styles.close} onClick={onClose} aria-label="Close game">
        ✕
      </button>
    </div>
  );
}
