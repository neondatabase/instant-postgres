// https://buildui.com/recipes/artificial-delay
export const minDelay = async <T>(promise: Promise<T>, ms: number) => {
	const delay = new Promise((resolve) => setTimeout(resolve, ms));
	const [p] = await Promise.all([promise, delay]);

	return p;
};
