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

    const singleNote = result[0];

    return {
      id: singleNote.id,
      title: singleNote.title,
      content: singleNote.content,
      tags: [],
      createdAt: singleNote.createdAt,
      updatedAt: singleNote.updatedAt,
    };
    
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

// [
//     {
//         "id": "d070a2d6-d8e9-4868-aacb-87873fd5137b",
//         "title": "the long night",
//         "content": "",
//         "userId": "MABnNgaGKERICJ9QGz45osuma9a7fyMV",
//         "isArchived": false,
//         "createdAt": "2025-08-02T08:10:06.106Z",
//         "updatedAt": "2025-08-02T08:10:05.604Z"
//     }
// ]
