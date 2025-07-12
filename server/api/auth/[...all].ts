// import { neon } from "@neondatabase/serverless";

import { auth } from "~/lib/auth";

// import { db } from "../db/db";

// import { users } from "../db/schema";
// import { count, eq } from "drizzle-orm";

// const { databaseUrl } = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  return auth.handler(toWebRequest(event));
  // if ((await checkIfExist(data.username)) > 0) {
  //   return "username already exist";
  // } else {
  //   return "username available";
  // }
});
