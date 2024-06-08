import { regions } from "@instant-postgres/neon/regions";
import { useFetcher } from "@remix-run/react";
import { OverlayArrow, Tooltip, TooltipTrigger } from "react-aria-components";
import type { clientAction } from "~/routes/actions.deploy";
import { Button } from "./ui/button";

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
				<TooltipTrigger delay={300}>
					<Button variant="ghost" size="icon" className="hover:bg-transparent">
						<svg
							className="w-4 h-4 text-white"
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
							role="img"
						>
							<circle cx="12" cy="12" r="10" />
							<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
							<path d="M12 17h.01" />
						</svg>
					</Button>
					<Tooltip className="max-w-xs text-center text-white data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-violet11 select-none rounded-[10px] bg-[#222222] px-[15px] py-[10px] text-xs  shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity]">
						<OverlayArrow className="fill-[#222222]">
							<svg width={8} height={8} viewBox="0 0 8 8">
								<path d="M0 0 L4 4 L8 0" />
							</svg>
						</OverlayArrow>
						Actual time taken to provision the database. It doesn't represent
						the total round-trip time.
					</Tooltip>
				</TooltipTrigger>
			</div>
		);
	}
};

export default RequestInfo;
