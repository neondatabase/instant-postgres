import { Form } from "@remix-run/react";
import { Turnstile } from "@instant-postgres/turnstile";
import { type CSSProperties, useState } from "react";
import { cn } from "~/lib/cn";

type DeployButtonProps = {
	isLoading: boolean;
	hasCreatedProject: boolean;
};

export const DeployButton = ({
	isLoading,
	hasCreatedProject,
}: DeployButtonProps) => {
	const [token, setToken] = useState<null | string>(null);

	return (
		<Form
			method="POST"
			className="flex flex-col md:flex-row gap-3 md:items-center"
		>
			<button
				type="submit"
				disabled={!token || isLoading || hasCreatedProject}
				style={
					{
						"--spread": "90deg",
						"--shimmer-color": "#00e599",
						"--radius": "10px",
						"--speed": "3s",
						"--cut": "0.05em",
						"--bg": "#000",
					} as CSSProperties
				}
				className={cn(
					"group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap border border-white/10 px-6 py-3 text-white [background:var(--bg)] [border-radius:var(--radius)]",
					"transform-gpu transition-transform duration-300 ease-in-out active:translate-y-[1px]",
				)}
			>
				{/* spark container */}
				{token && !hasCreatedProject && (
					<div
						className={cn(
							"-z-30 blur-[2px]",
							"absolute inset-0 overflow-visible [container-type:size]",
						)}
					>
						{/* spark */}
						<div className="absolute inset-0 h-[100cqh] animate-slide [aspect-ratio:1] [border-radius:0] [mask:none]">
							{/* spark before */}
							<div className="animate-spin-around absolute inset-[-100%] w-auto rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))] [translate:0_0]" />
						</div>
					</div>
				)}
				<span className="flex space-x-2 items-center whitespace-pre-wrap text-center text-base font-medium leading-none tracking-tight text-white from-white to-slate-900/10 ">
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
							className="w-4 h-4 mr-2 animate-spin"
							role="img"
							aria-label="Loading"
						>
							<path d="M21 12a9 9 0 1 1-6.219-8.56" />
						</svg>
					) : hasCreatedProject ? (
						<svg
							className="w-4 h-4 mr-2"
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="3"
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
							className="w-4 h-4 mr-2"
							role="img"
							aria-label="Database"
						>
							<ellipse cx="12" cy="5" rx="9" ry="3" />
							<path d="M3 5V19A9 3 0 0 0 21 19V5" />
							<path d="M3 12A9 3 0 0 0 21 12" />
						</svg>
					)}
					Deploy Postgres
				</span>
				{/* Highlight */}
				<div
					className={cn(
						"insert-0 absolute h-full w-full",

						"rounded-[10px] px-4 py-1.5 text-sm font-medium shadow-[inset_0_-8px_10px_#00e5991f]",

						// transition
						"transform-gpu transition-all duration-300 ease-in-out",

						// on hover
						"group-hover:shadow-[inset_0_-6px_10px_#00e5993f]",

						// on click
						"group-active:shadow-[inset_0_-10px_10px_#00e5993f]",
					)}
				/>
				{/* backdrop */}
				<div
					className={cn(
						"absolute -z-20 [background:var(--bg)] [border-radius:var(--radius)] [inset:var(--cut)]",
					)}
				/>
			</button>

			<Turnstile
				className="hidden"
				siteKey="0x4AAAAAAAa4q5vJcjGaJqL7"
				onSuccess={(token) => setToken(token)}
			/>
		</Form>
	);
};
