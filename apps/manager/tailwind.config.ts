import type { Config } from "tailwindcss";
import { twConfig } from "tailwind/nextjs";

const config: Pick<Config, "content" | "presets"> = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  presets: [twConfig],
};

export default config;
