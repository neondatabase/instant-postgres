import createClient from "openapi-fetch";
import type { paths } from "./schema";

export * as regions from "./regions";
export * as schema from "./schema";

export const neon = (apiKey: string) => {
	return createClient<paths>({
		baseUrl: "https://console.neon.tech/api/v2/",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`,
		},
	});
};
