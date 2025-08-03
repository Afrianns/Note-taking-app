import { defineConfig } from "drizzle-kit";

const config = useRuntimeConfig();

export default defineConfig({
  schema: "./server/schema/notes-schema.ts",
  out: "./server/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: config.NUXT_DB_URL as string,
  },
});
