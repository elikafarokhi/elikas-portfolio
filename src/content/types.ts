// Shapes of the content stored in Firestore. Each document carries an `order`
// field for sorting; `id` is the Firestore document id and is not stored in the doc.

export const COLLECTIONS = ["experience", "projects", "education", "life"] as const;
export type CollectionName = (typeof COLLECTIONS)[number];

export const TERMS = ["1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B"] as const;
export type Term = (typeof TERMS)[number];

export const PROJECT_TONES = ["yellow", "pink", "white"] as const;
export type ProjectTone = (typeof PROJECT_TONES)[number];

// Polaroid tilt/nudge are Tailwind classes, so they're limited to values that
// appear in source (Tailwind only generates classes it can see at build time).
export const LIFE_TILTS = ["-rotate-3", "-rotate-2", "-rotate-1", "rotate-0", "rotate-1", "rotate-2", "rotate-3"] as const;
export type LifeTilt = (typeof LIFE_TILTS)[number];

export const LIFE_NUDGES = [
  "",
  "md:-translate-y-4",
  "md:-translate-y-2",
  "md:translate-y-2",
  "md:translate-y-4",
  "md:translate-y-6",
] as const;
export type LifeNudge = (typeof LIFE_NUDGES)[number];

interface Doc {
  id: string;
  order: number;
}

export interface Education extends Doc {
  school: string;
  degree: string;
  start: string;
  end: string;
  note: string;
  highlights: string[];
  logo?: string;
  currentTerm: Term;
}

export interface JobLink {
  label: string;
  href: string;
  ariaLabel: string;
}

export interface Job extends Doc {
  dates: string;
  company: string;
  role: string;
  people?: string;
  description: string;
  stack: string[];
  links?: JobLink[];
}

export interface Project extends Doc {
  title: string;
  description: string;
  stack: string[];
  tone: ProjectTone;
  featured?: boolean;
  note?: string;
  image?: string;
  live?: string;
  github?: string;
  drive?: string;
  devpost?: string;
}

export interface LifePhoto extends Doc {
  src: string | null;
  title: string;
  text: string;
  tilt: LifeTilt;
  nudge: LifeNudge;
}

export interface SiteContent {
  education: Education[];
  experience: Job[];
  projects: Project[];
  life: LifePhoto[];
}
