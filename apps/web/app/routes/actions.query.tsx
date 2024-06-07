import { runQuery } from "@instant-postgres/db/run-query";
import { json, type ClientActionFunctionArgs } from "@remix-run/react";
import * as semicolons from "postgres-semicolons";

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
	// @ts-ignore
	if (window.zaraz) {
		// @ts-ignore
		window.zaraz.track("Button Clicked", {
			text: "Instant Postgres run query",
		});
	}

	const form = await request.formData();
	const query = form.get("query") as string;
	const connectionUri = form.get("connectionUri") as string;

	const splits = semicolons.parseSplits(query, true);
	const queries = semicolons.nonEmptyStatements(query, splits.positions);

	const results: Awaited<ReturnType<typeof runQuery>>[] = [];

	for (const query of queries) {
		const result = await runQuery({
			connectionUri,
			query,
		});
		results.push(result);
	}

	return json({ result: results });
};
