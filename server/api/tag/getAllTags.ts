import { getDb } from "../../db/db";
import { tags } from "../../schema/notes-schema";

export default defineEventHandler(async () => {
  const db = getDb();
  try {
    const result = await db
      .select({
        id: tags.id,
        name: tags.name,
        createdAt: tags.createdAt,
      })
      .from(tags)
      .execute();

    return result;
  } catch (err: any) {
    throw createError({ statusCode: 500, statusMessage: err.message });
  }
});
