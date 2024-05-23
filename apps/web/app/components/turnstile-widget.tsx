import { Turnstile } from "@marsidev/react-turnstile";

const CLOUDFLARE_TURNSTILE_SITE_KEY = import.meta.env
	.VITE_CLOUDFLARE_TURNSTILE_SITE_KEY;

export const TurnstileWidget = () => {
	return <Turnstile siteKey={CLOUDFLARE_TURNSTILE_SITE_KEY} />;
};
