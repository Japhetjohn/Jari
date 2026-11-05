import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-jari-sans)", "Arial", "sans-serif"],
        serif: ["var(--font-jari-serif)", "Georgia", "serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        slate: {
          50: "#f7f7f2",
          100: "#f0f2ec",
          200: "#e1e5dc",
          300: "#cdd4c8",
          400: "#a8b0a3",
          500: "#7b8378",
          600: "#60685f",
          700: "#424a42",
          800: "#2d342d",
          900: "#20261f",
        },
        emerald: {
          50: "#eef3eb",
          100: "#dfe9da",
          200: "#c6d8bf",
          300: "#a8c39d",
          400: "#83a477",
          500: "#64855f",
          600: "#496b50",
          700: "#36593f",
          800: "#2c4f38",
          900: "#244a35",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;

