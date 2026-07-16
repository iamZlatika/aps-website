import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/features/**/*.{js,ts,jsx,tsx}",
    "./src/entities/**/*.{js,ts,jsx,tsx}",
    "./src/widgets/**/*.{js,ts,jsx,tsx}",
    "./src/shared/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "ws-ink": "var(--ws-ink)",
        "ws-ink-hi": "var(--ws-ink-hi)",
        "ws-ink-soft": "var(--ws-ink-soft)",
        "ws-ink-mute": "var(--ws-ink-mute)",
        "ws-bg": "var(--ws-bg)",
        "ws-bg-2": "var(--ws-bg-2)",
        "ws-bg-3": "var(--ws-bg-3)",
        "ws-line": "var(--ws-line)",
        "ws-line-soft": "var(--ws-line-soft)",
        "ws-ember": "var(--ws-ember)",
        "ws-ember-bright": "var(--ws-ember-bright)",
        "ws-ember-deep": "var(--ws-ember-deep)",
        "ws-ember-text": "var(--ws-ember-text)",
        "ws-cream": "var(--ws-cream)",
        "ws-green": "rgb(93 184 111 / <alpha-value>)",
        "ws-green-soft": "var(--ws-green-soft)",
        "ws-green-bright": "var(--ws-green-bright)",
        "ws-red": "var(--ws-red)",
        "ws-red-bright": "var(--ws-red-bright)",
        "ws-overlay-chip": "var(--ws-overlay-chip)",
        "ws-overlay-border": "var(--ws-overlay-border)",
        "ws-card": "var(--ws-card)",
        "ws-input-bg": "var(--ws-input-bg)",
      },
      borderRadius: {
        "ws-ctrl": "9px",
        "ws-ctrl-inner": "6px",
        "ws-sm": "11px",
        "ws-md": "12px",
        "ws-chip": "14px",
        "ws-card": "18px",
        "ws-xl": "22px",
        "ws-2xl": "28px",
      },
      fontSize: {
        "ws-2xs": "11px",
        "ws-xs": "12.5px",
        "ws-sm": "13px",
        "ws-base": "14px",
        "ws-md": "15px",
        "ws-body": "15.5px",
        "ws-lg": "17px",
        "ws-xl": "18px",
        "ws-2xl": "28px",
        "ws-3xl": "36px",
        "ws-hero-title": "clamp(32px, 4vw, 54px)",
        "ws-hero-body": "clamp(13px, 1.1vw, 15.5px)",
      },
      spacing: {
        "ws-ctrl": "34px",
      },
    },
  },
  plugins: [animate],
};

export default config;
