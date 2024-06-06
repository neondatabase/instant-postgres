import type { Config } from "tailwindcss";
import animatePlugin from "tailwindcss-animate";
import reactAriaComponentsPlugin from "tailwindcss-react-aria-components";

export default {
	content: ["./app/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			animation: {
				shimmer: "shimmer 3.5s linear infinite",
			},
			keyframes: {
				shimmer: {
					from: {
						backgroundPosition: "0 0",
					},
					to: {
						backgroundPosition: "-200% 0",
					},
				},
			},
		},
	},
	plugins: [animatePlugin, reactAriaComponentsPlugin],
} satisfies Config;
