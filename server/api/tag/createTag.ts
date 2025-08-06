import { getDb } from "~/server/db/db";
import { tags } from "~/server/schema/notes-schema";
import { noteTagType, tagType } from "~/types/types";

type tagCreateType = [a: tagType | null, b: string | null];

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
      return { data: result, error: null };
    } else {
      return { data: null, error: "Tag too short" };
    }
  } catch (err: any) {
    throw createError({ statusCode: 500, statusMessage: err.message });
  }
});
