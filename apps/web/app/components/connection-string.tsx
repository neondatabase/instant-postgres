import { useClipboard } from "use-clipboard-copy";
import { Button } from "./ui/button";
import { useScramble } from "use-scramble";
import { cn } from "~/lib/cn";
import { maskPassword } from "~/lib/mask-password";
import type { clientAction } from "~/routes/actions.deploy";
import { useFetcher } from "@remix-run/react";

export const ConnectionString = () => {
	const fetcher = useFetcher<typeof clientAction>({ key: "deploy" });
	const hasCreatedProject = fetcher?.data?.result?.hasCreatedProject ?? false;
	const connectionUri = fetcher?.data?.result?.connectionUri ?? "";

	const clipboard = useClipboard({
		copiedTimeout: 600,
	});

	const { ref } = useScramble({
		text: connectionUri && maskPassword(connectionUri),
		range: [65, 99],
		speed: 1,
		tick: 1,
		step: 5,
		scramble: 5,
		seed: 2,
		chance: 1,
		overdrive: false,
		overflow: false,
	});

	return (
		<div className="relative flex w-full max-w-4xl flex-col sm:overflow-hidden space-y-3">
			<div className="relative z-10 rounded-[14px] bg-white bg-opacity-[0.03] p-1 backdrop-blur-[4px] xl:rounded-xl ">
				<div
					className="absolute inset-0 z-10 rounded-[inherit] border border-white/[0.04]"
					aria-hidden="true"
				/>
				<div
					className="absolute inset-[5px] z-10 rounded-[10px] border border-white/[0.04] mix-blend-overlay"
					aria-hidden="true"
				/>
				<div className="z-20 flex h-9 gap-x-3.5 rounded-[10px] border-opacity-[0.05] bg-[#0c0d0d] pl-[18px] pt-2.5 tracking-extra-tight  xl:rounded-lg xl:pl-4 lg:gap-x-3 md:gap-x-2.5 md:pl-[14px]">
					<span className="absolute left-0 top-1/2 h-[450px] w-px -translate-y-1/2" />
					<span
						className={cn(
							"relative mt-1.5 h-1.5 w-1.5 rounded-full transition-[background-color,box-shadow] duration-300 xl:h-[5px] xl:w-[5px]  shadow-[0px_0px_9px_0px_#4BFFC3]",
							hasCreatedProject && "bg-[#00E599]",
						)}
						aria-hidden="true"
					>
						<span className="absolute inset-px h-1 w-1 rounded-full bg-[#D9FDF1] opacity-70 blur-[1px]" />
					</span>

					{hasCreatedProject ? (
						<span
							ref={ref}
							className="text-white w-full focus:outline-none bg-transparent font-mono text-xs h-3.5 overflow-clip"
						>
							{connectionUri}
						</span>
					) : (
						<span className="text-[#AFB1B6]/50 w-full focus:outline-none bg-transparent font-mono text-xs h-3.5 overflow-clip">
							postgresql://neondb_owner:v9wpX3xjEnKT@ep-misty-sound-a5169vmg.us-east-2.aws.neon.tech/neondb?sslmode=require{" "}
						</span>
					)}

					<div>
						{hasCreatedProject && (
							<div>
								<Button
									variant="ghost"
									className="absolute right-1 top-1 bg-[#0c0d0d] z-30"
									size="icon"
									onPress={clipboard.copy}
								>
									{clipboard.copied ? (
										<svg
											className="w-4 h-4"
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
											className="w-4 h-4"
											role="img"
											aria-label="Copy to clipboard"
										>
											<rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
											<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
										</svg>
									)}
								</Button>
								<input
									type="hidden"
									ref={clipboard.target}
									value={connectionUri}
									readOnly
								/>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
