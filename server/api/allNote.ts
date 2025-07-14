import { eq } from "drizzle-orm";
import { db } from "../db/db";
import { user } from "../schema/auth-schema";
import { notes } from "../schema/notes-schema";

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
    })
    .from(user)
    .rightJoin(notes, eq(data.userId, notes.userId))
    .execute();

  return result;
});
