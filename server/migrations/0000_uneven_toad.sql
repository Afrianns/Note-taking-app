CREATE TABLE "notes"."notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"content" text DEFAULT '' NOT NULL,
	"user_id" text NOT NULL,
	"isArchived" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notes"."tag_notes" (
	"id" serial PRIMARY KEY NOT NULL,
	"tag_id" uuid NOT NULL,
	"note_id" uuid NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notes"."tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tag" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tags_tag_unique" UNIQUE("tag")
);
--> statement-breakpoint
ALTER TABLE "notes"."notes" ADD CONSTRAINT "notes_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notes"."tag_notes" ADD CONSTRAINT "tag_notes_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "notes"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notes"."tag_notes" ADD CONSTRAINT "tag_notes_note_id_notes_id_fk" FOREIGN KEY ("note_id") REFERENCES "notes"."notes"("id") ON DELETE cascade ON UPDATE no action;