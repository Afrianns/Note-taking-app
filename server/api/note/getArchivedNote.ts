import { eq } from "drizzle-orm";
import { db } from "../../db/db";
import { user } from "../../schema/auth-schema";
import { notes } from "../../schema/notes-schema";

export default defineEventHandler(async (event) => {
  const data = await readBody(event);
  console.log(data);
  const result = await db
    .select({
      id: notes.id,
      title: notes.title,
      content: notes.content,
      createdAt: notes.createdAt,
      updatedAt: notes.updatedAt,
      tagId: tag_notes.tagId,
      noteId: tag_notes.noteId,
      tagName: tag_notes.name,
    })
    .from(user)
    .rightJoin(notes, eq(notes.userId, data.userId))
    .where(eq(notes.isArchived, true))
    .execute();

  const archivedNotesMap = new Map();
  for (const row of result) {
    if (!archivedNotesMap.has(row.id)) {
      archivedNotesMap.set(row.id, {
        id: row.id,
        title: row.title,
        content: row.content,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        tags: [],
      });
    }
    if (row.tagId && row.tagName) {
      archivedNotesMap
        .get(row.id)
        .tags.push({ id: row.tagId, name: row.tagName });
    }
  }

  return result;
});
