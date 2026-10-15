CREATE TYPE "public"."lead_form" AS ENUM('contact', 'trial_class');--> statement-breakpoint
CREATE TYPE "public"."lead_status" AS ENUM('new', 'contacted', 'trial_scheduled', 'enrolled', 'lost');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'paid');--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"form" "lead_form" NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"answers" jsonb NOT NULL,
	"status" "lead_status" DEFAULT 'new' NOT NULL,
	"payment_status" "payment_status" DEFAULT 'pending' NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "leads" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE INDEX "leads_created_at_idx" ON "leads" USING btree ("created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "leads_form_idx" ON "leads" USING btree ("form");--> statement-breakpoint
CREATE INDEX "leads_status_idx" ON "leads" USING btree ("status");