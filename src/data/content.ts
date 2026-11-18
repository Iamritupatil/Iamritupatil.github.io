// All editable portfolio content lives here.
// Links marked TODO are still unknown — replace "#" with real URLs.

export const profile = {
  name: "Ritu Patil",
  location: "Surat, India",
  intro: "I build cool stuff even when no one cares ;)",
  photo: "/images/profile.jpg",
  cover: "/images/lofi-cover.jpg", // dark theme banner
  coverLight: "/images/cover-meadow.jpg", // white theme banner
  lofiRoomImage: "/images/lofi-room.jpg", // for the lofi room (coming)
  lofiRoom: { label: "Click here to enter the lofi room", href: "#" }, // TODO
};

export const github = {
  username: "iamritupatil",
  url: "https://github.com/iamritupatil",
};

export const socials = [
  { name: "X", icon: "/icons/x.svg", href: "https://x.com/iamritupatil" },
  { name: "LinkedIn", icon: "/icons/linkedin.svg", href: "#" }, // TODO: LinkedIn URL
  { name: "GitHub", icon: "/icons/github.svg", href: github.url },
  { name: "MiniClay AI", icon: "/icons/sparkle.svg", href: "https://www.miniclayai.com/" },
  { name: "Instagram", icon: "/icons/instagram.svg", href: "#" }, // TODO
  { name: "Links", icon: "/icons/links.svg", href: "#" }, // TODO
  { name: "Reading", icon: "/icons/reading.svg", href: "#" }, // TODO
];

// The "Work" section — your experience. `mark` is the letter tile shown instead of a logo.
export type Job = { org: string; role: string; period?: string; href?: string; mark: string; tint: string };
export const work: Job[] = [
  { org: "Medora AI", role: "Founding Engineer", period: "Now", mark: "M", tint: "#2f6fed" },
  { org: "MiniClay AI", role: "Founder & AI Engineer", href: "https://www.miniclayai.com/", mark: "M", tint: "#e0763b" },
  { org: "Virtuaze", role: "Robotics Researcher", mark: "V", tint: "#3a9d5d" },
];

export const contributions = {
  total: "3,181 contributions",
  period: "in the last year",
  githubHref: github.url,
  // [label, week column the label sits above]
  months: [
    ["Nov", 0], ["Dec", 3], ["Jan", 7], ["Feb", 11], ["Mar", 15], ["Apr", 20], ["May", 24],
    ["Jun", 29], ["Jul", 33], ["Aug", 37], ["Sep", 42], ["Oct", 46], ["Nov", 50],
  ] as [string, number][],
};

export type Project = {
  name: string;
  description: string[];
  /** Light pill button, e.g. "Download for Mac" or "Open app" */
  primary?: { label: string; href: string; icon?: "apple" | "github" };
  /** Plain link next to it, e.g. the website or repo */
  site?: { label: string; href: string };
  /** Screenshot shown at the top of the card */
  image?: string;
  /** Launch video shown on the right of the featured card: YouTube or X link, or "/videos/notchman.mp4" */
  video?: string;
};

const notchman: Project = {
  name: "Notchman",
  description: ["Get instant voice summaries", "from long text."],
  primary: { label: "Download for Mac", href: "https://notchman.app", icon: "apple" },
  site: { label: "notchman.app", href: "https://notchman.app" },
  video: "https://www.youtube.com/watch?v=LnBm2XWPGLc",
};

const agentGate: Project = {
  name: "AgentGate",
  description: ["Let agents act. Keep authority.", "Tool calls checked against Cedar policies."],
  image: "/images/projects/agentgate.jpg",
  primary: { label: "Open app", href: "https://agentgate-sable.vercel.app/#/control" },
  site: { label: "GitHub", href: "https://github.com/iamritupatil/AgentGate" },
};

const patchline: Project = {
  name: "Patchline",
  description: ["Your app texts you when it breaks,", "with the root cause and two tested fixes."],
  image: "/images/projects/patchline.jpg",
  primary: { label: "Visit site", href: "https://www.patchlinee.tech/" },
  site: { label: "GitHub", href: "https://github.com/iamritupatil/patchline" },
};

export const projects = {
  featured: notchman,
  pair: [agentGate, patchline] as [Project, Project],
};

// Projects page: pinned GitHub repos (and MiniClay AI), in pinned order
export type Repo = { name: string; description: string; repo?: string; site?: string; language?: string; image?: string };
export const allProjects: Repo[] = [
  {
    name: "AgentGate",
    description: "A deterministic control layer for AI agents. Cedar decides ALLOW, HUMAN APPROVAL or DENY before anything executes.",
    repo: "https://github.com/iamritupatil/AgentGate",
    site: "https://agentgate-sable.vercel.app/#/control",
    language: "Python",
    image: "/images/projects/agentgate.jpg",
  },
  {
    name: "Patchline",
    description: "An on-call engineer in your messages: your app texts you when it breaks, with two tested fixes. Reply A to ship.",
    repo: "https://github.com/iamritupatil/patchline",
    site: "https://www.patchlinee.tech/",
    language: "TypeScript",
    image: "/images/projects/patchline.jpg",
  },
  {
    name: "Radi-AI Bharat",
    description: "AI radiology assistant that analyses X-rays and highlights fracture areas.",
    repo: "https://github.com/iamritupatil/radi-ai-bharat-prototype",
    language: "Jupyter Notebook",
  },
  {
    name: "Notchman Community",
    description: "The open-source version of Notchman for desktop and Mac.",
    repo: "https://github.com/iamritupatil/notchman-community",
    site: "https://notchman.app",
    language: "JavaScript",
  },
  {
    name: "MiniClay AI",
    description: "Turn a prompt into a fine-tuned AI model: data sourcing, cleaning and fine-tuning handled for you.",
    site: "https://www.miniclayai.com/",
  },
  {
    name: "Healthcare Data Normalization Engine",
    description: "", // TODO: no description on GitHub yet
    repo: "https://github.com/iamritupatil/Healthcare-Data-Normalization-Engine",
    language: "Python",
  },
  {
    name: "Wispr Max",
    description: "", // TODO: no description on GitHub yet
    repo: "https://github.com/iamritupatil/wispr-max-releases-",
  },
];

// Card just above the footer
export const motivationVideo = {
  src: "", // TODO: "/videos/motivation.mp4"
  poster: "",
};

export const contact = {
  email: "ritu.patil.dilip@gmail.com",
  copyright: "© 2026 Ritu Patil",
};

// Links between pages. The claude.ai preview serves plain .html files.
const PREVIEW = process.env.NEXT_PUBLIC_PREVIEW === "1";
export const routes = {
  home: PREVIEW ? "index.html" : "/",
  projects: PREVIEW ? "projects.html" : "/projects",
};
