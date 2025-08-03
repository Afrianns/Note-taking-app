import { eq } from "drizzle-orm";
import { getDb } from "../../db/db";
import { notes, tag_notes } from "../../schema/notes-schema";

export default defineEventHandler(async (event) => {
  const data = await readBody(event);
  const db = getDb();

  let isArchived = false;

  if (data.type && data.type == "archived") isArchived = true;

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
    .from(notes)
    .leftJoin(tag_notes, eq(notes.id, tag_notes.noteId))
    .where(eq(notes.isArchived, isArchived))
    .execute();

  const notesMap = new Map();
  for (const row of result) {
    if (!notesMap.has(row.id)) {
      notesMap.set(row.id, {
        id: row.id,
        title: row.title,
        content: row.content,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        tags: [],
      });
    }
    if (row.tagId && row.tagName) {
      notesMap.get(row.id).tags.push({ id: row.tagId, name: row.tagName });
    }
  }

  return Array.from(notesMap.values());
});
