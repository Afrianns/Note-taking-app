import { getDb } from "~/server/db/db";
import { notes } from "~/server/schema/notes-schema";
export default defineEventHandler(async (event) => {
  const db = getDb();
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
});
