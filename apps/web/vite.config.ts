import {
	vitePlugin as remix,
	cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
} from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	base: "/demos/instant-postgres/",
	plugins: [
		remixCloudflareDevProxy(),
		remix({
			// basename: "/demos/instant-postgres", // Adjusted to match the base path
		}),
		tsconfigPaths(),
	],
	server: {
		port: 3000,
	},
	ssr: {
		noExternal: [
			"@uiw/react-codemirror",
			"@lezer/highlight",
			"@uiw/codemirror-theme-github",
			"@uiw/codemirror-themes",
			"@uiw/react-codemirror",
		],
	},
});
