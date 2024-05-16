import { useState } from "react";
import Editor from "@uiw/react-textarea-code-editor";
import { Button } from "./ui/button";
import { Play, LoaderCircle } from "lucide-react";

type CodeEditorProps = {
	hasCreatedProject: boolean;
};

export const CodeEditor = ({ hasCreatedProject }: CodeEditorProps) => {
	const [code, setCode] = useState(
		"CREATE TABLE playing_with_neon(id SERIAL PRIMARY KEY, name TEXT NOT NULL, value REAL);\nINSERT INTO playing_with_neon(name, value)\nSELECT LEFT(md5(i::TEXT), 10), random() FROM generate_series(1, 10) s(i);\nSELECT * FROM playing_with_neon;",
	);

	const isLoading = false;

	return (
		<div className="relative z-10 rounded-[14px] bg-white bg-opacity-[0.03] p-1.5 backdrop-blur-[4px] xl:rounded-xl w-full">
			<div
				className="absolute inset-0 z-10 rounded-[inherit] border border-white/[0.04]"
				aria-hidden="true"
			/>
			<div
				className="absolute inset-[5px] z-10 rounded-[10px] border border-white/[0.04] mix-blend-overlay"
				aria-hidden="true"
			/>
			<div className="pointer-events-none absolute -left-40 -top-44 z-0 h-[482px] w-[470px] rounded-[100%] bg-[linear-gradient(180deg,rgba(25,27,52,0)_0%,#16182D_88.36%)] opacity-65 blur-3xl xl:-left-36 xl:-top-40 xl:h-[427px] xl:w-[417]" />
			<div className="pointer-events-none absolute -right-32 -top-28 z-0 h-[316px] w-[316px] rounded-[100%] bg-[#16182D] opacity-30 blur-3xl" />
			<div className="pointer-events-none absolute -bottom-36 -right-36 z-0 h-[377px] w-[377px] rounded-[100%] bg-[#16182D] opacity-40 blur-3xl" />
			<div className="relative z-20 rounded-[10px] bg-black-new xl:rounded-lg">
				<div className="rounded-[10px] bg-black-new">
					<div className="border-b border-white/[0.03]" />
					<div className="relative h-[443px] lg:h-[403px]">
						<Editor
							value={code}
							language="sql"
							disabled={!hasCreatedProject}
							className={"h-full font-mono leading-loose"}
							onChange={(evn) => setCode(evn.target.value)}
							padding={20}
							data-color-mode="dark"
							style={{
								backgroundColor: "#0C0D0D",
								fontFamily:
									"ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
								fontSize: "14px",
								opacity: hasCreatedProject ? 1 : 0.5,
							}}
						/>

						<Button
							type="submit"
							className="text-sm inline-flex h-9 items-center justify-center rounded-[10px] border border-[#fff]/10 px-3 font-medium text-[#EEEEEE]	focus:outline-none focus:ring-2 focus:ring-[#00e599] focus:ring-offset-2 focus:ring-offset-black hover:shadow-[0px_8px_30px_0px_rgba(0,229,153,.16)] transition-shadow absolute bottom-5 right-5  disabled:opacity-50 disabled:hover:shadow-none"
							isDisabled={!hasCreatedProject || isLoading}
						>
							{isLoading ? (
								<LoaderCircle className="animate-spin mr-2 w-4 h-4" />
							) : (
								<Play className="mr-2 w-4 h-4" />
							)}
							Run query
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};
