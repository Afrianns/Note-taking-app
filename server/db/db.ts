import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

const config = useRuntimeConfig();

const postgres = neon(config.nuxtDatabaseUrl);
export const db = drizzle({ client: postgres });
