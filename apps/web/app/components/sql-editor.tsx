import { useMemo, useState } from "react";
import Editor from "@uiw/react-textarea-code-editor";
import { Button } from "./ui/button";
import {
	Play,
	LoaderCircle,
	GripHorizontal,
	CircleX,
	CircleCheck,
} from "lucide-react";
import { useFetcher } from "@remix-run/react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import type { clientAction } from "~/routes/query";
import { Result } from "./result";

type CodeEditorProps = {
	hasCreatedProject: boolean;
	connectionUri: string;
};

export const SqlEditor = ({
	hasCreatedProject,
	connectionUri,
}: CodeEditorProps) => {
	const [query, setQuery] = useState(
		"CREATE TABLE playing_with_neon(id SERIAL PRIMARY KEY, name TEXT NOT NULL, value REAL);\nINSERT INTO playing_with_neon(name, value)\nSELECT LEFT(md5(i::TEXT), 10), random() FROM generate_series(1, 10) s(i);\nSELECT * FROM playing_with_neon;",
	);

	const fetcher = useFetcher<typeof clientAction>();
	const isLoading = fetcher.state !== "idle";

	// const duration = useMemo(() => {
	//   return queryResult ? Date.now() - Number(queryResult.startTime) : 0;
	// }, [queryResult]);

	return (
		<div className="relative z-10 rounded-[14px] bg-white bg-opacity-[0.03] p-1.5 backdrop-blur-[4px] xl:rounded-xl w-full">
			<div
				className="absolute inset-0 z-10 rounded-[inherit] border border-white/[0.04]"
				aria-hidden="true"
			/>
			<div
				className="absolute inset-[5px] z-10 rounded-[inherit] border border-white/[0.04] mix-blend-overlay"
				aria-hidden="true"
			/>
			<div className="pointer-events-none absolute -left-40 -top-44 z-0 h-[482px] w-[470px] rounded-[100%] bg-[linear-gradient(180deg,rgba(25,27,52,0)_0%,#16182D_88.36%)] opacity-65 blur-3xl xl:-left-36 xl:-top-40 xl:h-[427px] xl:w-[417]" />
			<div className="hidden md:inline pointer-events-none absolute -right-32 -top-28 z-0 h-[316px] w-[316px] rounded-[100%] bg-[#16182D] opacity-30 blur-3xl" />
			<div className="hidden md:inline pointer-events-none absolute -bottom-36 -right-36 z-0 h-[377px] w-[377px] rounded-[100%] bg-[#16182D] opacity-40 blur-3xl" />
			<div className="relative z-20 rounded-[10px] bg-[#0C0D0D] xl:rounded-lg">
				<div className="rounded-[10px] bg-[#0C0D0D]">
					<div className={"relative h-[53svh]"}>
						{!hasCreatedProject && (
							<div className="bg-black w-full h-full absolute inset-0 z-20 opacity-60 rounded-[10px]" />
						)}
						<PanelGroup direction="vertical">
							<Panel className="relative" defaultSize={75} maxSize={75}>
								<Editor
									value={query}
									language="sql"
									disabled={!hasCreatedProject}
									className={"h-full font-mono leading-loose "}
									onChange={(evn) => setQuery(evn.target.value)}
									padding={20}
									data-color-mode="dark"
									style={{
										backgroundColor: "#0C0D0D",
										fontFamily:
											"ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
										fontSize: "0.875rem",
										borderRadius: "10px",
										overflow: "auto",
									}}
								/>
								<fetcher.Form
									className="absolute bottom-3 right-3"
									method="POST"
									action="/query"
								>
									<input type="hidden" name="query" value={query} />
									<input
										type="hidden"
										name="connectionUri"
										value={connectionUri}
									/>

									<Button
										type="submit"
										variant="outline"
										isDisabled={!hasCreatedProject || isLoading}
									>
										{isLoading ? (
											<LoaderCircle
												strokeWidth={3}
												className="animate-spin mr-2 w-4 h-4"
											/>
										) : (
											<Play strokeWidth={3} className="mr-2 w-4 h-4" />
										)}
										Run query
									</Button>
								</fetcher.Form>
							</Panel>
							<PanelResizeHandle className="relative flex w-px items-center justify-center bg-white/[0.04] after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00E599] focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90">
								<div className="flex h-4 w-3 items-center justify-center rounded-sm bg-[#29292E] hover:bg-[#303136] text-white hover:opacity-80">
									<GripHorizontal className="h-2.5 w-2.5" />
								</div>
							</PanelResizeHandle>

							<Panel
								className="text-white bg-[#0C0D0D] p-5 overflow-auto"
								defaultSize={25}
								maxSize={50}
							>
								<div className="h-full overflow-auto">
									{fetcher.data?.result.error ? (
										<div className="flex items-center space-x-2">
											<CircleX className="w-4 h-4 text-red-500" />{" "}
											<p className="text-sm">{fetcher.data?.result.error}</p>
											<span className="inline-flex items-center rounded-[10px] bg-gray-400/10 px-2 py-1 text-xs font-medium text-white ring-1 ring-inset ring-gray-400/20">
												{fetcher.data.queryTime} ms
											</span>
										</div>
									) : (
										<div className="w-full">
											{fetcher.data?.result.result && (
												<div className="flex items-center space-x-2">
													<CircleCheck className="w-4 h-4 text-green-500" />{" "}
													<p className="text-sm">Query ran successfully</p>
													<span className="inline-flex items-center rounded-[10px] bg-gray-400/10 px-2 py-1 text-xs font-medium text-white ring-1 ring-inset ring-gray-400/20">
														{fetcher.data.queryTime} ms
													</span>
												</div>
											)}
											<Result queryResult={fetcher.data?.result.result} />
										</div>
									)}
								</div>
							</Panel>
						</PanelGroup>
					</div>
				</div>
			</div>
		</div>
	);
};
