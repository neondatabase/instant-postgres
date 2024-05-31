import { useCallback, useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import {
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { Button } from "~/components/ui/button";
import { tags as t } from "@lezer/highlight";
import createTheme from "@uiw/codemirror-themes";
import { useFetcher } from "@remix-run/react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import type { clientAction } from "~/routes/query";
import Editor from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";

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
	const onChange = useCallback((val: string) => {
		setQuery(val);
	}, []);

	const fetcher = useFetcher<typeof clientAction>();
	const isLoading = fetcher.state !== "idle";

	const queryResult = fetcher.data?.result.result ?? {
		rows: [],
		rowCount: 0,
		columns: [],
	};

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
							<Panel className="relative" defaultSize={50} maxSize={75}>
								<Editor
									editable={hasCreatedProject}
									value={query}
									theme={darkTheme}
									basicSetup={{
										foldGutter: false,
										highlightActiveLineGutter: false,
										lineNumbers: false,
										crosshairCursor: true,
										highlightActiveLine: false,
									}}
									extensions={[sql({ upperCaseKeywords: true })]}
									onChange={onChange}
									height="100%"
									style={{
										backgroundColor: "#0C0D0D",
										fontFamily:
											"ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
										fontSize: "0.875rem",
										borderRadius: "10px",
										overflow: "auto",
										lineHeight: "2",
										height: "100%",
										margin: "1rem",
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
												className="animate-spin mr-2 w-4 h-4"
												role="img"
												aria-label="Loading"
											>
												<path d="M21 12a9 9 0 1 1-6.219-8.56" />
											</svg>
										) : (
											<svg
												role="img"
												aria-label="Run query"
												xmlns="http://www.w3.org/2000/svg"
												width="24"
												height="24"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="3"
												strokeLinecap="round"
												strokeLinejoin="round"
												className="mr-2 w-4 h-4"
											>
												<polygon points="6 3 20 12 6 21 6 3" />
											</svg>
										)}
										Run query
									</Button>
								</fetcher.Form>
							</Panel>
							<PanelResizeHandle className="relative flex w-px items-center justify-center bg-white/[0.04] after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00E599] focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90">
								<div className="flex h-4 w-3 items-center justify-center rounded-sm bg-[#29292E] hover:bg-[#303136] text-white hover:opacity-80">
									<svg
										role="img"
										aria-label="Grip Horizontal Icon"
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="h-2.5 w-2.5"
									>
										<circle cx="12" cy="9" r="1" />
										<circle cx="19" cy="9" r="1" />
										<circle cx="5" cy="9" r="1" />
										<circle cx="12" cy="15" r="1" />
										<circle cx="19" cy="15" r="1" />
										<circle cx="5" cy="15" r="1" />
									</svg>
								</div>
							</PanelResizeHandle>

							<Panel
								className="text-white bg-[#0C0D0D] p-5 overflow-auto"
								defaultSize={50}
								maxSize={50}
							>
								<div className="h-full overflow-auto">
									{fetcher.data?.result.error ? (
										<div className="flex items-center space-x-2">
											<svg
												className="w-4 h-4 text-red-500"
												xmlns="http://www.w3.org/2000/svg"
												width="24"
												height="24"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
												role="img"
												aria-label="Error Icon"
											>
												<circle cx="12" cy="12" r="10" />
												<path d="m15 9-6 6" />
												<path d="m9 9 6 6" />
											</svg>
											<p className="text-sm">{fetcher.data?.result.error}</p>
											<span className="inline-flex items-center rounded-[10px] bg-gray-400/10 px-2 py-1 text-xs font-medium text-white ring-1 ring-inset ring-gray-400/20">
												{fetcher.data.queryTime} ms
											</span>
										</div>
									) : (
										<div className="w-full">
											{fetcher.data?.result.result && (
												<div className="flex items-center space-x-2">
													<svg
														role="img"
														aria-label="Checkmark Icon"
														xmlns="http://www.w3.org/2000/svg"
														width="24"
														height="24"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														strokeWidth="2"
														strokeLinecap="round"
														strokeLinejoin="round"
														className="w-4 h-4 text-green-500"
													>
														<circle cx="12" cy="12" r="10" />
														<path d="m9 12 2 2 4-4" />
													</svg>
													<p className="text-sm">Query ran successfully</p>
													<span className="inline-flex items-center rounded-[10px] bg-gray-400/10 px-2 py-1 text-xs font-medium text-white ring-1 ring-inset ring-gray-400/20">
														{fetcher.data.queryTime} ms
													</span>
												</div>
											)}
											<Result queryResult={queryResult} />
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

export const Result = ({
	queryResult,
}: {
	queryResult: {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		rows: any[];
		rowCount: number;
		columns: string[];
	};
}) => {
	const table = useReactTable({
		data: queryResult?.rows,
		columns: queryResult?.columns.map((key) => {
			return {
				accessorKey: key,
				header: key,
				indexed: true,
			};
		}),
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	return (
		<div className="mt-10">
			{queryResult ? (
				<div className="mx-3 inline-block py-2 align-middle overflow-auto">
					{table.getRowModel().rows?.length > 0 && (
						<nav
							className="flex flex-col items-start justify-between py-3 space-y-2"
							aria-label="Pagination"
						>
							<p className="text-sm">
								Showing{" "}
								<span className="font-medium">
									{table.getRowModel().rows[0].index + 1}
								</span>{" "}
								to{" "}
								<span className="font-medium">
									{table.getRowModel().rows[table.getRowModel().rows.length - 1]
										.index + 1}{" "}
								</span>{" "}
								out of{" "}
								<span className="font-medium">{queryResult.rowCount}</span>{" "}
								results.
							</p>

							<div className="flex flex-1 space-x-2 justify-between sm:justify-end">
								<Button
									isDisabled={!table.getCanPreviousPage()}
									variant="outline"
									size="sm"
									onPress={() => table.previousPage()}
								>
									Previous
								</Button>

								{
									<Button
										isDisabled={!table.getCanNextPage()}
										variant="outline"
										size="sm"
										onPress={() => table.nextPage()}
									>
										Next
									</Button>
								}
							</div>
						</nav>
					)}
					<div className="flex flex-1 flex-col items-center justify-center space-y-3">
						<Table>
							<TableHeader>
								{table.getHeaderGroups().map((headerGroup) => (
									<TableRow key={headerGroup.id}>
										{headerGroup.headers.map((header) => {
											return (
												<TableHead key={header.id}>
													{header.isPlaceholder
														? null
														: flexRender(
																header.column.columnDef.header,
																header.getContext(),
															)}
												</TableHead>
											);
										})}
									</TableRow>
								))}
							</TableHeader>
							<TableBody>
								{table.getRowModel().rows?.length > 0
									? table.getRowModel().rows.map((row) => (
											<TableRow
												key={row.id}
												data-state={row.getIsSelected() && "selected"}
											>
												{row.getVisibleCells().map((cell) => (
													<TableCell key={cell.id}>
														{flexRender(
															cell.column.columnDef.cell,
															cell.getContext(),
														)}
													</TableCell>
												))}
											</TableRow>
										))
									: null}
							</TableBody>
						</Table>
					</div>
				</div>
			) : (
				<div className="flex flex-1 flex-col items-center justify-center space-y-3 min-h-full">
					<svg
						role="img"
						aria-label="File Text Icon"
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="h-6 w-6"
					>
						<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
						<path d="M14 2v4a2 2 0 0 0 2 2h4" />
						<path d="M10 9H8" />
						<path d="M16 13H8" />
						<path d="M16 17H8" />
					</svg>
					<p className="text-[#AFB1B6]  text-center text-sm">
						The results of your query will appear here
					</p>
				</div>
			)}
		</div>
	);
};

const darkTheme = createTheme({
	theme: "dark",
	settings: {
		background: "#0c0d0d",
		foreground: "#c9d1d9",
		caret: "#c9d1d9",
		selection: "#003d73",
		selectionMatch: "#003d73",
		lineHighlight: "#36334280",

		gutterBackground: "transparent",
		gutterForeground: "rgb(155, 161, 166,0.6)",
	},
	styles: [
		{ tag: [t.standard(t.tagName), t.tagName], color: "#7ee787" },
		{ tag: [t.comment, t.bracket], color: "#8b949e" },
		{ tag: [t.className, t.propertyName], color: "#d2a8ff" },
		{
			tag: [t.variableName, t.attributeName, t.number, t.operator],
			color: "#79c0ff",
		},
		{
			tag: [t.keyword, t.typeName, t.typeOperator, t.typeName],
			color: "#ff7b72",
		},
		{ tag: [t.string, t.meta, t.regexp], color: "#a5d6ff" },
		{ tag: [t.name, t.quote], color: "#7ee787" },
		{ tag: [t.heading], color: "#d2a8ff", fontWeight: "bold" },
		{ tag: [t.emphasis], color: "#d2a8ff", fontStyle: "italic" },
		{ tag: [t.deleted], color: "#ffdcd7", backgroundColor: "ffeef0" },
		{ tag: [t.atom, t.bool, t.special(t.variableName)], color: "#ffab70" },
		{ tag: t.link, textDecoration: "underline" },
		{ tag: t.strikethrough, textDecoration: "line-through" },
		{ tag: t.invalid, color: "#f97583" },
	],
});
