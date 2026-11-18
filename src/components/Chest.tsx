import type { CSSProperties } from "react";
import styles from "./Chest.module.css";

// A 3D isometric Minecraft-style chest built from CSS boxes with pixel-art wood
// textures. The lid is hinged at the back and swings open when `open` is true.

const OUTLINE = "#33240f";
const WOOD = ["#9c6b2b", "#8f6126"];
const GRAIN = ["#b07c33", "#7a531f", "#a87430"];

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** A w×h pixel wood texture with a dark outline, as an SVG data URL. */
function wood(w: number, h: number, seed: number, opts: { seamTop?: boolean } = {}) {
  const r = rng(seed);
  let rects = "";
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const edge = x === 0 || y === 0 || x === w - 1 || y === h - 1 || (opts.seamTop && y === 1);
      let c = edge ? OUTLINE : WOOD[Math.floor(y / 2) % 2];
      if (!edge && r() < 0.22) c = GRAIN[Math.floor(r() * GRAIN.length)];
      rects += `<rect x="${x}" y="${y}" width="1" height="1" fill="${c}"/>`;
    }
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges">${rects}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

// textures are generated once (16 px wide faces; base 11 rows, lid 5 rows)
const TEX = {
  baseFront: wood(16, 11, 1, { seamTop: true }),
  baseSide: wood(16, 11, 2, { seamTop: true }),
  lidFront: wood(16, 5, 3),
  lidSide: wood(16, 5, 4),
  lidTop: wood(16, 16, 5),
};

type Face = "front" | "back" | "left" | "right" | "top" | "bottom";

function Box({ className, faces }: { className: string; faces: Partial<Record<Face, CSSProperties & { children?: React.ReactNode }>> }) {
  return (
    <div className={`${styles.box} ${className}`}>
      {(Object.keys(faces) as Face[]).map((f) => {
        const { children, ...style } = faces[f]!;
        return (
          <div key={f} className={`${styles.face} ${styles[f]}`} style={style}>
            {children}
          </div>
        );
      })}
    </div>
  );
}

export default function Chest({ open }: { open: boolean }) {
  return (
    <span className={`${styles.chest} ${open ? styles.open : ""}`} aria-hidden>
      <span className={styles.shadow} />
      <span className={styles.scene}>
        <Box
          className={styles.base}
          faces={{
            front: { backgroundImage: TEX.baseFront },
            right: { backgroundImage: TEX.baseSide },
            left: { backgroundImage: TEX.baseSide },
            back: { backgroundImage: TEX.baseFront },
            top: {}, // the dark inside, lit up when the chest is open
          }}
        />
        <Box
          className={styles.lid}
          faces={{
            front: { backgroundImage: TEX.lidFront, children: <span className={styles.latch} /> },
            right: { backgroundImage: TEX.lidSide },
            left: { backgroundImage: TEX.lidSide },
            back: { backgroundImage: TEX.lidFront },
            top: { backgroundImage: TEX.lidTop },
            bottom: {},
          }}
        />
      </span>
      <span className={styles.sparkles}>
        <i />
        <i />
        <i />
        <i />
      </span>
    </span>
  );
}
