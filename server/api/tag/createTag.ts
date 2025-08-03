import { getDb } from "~/server/db/db";
import { tags } from "~/server/schema/notes-schema";

export default defineEventHandler(async (event) => {
  const data = await readBody(event);
  const db = getDb();
  try {
    if (data.nameTag.length >= 3) {
      const result = await db
        .insert(tags)
        .values({
          name: data.nameTag,
        })
        .returning()
        .execute();
      return [result, null];
    } else {
      return [null, "Tag too short"];
    }
  } catch (err: any) {
    throw createError({ statusCode: 500, statusMessage: err.message });
  }
});
