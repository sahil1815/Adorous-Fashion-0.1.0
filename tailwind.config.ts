import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ── Brand colour tokens ─────────────────────────────────────────────
      colors: {
        brand: {
          champagne: "#F7E7CE",   // backgrounds, warm fills
          charcoal:  "#1A1A1A",   // primary text, borders
          rose:      "#B76E79",   // accent, CTA, hover states
          "rose-light": "#D4A5AB",
          "champagne-dark": "#E8C99A",
        },
      },

      // ── Typography ──────────────────────────────────────────────────────
      fontFamily: {
        serif:  ["Cormorant Garamond", "Georgia", "serif"],
        sans:   ["Jost", "system-ui", "sans-serif"],
      },

      // ── Custom letter-spacing ───────────────────────────────────────────
      letterSpacing: {
        "widest-2": "0.25em",
        "widest-3": "0.35em",
      },

      // ── Smooth transition timing ─────────────────────────────────────────
      transitionTimingFunction: {
        "ease-smooth": "cubic-bezier(0.25, 0.1, 0.25, 1)",
        "ease-drawer": "cubic-bezier(0.32, 0, 0.15, 1)",
      },

      // ── Animation (Navbar scroll shadow) ────────────────────────────────
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        "slide-down": {
          from: { transform: "translateY(-4px)", opacity: "0" },
          to:   { transform: "translateY(0)",     opacity: "1" },
        },
      },
      animation: {
        "fade-in":   "fade-in 0.2s ease-out forwards",
        "slide-down":"slide-down 0.25s ease-out forwards",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"), // needed for animate-in / fade-in / zoom-in classes
  ],
};

export default config;