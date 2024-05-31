import { runQuery } from "@instant-postgres/db/run-query";
import { json, type ClientActionFunctionArgs } from "@remix-run/react";

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
	const form = await request.formData();
	const query = form.get("query") as string;
	const connectionUri = form.get("connectionUri") as string;

	const executionTime = Date.now();
	const result = await runQuery({
		connectionUri,
		query,
	});

	const queryTime = Date.now() - executionTime;

	return json({ result, queryTime });
};
