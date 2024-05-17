type queryOptions = {
	connectionUri: string;
	query: string;
};

type SuccessResponse<ResultType> = {
	result: ResultType;
	success: true;
	error: null;
};

type ErrorResponse = {
	result: null;
	success: false;
	error: string;
};

export const runQuery = async ({ connectionUri, query }: queryOptions) => {
	try {
		const client = new Pool({
			connectionString: connectionUri,
		});

		const { rows, rowCount, fields } = await client.query(query);

		client.end();

		const response: SuccessResponse<{
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			rows: any[];
			rowCount: number;
			columns: string[];
		}> = {
			result: {
				rows: rows ?? [],
				rowCount: rowCount ?? 0,
				columns: fields?.map((field) => field.name) ?? [],
			},
			success: true,
			error: null,
		};
		return response;
	} catch (error) {
		console.log("error", error);

		const response: ErrorResponse = {
			result: null,
			success: false,
			error: `${error}`,
		};

		return response;
	}
};