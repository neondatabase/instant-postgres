export const Message = () => {
	return (
		<p className=" animate-in fade-in slide-in-from-top text-[#AFB1B6] text-sm">
			Database will be deleted after 5 minutes.{" "}
			<a
				className="text-white underline hover:no-underline"
				href="https://console.neon.tech/?ref=instantPostgres"
			>
				Sign up on Neon
			</a>{" "}
			for a free Postgres database{" "}
		</p>
	);
};
