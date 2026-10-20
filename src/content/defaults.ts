// Built-in content. Renders immediately on every visit and is used whenever
// Firestore is unconfigured or unreachable. `scripts/seed.ts` uploads this
// as-is, using these ids as document ids.
import type { SiteContent } from "./types.ts";

export const DEFAULT_CONTENT: SiteContent = {
  education: [
    {
      id: "uwaterloo",
      order: 0,
      school: "University of Waterloo",
      degree: "Computer Engineering",
      start: "2025",
      end: "2030",
      note: "University of Waterloo President’s Scholarship of Distinction Recipient.",
      highlights: [],
      logo: "/uwaterloo_logo.png",
      currentTerm: "2A",
    },
  ],

  experience: [
    {
      id: "mercury-mortgages",
      order: 0,
      dates: "September 2026 to Present",
      company: "Mercury Mortgages",
      role: "Software Developer",
      description:
        "Developing full-stack features for internal financial and trade software. Currently focused on upgrading the invoice management system by building out payment batch processing, vendor verification, and manual date-tracking workflows.",
      stack: ["React", "Python", "SQL", "Docker"],
    },
    {
      id: "uwaterloo-usra",
      order: 1,
      dates: "January 2026 to May 2026",
      company: "University of Waterloo",
      role: "Research Assistant (USRA)",
      people: "with Dr. Mehrdad Pirnia & Dr. Elham Soufiani",
      description:
        "Compiled fleet, route, and airport data for 10 Canadian regional airlines and gathered research sources for an electric aircraft optimization model. Wrote the introduction and was acknowledged in the resulting paper. Built a React and TypeScript site showcasing the university's electric aviation research.",
      stack: ["React", "TypeScript", "Data Analysis", "Optimization"],
      links: [
        {
          label: "Read the paper",
          href: "https://arxiv.org/html/2606.28312v1",
          ariaLabel: "Read the paper: Optimal Deployment of Electric Aircraft for Canadian Domestic Flights",
        },
        {
          label: "Visit the site",
          href: "https://mpirnia.com",
          ariaLabel: "Visit mpirnia.com, the electric aviation research site I built",
        },
      ],
    },
    {
      id: "easier-emails",
      order: 2,
      dates: "July 2025 to January 2026",
      company: "Easier Emails",
      role: "Software Engineer",
      description:
        "Redesigned the campaign management UI for a SaaS email platform, adding real-time validation and progress tracking. Fixed cross-browser and timezone bugs that were breaking scheduled sends, raising email delivery rates by 15%.",
      stack: ["React", "JavaScript", "CSS"],
    },
    {
      id: "stork-ymca",
      order: 3,
      dates: "June 2023 to June 2026",
      company: "Stork Family YMCA",
      role: "Head Lifeguard",
      description:
        "Led a team of 15+ lifeguards while actively guarding and managing daily pool operations. Taught swimming to 500+ participants of all ages and co-led seasonal emergency training for staff.",
      stack: ["Leadership", "Teaching", "Teamwork"],
    },
  ],

  projects: [
    {
      id: "powder-puff",
      order: 0,
      title: "Powder Puff",
      description:
        "A serverless Python app that tracks overnight snowfall at 42 ski resorts across Ontario and Quebec. Runs on Vercel with a daily cron job and a Neon Postgres database, and anyone can sign up to get styled email alerts when their mountains get a powder day.",
      stack: ["Python", "FastAPI", "Serverless", "PostgreSQL", "Cron Jobs"],
      tone: "yellow",
      image: "/powderpuff.jpeg",
      live: "https://powderpuff.vercel.app",
      github: "https://github.com/elikafarokhi/powder-puff",
    },
    {
      id: "bathroom-bestie",
      order: 1,
      title: "BathroomBestie",
      description:
        "A mobile safety net for nights out. It notices when you split from your group, go still, or miss your home deadline, then alerts a ladder of friends one at a time. There’s no panic button, no check-ins and no live GPS sharing. Gemini turns a one-sentence plan for your night into the rules the app follows, and location data stays coarse and private by design.",
      stack: ["TypeScript", "React Native", "Fastify", "TimescaleDB", "Gemini API"],
      tone: "white",
      featured: true,
      note: "*Hack the Valley 11 winner*",
      image: "/bathroombestie.jpeg",
      github: "https://github.com/emilyyu07/bathroom-bestie",
      devpost: "https://devpost.com/software/bathroombestie",
    },
    {
      id: "firefighter",
      order: 2,
      title: "Firefighter",
      description:
        "An autonomous firefighting robot that follows walls and detects lines to navigate a maze, spots a flame with a phototransistor, and puts it out with a blower fan. I designed the circuit and wrote the PIC16F887 firmware.",
      stack: ["Embedded Systems", "Circuit Design", "Sensor Integration"],
      tone: "pink",
      featured: true,
      note: "*glambot*",
      drive: "https://drive.google.com/drive/folders/1pebpcMREaty22Qw6zZ57es8MjyiGYoS-?usp=sharing",
      image: "/firefighter.jpeg",
    },
    {
      id: "personal-portfolio",
      order: 3,
      title: "Personal Portfolio",
      description:
        "The website you're looking at right now! Built from scratch to showcase my experience, featuring a custom interactive UI and real-time content updates.",
      stack: ["React", "TypeScript", "Tailwind CSS", "Firebase"],
      tone: "yellow",
      image: "/portfolio.jpeg",
      github: "https://github.com/elikafarokhi/elikas-portfolio",
    },
  ],

  life: [
    { id: "golf", order: 0, src: "/golf.jpg", title: "Golf!", text: "My favourite excuse to go outside, nothing beats a nine and dine!", tilt: "-rotate-3", nudge: "" },
    { id: "luna", order: 1, src: "/luna.jpg", title: "Luna!", text: "My husky-labradoodle mix and my best friend. We love our forest walks :)", tilt: "rotate-2", nudge: "md:translate-y-6" },
    { id: "travelling", order: 2, src: "/bigsur.jpeg", title: "Travelling!", text: "Always plotting my next trip, trying to see as much of the world as my student budget will allow!", tilt: "-rotate-1", nudge: "md:-translate-y-2" },
    { id: "snowboarding", order: 3, src: "/snowboard.jpeg", title: "Snowboarding!", text: "Surviving the winter with my Ikon pass. Getting out to the mountains cures just about anything :)", tilt: "rotate-3", nudge: "md:translate-y-2" },
    { id: "concerts", order: 4, src: "/concert.jpeg", title: "Concerts!", text: "Whenever I need a break from my laptop, I make it my mission to hear my favorite Spotify playlists in real life!", tilt: "-rotate-2", nudge: "md:-translate-y-4" },
    { id: "food", order: 5, src: "/strawberry.jpeg", title: "Food!", text: "I'm always thinking about my next meal. Sharing good food is my absolute favorite way to connect :)", tilt: "rotate-1", nudge: "md:translate-y-4" },
  ],
};
