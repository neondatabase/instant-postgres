import type { schema } from "@instant-postgres/neon";

export type Bindings = {
	DATABASE_URL: string;
	NEON_API_KEY: string;
	COOKIE_SECRET: string;
	APP_URL: string;
	CLOUDFLARE_TURNSTILE_SECRET_KEY: string;
	UPSTASH_REDIS_REST_URL: string;
	UPSTASH_REDIS_REST_TOKEN: string;
};

export type SuccessResponse<ResultType> = {
	result: ResultType;
	success: true;
	error: null;
};

export type ErrorResponse = {
	result: null;
	success: false;
	error: {
		message: string;
		code: string;
	};
};

export type ProjectProvision = {
	connectionUri: string | undefined;
	project: schema.components["schemas"]["Project"];
	hasCreatedProject: boolean;
	timeToProvision: number;
	responseTime?: number;
};
