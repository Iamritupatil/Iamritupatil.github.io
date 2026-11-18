"use client";

import { useEffect } from "react";
import { playClip, preloadClips } from "@/lib/sfx";

/**
 * The Minecraft UI click for every click anywhere on the site. Things with their
 * own sound (chests, the lantern, the game) opt out with a `data-sfx` attribute.
 * Listens after React's handlers so the speaker button's new state is respected.
 */
export default function ClickSound() {
  useEffect(() => {
    preloadClips("click");
    const onClick = (e: MouseEvent) => {
      const t = e.target as Element | null;
      // data-sfx: this element and everything inside it; data-sfx-self: just this element
      if (t?.closest?.("[data-sfx]") || t?.hasAttribute?.("data-sfx-self")) return;
      void playClip("click");
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
