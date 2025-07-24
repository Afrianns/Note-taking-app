import { db } from "../../db/db";
import { tags, tag_notes } from "../../schema/notes-schema";

export default defineEventHandler(async (event) => {
  const data = await readBody(event);
  try {
    const result = await db
      .insert(tag_notes)
      .values({
        tagId: data.tagId,
        noteId: data.noteId,
        name: data.name,
      })
      .returning()
      .execute();

    return result;
  } catch (err: any) {
    throw createError({ statusCode: 500, statusMessage: err.message });
  }
});
