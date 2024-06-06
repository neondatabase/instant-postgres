import type { MetaFunction } from "@remix-run/cloudflare";
import { SEO } from "~/lib/constants";

export const meta: MetaFunction = () => SEO;

export default function Index() {
	return (
		<div>
			<h1>Instant Postgres</h1>
		</div>
	);
}
