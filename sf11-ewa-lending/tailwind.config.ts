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
        shinhan: {
          blue: "#003478",
          "blue-light": "#0062CC",
          gold: "#C8A96E",
          "bg-main": "#F5F6FA",
        },
      },
    },
  },
  plugins: [],
};
export default config;
