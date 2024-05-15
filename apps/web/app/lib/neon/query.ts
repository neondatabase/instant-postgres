import { neon } from "@neondatabase/serverless";

type queryOptions = {
	connectionString: string;
	query: string;
};

export const runQuery = async ({ connectionString, query }: queryOptions) => {
	try {
		let startTime = Date.now();

		const sql = neon(connectionString);

		const data = await sql(query);

		startTime = Date.now();
		return {
			data,
			startTime,
		};
	} catch (error) {
		console.log("error", error);
		// @ts-ignore
		throw new Error(error);
	}
};
