import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis/cloudflare";
import { createMiddleware } from "hono/factory";
import type { ErrorResponse } from "./types";

const TOKENS = 10; // Number of requests
const WINDOW = "10 s";

export const ratelimiter = createMiddleware(async (c, next) => {
	const ip = c.req.raw.headers.get("CF-Connecting-IP") as string;

	const redis = new Redis({
		url: c.env.UPSTASH_REDIS_REST_URL,
		token: c.env.UPSTASH_REDIS_REST_TOKEN,
	});

	const ratelimit = new Ratelimit({
		redis,
		limiter: Ratelimit.slidingWindow(TOKENS, WINDOW),
		analytics: true,
	});

	const { success, limit, reset, remaining } = await ratelimit.limit(ip);

	if (!success) {
		return c.json<ErrorResponse, 429>(
			{
				result: null,
				success: false,
				error: {
					message: "Rate limit exceeded",
					code: "429",
				},
			},
			429,
			{
				"X-RateLimit-Limit": limit.toString(),
				"X-RateLimit-Remaining": remaining.toString(),
				"X-RateLimit-Reset": reset.toString(),
			},
		);
	}
	await next();
});
