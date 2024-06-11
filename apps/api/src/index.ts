import { Hono } from "hono";
import { getSignedCookie, setSignedCookie } from "hono/cookie";
import { cors } from "hono/cors";
import { db } from "@instant-postgres/db";
import { projects } from "@instant-postgres/db/schema";
import { neon } from "@instant-postgres/neon";
import type { TurnstileServerValidationResponse } from "@instant-postgres/turnstile";
import {
	findClosestRegion,
	type regions,
} from "@instant-postgres/neon/regions";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import type {
	Bindings,
	ErrorResponse,
	ProjectProvision,
	SuccessResponse,
} from "./types";
import { ratelimiter } from "./middleware";

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", async (c, next) => {
	const corsMiddleware = cors({
		origin: [
			c.env.APP_URL.replace(/\/$/, ""),
			"https://neon.tech",
			"https://instant-postgres.mahmoudw.com",
			"https://instant-postgres.pages.dev",
		],
		allowHeaders: ["Origin", "Content-Type", "Authorization"],
		allowMethods: ["GET", "OPTIONS", "POST", "PUT", "DELETE"],
		credentials: true,
	});
	return await corsMiddleware(c, next);
});

const route = app.post(
	"/postgres",
	ratelimiter,
	zValidator(
		"json",
		z.object({
			cfTurnstileResponse: z.string(),
		}),
	),
	async (c) => {
		const responseStartTime = Date.now();

		const ip = c.req.raw.headers.get("CF-Connecting-IP") as string;

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

		const outcome = (await result.json()) as TurnstileServerValidationResponse;

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

		const neonApiClient = neon(c.env.INSTANT_POSTGRES_API_KEY);

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
					settings: {
						quota: {
							logical_size_bytes: 250000000,
						},
					},
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

		const responseTime = Date.now() - responseStartTime;

		return c.json<SuccessResponse<ProjectProvision>, 201>(
			{
				result: { ...newProjectData, responseTime },
				success: true,
				error: null,
			},
			201,
		);
	},
);

export type AppType = typeof route;

export default app;
