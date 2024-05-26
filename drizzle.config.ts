import "@/lib/drizzle/envConfig";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./lib/drizzle/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    user: process.env.POSTGRES_USER as string,
    password: process.env.POSTGRES_PASSWORD as string,
    host: process.env.POSTGRES_HOST as string,
    port: 5432,
    database: process.env.POSTGRES_DATABASE as string,
    url: process.env.POSTGRES_URL,
  },
});
