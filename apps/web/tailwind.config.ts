import type { Config } from "tailwindcss";
import animatePlugin from "tailwindcss-animate";
import reactAriaComponentsPlugin from "tailwindcss-react-aria-components";

export default {
	content: ["./app/**/*.{js,jsx,ts,tsx}"],
	plugins: [animatePlugin, reactAriaComponentsPlugin],
} satisfies Config;
