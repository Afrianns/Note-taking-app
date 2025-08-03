import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./server/schema/notes-schema.ts",
  out: "./server/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: import.meta.env.NUXT_DATABASE_URL!,
  },
});
