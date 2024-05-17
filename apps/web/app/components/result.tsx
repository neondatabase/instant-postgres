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
import { FileText } from "lucide-react";

export const Result = ({ queryResult }) => {
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
		<>
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
					<FileText className="h-6 w-6" />
					<p className="text-[#AFB1B6]  text-center text-sm">
						The results of your query will appear here
					</p>
				</div>
			)}
		</>
	);
};
