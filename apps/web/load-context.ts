import type { PlatformProxy } from "wrangler";

// biome-ignore lint/suspicious/noEmptyInterface: Not using wrangler
interface Env {}

type Cloudflare = Omit<PlatformProxy<Env>, "dispose">;

declare module "@remix-run/cloudflare" {
	interface AppLoadContext {
		cloudflare: Cloudflare;
	}
}
