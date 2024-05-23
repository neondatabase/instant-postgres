import { Form } from "@remix-run/react";
import { Button } from "./ui/button";
import { Turnstile } from "@marsidev/react-turnstile";
import { useState } from "react";

type DeployButtonProps = {
	isLoading: boolean;
	hasCreatedProject: boolean;
};

export const DeployButton = ({
	isLoading,
	hasCreatedProject,
}: DeployButtonProps) => {
	const [token, setToken] = useState(null);

	return (
		<Form
			method="POST"
			className="flex flex-col md:flex-row gap-3 md:items-center"
		>
			<Button
				name="action"
				value="deploy"
				size="lg"
				variant="primary"
				isDisabled={!token || isLoading || hasCreatedProject}
				type="submit"
				className="h-[43px]  hover:shadow-[0px_8px_30px_0px_rgba(0,229,153,.16)] transition-shadow disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
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
				Deploy Postgres{" "}
			</Button>

			<Turnstile siteKey="0x4AAAAAAAa4q5vJcjGaJqL7" onSuccess={setToken} />
		</Form>
	);
};
