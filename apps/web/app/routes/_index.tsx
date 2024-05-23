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
import { Intro } from "~/components/intro";
import { ProjectInfo } from "~/components/project-info";
import { minDelay } from "~/lib/min-delay";

export const meta: MetaFunction = () => SEO;

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
	const formdata = await request.formData();
	const cfTurnstileResponse = formdata.get("cf-turnstile-response") as string;

	const API_URL = import.meta.env.VITE_API_URL;
	try {
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
			return json({ error: data.error.message }, { status: 500 });
		}

		return json(data.result, {
			headers: res.headers,
		});
	} catch (error) {
		console.error(error);
		return json({ error: error.message }, { status: 500 });
	}
};

export default function Index() {
	const navigation = useNavigation();
	const isLoading = navigation.state !== "idle";

	const actionData = useActionData<typeof clientAction>();
	const hasCreatedProject = actionData?.hasCreatedProject ?? false;
	const connectionUri = actionData?.connectionUri ?? "";
	const timeToProvision = actionData?.timeToProvision ?? "";
	const project = actionData?.project ?? {};

	return (
		<div className="bg-black min-h-lvh px-6 pt-24 lg:px-8 md:px-4 w-full">
			<div className="max-w-screen-lg mx-auto">
				<Intro />
				<div className="my-16" />

				<div className="flex flex-col items-start gap-10 w-full">
					<DeployButton
						hasCreatedProject={hasCreatedProject}
						isLoading={isLoading}
					/>
					<div className="space-y-3 w-full">
						<div className="h-4">
							{hasCreatedProject && (
								<ProjectInfo
									project={project}
									timeToProvision={timeToProvision}
								/>
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
