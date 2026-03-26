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
        glow: "0 0 0 1px rgba(245,158,11,.15), 0 12px 40px rgba(15,23,42,.5)"
      },
      backgroundImage: {
        hero: "radial-gradient(circle at top left, rgba(245, 158, 11, .16), transparent 40%), radial-gradient(circle at top right, rgba(96, 165, 250, .14), transparent 30%)"
      }
    }
  },
  plugins: []
} satisfies Config;
