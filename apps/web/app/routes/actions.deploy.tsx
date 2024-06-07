import { type ClientActionFunctionArgs, json } from "@remix-run/react";
import type { AppType } from "../../../api/src";
import { hc } from "hono/client";

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
	// @ts-ignore
	if (window.zaraz) {
		// @ts-ignore
		window.zaraz.track("Button Clicked", { text: "Deploy Postgres" });
	}

	const formdata = await request.formData();
	const cfTurnstileResponse = formdata.get("cf-turnstile-response") as string;

	const API_URL = import.meta.env.VITE_API_URL;

	const client = hc<AppType>(API_URL, {
		headers: {
			"Content-Type": "application/json",
		},
		init: {
			credentials: "include",
		},
	});

	const res = await client.postgres.$post({
		json: {
			cfTurnstileResponse,
		},
	});

	const data = await res.json();

	if (data.error) {
		console.log(data.error.message);
		return json(data, { status: 500 });
	}

	return json(data);
};
