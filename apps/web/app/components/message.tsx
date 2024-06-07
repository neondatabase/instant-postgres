import { useFetcher } from "@remix-run/react";
import type { clientAction } from "~/routes/actions.deploy";

export const Message = () => {
	const fetcher = useFetcher<typeof clientAction>({ key: "deploy" });
	const hasCreatedProject = fetcher?.data?.result?.hasCreatedProject ?? false;

	if (hasCreatedProject) {
		return (
			<p className="h-4 animate-in fade-in slide-in-from-top text-[#AFB1B6] text-sm">
				This database will be deleted after 5 minutes.{" "}
				<a
					className="text-white underline hover:no-underline"
					href="https://console.neon.tech/signup?ref=instant-postgres"
				>
					Sign up on Neon
				</a>{" "}
				for a free Postgres database{" "}
			</p>
		);
	}
};
