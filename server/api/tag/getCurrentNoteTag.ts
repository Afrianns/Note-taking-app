import { getDb } from "../../db/db";
import { tag_notes } from "../../schema/notes-schema";

export default defineEventHandler(async () => {
  const db = getDb();
  try {
    const result = await db
      .select({
        tagId: tag_notes.tagId,
        noteId: tag_notes.noteId,
      })
      .from(tag_notes)
      .execute();

    return result;
  } catch (err: any) {
    throw createError({ statusCode: 500, statusMessage: err.message });
  }
});
