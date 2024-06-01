CREATE TABLE IF NOT EXISTS "bingos" (
	"id" serial PRIMARY KEY NOT NULL,
	"streamer" text NOT NULL,
	"expiredAt" timestamp (3) DEFAULT now() + '16 hour'::interval NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "selected_bingos_items" (
	"bingoItemId" integer,
	"bingoId" integer,
	"marked" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "selected_bingos_items_bingoId_bingoItemId_pk" PRIMARY KEY("bingoId","bingoItemId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "streamer_bingos_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"streamer" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "selected_bingos_items" ADD CONSTRAINT "selected_bingos_items_bingoItemId_streamer_bingos_items_id_fk" FOREIGN KEY ("bingoItemId") REFERENCES "public"."streamer_bingos_items"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "selected_bingos_items" ADD CONSTRAINT "selected_bingos_items_bingoId_bingos_id_fk" FOREIGN KEY ("bingoId") REFERENCES "public"."bingos"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "b_streamerIndex" ON "bingos" ("streamer");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sbi_streamerIndex" ON "streamer_bingos_items" ("streamer");