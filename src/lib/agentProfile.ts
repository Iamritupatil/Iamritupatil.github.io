import { allProjects, contact, github, profile, projects, socials, work } from "@/data/content";

/**
 * A plain-text (Markdown) profile for AI agents and crawlers.
 * Built from content.ts so it always matches the site. Served on the page
 * (Agent mode) and as /llms.txt.
 */
export function agentProfileText(): string {
  const [now, ...before] = work;
  const links = socials.filter((s) => s.href.startsWith("http"));
  const featured = projects.featured;

  return [
    `# ${profile.name}`,
    "",
    `> ${profile.summary} Based in ${profile.location}.`,
    "",
    "## Work",
    `- Now: ${now.role} at ${now.org}${now.href ? ` (${now.href})` : ""}`,
    ...before.map((w) => `- Before: ${w.role} at ${w.org}${w.href ? ` (${w.href})` : ""}`),
    "",
    "## Projects",
    `- ${featured.name}: ${featured.description.join(" ")}${featured.site ? ` ${featured.site.href}` : ""}`,
    ...allProjects
      .filter((p) => p.name !== featured.name)
      .map((p) => {
        const urls = [p.site, p.repo].filter(Boolean).join(" · ");
        return `- ${p.name}${p.description ? `: ${p.description}` : ""}${urls ? ` ${urls}` : ""}`;
      }),
    "",
    "## Skills",
    profile.skills.join(", "),
    "",
    "## Links",
    `- Website: ${profile.site}`,
    `- GitHub: ${github.url}`,
    ...links.filter((s) => s.href !== github.url).map((s) => `- ${s.name}: ${s.href}`),
    `- Email: ${contact.email}`,
    "",
  ].join("\n");
}
