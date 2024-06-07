import { Pool } from "@neondatabase/serverless";

type queryOptions = {
	connectionUri: string;
	query: string;
};

type SuccessResponse<ResultType> = {
	result: ResultType;
	success: true;
	error: null;
	queryTime: number;
};

type ErrorResponse = {
	result: null;
	success: false;
	error: string;
	queryTime: number;
};

export const runQuery = async ({ connectionUri, query }: queryOptions) => {
	const executionTime = Date.now();

	try {
		const client = new Pool({
			connectionString: connectionUri,
		});

		const result = await client.query(query);

		client.end();

		const queryTime = Date.now() - executionTime;

		const response: SuccessResponse<typeof result> = {
			result,
			queryTime,
			success: true,
			error: null,
		};

		return response;
	} catch (error) {
		const queryTime = Date.now() - executionTime;

		const response: ErrorResponse = {
			result: null,
			success: false,
			error: `${error}`,
			queryTime,
		};

		return response;
	}
};
