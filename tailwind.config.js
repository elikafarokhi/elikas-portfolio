/** @type {import('tailwindcss').Config} */
// Tailwind v3. This file uses ESM (`export default`), which matches the Vite
// react-ts template. If your project is CommonJS (e.g. Next.js), swap the
// first line for `module.exports = {` and delete the `export default`.
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  // Dark mode is switched by adding the `dark` class to <html> (see useTheme in App.tsx).
  darkMode: "class",

  theme: {
    extend: {
      /* ------------------------------------------------------------------
       * COLOURS: two layers
       *
       * 1) SEMANTIC TOKENS (paper, ink, tint, featured). These read CSS
       *    variables defined in index.css, so they FLIP in dark mode:
       *      paper    page background      light pink   <->  deep navy
       *      ink      text + structure     navy         <->  light pink
       *      tint     soft pink surfaces   pink         <->  lighter navy
       *      featured feature cards        pale yellow  <->  dark card, gold edge
       *    Use these for almost everything.
       *
       * 2) FIXED RAMPS (blush, butter, navy). These never change. Use them
       *    for things that should look the same in both modes: sticky notes,
       *    tape, and the photo prints (paper stays paper).
       * ------------------------------------------------------------------ */
      colors: {
        paper: "rgb(var(--paper) / <alpha-value>)",
        ink: {
          DEFAULT: "rgb(var(--ink) / <alpha-value>)",
          soft: "rgb(var(--ink-soft) / <alpha-value>)", // body copy
          muted: "rgb(var(--ink-muted) / <alpha-value>)", // dates, captions
        },
        tint: {
          DEFAULT: "rgb(var(--tint) / <alpha-value>)",
          edge: "rgb(var(--tint-edge) / <alpha-value>)",
        },
        featured: {
          DEFAULT: "rgb(var(--featured) / <alpha-value>)",
          edge: "rgb(var(--featured-edge) / <alpha-value>)",
        },

        blush: {
          50: "#FFF6F8",
          100: "#FEEDF2",
          200: "#FCDDE7",
          300: "#F9C6D7",
          400: "#F4A6C0",
        },
        // Butter yellow matched to the user's reference swatch (#FCF6CA at 300).
        butter: {
          50: "#FFFEF8",
          100: "#FEFAE8", // feature-card fill
          200: "#FCF7D8", // tape, feature-card edge
          300: "#FCF6CA", // sticky notes + accents — the reference colour
          400: "#EDE0A8",
        },
        navy: {
          DEFAULT: "#1B2A4E",
          900: "#111C38",
          700: "#2C3E6B",
          500: "#56679A",
          300: "#98A5C8",
        },
      },

      /* ------------------------------------------------------------------
       * FONTS  (loaded via Google Fonts in index.css)
       *   sans / display = Space Grotesk: geometric, a little technical, still
       *                    very readable. Used for headlines AND body text,
       *                    mostly at regular/medium weight (not bold) for a
       *                    leaner, more technical look.
       *   mono           = IBM Plex Mono: the "system voice" for section
       *                    titles, nav, dates, tags and labels. It has a true
       *                    Light weight, which is what makes it read as thin
       *                    and technical rather than typewriter-heavy.
       *   hand           = Caveat: the "pen", only for short notes and captions
       * ------------------------------------------------------------------ */
      fontFamily: {
        display: ['"Space Grotesk"', "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ['"Space Grotesk"', "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
        hand: ["Caveat", '"Bradley Hand"', "cursive"],
      },

      boxShadow: {
        soft: "0 14px 40px -16px rgba(17, 28, 56, 0.32)",
        glass: "0 8px 32px -8px rgba(17, 28, 56, 0.16)",
      },

      /* Adds `hover:scale-102` for a barely-there lift on cards. */
      scale: {
        102: "1.02",
      },

      /* ------------------------------------------------------------------
       * BACKGROUND PATTERNS (colour comes from --ink, so they flip too)
       *   grid -> faint graph-paper lines. Delete `bg-grid
       *           bg-[length:32px_32px]` in App.tsx for perfectly flat colour.
       *   pins -> a row of small ticks, like the legs of a chip.
       * ------------------------------------------------------------------ */
      backgroundImage: {
        grid:
          "linear-gradient(to right, rgb(var(--ink) / 0.045) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--ink) / 0.045) 1px, transparent 1px)",
        pins: "repeating-linear-gradient(to bottom, rgb(var(--ink)) 0 6px, transparent 6px 16px)",
      },

      /* ------------------------------------------------------------------
       * ANIMATION
       *   trace -> the hero wire draws itself down the page once on load.
       *   Wrapped in `motion-safe:` in App.tsx.
       * ------------------------------------------------------------------ */
      keyframes: {
        trace: {
          "0%": { transform: "scaleY(0)" },
          "100%": { transform: "scaleY(1)" },
        },
      },
      animation: {
        trace: "trace 1.8s cubic-bezier(0.65, 0, 0.35, 1) both",
      },
    },
  },
  plugins: [],
};