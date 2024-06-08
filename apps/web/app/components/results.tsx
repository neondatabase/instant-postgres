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
import { useFetcher } from "@remix-run/react";
import type { clientAction as queryAction } from "~/routes/actions.query";
import { Tab, TabList, TabPanel, Tabs } from "react-aria-components";

export const Results = () => {
	const queryFetcher = useFetcher<typeof queryAction>({ key: "query" });
	const results = queryFetcher.data?.result ?? [];

	if (!results || results.length === 0) {
		return (
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
		);
	}

	return (
		<Tabs defaultSelectedKey={"0"} className="flex flex-col w-full mt-5">
			<TabList className="flex items-center gap-5 w-full border-b border-b-white/10 group">
				{results.map(({ result }, i) => {
					return (
						<Tab
							key={i.toString()}
							id={i.toString()}
							className="border-b border-b-transparent py-3 data-[focus-visible]:ring-2 data-[focus-visible]:ring-white data-[selected]:border-b-white "
						>
							{i}: {result?.command || "Error"}
						</Tab>
					);
				})}
			</TabList>

			{results.map(({ success, error, queryTime, result }, i) => {
				return (
					<TabPanel
						key={i.toString()}
						id={i.toString()}
						className="grow w-full mt-8 space-y-5 outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
					>
						<div className="w-full flex items-center space-x-2">
							{success ? (
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
							) : (
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
							)}
							<p className="text-sm">
								{success ? "Query ran successfully" : error}
							</p>
							<span className="inline-flex items-center rounded-[10px] bg-gray-400/10 px-2 py-1 text-xs font-medium text-white ring-1 ring-inset ring-gray-400/20">
								{queryTime} ms
							</span>
						</div>

						{success && (
							<div className="inline-block align-middle overflow-auto">
								{result?.rows.length > 0 ? (
									<Result result={result} />
								) : (
									<p className="text-sm">Query completed with no result</p>
								)}
							</div>
						)}
					</TabPanel>
				);
			})}
		</Tabs>
	);
};

const Result = ({
	result,
}: {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	result: any | null;
}) => {
	const table = useReactTable({
		data: result?.rows ?? [],
		columns:
			result?.fields
				// @ts-ignore
				?.map((field) => field.name)
				// @ts-ignore
				.map((key) => {
					return {
						accessorKey: key,
						header: key,
						indexed: true,
					};
				}) ?? [],
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});
	return (
		<>
			{table.getRowModel().rows?.length > 0 && (
				<nav
					className="flex flex-col items-start justify-between space-y-2"
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
						out of <span className="font-medium">{result.rowCount}</span>{" "}
						results
					</p>

					<div className="flex flex-1 space-x-2 py-2 justify-between sm:justify-end">
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
		</>
	);
};
