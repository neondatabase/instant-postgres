import type { MetaFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import {
	type ClientActionFunctionArgs,
	useActionData,
	useNavigation,
} from "@remix-run/react";
import { SEO } from "~/lib/constants";
import { hc } from "hono/client";
import type { AppType } from "../../../api/src";
import { ConnectionString } from "~/components/connection-string";
import { DeployButton } from "~/components/deploy-button";
import { SqlEditor } from "~/components/sql-editor";
import { Message } from "~/components/message";
import { minDelay } from "~/lib/min-delay";
import { regions } from "@instant-postgres/neon/regions";

export const meta: MetaFunction = () => SEO;

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
	const formdata = await request.formData();
	const cfTurnstileResponse = formdata.get("cf-turnstile-response") as string;

	const API_URL = import.meta.env.VITE_API_URL;

	console.log({ API_URL });

	const client = hc<AppType>(API_URL, {
		headers: {
			"Content-Type": "application/json",
		},
		init: {
			credentials: "include",
		},
	});

	const res = await minDelay(
		client.postgres.$post({
			json: {
				cfTurnstileResponse,
			},
		}),
		800,
	);

	const data = await res.json();

	if (data.error) {
		console.log(data.error.message);
		return json(data, { status: 500 });
	}

	return json(data);
};

export default function Index() {
	const navigation = useNavigation();
	const isLoading = navigation.state !== "idle";

	const actionData = useActionData<typeof clientAction>();

	const hasCreatedProject = actionData?.result?.hasCreatedProject ?? false;
	const connectionUri = actionData?.result?.connectionUri ?? "";
	const timeToProvision = actionData?.result?.timeToProvision ?? 0;
	const project = actionData?.result?.project;
	const regionId = project?.region_id as keyof typeof regions;
	const region = regions[regionId]?.name;

	return (
		<div className="bg-black min-h-lvh px-6 pt-24 lg:px-8 md:px-4 w-full">
			<div className="max-w-screen-lg mx-auto">
				<div>
					<h1 className="text-balance text-[32px] font-semibold leading-[0.9] tracking-extra-tight text-white xl:text-[56px] lg:text-[44px]">
						Postgres in under a second
					</h1>
					<h2 className="text-balance mt-[18px] text-xl font-light tracking-extra-tight text-[#AFB1B6] xl:mt-4 xl:text-lg lg:mt-3 lg:text-base md:mt-2">
						Instantly provison a Postgres database on{" "}
						<a
							className="text-white underline hover:no-underline underline-offset-4"
							href="https://console.neon.tech/?ref=instantPostgres"
						>
							Neon
						</a>
					</h2>
				</div>
				<div className="my-16" />

				<div className="flex flex-col items-start gap-10 w-full">
					<DeployButton
						hasCreatedProject={hasCreatedProject}
						isLoading={isLoading}
					/>
					<div className="space-y-3 w-full">
						<div className="h-4">
							{hasCreatedProject && (
								<p className="animate-in fade-in slide-in-from-bottom font-mono text-xs leading-none tracking-extra-tight text-white tracking-extra-tight opacity-90">
									Provisioned in {timeToProvision} ms, {region}
								</p>
							)}
						</div>
						<ConnectionString
							hasCreatedProject={hasCreatedProject}
							connectionUri={connectionUri}
						/>
						<div className="h-4">{hasCreatedProject && <Message />}</div>
					</div>
				</div>
				<div className="mt-10" />
				<SqlEditor
					hasCreatedProject={hasCreatedProject}
					connectionUri={connectionUri}
				/>
			</div>
		</div>
	);
}
