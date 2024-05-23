import { Heading } from "./ui/heading";

export const Intro = () => {
	return (
		<div>
			<Heading
				level={1}
				className="text-[32px] font-semibold leading-[0.9] tracking-extra-tight text-white xl:text-[56px] lg:text-[44px]"
			>
				Postgres in less than a second
			</Heading>
			<Heading
				level={2}
				className="mt-[18px] text-xl font-light tracking-extra-tight text-[#AFB1B6] xl:mt-4 xl:text-lg lg:mt-3 lg:text-base md:mt-2"
			>
				Instantly provison a Postgres database on{" "}
				<a
					className="text-white underline hover:no-underline underline-offset-4"
					href="https://console.neon.tech/?ref=instantPostgres"
				>
					Neon
				</a>{" "}
			</Heading>
		</div>
	);
};
