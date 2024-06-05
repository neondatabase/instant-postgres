import {
	vitePlugin as remix,
	cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
} from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [
		remixCloudflareDevProxy(),
		remix({
			basename: "/demos/instant-postgres",
		}),
		tsconfigPaths(),
	],
	server: {
		port: 3000,
	},
	base: "/demos/instant-postgres/",
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
