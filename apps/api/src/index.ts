import { Hono } from "hono";
import { getSignedCookie, setSignedCookie } from "hono/cookie";
import { cors } from "hono/cors";
import { db } from "@instant-postgres/db";
import { projects } from "@instant-postgres/db/schema";
import { neon, type schema } from "@instant-postgres/neon";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis/cloudflare";

import {
	findClosestRegion,
	type regions,
} from "@instant-postgres/neon/regions";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

type Bindings = {
	DATABASE_URL: string;
	NEON_API_KEY: string;
	COOKIE_SECRET: string;
	APP_URL: string;
	CLOUDFLARE_TURNSTILE_SECRET_KEY: string;
	UPSTASH_REDIS_REST_URL: string;
	UPSTASH_REDIS_REST_TOKEN: string;
};

type SuccessResponse<ResultType> = {
	result: ResultType;
	success: true;
	error: null;
};

type ErrorResponse = {
	result: null;
	success: false;
	error: {
		message: string;
		code: string;
	};
};

type ProjectProvision = {
	connectionUri: string | undefined;
	project: schema.components["schemas"]["Project"];
	hasCreatedProject: boolean;
	timeToProvision: number;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", async (c, next) => {
	const corsMiddleware = cors({
		origin: c.env.APP_URL.replace(/\/$/, ""),
		allowHeaders: ["Origin", "Content-Type", "Authorization"],
		allowMethods: ["GET", "OPTIONS", "POST", "PUT", "DELETE"],
		credentials: true,
	});
	return await corsMiddleware(c, next);
});

const route = app.post(
	"/postgres",
	zValidator(
		"json",
		z.object({
			cfTurnstileResponse: z.string(),
		}),
	),
	async (c) => {
		const ip = c.req.raw.headers.get("CF-Connecting-IP") as string;

		const redis = new Redis({
			url: c.env.UPSTASH_REDIS_REST_URL,
			token: c.env.UPSTASH_REDIS_REST_TOKEN,
		});

		const ratelimit = new Ratelimit({
			redis,
			limiter: Ratelimit.slidingWindow(10, "10 s"),
			analytics: true,
		});

		const { success, limit, reset, remaining } = await ratelimit.limit(ip);

		if (!success) {
			return new Response("Too many requests", {
				status: 429,
				headers: {
					"X-RateLimit-Limit": limit.toString(),
					"X-RateLimit-Remaining": remaining.toString(),
					"X-RateLimit-Reset": reset.toString(),
				},
			});
		}

		const projectData = await getSignedCookie(
			c,
			c.env.COOKIE_SECRET,
			"neon-project",
		);

		if (projectData) {
			const parsedProjectData = JSON.parse(projectData) as ProjectProvision;

			return c.json<SuccessResponse<ProjectProvision>, 200>(
				{
					result: parsedProjectData,
					success: true,
					error: null,
				},
				200,
			);
		}

		const body = await c.req.json();

		const token = body.cfTurnstileResponse;

		const formData = new FormData();
		formData.append("secret", c.env.CLOUDFLARE_TURNSTILE_SECRET_KEY);
		formData.append("response", token);
		formData.append("remoteip", ip);

		const result = await fetch(
			"https://challenges.cloudflare.com/turnstile/v0/siteverify",
			{
				body: formData,
				method: "POST",
			},
		);

		const outcome = await result.json();

		if (!outcome.success) {
			return c.json<ErrorResponse, 400>(
				{
					result: null,
					success: false,
					error: {
						message: `Failed to validate captcha token: ${outcome[
							"error-codes"
						].join()}`,
						code: "400",
					},
				},
				400,
			);
		}

		const neonApiClient = neon(c.env.NEON_API_KEY);

		const start = Date.now();

		const ipLongitude = c.req.raw.headers.get("cf-iplongitude");
		const ipLatitude = c.req.raw.headers.get("cf-iplatitude");

		const { data, error } = await neonApiClient.POST("/projects", {
			body: {
				project: {
					region_id: findClosestRegion({
						lat: Number(ipLatitude),
						lon: Number(ipLongitude),
					}) as keyof typeof regions,
					pg_version: 16,
					// @ts-ignore
					default_endpoint_settings: {
						autoscaling_limit_min_cu: 0.25,
						autoscaling_limit_max_cu: 0.25,
						suspend_timeout_seconds: 120,
					},
				},
			},
		});

		const timeToProvision = Date.now() - start;

		if (error) {
			return c.json<ErrorResponse, 400>(
				{
					result: null,
					success: false,
					error: {
						message: error.message,
						code: error.code,
					},
				},
				400,
			);
		}

		try {
			const client = db(c.env.DATABASE_URL);
			console.log({
				projectId: data?.project.id,
				region: data?.project.region_id,
			});
			await client.insert(projects).values({
				projectId: data?.project.id,
				region: data?.project.region_id,
			});
		} catch (error) {
			console.error("Failed to save project to database:", error);
			return c.json<ErrorResponse, 400>(
				{
					result: null,
					success: false,
					error: {
						message: "Failed to save project to database:",
						code: "400",
					},
				},
				400,
			);
		}

		const newProjectData: ProjectProvision = {
			connectionUri: data.connection_uris[0]?.connection_uri,
			project: data.project,
			hasCreatedProject: true,
			timeToProvision,
		};

		await setSignedCookie(
			c,
			"neon-project",
			JSON.stringify(newProjectData),
			c.env.COOKIE_SECRET,
			{
				httpOnly: true,
				secure: true,
				sameSite: "None",
				maxAge: 300, // 5 minutes
			},
		);

		return c.json<SuccessResponse<ProjectProvision>, 201>(
			{
				result: newProjectData,
				success: true,
				error: null,
			},
			201,
		);
	},
);

export type AppType = typeof route;

export default app;
