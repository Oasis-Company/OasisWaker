import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ── Swiss Style Color Palette ──────────────────────────────────────
      colors: {
        swiss: {
          black: "#000000",
          white: "#FFFFFF",
          gray: {
            100: "#F5F5F5",
            200: "#E5E5E5",
            300: "#CCCCCC",
            400: "#999999",
            500: "#666666",
            600: "#444444",
            700: "#333333",
            800: "#222222",
            900: "#111111",
          },
          red: "#DC2626",
        },
      },
      // ── 8px Baseline Grid Spacing ──────────────────────────────────────
      spacing: {
        "2xs": "2px",
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        "2xl": "48px",
        "3xl": "64px",
        "4xl": "96px",
      },
      // ── Typography ─────────────────────────────────────────────────────
      fontSize: {
        caption: ["12px", { lineHeight: "16px", fontWeight: "400" }],
        body: ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "body-bold": ["14px", { lineHeight: "20px", fontWeight: "600" }],
        h3: ["18px", { lineHeight: "24px", fontWeight: "700" }],
        h2: ["24px", { lineHeight: "32px", fontWeight: "700" }],
        h1: ["32px", { lineHeight: "40px", fontWeight: "700" }],
      },
      // ── Font Family ────────────────────────────────────────────────────
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      // ── Border Radius (Swiss: sharp corners only) ──────────────────────
      borderRadius: {
        none: "0px",
        sm: "0px",
        DEFAULT: "0px",
        md: "0px",
        lg: "0px",
      },
      // ── Box Shadow (Swiss: no shadows) ─────────────────────────────────
      boxShadow: {
        none: "none",
        DEFAULT: "none",
        sm: "none",
        md: "none",
        lg: "none",
        xl: "none",
      },
    },
  },
  plugins: [],
};

export default config;