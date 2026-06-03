import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: "375px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1920px",
    },
    extend: {
      colors: {
        brand: {
          navy: "#0B2D78",
          blue: "#1A5FBF",
          mid: "#2D84D8",
          bright: "#4BAEF0",
          cyan: "#5DCDE6",
          indigo: "#071840",
          ink: "#0A1B2E",
          cloud: "#F4F8FB",
          border: "#E2EAF4",
          muted: "#6B7A8F",
          body: "#3A4655",
        },
        semantic: {
          success: "#27AE60",
          warning: "#F39C12",
          error: "#E74C3C",
          info: "#2D84D8",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      fontSize: {
        display: [
          "clamp(48px, 7vw, 96px)",
          { lineHeight: "1.1", letterSpacing: "-0.02em" },
        ],
        h1: [
          "clamp(36px, 5vw, 64px)",
          { lineHeight: "1.1", letterSpacing: "-0.02em" },
        ],
        h2: ["clamp(28px, 4vw, 48px)", { lineHeight: "1.2" }],
        h3: ["clamp(22px, 3vw, 32px)", { lineHeight: "1.2" }],
        h4: ["clamp(18px, 2vw, 24px)", { lineHeight: "1.5" }],
        "body-lg": ["18px", { lineHeight: "1.7" }],
        body: ["16px", { lineHeight: "1.7" }],
        "body-sm": ["14px", { lineHeight: "1.5" }],
        label: ["12px", { lineHeight: "1.5", letterSpacing: "0.1em" }],
        micro: ["11px", { lineHeight: "1.5" }],
      },
      letterSpacing: {
        tight: "-0.02em",
        normal: "0em",
        wide: "0.05em",
        wider: "0.1em",
        widest: "0.2em",
      },
      lineHeight: {
        tight: "1.1",
        snug: "1.2",
        normal: "1.5",
        relaxed: "1.7",
        loose: "2.0",
      },
      spacing: {
        "section-mobile": "64px",
        "section-tablet": "96px",
        "section-desktop": "128px",
      },
      maxWidth: {
        narrow: "768px",
        content: "1280px",
        wide: "1440px",
      },
      backgroundImage: {
        "gradient-brand":
          "linear-gradient(135deg, #0B2D78 0%, #1A5FBF 55%, #4BAEF0 100%)",
        "gradient-dark":
          "linear-gradient(145deg, #071840 0%, #0B2D78 100%)",
        "gradient-subtle":
          "linear-gradient(180deg, #F4F8FB 0%, #FFFFFF 100%)",
      },
      boxShadow: {
        card: "0 2px 24px rgba(11, 45, 120, 0.06)",
        "card-hover": "0 12px 40px rgba(11, 45, 120, 0.12)",
        "btn-primary": "0 4px 16px rgba(11, 45, 120, 0.3)",
        "focus-ring": "0 0 0 3px rgba(93, 205, 230, 0.15)",
      },
      transitionDuration: {
        fast: "150ms",
        base: "250ms",
        slow: "400ms",
      },
    },
  },
  plugins: [],
};
export default config;
