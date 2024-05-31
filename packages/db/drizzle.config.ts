import * as dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config({
	path: "../../.env",
});

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL is not set");
}

export default defineConfig({
	dialect: "postgresql",
	schema: "./src/schema",
	out: "./migrations",
	dbCredentials: {
		url: process.env.DATABASE_URL,
	},
});
