// Form definitions for each Firestore collection, plus conversion between
// stored documents and the flat form state the editor works with.
import { parseEducation, parseJob, parseLifePhoto, parseProject } from "../content/parse.ts";
import {
  LIFE_NUDGES,
  LIFE_TILTS,
  PROJECT_TONES,
  TERMS,
  type CollectionName,
  type JobLink,
} from "../content/types.ts";

export type Raw = Record<string, unknown>;

interface BaseField {
  key: string;
  label: string;
  hint?: string;
  required?: boolean;
}
export type Field =
  | (BaseField & { kind: "text" | "textarea" | "list" | "checkbox" | "links" })
  | (BaseField & { kind: "select"; options: readonly { value: string; label: string }[] });

export type DraftValue = string | boolean | JobLink[];
export type Draft = Record<string, DraftValue>;

export interface CollectionConfig {
  name: CollectionName;
  label: string;
  singular: string;
  fields: Field[];
  title: (d: Raw) => string;
  subtitle: (d: Raw) => string;
  validate: (id: string, d: Raw) => unknown;
}

const opts = (values: readonly string[], labels: Record<string, string> = {}) =>
  values.map((value) => ({ value, label: labels[value] ?? value }));

const s = (v: unknown) => (typeof v === "string" ? v : "");
const IMAGE_HINT = "A path to a file in /public (e.g. /golf.jpg) or a full https:// URL.";

export const CONFIGS: Record<CollectionName, CollectionConfig> = {
  experience: {
    name: "experience",
    label: "Experience",
    singular: "role",
    fields: [
      { key: "role", label: "Role", kind: "text", required: true },
      { key: "company", label: "Company", kind: "text", required: true },
      { key: "dates", label: "Dates", kind: "text", required: true, hint: "e.g. September 2026 to Present" },
      { key: "people", label: "People", kind: "text", hint: "Optional, shown beside the role, e.g. with Dr. …" },
      { key: "description", label: "Description", kind: "textarea", required: true },
      { key: "stack", label: "Skill pills", kind: "list", hint: "One per line." },
      { key: "links", label: "Links", kind: "links", hint: "Optional, shown under the description." },
    ],
    title: (d) => s(d.role),
    subtitle: (d) => [s(d.company), s(d.dates)].filter(Boolean).join(" · "),
    validate: parseJob,
  },
  projects: {
    name: "projects",
    label: "Projects",
    singular: "project",
    fields: [
      { key: "title", label: "Title", kind: "text", required: true },
      { key: "description", label: "Description", kind: "textarea", required: true },
      { key: "stack", label: "Skill pills", kind: "list", hint: "One per line." },
      {
        key: "tone",
        label: "Card colour",
        kind: "select",
        options: opts(PROJECT_TONES, { yellow: "Yellow", pink: "Pink", white: "Glass (white)" }),
      },
      { key: "image", label: "Thumbnail", kind: "text", hint: IMAGE_HINT },
      { key: "live", label: "Live site URL", kind: "text", hint: "Optional. Makes the thumbnail link to the site." },
      { key: "github", label: "GitHub URL", kind: "text" },
      { key: "drive", label: "Google Drive URL", kind: "text", hint: "Optional. Shows a folder button next to the title." },
      { key: "devpost", label: "Devpost URL", kind: "text", hint: "Optional. Shows a trophy button next to the title." },
      { key: "featured", label: "Featured (show sticky note)", kind: "checkbox" },
      { key: "note", label: "Sticky note text", kind: "text", hint: "Only shown when Featured is ticked." },
    ],
    title: (d) => s(d.title),
    subtitle: (d) => (Array.isArray(d.stack) ? d.stack.join(", ") : ""),
    validate: parseProject,
  },
  education: {
    name: "education",
    label: "Education",
    singular: "school",
    fields: [
      { key: "school", label: "School", kind: "text", required: true },
      { key: "degree", label: "Degree", kind: "text", required: true },
      { key: "start", label: "Start year", kind: "text", required: true },
      { key: "end", label: "End year", kind: "text", required: true },
      { key: "currentTerm", label: "Current term", kind: "select", required: true, options: opts(TERMS) },
      { key: "note", label: "Note", kind: "textarea" },
      { key: "highlights", label: "Highlights", kind: "list", hint: "One per line, shown as pills." },
      { key: "logo", label: "Logo", kind: "text", hint: IMAGE_HINT },
    ],
    title: (d) => s(d.school),
    subtitle: (d) => s(d.degree),
    validate: parseEducation,
  },
  life: {
    name: "life",
    label: "Life",
    singular: "polaroid",
    fields: [
      { key: "title", label: "Title", kind: "text", required: true, hint: "Handwritten caption, e.g. Golf!" },
      { key: "text", label: "Text", kind: "textarea", required: true },
      { key: "src", label: "Photo", kind: "text", hint: IMAGE_HINT + " Leave empty for a placeholder." },
      {
        key: "tilt",
        label: "Tilt",
        kind: "select",
        options: opts(LIFE_TILTS, {
          "-rotate-3": "Left, strong",
          "-rotate-2": "Left",
          "-rotate-1": "Left, slight",
          "rotate-0": "Straight",
          "rotate-1": "Right, slight",
          "rotate-2": "Right",
          "rotate-3": "Right, strong",
        }),
      },
      {
        key: "nudge",
        label: "Vertical offset (desktop)",
        kind: "select",
        options: opts(LIFE_NUDGES, {
          "": "None",
          "md:-translate-y-4": "Up, more",
          "md:-translate-y-2": "Up",
          "md:translate-y-2": "Down",
          "md:translate-y-4": "Down, more",
          "md:translate-y-6": "Down, most",
        }),
      },
    ],
    title: (d) => s(d.title),
    subtitle: (d) => s(d.text),
    validate: parseLifePhoto,
  },
};

export function toDraft(config: CollectionConfig, data: Raw): Draft {
  const draft: Draft = {};
  for (const f of config.fields) {
    const v = data[f.key];
    switch (f.kind) {
      case "list":
        draft[f.key] = Array.isArray(v) ? v.join("\n") : "";
        break;
      case "checkbox":
        draft[f.key] = v === true;
        break;
      case "links":
        draft[f.key] = Array.isArray(v)
          ? v.map((l: Partial<Record<keyof JobLink, unknown>>) => ({ label: s(l?.label), href: s(l?.href), ariaLabel: s(l?.ariaLabel) }))
          : [];
        break;
      case "select":
        draft[f.key] = typeof v === "string" ? v : f.options[0].value;
        break;
      default:
        draft[f.key] = typeof v === "string" ? v : "";
    }
  }
  return draft;
}

/** Converts form state into a Firestore document (without `order`). Optional empty fields are omitted. */
export function fromDraft(config: CollectionConfig, draft: Draft): { data: Raw; missing: string[] } {
  const data: Raw = {};
  const missing: string[] = [];
  for (const f of config.fields) {
    const v = draft[f.key];
    if (f.kind === "list") {
      const items = String(v ?? "")
        .split("\n")
        .map((x) => x.trim())
        .filter(Boolean);
      data[f.key] = items;
    } else if (f.kind === "checkbox") {
      if (v === true) data[f.key] = true;
    } else if (f.kind === "links") {
      const links = (Array.isArray(v) ? v : [])
        .map((l) => ({ label: l.label.trim(), href: l.href.trim(), ariaLabel: l.ariaLabel.trim() }))
        .filter((l) => l.label || l.href)
        .map((l) => (l.ariaLabel ? l : { label: l.label, href: l.href }));
      if (links.some((l) => !l.label || !l.href)) missing.push(`${f.label} (each needs a label and URL)`);
      if (links.length) data[f.key] = links;
    } else if (f.kind === "select") {
      data[f.key] = String(v ?? "");
    } else {
      const text = String(v ?? "").trim();
      if (text) data[f.key] = text;
      else if (f.required) missing.push(f.label);
    }
  }
  return { data, missing };
}
