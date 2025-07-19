import {
  integer,
  pgSchema,
  serial,
  text,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

import { user } from "./auth-schema";

const noteSchema = pgSchema("notes");

export const tags = noteSchema.table("tags", {
  id: serial("id").primaryKey(),
  name: text("tag").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const tag_notes = noteSchema.table("tag_notes", {
  id: serial("id").primaryKey(),
  tagId: integer("tag_id")
    .notNull()
    .references(() => tags.id, { onDelete: "cascade" }),
  noteId: integer("note_id")
    .notNull()
    .references(() => notes.id, { onDelete: "cascade" }),
  sim: text("sim"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
export const notes = noteSchema.table("notes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  isArchived: boolean().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export type insertNotes = typeof notes.$inferInsert;
export type selectNotes = typeof notes.$inferSelect;

export type insertTags = typeof tags.$inferInsert;
export type selectTags = typeof tags.$inferSelect;
// export type InsertPost = typeof postsTable.$inferInsert;
// export type SelectPost = typeof postsTable.$inferSelect;
