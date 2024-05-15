import {
	vitePlugin as remix,
	cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
} from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [remixCloudflareDevProxy(), remix(), tsconfigPaths()],
	server: {
		port: 3000,
	},
	ssr: {
		noExternal: ["@uiw/react-textarea-code-editor"],
	},
});
