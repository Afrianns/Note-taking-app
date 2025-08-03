import { eq } from "drizzle-orm";
import { getDb } from "~/server/db/db";
import { notes } from "~/server/schema/notes-schema";

export default defineEventHandler(async (event) => {
  const data = await readBody(event);
  const db = getDb();
  try {
    if (data.title != "" && data.id != "") {
      const result = await db
        .update(notes)
        .set({
          title: data.title,
          content: data.content,
        })
        .where(eq(notes.id, data.id))
        .execute();
      return [result, null];
    } else {
      return [null, "data cannot be empty"];
    }
  } catch (err: any) {
    throw createError({ statusCode: 500, statusMessage: err.message });
  }
});
