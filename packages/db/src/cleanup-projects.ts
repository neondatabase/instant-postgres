import { neon } from "@instant-postgres/neon";
import { type Project, projects } from "./schema";
import type { NeonDriver } from "drizzle-orm/neon-serverless";
import { and, sql } from "drizzle-orm";
import { db } from ".";

const DATABASE_URL = process.env.DATABASE_URL;
const NEON_API_KEY = process.env.NEON_API_KEY;

const fetchOldProjects = async (client: NeonDriver["client"]) => {
	const fiveMinutesAgo = sql`now() - interval '5 minutes'`;
	return client
		.select()
		.from(projects)
		.where(
			and(
				sql`${projects.createdAt} < ${fiveMinutesAgo}`,
				sql`${projects.isDeleted} = false`,
			),
		);
};

const deleteProjectsFromNeon = async (
	neonApiClient: ReturnType<typeof neon>,
	oldProjects: Project[],
) => {
	return Promise.all(
		oldProjects.map((project: Project) =>
			neonApiClient.DELETE("/projects/{project_id}", {
				params: {
					path: {
						project_id: project.projectId,
					},
				},
			}),
		),
	);
};

const markProjectsAsDeleted = async (client: NeonDriver["client"]) => {
	const fiveMinutesAgo = sql`now() - interval '5 minutes'`;
	return client
		.update(projects)
		.set({ isDeleted: true })
		.where(
			and(
				sql`${projects.createdAt} < ${fiveMinutesAgo}`,
				sql`${projects.isDeleted} = false`,
			),
		);
};

const main = async () => {
	try {
		if (!DATABASE_URL || !NEON_API_KEY) {
			throw new Error("Missing DATABASE_URL or NEON_API_KEY env var");
		}

		const client = db(DATABASE_URL);
		const neonApiClient = neon(NEON_API_KEY);

		const oldProjects = await fetchOldProjects(client);

		await deleteProjectsFromNeon(neonApiClient, oldProjects);

		await markProjectsAsDeleted(client);
	} catch (error) {
		console.error("Error cleaning up projects", error);
		throw error;
	}
};

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
