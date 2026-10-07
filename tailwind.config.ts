import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: "#0F0F0F",
          pure: "#080808",
        },
        charcoal: {
          DEFAULT: "#1A1A1A",
          elevated: "#1E1E1E",
        },
        graphite: {
          DEFAULT: "#242424",
          input: "#2A2A2A",
        },
        mustard: {
          DEFAULT: "#C9A84C",
          hover: "#E0BC6A",
          muted: "rgba(201, 168, 76, 0.15)",
        },
        golden: "#E0BC6A",
        mocha: "#6B5035",
        cream: {
          DEFAULT: "#F5F0E8",
          muted: "#DDD7CD",
        },
        ash: "#9A9A9A",
        smoke: "#5A5A5A",
        iron: {
          DEFAULT: "#2E2E2E",
          subtle: "#3A3A3A",
        },
        olive: "#5C7A3E",
        amber: "#D97706",
        rust: "#8B3A2A",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-jakarta)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
