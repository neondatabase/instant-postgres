const coverImage = new URL("../../public/instant-postgres.png", import.meta.url)
	.href;

export const SEO = [
	{ title: "Neon | Instant Postgres" },
	{
		name: "description",
		content: "Provision a Postgres database on Neon in seconds.",
	},

	// Open Graph meta tags
	{ property: "og:title", content: "Instant Postgres" },
	{
		property: "og:description",
		content: "Provision a Postgres database on Neon in seconds.",
	},
	{ property: "og:image", content: coverImage },
	{ property: "og:url", content: "https://neon.tech/demos/instant-postgres" },
	{ property: "og:type", content: "website" },

	// Twitter meta tags
	{ name: "twitter:card", content: "summary_large_image" },
	{ name: "twitter:title", content: "Instant Postgres" },
	{
		name: "twitter:description",
		content: "Provision a Postgres database on Neon in seconds.",
	},
	{ name: "twitter:image", content: coverImage },
	{ name: "twitter:site", content: "@neondatabase" },
];
