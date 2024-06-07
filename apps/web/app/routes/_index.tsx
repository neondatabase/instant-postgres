import type { MetaFunction } from "@remix-run/cloudflare";
import { SEO } from "~/lib/seo";
import { ConnectionString } from "~/components/connection-string";
import { DeployButton } from "~/components/deploy-button";
import { SqlEditor } from "~/components/sql-editor";
import { Message } from "~/components/message";
import RequestInfo from "~/components/request-info";

export const meta: MetaFunction = () => SEO;

export default function Index() {
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
							href="https://console.neon.tech/signup?ref=instant-postgres"
						>
							Neon
						</a>
					</h2>
				</div>
				<div className="my-16" />

				<div className="flex flex-col items-start gap-10 w-full">
					<DeployButton />
					<div className="space-y-3 w-full">
						<RequestInfo />
						<ConnectionString />
						<Message />
					</div>
				</div>
				<div className="mt-10" />
				<SqlEditor />
			</div>
		</div>
	);
}
