import type { InferSelectModel } from "drizzle-orm";
import {
	pgTable,
	serial,
	varchar,
	timestamp,
	index,
	boolean,
} from "drizzle-orm/pg-core";

export const projects = pgTable(
	"projects",
	{
		id: serial("id").primaryKey(),
		projectId: varchar("project_id", { length: 256 }).notNull().unique(), // provided by Neon
		region: varchar("region", { length: 256 }).notNull(), // provided by Neon
		createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
		updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
		isDeleted: boolean("is_deleted").default(false),
	},
	(t) => ({
		projectIdIdx: index("project_id_idx").on(t.projectId),
	}),
);

export type Project = InferSelectModel<typeof projects>;
