import { pgSchema, serial, text, timestamp, integer } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const note = pgSchema("note").table("notes", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  tagId: integer("tag_id")
    .notNull()
    .references(() => tag.id, { onDelete: "no action" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const tag = pgSchema("note").table("tags", {
  id: serial().primaryKey(),
  name: text("name").notNull(),
});
