// Validates untrusted data (Firestore documents, localStorage cache) into the
// typed shapes the site renders. Anything malformed returns null and is skipped,
// so a bad edit in Firestore can't crash the public page.
import {
  COLLECTIONS,
  LIFE_NUDGES,
  LIFE_TILTS,
  PROJECT_TONES,
  TERMS,
  type CollectionName,
  type Education,
  type Job,
  type JobLink,
  type LifePhoto,
  type Project,
  type SiteContent,
} from "./types.ts";

type Raw = Record<string, unknown>;

const isObj = (v: unknown): v is Raw => typeof v === "object" && v !== null && !Array.isArray(v);
const str = (v: unknown): string | null => (typeof v === "string" ? v : null);
const reqStr = (v: unknown): string | null => (typeof v === "string" && v.trim() !== "" ? v : null);
const optStr = (v: unknown): string | undefined => (typeof v === "string" && v.trim() !== "" ? v : undefined);
const strList = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((s): s is string => typeof s === "string" && s.trim() !== "") : [];
const order = (v: unknown): number => (typeof v === "number" && Number.isFinite(v) ? v : Number.MAX_SAFE_INTEGER);
const oneOf = <T extends string>(list: readonly T[], v: unknown): T | null =>
  list.includes(v as T) ? (v as T) : null;

export function parseEducation(id: string, d: Raw): Education | null {
  const school = reqStr(d.school);
  const degree = reqStr(d.degree);
  const start = reqStr(d.start);
  const end = reqStr(d.end);
  const currentTerm = oneOf(TERMS, d.currentTerm);
  if (!school || !degree || !start || !end || !currentTerm) return null;
  return {
    id,
    order: order(d.order),
    school,
    degree,
    start,
    end,
    note: str(d.note) ?? "",
    highlights: strList(d.highlights),
    logo: optStr(d.logo),
    currentTerm,
  };
}

function parseLink(v: unknown): JobLink | null {
  if (!isObj(v)) return null;
  const label = reqStr(v.label);
  const href = reqStr(v.href);
  if (!label || !href) return null;
  return { label, href, ariaLabel: optStr(v.ariaLabel) ?? label };
}

export function parseJob(id: string, d: Raw): Job | null {
  const dates = reqStr(d.dates);
  const company = reqStr(d.company);
  const role = reqStr(d.role);
  const description = reqStr(d.description);
  if (!dates || !company || !role || !description) return null;
  const links = Array.isArray(d.links) ? d.links.map(parseLink).filter((l): l is JobLink => l !== null) : [];
  return {
    id,
    order: order(d.order),
    dates,
    company,
    role,
    people: optStr(d.people),
    description,
    stack: strList(d.stack),
    links: links.length ? links : undefined,
  };
}

export function parseProject(id: string, d: Raw): Project | null {
  const title = reqStr(d.title);
  const description = reqStr(d.description);
  if (!title || !description) return null;
  return {
    id,
    order: order(d.order),
    title,
    description,
    stack: strList(d.stack),
    tone: oneOf(PROJECT_TONES, d.tone) ?? "yellow",
    featured: d.featured === true ? true : undefined,
    note: optStr(d.note),
    image: optStr(d.image),
    live: optStr(d.live),
    github: optStr(d.github),
    drive: optStr(d.drive),
  };
}

export function parseLifePhoto(id: string, d: Raw): LifePhoto | null {
  const title = reqStr(d.title);
  const text = reqStr(d.text);
  if (!title || !text) return null;
  return {
    id,
    order: order(d.order),
    src: optStr(d.src) ?? null,
    title,
    text,
    tilt: oneOf(LIFE_TILTS, d.tilt) ?? "rotate-0",
    nudge: oneOf(LIFE_NUDGES, d.nudge) ?? "",
  };
}

const PARSERS = {
  education: parseEducation,
  experience: parseJob,
  projects: parseProject,
  life: parseLifePhoto,
} satisfies Record<CollectionName, (id: string, d: Raw) => unknown>;

/** Parses raw `{ id, data }` docs for one collection, dropping invalid ones and sorting by `order`. */
export function parseCollection<K extends CollectionName>(
  name: K,
  docs: { id: string; data: unknown }[]
): SiteContent[K] {
  const parse = PARSERS[name] as (id: string, d: Raw) => SiteContent[K][number] | null;
  return docs
    .map(({ id, data }) => (isObj(data) ? parse(id, data) : null))
    .filter((x): x is SiteContent[K][number] => x !== null)
    .sort((a, b) => a.order - b.order) as SiteContent[K];
}

/** Validates a previously cached SiteContent; null if it doesn't look right. */
export function parseCachedContent(v: unknown): SiteContent | null {
  if (!isObj(v)) return null;
  const out: Partial<SiteContent> = {};
  for (const name of COLLECTIONS) {
    const list = v[name];
    if (!Array.isArray(list)) return null;
    const docs = list.filter(isObj).map((d) => ({ id: String(d.id ?? ""), data: d }));
    const parsed = parseCollection(name, docs);
    if (parsed.length === 0) return null;
    (out as Record<string, unknown>)[name] = parsed;
  }
  return out as SiteContent;
}
