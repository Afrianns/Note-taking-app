import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

export const getDb = () => {
  const config = useRuntimeConfig();
  const postgres = neon(config.databaseUrl);
  return drizzle({ client: postgres });
};
