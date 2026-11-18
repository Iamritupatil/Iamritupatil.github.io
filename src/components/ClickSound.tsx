"use client";

import { useEffect } from "react";
import { playClip, preloadClips } from "@/lib/sfx";

const CLICKABLE = 'a, button, [role="button"], [role="tab"], summary, label, input[type="checkbox"], input[type="radio"]';

/**
 * The Minecraft UI click for every button and link on the site. Things with their
 * own sound (chests, the lantern) opt out with a `data-sfx` attribute.
 * Listens after React's handlers so the speaker button's new state is respected.
 */
export default function ClickSound() {
  useEffect(() => {
    preloadClips("click");
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest?.(CLICKABLE);
      if (!el || el.closest("[data-sfx]")) return;
      void playClip("click");
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
