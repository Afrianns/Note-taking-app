import { eq } from "drizzle-orm";
import { db } from "~/server/db/db";
import { tags } from "~/server/schema/notes-schema";

export default defineEventHandler(async (event) => {
  const data = await readBody(event);

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
