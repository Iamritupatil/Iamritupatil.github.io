"use client";

import { useEffect, useRef } from "react";

type Twttr = { widgets?: { load: (el?: HTMLElement) => void } };
const SCRIPT = "https://platform.twitter.com/widgets.js";

/** Embeds an X (Twitter) post with its video. Falls back to a plain link if X's script can't load. */
export default function XEmbed({ url }: { url: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = () => (window as unknown as { twttr?: Twttr }).twttr?.widgets?.load(ref.current ?? undefined);
    if (document.querySelector(`script[src="${SCRIPT}"]`)) {
      load();
      return;
    }
    const s = document.createElement("script");
    s.src = SCRIPT;
    s.async = true;
    s.onload = load;
    document.body.appendChild(s);
  }, [url]);

  const theme =
    typeof document !== "undefined" && document.documentElement.dataset.theme === "light" ? "light" : "dark";

  return (
    <div ref={ref} style={{ width: "100%" }}>
      <blockquote className="twitter-tweet" data-theme={theme} data-dnt="true" data-conversation="none" data-align="center">
        <a href={url.replace("twitter.com", "x.com")} target="_blank" rel="noreferrer">
          Watch the launch video on X ↗
        </a>
      </blockquote>
    </div>
  );
}
