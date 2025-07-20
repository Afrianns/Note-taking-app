import { eq } from "drizzle-orm";
import { db } from "../../db/db";
import { notes } from "../../schema/notes-schema";

export default defineEventHandler(async (event) => {
  const data = await readBody(event);

  let isArchiving = false;

  if (data.value) {
    isArchiving = true;
  }
  const result = await db
    .update(notes)
    .set({ isArchived: isArchiving })
    .where(eq(notes.id, data.noteId))
    .returning()
    .execute();

  return [result, isArchiving];
});
