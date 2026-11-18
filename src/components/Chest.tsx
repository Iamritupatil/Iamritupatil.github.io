import type { CSSProperties, ReactNode } from "react";
import styles from "./Chest.module.css";

// A 3D isometric Minecraft chest built from CSS boxes, textured with the faces of the
// chest texture sheet (public/images/chest). The lid is hinged at the back and stands
// up when `open` is true, showing the black inside.

const tex = (name: string) => `url(/images/chest/${name}.png)`;

type Face = "front" | "back" | "left" | "right" | "top" | "bottom";
type FaceProps = CSSProperties & { children?: ReactNode };

function Box({ className, faces }: { className: string; faces: Partial<Record<Face, FaceProps>> }) {
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
            front: { backgroundImage: tex("front-base") },
            right: { backgroundImage: tex("right-base") },
            left: { backgroundImage: tex("left-base") },
            back: { backgroundImage: tex("back-base") },
            top: {}, // the black inside with its wooden rim
          }}
        />
        <Box
          className={styles.lid}
          faces={{
            front: { backgroundImage: tex("front-lid"), children: <span className={styles.latch} /> },
            right: { backgroundImage: tex("right-lid") },
            left: { backgroundImage: tex("left-lid") },
            back: { backgroundImage: tex("back-lid") },
            top: { backgroundImage: tex("top") },
            bottom: { backgroundImage: tex("underside") },
          }}
        />
      </span>
    </span>
  );
}
