import { neon, Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
export * from "drizzle-orm";

export const db = (databaseUrl: string) => {
	const sql = neon(databaseUrl);

	return drizzle(sql, {
		schema,
	});
};


