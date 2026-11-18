// Dark is the default look; light is the "lights on" white theme.
export type Theme = "dark" | "light";
const KEY = "theme";

export function currentTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export function toggleTheme(): Theme {
  const next: Theme = currentTheme() === "light" ? "dark" : "light";
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem(KEY, next);
  } catch {}
  return next;
}

// Runs before paint (inlined in <head>) so a saved theme doesn't flash.
export const themeInitScript = `try{if(localStorage.getItem("${KEY}")==="light")document.documentElement.dataset.theme="light"}catch(e){}`;
