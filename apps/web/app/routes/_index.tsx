import { useClipboard } from "use-clipboard-copy";
import type { MetaFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { Button } from "react-aria-components";
import Editor from "@uiw/react-textarea-code-editor";
import { useState } from "react";
import { Check, CopyIcon, Database, Loader } from "lucide-react";
import { SEO } from "~/lib/constants";
import { regions } from "~/lib/neon/regions";
import { hc } from "hono/client";
import type { AppType } from "../../../api/src";

export const meta: MetaFunction = () => SEO;

export const clientAction = async () => {
	try {
		const client = hc<AppType>(import.meta.env.VITE_API_URL, {
			headers: {
				"Content-Type": "application/json",
				credentials: "include",
			},
		});

		const res = await client.postgres.$post();

		// const res = await fetch(`${API_URL}/api/new`, {
		// 	method: "POST",
		// 	headers: {
		// 		"Content-Type": "application/json",
		// 	},
		// });

		const data = await res.json();

		if (data.error) {
			console.log(data.error.message);
			return json({ error: data.error.message }, { status: 500 });
		}

		return json(
			{
				hasCreatedProject: data.result.hasCreatedProject,
				connectionUri: data.result.connectionUri,
				timeToProvision: data.result.timeToProvision,
				project: data.result.project,
			},
			{
				headers: res.headers,
			},
		);
	} catch (error) {
		console.error(error);
		return json({ error: error.message }, { status: 500 });
	}
};

export default function Index() {
	const [code, setCode] = useState(
		"CREATE TABLE playing_with_neon(id SERIAL PRIMARY KEY, name TEXT NOT NULL, value REAL);\nINSERT INTO playing_with_neon(name, value)\nSELECT LEFT(md5(i::TEXT), 10), random() FROM generate_series(1, 10) s(i);\nSELECT * FROM playing_with_neon;",
	);
	const navigation = useNavigation();
	const isLoading = navigation.state !== "idle";

	const actionData = useActionData<typeof clientAction>();
	const hasCreatedProject = actionData?.hasCreatedProject ?? false;
	const connectionUri = actionData?.connectionUri ?? "";
	const timeToProvision = actionData?.timeToProvision ?? "";
	const project = actionData?.project ?? {};

	const clipboard = useClipboard({
		copiedTimeout: 600,
	});

	return (
		<div className="bg-black min-h-lvh px-6 pt-24 lg:px-8 md:px-4 w-full">
			<div className="max-w-screen-lg mx-auto">
				<h2 className="text-[56px] font-semibold leading-[0.9] tracking-extra-tight text-white xl:text-[56px] lg:text-[44px] text-sm:text-[32px]">
					Postgres on Neon
				</h2>
				<p className="mt-[18px] text-xl font-light tracking-extra-tight text-[#AFB1B6] xl:mt-4 xl:text-lg lg:mt-3 lg:text-base md:mt-2">
					No waiting. Get a Postgres database in less than a second.
				</p>
				<div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mt-20">
					<Form method="POST">
						<Button
							isDisabled={isLoading || hasCreatedProject}
							type="submit"
							className="inline-flex h-12 text-sm items-center justify-center rounded-[10px] border border-[#00e599]/40 px-6 font-medium text-[#EEEEEE]	focus:outline-none focus:ring-2 focus:ring-[#00e599] focus:ring-offset-2 focus:ring-offset-black hover:shadow-[0px_8px_30px_0px_rgba(0,229,153,.16)] transition-shadow disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
						>
							{isLoading ? (
								<Loader className="w-4 h-4 mr-2" />
							) : hasCreatedProject ? (
								<Check className="w-4 h-4 mr-2" />
							) : (
								<Database className="w-4 h-4 mr-2" />
							)}
							{hasCreatedProject ? "Postgres Deployed" : "Deploy Postgres"}
						</Button>
						<div
							className="cf-turnstile"
							data-sitekey="0x4AAAAAAAaLhuOYDRwuDjk9"
							data-callback="javascriptCallback"
						/>
					</Form>
					<div className="relative flex w-full max-w-3xl flex-col sm:overflow-hidden space-y-3">
						<div className="relative z-10 rounded-[14px] bg-white bg-opacity-[0.03] p-1.5 backdrop-blur-[4px] xl:rounded-xl md:p-1">
							<div
								className="absolute inset-0 z-10 rounded-[inherit] border border-white/[0.04]"
								aria-hidden="true"
							/>
							<div
								className="absolute inset-[5px] z-10 rounded-[10px] border border-white/[0.04] mix-blend-overlay"
								aria-hidden="true"
							/>
							<div className="relative z-20 flex h-12 gap-x-3.5 rounded-[10px] border-opacity-[0.05] bg-black-new pl-[18px] pt-4 tracking-extra-tight xl:h-[43px] xl:rounded-lg xl:pl-4 xl:pt-[14px] lg:gap-x-3 md:h-9 md:gap-x-2.5 md:pl-[14px] md:pt-[13px]">
								<span className="absolute left-0 top-1/2 h-[450px] w-px -translate-y-1/2" />
								<span
									className="relative mt-1 h-1.5 w-1.5 rounded-full transition-[background-color,box-shadow] duration-300 xl:h-[5px] xl:w-[5px]  shadow-[0px_0px_9px_0px_#4BFFC3]"
									aria-hidden="true"
									// style={{
									// 	backgroundColor: hasCreatedProject ? "#00E599" : "",
									// }}
								>
									<span className="absolute inset-px h-1 w-1 rounded-full bg-[#D9FDF1] opacity-70 blur-[1px]" />
								</span>
								<span className="line-clamp-1  h-[14px] font-mono text-xs leading-none transition-colors duration-300 md:h-3  text-white">
									<span
										className={
											hasCreatedProject ? "text-white" : "text-[#AFB1B6]/50"
										}
									>
										{hasCreatedProject
											? connectionUri
											: "postgresql://neondb_owner:password@ep-cool-darkness-123456.eu-central-1.aws.neon.tech/neondb"}
									</span>
								</span>
								<div>
									{hasCreatedProject && (
										<div>
											<input
												type="hidden"
												ref={clipboard.target}
												value={connectionUri}
												readOnly
											/>
											<Button onPress={clipboard.copy}>
												{clipboard.copied ? (
													<Check className="w-4 h-4 text-white mr-4" />
												) : (
													<CopyIcon className="w-4 h-4 text-white mr-4" />
												)}
											</Button>
										</div>
									)}
								</div>
							</div>
						</div>
						{hasCreatedProject && (
							<div className="space-y-2">
								<p className="text-right font-mono text-xs leading-none tracking-extra-tight text-white tracking-extra-tight opacity-90">
									Provisioned in {timeToProvision} ms,{" "}
									{regions[project.region_id]}
								</p>
							</div>
						)}
					</div>
				</div>

				<div className="relative z-10 rounded-[14px] bg-white bg-opacity-[0.03] p-1.5 backdrop-blur-[4px] xl:rounded-xl w-full mt-10">
					<div
						className="absolute inset-0 z-10 rounded-[inherit] border border-white/[0.04]"
						aria-hidden="true"
					/>
					<div
						className="absolute inset-[5px] z-10 rounded-[10px] border border-white/[0.04] mix-blend-overlay"
						aria-hidden="true"
					/>
					<div className="pointer-events-none absolute -left-40 -top-44 z-0 h-[482px] w-[470px] rounded-[100%] bg-[linear-gradient(180deg,rgba(25,27,52,0)_0%,#16182D_88.36%)] opacity-65 blur-3xl xl:-left-36 xl:-top-40 xl:h-[427px] xl:w-[417]" />
					<div className="pointer-events-none absolute -right-32 -top-28 z-0 h-[316px] w-[316px] rounded-[100%] bg-[#16182D] opacity-30 blur-3xl" />
					<div className="pointer-events-none absolute -bottom-36 -right-36 z-0 h-[377px] w-[377px] rounded-[100%] bg-[#16182D] opacity-40 blur-3xl" />
					<div className="relative z-20 rounded-[10px] bg-black-new xl:rounded-lg">
						<div className="rounded-[10px] bg-black-new">
							<div className="border-b border-white/[0.03]" />
							<div className="relative h-[443px] lg:h-[403px]">
								<Editor
									value={code}
									language="sql"
									disabled={!hasCreatedProject}
									className="h-full font-mono leading-loose"
									onChange={(evn) => setCode(evn.target.value)}
									padding={15}
									data-color-mode="dark"
									style={{
										backgroundColor: "#0C0D0D",
										fontFamily:
											"ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
										fontSize: "14px",
										opacity: !hasCreatedProject ? 0.5 : 1,
									}}
								/>

								<Button
									type="submit"
									className="text-sm inline-flex h-9 items-center justify-center rounded-[10px] border border-[#fff]/10 px-3 font-medium text-[#EEEEEE]	focus:outline-none focus:ring-2 focus:ring-[#00e599] focus:ring-offset-2 focus:ring-offset-black hover:shadow-[0px_8px_30px_0px_rgba(0,229,153,.16)] transition-shadow absolute bottom-5 right-5  disabled:opacity-50 disabled:hover:shadow-none"
									isDisabled={!hasCreatedProject}
								>
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
										aria-label="Play icon"
										role="img"
										className="mr-2 w-4 h-4"
									>
										<polygon points="6 3 20 12 6 21 6 3" />
									</svg>
									Run query
								</Button>
							</div>
						</div>
					</div>
				</div>
				{hasCreatedProject && (
					<p className="mt-10 text-center text-[#AFB1B6] text-sm">
						This temporary Postgres database will be deleted after 5 minutes.{" "}
						<a
							className="text-white underline hover:no-underline"
							href="https://console.neon.tech/?ref=instantPostgres"
						>
							Sign up on{" "}
							<svg
								role="img"
								aria-label="Neon Logo"
								width="72"
								height="21"
								viewBox="0 0 72 21"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								className="inline mx-1 size-16"
							>
								<g clipPath="url(#clip0_117_2)">
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M0 3.49144C0 2.56545 0.367847 1.67739 1.02262 1.02262C1.67739 0.367847 2.56545 0 3.49144 0L16.7586 0C17.6845 0 18.5726 0.367847 19.2274 1.02262C19.8822 1.67739 20.25 2.56545 20.25 3.49144V14.7752C20.25 16.7698 17.7255 17.6355 16.5015 16.0611L12.6737 11.1369V17.1079C12.6737 17.9412 12.3426 18.7404 11.7534 19.3297C11.1641 19.919 10.3649 20.25 9.53156 20.25H3.49144C2.56545 20.25 1.67739 19.8822 1.02262 19.2274C0.367847 18.5726 0 17.6845 0 16.7586L0 3.49144ZM3.49144 2.79338C3.10556 2.79338 2.79338 3.10556 2.79338 3.49087V16.7586C2.79338 17.1444 3.10556 17.4572 3.49087 17.4572H9.63619C9.82913 17.4572 9.88031 17.3008 9.88031 17.1079V9.10125C9.88031 7.10606 12.4048 6.24038 13.6294 7.81538L17.4572 12.7389V3.49144C17.4572 3.10556 17.4932 2.79338 17.1079 2.79338H3.49144Z"
										fill="#12FFF7"
									/>
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M0 3.49144C0 2.56545 0.367847 1.67739 1.02262 1.02262C1.67739 0.367847 2.56545 0 3.49144 0L16.7586 0C17.6845 0 18.5726 0.367847 19.2274 1.02262C19.8822 1.67739 20.25 2.56545 20.25 3.49144V14.7752C20.25 16.7698 17.7255 17.6355 16.5015 16.0611L12.6737 11.1369V17.1079C12.6737 17.9412 12.3426 18.7404 11.7534 19.3297C11.1641 19.919 10.3649 20.25 9.53156 20.25H3.49144C2.56545 20.25 1.67739 19.8822 1.02262 19.2274C0.367847 18.5726 0 17.6845 0 16.7586L0 3.49144ZM3.49144 2.79338C3.10556 2.79338 2.79338 3.10556 2.79338 3.49087V16.7586C2.79338 17.1444 3.10556 17.4572 3.49087 17.4572H9.63619C9.82913 17.4572 9.88031 17.3008 9.88031 17.1079V9.10125C9.88031 7.10606 12.4048 6.24038 13.6294 7.81538L17.4572 12.7389V3.49144C17.4572 3.10556 17.4932 2.79338 17.1079 2.79338H3.49144Z"
										fill="url(#paint0_linear_117_2)"
									/>
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M0 3.49144C0 2.56545 0.367847 1.67739 1.02262 1.02262C1.67739 0.367847 2.56545 0 3.49144 0L16.7586 0C17.6845 0 18.5726 0.367847 19.2274 1.02262C19.8822 1.67739 20.25 2.56545 20.25 3.49144V14.7752C20.25 16.7698 17.7255 17.6355 16.5015 16.0611L12.6737 11.1369V17.1079C12.6737 17.9412 12.3426 18.7404 11.7534 19.3297C11.1641 19.919 10.3649 20.25 9.53156 20.25H3.49144C2.56545 20.25 1.67739 19.8822 1.02262 19.2274C0.367847 18.5726 0 17.6845 0 16.7586L0 3.49144ZM3.49144 2.79338C3.10556 2.79338 2.79338 3.10556 2.79338 3.49087V16.7586C2.79338 17.1444 3.10556 17.4572 3.49087 17.4572H9.63619C9.82913 17.4572 9.88031 17.3008 9.88031 17.1079V9.10125C9.88031 7.10606 12.4048 6.24038 13.6294 7.81538L17.4572 12.7389V3.49144C17.4572 3.10556 17.4932 2.79338 17.1079 2.79338H3.49144Z"
										fill="url(#paint1_linear_117_2)"
									/>
									<path
										d="M16.7586 0C17.6845 0 18.5726 0.367847 19.2274 1.02262C19.8822 1.67739 20.25 2.56545 20.25 3.49144V14.7752C20.25 16.7698 17.7255 17.6355 16.5015 16.0611L12.6737 11.1369V17.1079C12.6737 17.9412 12.3426 18.7404 11.7534 19.3297C11.1641 19.919 10.3649 20.25 9.53156 20.25C9.57736 20.25 9.62271 20.241 9.66502 20.2235C9.70734 20.2059 9.74578 20.1802 9.77817 20.1479C9.81055 20.1155 9.83624 20.077 9.85377 20.0347C9.87129 19.9924 9.88031 19.947 9.88031 19.9013V9.10125C9.88031 7.10606 12.4048 6.24038 13.6294 7.81538L17.4572 12.7389V0.698063C17.4572 0.31275 17.1444 0 16.7586 0Z"
										fill="#B9FFB3"
									/>
									<path
										d="M34.1359 5.96236V11.2589L29.0003 5.96236H26.3273V14.6249H28.7651V8.93236L34.3586 14.6249H36.5738V5.96236H34.1359ZM41.0929 12.6944V11.1599H46.5503V9.31598H41.0929V7.89286H47.7135V5.96236H38.6055V14.6249H47.8496V12.6944H41.0929ZM54.3279 14.9095C57.7558 14.9095 59.9833 13.2265 59.9833 10.2936C59.9833 7.36073 57.7558 5.67773 54.3279 5.67773C50.9001 5.67773 48.6849 7.36073 48.6849 10.2936C48.6849 13.2265 50.9001 14.9095 54.3279 14.9095ZM54.3279 12.8552C52.4222 12.8552 51.2466 11.9271 51.2466 10.2936C51.2466 8.66011 52.4346 7.73198 54.3279 7.73198C56.2337 7.73198 57.4093 8.66011 57.4093 10.2936C57.4093 11.9271 56.2337 12.8552 54.3279 12.8552ZM69.3276 5.96236V11.2589L64.1919 5.96236H61.5189V14.6249H63.9568V8.93236L69.5503 14.6249H71.7654V5.96236H69.3276Z"
										fill="white"
									/>
								</g>
								<defs>
									<linearGradient
										id="paint0_linear_117_2"
										x1="20.25"
										y1="20.25"
										x2="2.44406"
										y2="-7.78333e-07"
										gradientUnits="userSpaceOnUse"
									>
										<stop stopColor="#B9FFB3" />
										<stop offset="1" stopColor="#B9FFB3" stopOpacity="0" />
									</linearGradient>
									<linearGradient
										id="paint1_linear_117_2"
										x1="20.25"
										y1="20.25"
										x2="8.22206"
										y2="15.5717"
										gradientUnits="userSpaceOnUse"
									>
										<stop stopColor="#1A1A1A" stopOpacity="0.9" />
										<stop offset="1" stopColor="#1A1A1A" stopOpacity="0" />
									</linearGradient>
									<clipPath id="clip0_117_2">
										<rect width="72" height="20.25" fill="white" />
									</clipPath>
								</defs>
							</svg>{" "}
						</a>
						for a free Postgres instance{" "}
					</p>
				)}
			</div>
		</div>
	);
}
