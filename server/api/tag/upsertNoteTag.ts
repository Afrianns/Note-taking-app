import { inputTagType } from "~/types/types";
import { db } from "../../db/db";
import { tags, tag_notes } from "../../schema/notes-schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const dataParse = await readBody(event);

  if (!dataParse.noteId) return;

  const deleteTagResult = await deleteRelatedNoteTag(dataParse.noteId);

  if (deleteTagResult != 200 || !dataParse.tags || dataParse.tags.length <= 0)
    return;

  const tags = dataParse.tags.map((tag: inputTagType) => ({
    tagId: tag.value,
    noteId: dataParse.noteId,
    name: tag.label,
  }));

  try {
    const result = await db
      .insert(tag_notes)
      .values(tags)
      .onConflictDoNothing({ target: [tag_notes.tagId, tag_notes.noteId] })
      .returning()
      .execute();

    return result;
  } catch (err: any) {
    throw createError({ statusCode: 500, statusMessage: err.message });
  }
});

const deleteRelatedNoteTag = async (noteId: string) => {
  try {
    await db.delete(tag_notes).where(eq(tag_notes.noteId, noteId)).execute();

    return 200;
  } catch (err: any) {
    throw createError({ statusCode: 500, statusMessage: err.message });
  }
};
