CREATE TABLE "notes"."notes" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notes"."tag_notes " (
	"id" serial PRIMARY KEY NOT NULL,
	"tag_id" integer NOT NULL,
	"note_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notes"."tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"tag" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tags_tag_unique" UNIQUE("tag")
);
--> statement-breakpoint
ALTER TABLE "notes"."notes" ADD CONSTRAINT "notes_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notes"."tag_notes " ADD CONSTRAINT "tag_notes _tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "notes"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notes"."tag_notes " ADD CONSTRAINT "tag_notes _note_id_notes_id_fk" FOREIGN KEY ("note_id") REFERENCES "notes"."notes"("id") ON DELETE cascade ON UPDATE no action;