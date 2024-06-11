import { useFetcher } from "@remix-run/react";
import { Turnstile } from "@instant-postgres/turnstile";
import { useState } from "react";
import { cn } from "~/lib/cn";
import type { clientAction } from "~/routes/actions.deploy";

export const DeployButton = () => {
	const CLOUDFLARE_TURNSTILE_SITE_KEY = import.meta.env
		.VITE_CLOUDFLARE_TURNSTILE_SITE_KEY;
	const [token, setToken] = useState<null | string>(null);

	console.log(CLOUDFLARE_TURNSTILE_SITE_KEY);
	const fetcher = useFetcher<typeof clientAction>({ key: "deploy" });
	const isLoading = fetcher.state !== "idle";
	const hasCreatedProject = fetcher?.data?.result?.hasCreatedProject ?? false;

	console.log(CLOUDFLARE_TURNSTILE_SITE_KEY);
	return (
		<fetcher.Form
			method="POST"
			className="flex flex-col md:flex-row gap-3 md:items-center"
			action="/actions/deploy"
		>
			<button
				type="submit"
				disabled={!token || isLoading || hasCreatedProject}
				className={cn(
					"cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 disabled:animate-none animate-shimmer",
					"inline-flex h-11 px-6 py-3 items-center justify-center rounded-[10px] animate-shimmer border border-white/10 bg-[linear-gradient(110deg,#000,45%,#191919,55%,#000103)] bg-[length:200%_100%] font-medium text-white transition-colors",
				)}
			>
				<span className="flex space-x-2 items-center whitespace-pre-wrap text-center text-base font-medium leading-none tracking-tight text-white from-white to-slate-900/10 ">
					{isLoading ? (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="3"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="w-4 h-4 mr-2 animate-spin"
							role="img"
							aria-label="Loading"
						>
							<path d="M21 12a9 9 0 1 1-6.219-8.56" />
						</svg>
					) : hasCreatedProject ? (
						<svg
							className="w-4 h-4 mr-2"
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="3"
							strokeLinecap="round"
							strokeLinejoin="round"
							role="img"
							aria-label="Copied to clipboard"
						>
							<path d="M20 6 9 17l-5-5" />
						</svg>
					) : (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="w-4 h-4 mr-2"
							role="img"
							aria-label="Database"
						>
							<ellipse cx="12" cy="5" rx="9" ry="3" />
							<path d="M3 5V19A9 3 0 0 0 21 19V5" />
							<path d="M3 12A9 3 0 0 0 21 12" />
						</svg>
					)}
					Deploy Postgres
				</span>
			</button>

			<Turnstile
				className="hidden"
				siteKey={CLOUDFLARE_TURNSTILE_SITE_KEY}
				onSuccess={(token) => setToken(token)}
			/>
		</fetcher.Form>
	);
};
