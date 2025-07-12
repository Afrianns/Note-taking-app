import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env" });

const postgres = neon(process.env.NUXT_DATABASE_URL!);
export const db = drizzle({ client: postgres });
