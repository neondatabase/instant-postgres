import { neon } from "@instant-postgres/neon";
import { db, sql } from ".";
import { projects } from "./schema";

const DATABASE_URL = process.env.DATABASE_URL;
const NEON_API_KEY = process.env.NEON_API_KEY;

const main = async () => {
	if (!DATABASE_URL || !NEON_API_KEY) {
		throw new Error("Missing DATABASE_URL or NEON_API_KEY env var");
	}

	const client = db(DATABASE_URL);

	const neonApiClient = neon(NEON_API_KEY);

	// fetch projects from database that are older than 5 minutes

	try {
		const fiveMinutesAgo = sql`now() - interval '5 minutes'`;

		const oldProjects = await client
			.select()
			.from(projects)
			.where(sql`${projects.createdAt} < ${fiveMinutesAgo}`)
			.execute();

		console.log("oldProjects", oldProjects);
		// delete projects from Neon that are older than 5 minutes

		await Promise.all(
			oldProjects.map(async (project) => {
				const { data, error } = await neonApiClient.DELETE(
					"/projects/{project_id}",
					{
						params: {
							path: {
								project_id: project.projectId,
							},
						},
					},
				);

				console.log("error", error);
				console.log("data", data);
			}),
		);
	} catch (error) {
		console.error("Error cleaning up projects", error);

		throw error;
	}
};

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
