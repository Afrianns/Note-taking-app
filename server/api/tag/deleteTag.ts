import { eq } from "drizzle-orm";
import { getDb } from "~/server/db/db";
import { tags } from "~/server/schema/notes-schema";

export default defineEventHandler(async (event) => {
  const data = await readBody(event);
  const db = getDb();
  try {
    if (data.tagId) {
      await db.delete(tags).where(eq(tags.id, data.tagId)).execute();
      return "success";
    } else {
      return "failed";
    }
  } catch (err: any) {
    throw createError({ statusCode: 500, statusMessage: err.message });
  }
});
