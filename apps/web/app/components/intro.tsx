import { Heading } from "./ui/heading";

export const Intro = () => {
	return (
		<div>
			<Heading
				level={1}
				className="text-[56px] font-semibold leading-[0.9] tracking-extra-tight text-white xl:text-[56px] lg:text-[44px] text-sm:text-[32px]"
			>
				Postgres on Neon
			</Heading>
			<Heading
				level={2}
				className="mt-[18px] text-xl font-light tracking-extra-tight text-[#AFB1B6] xl:mt-4 xl:text-lg lg:mt-3 lg:text-base md:mt-2"
			>
				No waiting. Get a Postgres database in less than a second.
			</Heading>
		</div>
	);
};
