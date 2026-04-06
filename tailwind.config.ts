import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#060816",
        card: "#0d1326",
        accent: "#f59e0b",
        line: "#1f2a44",
        text: "#eef2ff",
        muted: "#94a3b8"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(56,189,248,.12), 0 18px 48px rgba(2,8,23,.48)"
      },
      backgroundImage: {
        hero: "radial-gradient(circle at top left, rgba(56, 189, 248, .16), transparent 34%), radial-gradient(circle at top right, rgba(245, 158, 11, .16), transparent 26%), linear-gradient(135deg, rgba(8, 15, 34, .92), rgba(5, 8, 22, .92))"
      }
    }
  },
  plugins: []
} satisfies Config;
