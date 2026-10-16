/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      screens: {
        mouse: { raw: "(hover: hover) and (pointer: fine)" },
      },
      colors: {
        paper: "rgb(var(--paper) / <alpha-value>)",
        ink: {
          DEFAULT: "rgb(var(--ink) / <alpha-value>)",
          soft: "rgb(var(--ink-soft) / <alpha-value>)",
          muted: "rgb(var(--ink-muted) / <alpha-value>)",
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
        butter: {
          50: "#FFFEF8",
          100: "#FEFAE8",
          200: "#FCF7D8",
          300: "#FCF6CA",
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
      scale: {
        102: "1.02",
      },
      backgroundImage: {
        grid: "linear-gradient(to right, rgb(var(--ink) / 0.045) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--ink) / 0.045) 1px, transparent 1px)",
        pins: "repeating-linear-gradient(to bottom, rgb(var(--ink)) 0 6px, transparent 6px 16px)",
      },
      keyframes: {
        trace: {
          "0%": { transform: "scaleY(0)" },
          "100%": { transform: "scaleY(1)" },
        },
      },
      animation: {
        trace: "trace 0.6s cubic-bezier(0.65, 0, 0.35, 1) both",
      },
    },
  },
  plugins: [],
};