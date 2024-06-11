import "@/lib/drizzle/envConfig";
import { defineConfig, Config } from "drizzle-kit";

export default defineConfig({
  schema: "./lib/drizzle/schema.ts",
  dialect: "postgresql",
  out: "./drizzle",
  dbCredentials: {
    port: 5432,
    url: process.env.POSTGRES_URL,
  },
} as Config);
