// All editable portfolio content lives here.
// Links marked TODO are still unknown — replace "#" with real URLs.

export const profile = {
  name: "Ritu Patil",
  location: "Surat, India",
  intro: "I build cool stuff even when nobody cares ;)",
  photo: "/images/profile.jpg",
  summary: "Founder and AI engineer building backend systems, developer infrastructure and AI products.",
  skills: ["Python", "FastAPI", "PostgreSQL", "Redis", "TypeScript", "Docker"],
  site: "https://ritupatil.me",
  // Banner slideshow: changes every few seconds. `position` picks which part of the photo shows.
  banners: [
    { src: "/images/banner-cave.jpg", position: "center 48%", alt: "Lantern-lit stone cave" },
    { src: "/images/banner-house.jpg", position: "center 55%", alt: "Cozy pixel cottage with a sunny window" },
    { src: "/images/banner-meadow.jpg", position: "center 62%", alt: "Cherry-blossom meadow" },
  ],
};

export const github = {
  username: "iamritupatil",
  url: "https://github.com/iamritupatil",
};

export const socials = [
  { name: "X", icon: "/icons/x.svg", href: "https://x.com/iamritupatil" },
  { name: "LinkedIn", icon: "/icons/linkedin.svg", href: "#" }, // TODO: LinkedIn URL
  { name: "GitHub", icon: "/icons/github.svg", href: github.url },
  { name: "MiniClay AI", icon: "/icons/miniclay.png", brand: true, href: "https://www.miniclayai.com/" },
  { name: "Instagram", icon: "/icons/instagram.svg", href: "https://www.instagram.com/iamritupatil/" },
];

// The "Work" section — your experience. `mark` is the letter tile shown instead of a logo.
export type Job = { org: string; role: string; period?: string; href?: string; logo?: string; mark: string; tint: string };
export const work: Job[] = [
  { org: "Medvora AI", role: "Founding AI Engineer", period: "Now", href: "https://medvora.ai/", logo: "/images/logos/medvora.png", mark: "M", tint: "#2f6fed" },
  { org: "MiniClay AI", role: "Founder & AI Engineer", href: "https://www.miniclayai.com/", logo: "/images/logos/miniclay.png", mark: "M", tint: "#e0763b" },
  { org: "Virtuaze", role: "Robotics Researcher", logo: "/images/logos/virtuaze.png", mark: "V", tint: "#3a9d5d" },
];

export const contributions = {
  // the calendar itself is fetched live from GitHub (see Contributions.tsx)
  period: "in the last year",
  githubHref: github.url,
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
export type Repo = {
  name: string;
  description: string;
  repo?: string;
  site?: string;
  language?: string;
  image?: string;
  /** What the chest window shows: an overview written from the project's README */
  overview?: { tagline: string; about: string[]; highlights: string[]; stack: string[] };
};
export const allProjects: Repo[] = [
  {
    name: "AgentGate",
    description: "A deterministic control layer for AI agents. Cedar decides ALLOW, HUMAN APPROVAL or DENY before anything executes.",
    repo: "https://github.com/iamritupatil/AgentGate",
    site: "https://agentgate-sable.vercel.app/#/control",
    language: "Python",
    image: "/images/projects/agentgate.jpg",
    overview: {
      tagline: "Reasoning can be probabilistic. Authority should be deterministic.",
      about: [
        "AI agents can now issue refunds, deploy software, send messages and change databases. Giving an agent a tool usually gives it far more authority than it needs, and rules written into a system prompt can be misread or prompt-injected away.",
        "AgentGate puts a deterministic policy boundary between a proposed action and its execution. The caller says who is acting, what they want to do, to which resource and in what context. Cedar policies then return ALLOW, REQUIRE_APPROVAL or DENY. The agent can reason however it wants; it doesn't get to decide its own authority.",
      ],
      highlights: [
        "Cedar authorization with three outcomes: allow, require human approval, or deny",
        "Human approval bound to the exact action and arguments, claimed exactly once",
        "Generic HTTP authorization API and an MCP adapter for agents",
        "Control Room with Policy Studio, Playground, Test Bench and an audit timeline",
        "Natural-language policy drafting",
      ],
      stack: ["Cedar", "FastAPI", "React", "Vite", "AWS EC2", "Vercel"],
    },
  },
  {
    name: "Patchline",
    description: "An on-call engineer in your messages: your app texts you when it breaks, with two tested fixes. Reply A to ship.",
    repo: "https://github.com/iamritupatil/patchline",
    site: "https://www.patchlinee.tech/",
    language: "TypeScript",
    image: "/images/projects/patchline.jpg",
    overview: {
      tagline: "Your app texts you when it breaks, with two tested fixes. Reply A to ship.",
      about: [
        "Patchline is an on-call engineer in your messages. Point your alerts at it and connect your GitHub repo. When something breaks, it investigates, writes two tested fixes and texts you on iMessage or WhatsApp.",
        "Big companies have on-call rotations and SREs. Indie devs and small teams have an inbox full of error emails and hours of lag. Patchline closes that gap: alert, diagnosis, tested fix, approval from your phone. Reply A and you get a pull request; reply ship and your CI deploys it.",
      ],
      highlights: [
        "Takes alerts from AWS SNS, Sentry or any JSON webhook",
        "Groups 200 identical errors into one incident",
        "Reads the stack trace, recent commits and past incidents to find the cause",
        "Writes a minimal fix and a robust fix, each tested in an isolated VM",
        "Never pushes to your default branch; secrets are scrubbed before anything reaches the LLM",
      ],
      stack: ["TypeScript", "Maritime", "Keiki", "Supermemory", "GitHub"],
    },
  },
  {
    name: "Radi-AI Bharat",
    description: "AI radiology assistant that analyses X-rays and highlights fracture areas.",
    repo: "https://github.com/iamritupatil/radi-ai-bharat-prototype",
    language: "Jupyter Notebook",
    overview: {
      tagline: "AI fracture detection for radiologists: analysis, segmentation and reporting.",
      about: [
        "RadiAI Bharat combines computer-vision models with a radiologist dashboard to find, outline and classify fractures in X-ray images.",
        "It's built to assist radiologists, not replace them: the AI's findings are surfaced for expert review, and a radiologist can modify or override them before the final report is generated.",
      ],
      highlights: [
        "YOLOv8 detection puts bounding boxes around fractures",
        "UNet segmentation outlines the exact fracture boundary, pixel by pixel",
        "A CNN classifies fracture type, severity and healing stage",
        "Dashboard to review findings and add manual annotations",
        "Generates structured PDF reports",
      ],
      stack: ["Python", "PyTorch", "YOLOv8", "FastAPI", "React", "PostgreSQL"],
    },
  },
  {
    name: "Notchman Community",
    description: "The open-source version of Notchman for desktop and Mac.",
    repo: "https://github.com/iamritupatil/notchman-community",
    site: "https://notchman.app",
    language: "JavaScript",
    overview: {
      tagline: "Copy anything. Hear the TL;DR.",
      about: [
        "A tiny Shiba that lives on your screen and reads you the short version of long posts, messages, articles and AI answers while you keep working.",
        "This is the free, open-source edition of Notchman. It runs on your own computer with your own API keys: there's no Notchman server. Windows and macOS.",
      ],
      highlights: [
        "Alt+T: TL;DR of whatever you copied, read aloud",
        "Alt+R: reads the whole thing",
        "A small player with play/pause, ±15 seconds and speed",
        "Free on-device Kokoro voice, or ElevenLabs voices with your key",
        "Works with Groq, OpenAI, OpenRouter or a local Ollama",
      ],
      stack: ["JavaScript", "Electron", "Node.js", "Groq", "Kokoro"],
    },
  },
  {
    name: "MiniClay AI",
    description: "Turn a prompt into a fine-tuned AI model: data sourcing, cleaning and fine-tuning handled for you.",
    site: "https://www.miniclayai.com/",
    overview: {
      tagline: "Turn a prompt into a fine-tuned AI model.",
      about: [
        "MiniClay AI takes the hard parts out of building your own model. Describe what you want, and it handles sourcing the data, cleaning it and fine-tuning the model for you.",
      ],
      highlights: ["Data sourcing from a prompt", "Automatic dataset cleaning", "Fine-tuning handled end to end"],
      stack: [],
    },
  },
  {
    name: "Healthcare Data Normalization Engine",
    description: "Turns patient records from different healthcare systems into one FHIR-based format, with a traceable history of every change.",
    repo: "https://github.com/iamritupatil/Healthcare-Data-Normalization-Engine",
    language: "Python",
    overview: {
      tagline: "Patient records from any system, in one standard FHIR format, without losing a thing.",
      about: [
        "Hospitals, clinics and labs send patient data in different shapes, with different field names, date formats, units and codes. This service takes those records through an API or file upload and converts them into one FHIR-based format.",
        "In an ML dataset you can drop or overwrite a bad value. In healthcare a silently “fixed” value can reach a doctor. So every record is validated, every change is logged, and any normalized value can be traced back to its source. Invalid records are quarantined, never dropped.",
      ],
      highlights: [
        "Normalizes field names, dates, time zones, units and codes into FHIR-lite Patient and Observation records",
        "Ambiguous dates are quarantined, never guessed",
        "Full history: the raw payload, every version and a log entry for every changed field",
        "Finds duplicates and conflicts across systems, without merging people on name and birth date alone",
        "Organizations isolated with Postgres row-level security; background uploads with retries",
      ],
      stack: ["Python", "FastAPI", "Pydantic", "PostgreSQL", "SQLAlchemy", "Docker"],
    },
  },
  {
    name: "Wispr Max",
    description: "", // TODO: no description on GitHub yet
    repo: "https://github.com/iamritupatil/wispr-max-releases-",
  },
];

// Projects page: the six chests under "Top Projects", in order
export const topProjects: Repo[] = allProjects.filter((p) => p.name !== "Wispr Max");

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
