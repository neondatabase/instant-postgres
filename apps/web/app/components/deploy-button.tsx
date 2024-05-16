import { Form } from "@remix-run/react";
import { Button } from "./ui/button";
import { Check, Database, LoaderCircle } from "lucide-react";

type DeployButtonProps = {
	isLoading: boolean;
	hasCreatedProject: boolean;
};

export const DeployButton = ({
	isLoading,
	hasCreatedProject,
}: DeployButtonProps) => {
	return (
		<Form method="POST">
			<Button
				size="lg"
				variant="primary"
				isDisabled={isLoading || hasCreatedProject}
				type="submit"
				className="h-[43px]  hover:shadow-[0px_8px_30px_0px_rgba(0,229,153,.16)] transition-shadow disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
			>
				{isLoading ? (
					<LoaderCircle className="w-4 h-4 mr-2 animate-spin" />
				) : hasCreatedProject ? (
					<Check className="w-4 h-4 mr-2" strokeWidth={3} />
				) : (
					<Database className="w-4 h-4 mr-2" strokeWidth={3} />
				)}
				{hasCreatedProject ? "Postgres Deployed" : "Deploy Postgres"}
			</Button>
			<div
				className="cf-turnstile"
				data-sitekey="0x4AAAAAAAaLhuOYDRwuDjk9"
				data-callback="javascriptCallback"
			/>
		</Form>
	);
};
