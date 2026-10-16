import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

const PROFILE_PHOTO_1 = "/IMG_0035.jpg";
const PROFILE_PHOTO_2: string | null = "/IMG_0036.jpg";

const PROFILE = {
  name: "Elika Farokhi",
  initials: "EF",
  headline: "Computer Engineering at the University of Waterloo",
  email: "efarokhi@uwaterloo.ca",
  linkedin: "https://www.linkedin.com/in/elika-farokhi",
  github: "https://github.com/elikafarokhi",
};

const TERMS = ["1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B"] as const;
const CURRENT_TERM_INDEX = 2;

const EDUCATION = [
  {
    school: "University of Waterloo",
    degree: "Computer Engineering",
    start: "2025",
    end: "2030",
    note: "University of Waterloo President’s Scholarship of Distinction Recipient.",
    highlights: [
      "ECE 150 - Programming Fundamentals",
      "ECE 108 - Discrete Mathematics and Logic 1",
      "ECE 124 - Digital Circuits and Systems",
      "DELF B1",
    ],
  },
];

interface Job {
  dates: string;
  company: string;
  role: string;
  description: string;
  stack: string[];
}
const EXPERIENCE: Job[] = [
  {
    dates: "September 2026 to Present",
    company: "Mercury Mortgages",
    role: "Software Developer",
    description:
      "Building full-stack internal tooling and backend services that process millions of dollars for 25+ corporate clients. Keep systems reliable by automating heavy data workflows and streamlining bulk payments.",
    stack: ["React", "SQL", "Docker"],
  },
  {
    dates: "January 2026 to May 2026",
    company: "University of Waterloo",
    role: "Research Assistant (USRA)",
    description:
      "Launched a custom web platform from scratch to showcase university electric aviation research. Mapped out Canadian regional airline fleets and flight routes to build a massive database for advanced flight models.",
    stack: ["React", "TypeScript", "Databases"],
  },
  {
    dates: "July 2025 to January 2026",
    company: "Easier Emails",
    role: "Software Engineer",
    description:
      "Redesigned the campaign management UI for a SaaS platform to include real-time validation and progress tracking. Boosted overall email delivery rates by 15% by tracking down and fixing complex cross-browser bugs and tricky timezone issues.",
    stack: ["SaaS", "UI Development", "Web Compatibility"],
  },
  {
    dates: "June 2023 to June 2026",
    company: "Stork Family YMCA",
    role: "Head Lifeguard",
    description:
      "Kept the community safe by managing daily pool operations and leading a team of over 15 lifeguards. Taught swimming lessons to 500+ participants of all ages while co-hosting seasonal emergency training sessions.",
    stack: ["Leadership", "Teaching", "Teamwork"],
  },
];

interface Project {
  title: string;
  description: string;
  stack: string[];
  tone: "yellow" | "pink" | "white";
  featured?: boolean;
  note?: string;
  image?: string;
  live?: string;
  github?: string;
}
const PROJECTS: Project[] = [
  {
    title: "Firefighter",
    description:
      "An autonomous firefighting robot that follows walls and detects lines to navigate a maze, spots a flame with a phototransistor, and puts it out with a blower fan. I designed the circuit and wrote the PIC16F887 firmware.",
    stack: ["Embedded Systems", "Circuit Design", "Sensor Integration"],
    tone: "yellow",
    featured: true,
    note: "*glambot*",
    image: "/firefighter.jpeg",
  },
  {
    title: "Powder Puff",
    description: "A serverless Python app that tracks overnight snowfall at 42 ski resorts across Ontario and Quebec. Runs on Vercel with a daily cron job and a Neon Postgres database, and anyone can sign up to get styled email alerts when their mountains get a powder day.",
    stack: ["Python", "FastAPI", "Serverless", "PostgreSQL", "Cron Jobs"],
    tone: "pink",
    image: "/powderpuff.jpeg",
    live: "https://powderpuff.vercel.app",
    github: "https://github.com/elikafarokhi/powder-puff",
  },
  {
    title: "Portfolio",
    description: "The website you're looking at right now! Built from scratch to showcase my experience, featuring a custom interactive UI and real-time content updates.",
    stack: ["React", "TypeScript", "Tailwind CSS", "Firebase"],
    tone: "yellow",
    image: "/portfolio.jpeg",
    live: "https://elikafarokhi.vercel.app",
    github: "https://github.com/elikafarokhi/elikas-portfolio",
  },
];

interface LifePhoto {
  src: string | null;
  title: string;
  text: string;
  tilt: string;
  nudge: string;
}
const LIFE_PHOTOS: LifePhoto[] = [
  { src: "/golf.jpg", title: "Golf!", text: "My favourite excuse to go outside, nothing beats a nine and dine :)", tilt: "-rotate-3", nudge: "" },
  { src: "/luna.jpg", title: "Luna!", text: "My husky-labradoodle mix and the main reason I actually touch grass. We love our forest walks :)", tilt: "rotate-2", nudge: "md:translate-y-6" },
  { src: "/bigsur.jpeg", title: "Travelling!", text: "Always plotting my next trip, trying to see as much of the world as my student budget will allow :)", tilt: "-rotate-1", nudge: "md:-translate-y-2" },
  { src: "/snowboard.jpeg", title: "Snowboarding!", text: "Surviving the winter with my Ikon pass. Getting out to the mountains cures just about anything :)", tilt: "rotate-3", nudge: "md:translate-y-2" },
  { src: "/concert.jpeg", title: "Concerts!", text: "Whenever I need a break from my laptop, I make it my mission to hear my favorite Spotify playlists in real life :)", tilt: "-rotate-2", nudge: "md:-translate-y-4" },
  { src: "/strawberry.jpeg", title: "Food!", text: "I'm always thinking about my next meal. Sharing good food is my absolute favorite way to connect :)", tilt: "rotate-1", nudge: "md:translate-y-4" },
];

const NAV_ITEMS = [
  { id: "about", label: "About" },
  { id: "education", label: "Education" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "life", label: "Life" },
  { id: "connect", label: "Connect" },
] as const;

const NAV_IDS: readonly string[] = NAV_ITEMS.map((n) => n.id);

const GLASS =
  "border border-white/70 bg-white/55 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]";

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function scrollToSection(id: string) {
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
}

const prettyUrl = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "");

type Theme = "light" | "dark";

function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "light" || saved === "dark") return saved;
    } catch {
      /* storage unavailable */
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggle = useCallback(() => {
    const root = document.documentElement;
    if (!prefersReducedMotion()) {
      root.classList.add("theme-fade");
      window.setTimeout(() => root.classList.remove("theme-fade"), 400);
    }
    setTheme((t) => {
      const next: Theme = t === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("theme", next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  return { theme, toggle };
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    const measure = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? Math.min(100, Math.max(0, (el.scrollTop / max) * 100)) : 0);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(measure);
        ticking = true;
      }
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return progress;
}

function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string>(ids[0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    const onScroll = () => {
      const atBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 4;
      if (atBottom) setActive(ids[ids.length - 1]);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [ids]);

  return active;
}

const iconProps = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

function CameraIcon() {
  return (
    <svg {...iconProps} width={28} height={28} strokeWidth={1.5}>
      <path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  );
}
function GithubIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.38 7.86 10.9.575.105.785-.25.785-.555 0-.275-.01-1-.015-1.96-3.2.695-3.875-1.54-3.875-1.54-.525-1.33-1.28-1.685-1.28-1.685-1.045-.715.08-.7.08-.7 1.155.08 1.765 1.185 1.765 1.185 1.03 1.76 2.7 1.25 3.36.955.105-.745.4-1.25.73-1.54-2.555-.29-5.24-1.275-5.24-5.68 0-1.255.45-2.28 1.185-3.085-.12-.29-.515-1.46.11-3.04 0 0 .965-.31 3.165 1.18a10.99 10.99 0 0 1 5.76 0c2.2-1.49 3.165-1.18 3.165-1.18.625 1.58.23 2.75.11 3.04.74.805 1.185 1.83 1.185 3.085 0 4.415-2.69 5.385-5.255 5.67.41.355.78 1.055.78 2.125 0 1.535-.015 2.77-.015 3.15 0 .31.205.67.79.555C20.215 21.375 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}
function SunIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg {...iconProps}>
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
    </svg>
  );
}

type Tone = "pink" | "yellow";
const PLACEHOLDER_TONES: Record<Tone, string> = {
  pink: "bg-tint/70 border-ink/25 text-ink-muted",
  yellow: "bg-featured border-ink/25 text-ink-muted",
};
function ImagePlaceholder({
  label,
  tone = "pink",
  className = "",
}: {
  label: string;
  tone?: Tone;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={`Placeholder: ${label}`}
      className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed ${PLACEHOLDER_TONES[tone]} ${className}`}
    >
      <CameraIcon />
      <span className="px-3 text-center text-sm font-medium">{label}</span>
    </div>
  );
}

function Pill({ children, tone = "yellow" }: { children: ReactNode; tone?: "yellow" | "white" }) {
  const styles =
    tone === "yellow"
      ? "bg-featured border-featured-edge"
      : "bg-white/70 border-white dark:bg-white/10 dark:border-white/15";
  return (
    <li className={`rounded border px-2.5 py-1 font-mono text-xs font-normal tracking-wide text-ink ${styles}`}>
      {children}
    </li>
  );
}

function Tape({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute z-10 block h-6 w-16 border-x border-butter-300/60 bg-butter-200/80 ${className}`}
    />
  );
}

function Trace({ end = false }: { end?: boolean }) {
  return (
    <>
      <span aria-hidden="true" className="absolute bottom-0 left-0 top-0 w-px bg-ink/30" />
      {end && (
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-0 h-3.5 w-3.5 -translate-x-1/2 translate-y-1/2 rounded-full border-2 border-ink bg-paper"
        />
      )}
    </>
  );
}

function RevealHeading({
  id,
  text,
  as: Tag = "h2",
  className = "",
  delay = 0,
}: {
  id: string;
  text: string;
  as?: "h1" | "h2";
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(prefersReducedMotion());

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          window.setTimeout(() => setShown(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <Tag id={id} className={className}>
      <span
        ref={ref}
        className={`inline-block transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none ${
          shown ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
      >
        {text}
      </span>
    </Tag>
  );
}

function SectionHeading({ id, title, index }: { id: string; title: string; index: number }) {
  return (
    <div className="-ml-9 flex items-center md:-ml-16">
      <span aria-hidden="true" className="relative block h-px w-7 shrink-0 bg-ink/40 md:w-14">
        <span className="absolute left-0 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink bg-butter-300" />
      </span>
      <span
        aria-hidden="true"
        className="ml-2 shrink-0 rounded-sm border border-ink/30 px-1.5 py-0.5 font-mono text-[11px] tracking-wide text-ink-muted"
      >
        {String(index).padStart(2, "0")}
      </span>
      <RevealHeading
        id={`${id}-title`}
        text={title}
        className="ml-2 font-mono text-2xl font-medium tracking-wide text-ink sm:text-3xl md:text-4xl"
      />
    </div>
  );
}

function Section({
  id,
  title,
  intro,
  end = false,
  children,
}: {
  id: string;
  title: string;
  intro?: string;
  end?: boolean;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-20 px-5 sm:px-8">
      <div className="relative mx-auto max-w-6xl py-20 pl-9 md:py-28 md:pl-16">
        <Trace end={end} />
        <SectionHeading id={id} title={title} index={NAV_IDS.indexOf(id) + 1} />
        {intro && <p className="mt-3 max-w-xl text-lg text-ink-muted">{intro}</p>}
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

function Nav({ active, theme, onToggleTheme }: { active: string; theme: Theme; onToggleTheme: () => void }) {
  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3 sm:top-4 sm:px-6">
      <nav aria-label="Primary" className={`mx-auto flex max-w-3xl items-center gap-2 rounded-full p-1.5 ${GLASS}`}>
        <a
          href="#about"
          aria-label="Back to top"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("about");
          }}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink font-mono text-sm font-medium tracking-wide text-paper"
        >
          {PROFILE.initials}
        </a>

        <ul className="flex flex-1 items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:justify-end">
          {NAV_ITEMS.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={active === id ? "true" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(id);
                }}
                className={`block whitespace-nowrap rounded-full px-3.5 py-2 font-mono text-[13px] font-medium tracking-wide transition-colors ${
                  active === id ? "bg-ink text-paper" : "text-ink hover:bg-ink/10"
                }`}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={onToggleTheme}
          aria-label="Dark mode"
          aria-pressed={theme === "dark"}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink transition-colors hover:bg-ink/10"
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>
      </nav>
    </header>
  );
}

function ScrollProgress() {
  const progress = useScrollProgress();
  return (
    <div aria-hidden="true" className="fixed inset-x-0 top-0 z-40 h-1 bg-navy/15">
      <div className="h-full bg-navy" style={{ width: `${progress}%` }} />
    </div>
  );
}

function Hero() {
  return (
    <section id="about" aria-labelledby="about-title" className="scroll-mt-20 px-5 sm:px-8">
      <div className="relative mx-auto max-w-6xl pb-16 pl-9 pt-32 md:pb-24 md:pl-16 md:pt-40">
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-0 top-0 w-px origin-top bg-ink/30 motion-safe:animate-trace"
        />

        <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="font-mono text-sm tracking-wide text-ink-muted sm:text-base">{PROFILE.headline}</p>

            <RevealHeading
              as="h1"
              id="about-title"
              text={PROFILE.name}
              className="mt-4 font-display text-5xl font-semibold leading-[1.02] tracking-tight text-ink sm:text-6xl lg:text-7xl"
            />

            <p className="mt-6 max-w-xl text-lg leading-relaxed">
            I build software and sometimes hardware. A lot of what I know I learned by trying things I wasn’t sure I could do yet :)
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => scrollToSection("education")}
                className="rounded-full bg-ink px-6 py-3 font-medium text-paper shadow-soft transition duration-300 hover:scale-102 hover:opacity-90 motion-reduce:transition-none"
              >
                Explore
              </button>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md pb-14 pt-3">
            <div className="flex items-center justify-center">
              <figure className="relative z-0 w-[56%] rotate-6 rounded-md bg-white p-3 pb-4 shadow-soft">
                <Tape className="-top-3 left-1/2 -translate-x-1/2 rotate-3" />
                {PROFILE_PHOTO_2 ? (
                  <img
                    src={PROFILE_PHOTO_2}
                    alt={`${PROFILE.name}, second photo`}
                    className="aspect-[4/5] w-full rounded-md object-cover"
                  />
                ) : (
                  <ImagePlaceholder label="Photo 2" tone="pink" className="aspect-[4/5] w-full !rounded-md" />
                )}
                <figcaption className="mt-3 font-hand text-2xl leading-none text-navy-700">
                  <br />
                </figcaption>
              </figure>

              <figure className="relative z-10 -ml-12 w-[56%] -rotate-6 rounded-md bg-white p-3 pb-4 shadow-soft sm:-ml-16">
                <Tape className="-top-3 left-6 -rotate-6" />
                <Tape className="-top-3 right-6 rotate-6" />
                <img
                  src={PROFILE_PHOTO_1}
                  alt={`Portrait of ${PROFILE.name}`}
                  className="aspect-[4/5] w-full rounded-md object-cover"
                />
                <figcaption className="mt-3 font-hand text-2xl leading-none text-navy-700">
                  <br />
                </figcaption>
              </figure>
            </div>

            <div className="absolute -bottom-2 left-1/2 z-20 w-44 -translate-x-1/2 rotate-2 bg-butter-300 p-4 font-hand text-xl leading-tight text-navy shadow-soft">
              Seeking summer 2027 internships :)
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TermTimeline({ start, end, current }: { start: string; end: string; current: number }) {
  const last = TERMS.length - 1;
  const pct = (i: number) => `${(i / last) * 100}%`;
  const label = `${start} to ${end}. Completed ${TERMS.slice(0, current).join(", ") || "no terms"}; now at the start of ${TERMS[current] ?? "the end"}.`;

  return (
    <div className="md:col-span-2" role="group" aria-label={label}>
      <div>
        <div className="relative mx-4 h-5 font-mono text-xs font-medium text-ink" aria-hidden="true">
          <span className="absolute left-0 -translate-x-1/2">{start}</span>
          <span className="absolute right-0 translate-x-1/2">{end}</span>
        </div>

        <div className="relative mx-4 mt-1 h-9" aria-hidden="true">
          <span className="absolute left-0 right-0 top-1.5 h-px bg-ink/30" />
          <span
            className="absolute left-0 top-1.5 h-0.5 -translate-y-px bg-ink"
            style={{ width: pct(current) }}
          />

          {TERMS.map((term, i) => {
            const done = i < current;
            const now = i === current;
            return (
              <div
                key={term}
                className="absolute top-0 flex -translate-x-1/2 flex-col items-center"
                style={{ left: pct(i) }}
              >
                {now ? (
                  <span className="h-3 w-3 rounded-full border-2 border-ink bg-butter-300 ring-4 ring-butter-300/40" />
                ) : (
                  <span className={`h-3 w-px ${done ? "bg-ink" : "bg-ink/40"}`} />
                )}
                <span
                  className={`mt-1.5 font-mono text-[11px] leading-none ${
                    now ? "font-semibold text-ink" : done ? "text-ink" : "text-ink-muted"
                  }`}
                >
                  {term}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Education() {
  return (
    <Section id="education" title="Education">
      <div className="space-y-5">
        {EDUCATION.map((ed, i) => (
          <article
            key={i}
            className="grid gap-6 rounded-3xl border border-featured-edge bg-featured p-6 shadow-soft sm:p-8 md:grid-cols-[auto_1fr]"
          >
            <img
              src="/uwaterloo_logo.png"
              alt={`${ed.school} Logo`}
              className="h-28 w-28 md:h-32 md:w-32 object-contain rounded-2xl"
            />

            <div>
              <h3 className="font-display text-2xl font-semibold text-ink">{ed.school}</h3>
              <p className="mt-1 text-lg text-ink-soft">{ed.degree}</p>
              <p className="mt-3 max-w-xl">{ed.note}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {ed.highlights.map((h, j) => (
                  <Pill key={j} tone="white">{h}</Pill>
                ))}
              </ul>
            </div>

            <TermTimeline start={ed.start} end={ed.end} current={CURRENT_TERM_INDEX} />
          </article>
        ))}
      </div>
    </Section>
  );
}

function Experience() {
  return (
    <Section id="experience" title="Experience">
      <ol className="divide-y divide-ink/15 border-y border-ink/15">
        {EXPERIENCE.map((job, i) => (
          <li key={i} className="relative grid gap-4 py-8 md:grid-cols-[13rem_1fr] md:gap-12">
            <span
              aria-hidden="true"
              className="absolute -left-9 top-[2.3rem] h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-ink md:-left-16"
            />

            <div className="font-mono text-[13px] leading-relaxed text-ink-muted">
              <p>{job.dates}</p>
              <p className="mt-1 font-medium">{job.company}</p>
            </div>

            <div>
              <h3 className="font-display text-xl font-semibold text-ink">{job.role}</h3>
              <p className="mt-2 text-sm leading-relaxed">{job.description}</p>
              <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tech stack">
                {job.stack.map((s) => (
                  <Pill key={s}>{s}</Pill>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

const PROJECT_TONES: Record<Project["tone"], { card: string; placeholder: Tone }> = {
  yellow: { card: "bg-featured border-featured-edge", placeholder: "yellow" },
  pink: { card: "bg-tint/70 border-tint-edge", placeholder: "pink" },
  white: { card: GLASS, placeholder: "pink" },
};

const CHIP_PINS =
  "before:absolute before:inset-y-8 before:-left-1.5 before:w-1.5 before:rounded-l-sm before:bg-pins before:opacity-40 " +
  "after:absolute after:inset-y-8 after:-right-1.5 after:w-1.5 after:rounded-r-sm after:bg-pins after:opacity-40";

function Projects() {
  return (
    <Section id="projects" title="Projects" intro="A few things I've built for fun outside of classes and co-op :)">
      <div className="space-y-5">
        {PROJECTS.map((p, i) => (
          <article
            key={i}
            className={`relative flex flex-col gap-4 rounded-2xl border p-3 shadow-soft transition duration-300 hover:scale-102 motion-reduce:transition-none motion-reduce:hover:transform-none sm:flex-row sm:items-center ${CHIP_PINS} ${PROJECT_TONES[p.tone].card}`}
          >
            {p.featured && p.note && (
              <span className="absolute -top-4 right-8 z-10 rotate-2 bg-butter-300 px-3 py-1 font-hand text-xl leading-tight text-navy shadow-soft">
                {p.note}
              </span>
            )}

            <div className="shrink-0 sm:w-64">
              {(() => {
                const thumb = p.image ? (
                  <img
                    src={p.image}
                    alt={p.title}
                    className="aspect-video h-full w-full rounded-xl object-contain"
                  />
                ) : (
                  <ImagePlaceholder
                    label="Project thumbnail"
                    tone={PROJECT_TONES[p.tone].placeholder}
                    className="aspect-video h-full w-full"
                  />
                );
                if (!p.live) return thumb;
                return (
                  <a
                    href={p.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${p.title} in a new tab`}
                    className="group/visit relative block overflow-hidden rounded-xl"
                  >
                    {thumb}
                    <span
                      aria-hidden="true"
                      className="absolute right-2 top-2 z-10 grid h-8 w-8 place-items-center rounded-full border border-ink/25 bg-white/80 text-ink shadow-soft transition duration-300 group-hover/visit:scale-110 group-hover/visit:bg-ink group-hover/visit:text-paper motion-reduce:transition-none"
                    >
                      <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 17L17 7M8 7h9v9" />
                      </svg>
                    </span>
                    <span className="absolute inset-0 flex items-center justify-center bg-navy/60 font-mono text-sm tracking-wide text-white opacity-0 transition-opacity duration-300 group-hover/visit:opacity-100 group-focus-visible/visit:opacity-100 motion-reduce:transition-none">
                      visit site ↗
                    </span>
                  </a>
                );
              })()}
            </div>

            <div className="min-w-0 flex-1 px-2 py-2">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-lg font-semibold text-ink">{p.title}</h3>
                {p.github && (
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${p.title} on GitHub`}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-ink/25 bg-white/60 text-ink transition-colors hover:bg-ink hover:text-paper"
                  >
                    <GithubIcon />
                  </a>
                )}
              </div>
              <ul className="mt-2 flex flex-wrap gap-2" aria-label="Tech stack">
                {p.stack.map((s) => (
                  <Pill key={s} tone="white">{s}</Pill>
                ))}
              </ul>
              <p className="mt-2 text-sm leading-relaxed">{p.description}</p>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

function Life() {
  return (
    <Section id="life" title="Life Unplugged" intro="Everything else that makes me, me! (Hover over the polaroids!)" end>
      <ul className="mx-auto grid max-w-sm grid-cols-2 gap-x-6 gap-y-10 sm:max-w-xl sm:gap-x-10 md:max-w-4xl md:grid-cols-3 md:gap-x-32 md:gap-y-16">
        {LIFE_PHOTOS.map((ph) => (
          <li key={ph.title} className={ph.nudge}>
            <button
              type="button"
              className={`group relative block w-full rounded-sm bg-white p-1.5 pb-8 text-left shadow-soft outline-none transition duration-300 hover:z-10 hover:rotate-0 hover:scale-102 focus-visible:z-10 focus-visible:rotate-0 focus-visible:ring-2 focus-visible:ring-navy motion-reduce:transition-none ${ph.tilt}`}
            >
              <Tape className="-top-3 left-1/2 -translate-x-1/2 rotate-2" />

              <span className="relative block overflow-hidden rounded-sm">
                {ph.src ? (
                  <img src={ph.src} alt="" className="aspect-[4/5] w-full object-cover" />
                ) : (
                  <ImagePlaceholder label="Photo" tone="pink" className="aspect-[4/5] w-full !rounded-sm" />
                )}

                <span className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-navy/75 p-3 text-center text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none">
                  <span className="font-hand text-xl leading-none">{ph.title}</span>
                  <span className="text-xs leading-snug text-white/90 sm:text-sm">{ph.text}</span>
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function Connect() {
  const [copied, setCopied] = useState(false);

  const handleEmailClick = () => {
    navigator.clipboard.writeText(PROFILE.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const links = [
    { isEmail: true, value: PROFILE.email, href: `mailto:${PROFILE.email}`, external: false },
    { isEmail: false, value: prettyUrl(PROFILE.linkedin), href: PROFILE.linkedin, external: true },
    { isEmail: false, value: prettyUrl(PROFILE.github), href: PROFILE.github, external: true },
  ];

  return (
    <footer id="connect" aria-labelledby="connect-title" className="scroll-mt-20 px-5 sm:px-8">
      <div className="mx-auto max-w-6xl rounded-t-[2.5rem] bg-ink px-6 pb-8 pt-14 text-paper sm:px-12 md:pt-20">
        <div className="grid items-center gap-14 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <RevealHeading
              id="connect-title"
              text="say hi :)"
              className="font-hand text-6xl leading-none text-paper sm:text-7xl md:text-8xl"
            />
            <p className="mt-6 max-w-md text-lg leading-relaxed text-paper/80">
              Looking for my next co-op for Summer 2027! Reach out if you have an open role, a fun side project, or a great restaurant rec!
            </p>
          </div>

          <ul className="relative space-y-2 pl-8">
            <span aria-hidden="true" className="absolute bottom-6 left-1.5 top-6 w-px bg-paper/30" />
            {links.map((l) => (
              <li key={l.value}>
                <a
                  href={l.href}
                  onClick={l.isEmail ? handleEmailClick : undefined}
                  {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group relative block rounded-lg px-3 py-4 transition-colors hover:bg-paper/10 focus-visible:outline-butter-300 dark:focus-visible:outline-navy"
                >
                  <span
                    aria-hidden="true"
                    className="absolute -left-8 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-paper bg-ink transition-colors duration-300 group-hover:bg-butter-300"
                  />
                  <span className="flex items-center justify-between gap-3 font-mono text-[15px] tracking-wide text-paper">
                    <span className="break-all">
                      {l.isEmail && copied ? "Copied to clipboard!" : l.value}
                    </span>
                    <span
                      aria-hidden="true"
                      className="shrink-0 -translate-x-1 opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100 motion-reduce:transition-none"
                    >
                      ↗
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-2 border-t border-paper/20 pt-6 font-mono text-xs text-paper/60">
          <span>© {new Date().getFullYear()} {PROFILE.name}</span>
          <span>made with a lot of pink :)</span>
        </div>
      </div>
    </footer>
  );
}

function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isInverse, setIsInverse] = useState(false);
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      setIsInverse(!!target.closest('.bg-ink'));
      setIsPointer(!!target.closest('a, button, [role="button"]'));
    };
    
    window.addEventListener('mousemove', updateCursor);
    return () => window.removeEventListener('mousemove', updateCursor);
  }, []);

  const color = isInverse ? "text-paper" : "text-ink";

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[100000] hidden sm:block ${color}`}
      style={{ transform: `translate3d(${pos.x}px, ${pos.y}px, 0)` }}
    >
      <div className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-150 ease-out">
        {isPointer ? (
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="16" cy="16" r="10" />
            <circle cx="16" cy="16" r="2" fill="currentColor" />
          </svg>
        ) : (
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="16" cy="16" r="6" />
            <line x1="16" y1="2" x2="16" y2="8" />
            <line x1="16" y1="24" x2="16" y2="30" />
            <line x1="2" y1="16" x2="8" y2="16" />
            <line x1="24" y1="16" x2="30" y2="16" />
          </svg>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const active = useActiveSection(NAV_IDS);
  const { theme, toggle } = useTheme();

  return (
    <div className="relative overflow-x-clip bg-paper bg-grid bg-[length:32px_32px] text-ink-soft sm:cursor-none [&_a]:sm:cursor-none [&_button]:sm:cursor-none">
      <CustomCursor />
      <ScrollProgress />
      <Nav active={active} theme={theme} onToggleTheme={toggle} />

      <main>
        <Hero />
        <Education />
        <Experience />
        <Projects />
        <Life />
      </main>

      <Connect />
    </div>
  );
}