import {
  integer,
  pgSchema,
  serial,
  text,
  timestamp,
  boolean,
  uuid,
  unique,
} from "drizzle-orm/pg-core";

import { user } from "./auth-schema";

const noteSchema = pgSchema("notes");

export const tags = noteSchema.table("tags", {
  id: uuid().notNull().defaultRandom().primaryKey(),
  name: text("tag").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const tag_notes = noteSchema.table(
  "tag_notes",
  {
    id: serial("id").primaryKey(),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
    noteId: uuid("note_id")
      .notNull()
      .references(() => notes.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => {
    return {
      tagNoteUnique: unique().on(table.tagId, table.noteId),
    };
  }
);
export const notes = noteSchema.table("notes", {
  id: uuid().notNull().defaultRandom().primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull().default(""),
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
