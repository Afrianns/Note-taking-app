// import { neon } from "@neondatabase/serverless";

import { Placeholder, SQL } from "drizzle-orm";
import { db } from "~/server/db/db";
import { notes } from "~/server/schema/notes-schema";

// import { auth } from "../schema/auth-schema";
// import { count, eq } from "drizzle-orm";
// const { databaseUrl } = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  const data = await readBody(event);
  try {
    const result = await db
      .insert(notes)
      .values({
        userId: data.userId,
        title: data.title,
      })
      .returning()
      .execute();
    return result;
  } catch (err: any) {
    throw createError({ statusCode: 500, statusMessage: err.message });
  }

  // return result;

  // return result;

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
