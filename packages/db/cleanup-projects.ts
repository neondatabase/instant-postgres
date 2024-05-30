import { neon } from "@instant-postgres/neon";
import { and, db, sql } from ".";
import { projects } from "./schema";

const DATABASE_URL = process.env.DATABASE_URL;
const NEON_API_KEY = process.env.NEON_API_KEY;

const fetchOldProjects = async (client) => {
	const fiveMinutesAgo = sql`now() - interval '5 minutes'`;
	return client
		.select()
		.from(projects)
		.where(
			and(
				sql`${projects.createdAt} < ${fiveMinutesAgo}`,
				sql`${projects.isDeleted} = false`,
			),
		)
		.execute();
};

const deleteProjectsFromNeon = async (neonApiClient, oldProjects) => {
	return Promise.all(
		oldProjects.map((project) =>
			neonApiClient.DELETE(`/projects/${project.projectId}`, {
				params: {
					path: {
						project_id: project.projectId,
					},
				},
			}),
		),
	);
};

const markProjectsAsDeleted = async (client) => {
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
