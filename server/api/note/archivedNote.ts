import { eq } from "drizzle-orm";
import { db } from "../../db/db";
import { notes } from "../../schema/notes-schema";

export default defineEventHandler(async (event) => {
  const data = await readBody(event);

  if (!data.hasOwnProperty("setArchiving")) return;

  try {
    if (data.noteId != "") {
      await db
        .update(notes)
        .set({ isArchived: data.setArchiving })
        .where(eq(notes.id, data.noteId))
        .execute();

      return true;
    } else {
      return false;
    }
  } catch (err: any) {
    throw createError({ statusCode: 500, statusMessage: err.message });
  }
});
