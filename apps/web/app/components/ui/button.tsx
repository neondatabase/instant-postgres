import type { ButtonProps as BtnProps } from "react-aria-components";
import { Button as ReactAriaButton } from "react-aria-components";

import { buttonSizes } from "./constants";
import { cn } from "~/lib/cn";

const buttonVariants = {
	primary: "bg-[#00e599] text-black hover:bg-[#00e599]",
	ghost: "hover:bg-[#343535] hover:text-white data-[focus-visible]:text-white",
	outline: "border border-white/[0.04] hover:bg-[#343535] text-white",
} as const;

export type ButtonProps = BtnProps & {
	variant?: keyof typeof buttonVariants;
	size?: keyof typeof buttonSizes;
	className?: string;
};

const Button = ({
	variant = "primary",
	size = "default",
	className,
	children,
	...props
}: ButtonProps) => {
	return (
		<ReactAriaButton
			{...props}
			className={cn(
				"inline-flex items-center justify-center rounded-[10px] text-sm transition-colors text-[#AFB1B6]/50 font-semibold",
				"focus:outline-none data-[focus-visible]:ring-[#00e599] data-[focus-visible]:outline-none data-[focus-visible]:ring-2 data-[focus-visible]:ring-offset-2 data-[focus-visible]:ring-offset-black",
				"disabled:pointer-events-none disabled:opacity-50",
				"cursor-default",
				buttonVariants[variant],
				buttonSizes[size],
				className,
			)}
		>
			{children}
		</ReactAriaButton>
	);
};

export { Button, buttonSizes, buttonVariants };
