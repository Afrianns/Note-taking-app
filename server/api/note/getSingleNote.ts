import { eq } from "drizzle-orm";
import { getDb } from "~/server/db/db";
import { notes, tag_notes } from "~/server/schema/notes-schema";
import { noteTagType, noteType } from "~/types/types";

export default defineEventHandler(async (event) => {
  const data = await readBody(event);
  const db = getDb();

  try {
    const result = await db
      .select()
      .from(notes)
      .where(eq(notes.id, data.noteId))
      .leftJoin(tag_notes, eq(notes.id, tag_notes.noteId))
      .execute();

    let newResult: noteType = {
      id: result[0].notes.id,
      title: result[0].notes.title,
      content: result[0].notes.content,
      tags: [] as noteTagType[],
      createdAt: result[0].notes.createdAt,
      updatedAt: result[0].notes.updatedAt,
    };

    result.forEach((obj) => {
      if (obj.tag_notes) {
        newResult.tags.push({
          id: obj.tag_notes.tagId,
          name: obj.tag_notes.name,
        });
      }
    });

    return newResult;
  } catch (err: any) {
    throw createError({ statusCode: 500, statusMessage: err.message });
  }
});
