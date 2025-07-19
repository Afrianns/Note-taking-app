import { eq } from "drizzle-orm";
import { db } from "~/server/db/db";
import { notes } from "~/server/schema/notes-schema";

export default defineEventHandler(async (event) => {
  const data = await readBody(event);

  try {
    const result = await db
      .select()
      .from(notes)
      .where(eq(notes.id, data.noteId))
      .execute();
    return result;
  } catch (err: any) {
    throw createError({ statusCode: 500, statusMessage: err.message });
  }
});
