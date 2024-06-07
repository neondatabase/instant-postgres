import { regions } from "@instant-postgres/neon/regions";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useFetcher } from "@remix-run/react";
import type { clientAction } from "~/routes/actions.deploy";

const RequestInfo = () => {
	const fetcher = useFetcher<typeof clientAction>({ key: "deploy" });
	const hasCreatedProject = fetcher?.data?.result?.hasCreatedProject ?? false;

	const timeToProvision = fetcher?.data?.result?.timeToProvision ?? 0;
	const regionId = fetcher?.data?.result?.project
		?.region_id as keyof typeof regions;
	const region = regions[regionId]?.name;

	if (hasCreatedProject) {
		return (
			<div className="flex items-center gap-1">
				<p className="animate-in fade-in slide-in-from-bottom font-mono text-xs leading-none tracking-extra-tight text-white tracking-extra-tight opacity-90">
					Provisioned in {timeToProvision} ms, {region}{" "}
				</p>

				<Tooltip.Provider delayDuration={300}>
					<Tooltip.Root>
						<Tooltip.Trigger className="p-2 text-white rounded-[10px]">
							<svg
								className="w-4 h-4"
								role="img"
								aria-label="Query info"
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<circle cx="12" cy="12" r="10" />
								<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
								<path d="M12 17h.01" />
							</svg>
						</Tooltip.Trigger>
						<Tooltip.Portal>
							<Tooltip.Content
								className="text-black data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-violet11 select-none rounded-[10px] bg-white px-[15px] py-[10px] text-xs leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity]"
								sideOffset={5}
							>
								Actual time taken to provision the database. It doesn't
								represent the total round-trip time.
								<Tooltip.Arrow className="fill-white" />
							</Tooltip.Content>
						</Tooltip.Portal>
					</Tooltip.Root>
				</Tooltip.Provider>
			</div>
		);
	}
};

export default RequestInfo;
