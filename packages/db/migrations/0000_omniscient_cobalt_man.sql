DO $$ BEGIN
 CREATE TYPE "public"."listType" AS ENUM('space', 'project');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."stripe_subscription_status" AS ENUM('incomplete', 'incomplete_expired', 'trialing', 'active', 'past_due', 'canceled', 'unpaid', 'paused');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "modal_auth_key" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(15) NOT NULL,
	"hashed_password" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "modal_auth_session" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"user_id" varchar(15) NOT NULL,
	"active_expires" bigint NOT NULL,
	"idle_expires" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "modal_auth_token" (
	"id" char(24) NOT NULL,
	"user_id" varchar(15) NOT NULL,
	"token" char(8) NOT NULL,
	"expires" bigint NOT NULL,
	CONSTRAINT "modal_auth_token_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "modal_feature_notification" (
	"id" char(24) NOT NULL,
	"time_created" timestamp with time zone DEFAULT now() NOT NULL,
	"time_updated" timestamp with time zone DEFAULT now() NOT NULL,
	"user_id" varchar(15) NOT NULL,
	"modal_type" varchar(50) NOT NULL,
	"show_modal" boolean DEFAULT true NOT NULL,
	CONSTRAINT "modal_feature_notification_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "modal_project" (
	"id" char(24) NOT NULL,
	"time_created" timestamp with time zone DEFAULT now() NOT NULL,
	"time_updated" timestamp with time zone DEFAULT now() NOT NULL,
	"name" varchar(255) NOT NULL,
	"space_id" char(24),
	"user_id" varchar(15) NOT NULL,
	CONSTRAINT "modal_project_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "modal_space" (
	"id" char(24) NOT NULL,
	"time_created" timestamp with time zone DEFAULT now() NOT NULL,
	"time_updated" timestamp with time zone DEFAULT now() NOT NULL,
	"name" varchar(255) NOT NULL,
	"user_id" varchar(15) NOT NULL,
	CONSTRAINT "modal_space_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "modal_stripe_event" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"api_version" varchar(255),
	"data" json NOT NULL,
	"request" json,
	"type" varchar(255) NOT NULL,
	"object" varchar(255) NOT NULL,
	"account" varchar(255),
	"livemode" boolean NOT NULL,
	"pending_webhooks" bigint NOT NULL,
	"time_created" timestamp with time zone DEFAULT now() NOT NULL,
	"time_updated" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "modal_task" (
	"id" char(24) NOT NULL,
	"time_created" timestamp with time zone DEFAULT now() NOT NULL,
	"time_updated" timestamp with time zone DEFAULT now() NOT NULL,
	"name" varchar(50) NOT NULL,
	"deadline" date,
	"priority" boolean DEFAULT false NOT NULL,
	"completed_time" date,
	"listType" "listType",
	"listId" char(24),
	"user_id" varchar(15) NOT NULL,
	CONSTRAINT "modal_task_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "modal_user" (
	"id" varchar(15) PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"time_email_verified" timestamp,
	"stripe_customer_id" varchar(255),
	"stripe_subscription_id" varchar(255),
	"stripe_subscription_status" "stripe_subscription_status",
	"time_created" timestamp with time zone DEFAULT now() NOT NULL,
	"time_updated" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user" ON "modal_auth_token" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "list_index" ON "modal_task" USING btree ("listType","listId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_index" ON "modal_task" USING btree ("user_id");