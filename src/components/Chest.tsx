import styles from "./Chest.module.css";

const U = 6; // CSS px per pixel-art pixel

// Wooden chest, 16 pixels wide: a lid (6 rows) and a base (8 rows)
const LID = [
  "oooooooooooooooo",
  "ohhhhhhhhhhhhhho",
  "obbbbbbbbbbbbbbo",
  "oBbbbbbbbbbbbbBo",
  "oBBBBBBBBBBBBBBo",
  "oooooooLLooooooo",
];
const BASE = [
  "obbbbbbllbbbbbbo",
  "ohbbbbbLLbbbbbho",
  "obbbbbbbbbbbbbbo",
  "oBBBBBBBBBBBBBBo",
  "obbbbbbbbbbbbbbo",
  "obbbbbbbbbbbbbbo",
  "oBBBBBBBBBBBBBBo",
  "oooooooooooooooo",
];
const COLORS: Record<string, string> = {
  o: "#2b1a0e", // outline
  h: "#b98245", // highlight
  b: "#8f5c2c", // wood
  B: "#6b4421", // plank shadow
  l: "#e6e6e6", // latch
  L: "#8d8d8d", // latch shadow
};

function Pixels({ rows }: { rows: string[] }) {
  return (
    <svg
      width={rows[0].length * U}
      height={rows.length * U}
      viewBox={`0 0 ${rows[0].length} ${rows.length}`}
      shapeRendering="crispEdges"
      aria-hidden
    >
      {rows.flatMap((row, y) =>
        [...row].map((c, x) =>
          COLORS[c] ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={COLORS[c]} /> : null,
        ),
      )}
    </svg>
  );
}

/** A Minecraft-style chest; `open` lifts the lid and lets the light out. */
export default function Chest({ open }: { open: boolean }) {
  return (
    <span className={`${styles.chest} ${open ? styles.open : ""}`} aria-hidden>
      <span className={styles.lid}>
        <Pixels rows={LID} />
      </span>
      <span className={styles.inside} />
      <span className={styles.sparkles}>
        <i />
        <i />
        <i />
        <i />
      </span>
      <span className={styles.base}>
        <Pixels rows={BASE} />
      </span>
    </span>
  );
}
