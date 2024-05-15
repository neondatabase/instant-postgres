import type { InferSelectModel } from "drizzle-orm";
import {
	pgTable,
	serial,
	varchar,
	timestamp,
	index,
} from "drizzle-orm/pg-core";

export const projects = pgTable(
	"projects",
	{
		id: serial("id").primaryKey(),
		projectId: varchar("project_id", { length: 256 }).notNull().unique(), // provided by Neon
		createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
		updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
	},
	(t) => ({
		projectIdIdx: index("project_id_idx").on(t.projectId),
	}),
);

export type Project = InferSelectModel<typeof projects>;
