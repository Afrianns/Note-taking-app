// import { neon } from "@neondatabase/serverless";

import { db } from "../db/db";

import { note, tag } from "../schema/note-schema";
// import { count, eq } from "drizzle-orm";

// const { databaseUrl } = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  const data = await readBody(event);
  const result = await db.insert(tag).values({
    name: data.name,
  })

  return result;

  // if ((await checkIfExist(data.username)) > 0) {
  //   return "username already exist";
  // } else {
  //   return "username available";
  // }
});
// const checkIfExist = async (username: string) => {
//   const result = await db
//     .select({ count: count() })
//     .from(users)
//     .where(eq(users.username, username));

//   return result[0].count;
// };
