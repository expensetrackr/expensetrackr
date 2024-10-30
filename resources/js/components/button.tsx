import * as Headless from "@headlessui/react";
import type { VariantProps } from "cva";
import * as React from "react";

import { cva, cx } from "#/utils/cva.ts";
import { Link } from "./link.tsx";

const buttonVariants = cva({
	base: [
		// Base
		"relative isolate inline-flex items-center justify-center font-medium text-label-sm transition",
		// Focus
		"focus:outline-none data-focus:outline data-focus:outline-2 data-focus:outline-primary data-focus:outline-offset-2",
		// Disabled
		"data-disabled:opacity-50",
		// Icon
		"[&>[data-slot=icon]]:-mx-0.5 forced-colors:[--btn-icon:ButtonText] forced-colors:data-hover:[--btn-icon:ButtonText] [&>[data-slot=icon]]:my-0.5 [&>[data-slot=icon]]:size-5 [&>[data-slot=icon]]:shrink-0 [&>[data-slot=icon]]:text-[var(--btn-icon)] [&>[data-slot=icon]]:sm:my-1 [&>[data-slot=icon]]:sm:size-4",
	],
	variants: {
		$variant: {
			filled: [
				// Base
				"text-[var(--btn-text)]",
				// Optical border, implemented as the button background to avoid corner artifacts
				"border-transparent bg-[var(--btn-border)]",
				// Button background, implemented as foreground layer to stack on top of pseudo-border layer
				"before:-z-10 before:absolute before:inset-0 before:bg-[var(--btn-bg)] before:transition",
				// Drop shadow, applied to the inset `before` layer, so it blends with the
				"before:shadow",
				// Shim/overlay, inset to match button foreground and used for hover state + highlight
				"after:-z-10 after:absolute after:inset-0 after:transition",
				// White overlay on hover
				"data-active:after:bg-[var(--btn-hover-overlay)] data-hover:after:bg-[var(--btn-hover-overlay)]",
				// Disabled
				"data-disabled:after:shadow-none data-disabled:before:shadow-none",
			],
			stroke: [
				// Base
				"border border-[var(--btn-stroke-border)] bg-[var(--bg-white-0)] text-[var(--btn-stroke-text)] data-active:bg-[var(--btn-stroke-hover)] data-hover:bg-[var(--btn-stroke-hover)]",
				// Icon
				"data-active:[--btn-icon:theme(colors.zinc.700)] data-hover:[--btn-icon:theme(colors.zinc.700)]",
			],
			lighter: [
				// Base
				"text-[var(--btn-lighter-text)]",
				// Border
				"border border-[var(--btn-lighter-border,transparent)]",
				// Button background
				"bg-[var(--btn-lighter-bg)] data-focus:bg-[var(--bg-white-0)] data-hover:bg-[var(--bg-white-0)]",
			],
			ghost: [
				// Base
				"text-[var(--btn-ghost-text)]",
				// Border
				"border border-[var(--btn-ghost-border,transparent)]",
				// Button background
				"bg-[var(--btn-ghost-bg,transparent)] data-focus:bg-[var(--bg-white-0)]",
			],
		},
		$size: {
			xs: "h-8 gap-1 rounded-8 p-1.5 before:rounded-[calc(var(--radius-8)-1px)] after:rounded-[calc(var(--radius-8)-1px)]",
			sm: "h-9 gap-2 rounded-8 p-2 before:rounded-[calc(var(--radius-8)-1px)] after:rounded-[calc(var(--radius-8)-1px)]",
			md: "h-10 gap-2 rounded-10 p-2.5 before:rounded-[calc(var(--radius-10)-1px)] after:rounded-[calc(var(--radius-10)-1px)]",
			none: false,
		},
		$color: {
			primary: [
				"[--btn-bg:var(--color-primary)] [--btn-border:var(--color-primary)] [--btn-ghost-text:var(--color-primary)] [--btn-hover-overlay:var(--color-primary-dark)] [--btn-lighter-bg:var(--color-primary-lighter)] [--btn-lighter-text:var(--color-primary)] [--btn-stroke-border:var(--color-primary)] [--btn-stroke-hover:var(--color-primary-lighter)] [--btn-stroke-text:var(--color-primary)] [--btn-text:var(--color-white)]",
				"data-hover:[--btn-ghost-bg:var(--color-primary-lighter)] data-hover:[--btn-lighter-border:var(--color-primary)]",
				"data-focus:outline-primary-lighter data-focus:[--btn-ghost-border:var(--color-primary)] data-focus:[--btn-lighter-border:var(--color-primary)]",
				"[--btn-icon:var(--color-white)]",
			],
			neutral: [
				"[--btn-bg:var(--bg-strong-950)] [--btn-border:var(--bg-strong-950)] [--btn-ghost-text:var(--text-sub-600)] [--btn-hover-overlay:var(--bg-surface-800)] [--btn-lighter-bg:var(--bg-weak-50)] [--btn-lighter-text:var(--text-sub-600)] [--btn-stroke-border:var(--stroke-soft-200)] [--btn-stroke-hover:var(--bg-weak-50)] [--btn-stroke-text:var(--text-sub-600)] [--btn-text:var(--text-white-0)]",
				"data-hover:[--btn-ghost-bg:var(--bg-weak-50)] data-hover:[--btn-ghost-text:var(--text-strong-950)] data-hover:[--btn-lighter-border:var(--stroke-soft-200)] data-hover:[--btn-lighter-text:var(--text-strong-950)] data-hover:[--btn-stroke-border:var(--bg-weak-50)] data-hover:[--btn-stroke-text:var(--text-strong-950)] data-hover:[--btn-text:var(--text-strong-950)]",
				"data-focus:outline-neutral-alpha-16 data-focus:[--btn-ghost-border:var(--stroke-strong-950)] data-focus:[--btn-ghost-text:var(--text-strong-950)] data-focus:[--btn-lighter-border:var(--stroke-soft-200)] data-focus:[--btn-lighter-text:var(--text-strong-950)] data-focus:[--btn-stroke-border:var(--stroke-strong-950)] data-focus:[--btn-stroke-text:var(--text-strong-950)] data-focus:[--btn-text:var(--text-strong-950)]",
			],
			error: [
				"[--btn-bg:var(--state-error-base)] [--btn-border:var(--state-error-base)] [--btn-ghost-text:var(--state-error-base)] [--btn-hover-overlay:var(--color-red-700)] [--btn-lighter-bg:var(--color-red-alpha-10)] [--btn-lighter-text:var(--state-error-base)] [--btn-stroke-border:var(--state-error-base)] [--btn-stroke-hover:var(--color-red-alpha-10)] [--btn-stroke-text:var(--state-error-base)] [--btn-text:var(--color-white)]",
				"data-hover:[--btn-ghost-bg:var(--color-red-alpha-10)] data-hover:[--btn-lighter-border:var(--state-error-base)] data-hover:[--btn-stroke-border:transparent]",
				"data-focus:outline-red-alpha-16 data-focus:[--btn-ghost-border:var(--state-error-base)] data-focus:[--btn-lighter-border:var(--state-error-base)]",
				"[--btn-icon:var(--color-white)]",
			],
		},
	},
	defaultVariants: {
		$variant: "filled",
		$size: "md",
		$color: "primary",
	},
});

type ButtonProps = { className?: string; children: React.ReactNode } & (
	| Omit<Headless.ButtonProps, "className">
	| Omit<React.ComponentPropsWithoutRef<typeof Link>, "className">
) &
	VariantProps<typeof buttonVariants>;

export const Button = React.forwardRef(function Button(
	{ className, children, $variant = "filled", $size = "md", $color = "primary", ...props }: ButtonProps,
	ref: React.ForwardedRef<HTMLElement>,
) {
	if ("href" in props) {
		return (
			<Link
				{...props}
				className={buttonVariants({
					$variant,
					$size,
					$color,
					className,
				})}
				ref={ref as React.ForwardedRef<HTMLAnchorElement>}
			>
				<TouchTarget>{children}</TouchTarget>
			</Link>
		);
	}

	return (
		<Headless.Button
			{...props}
			className={cx(
				buttonVariants({
					$variant,
					$size,
					$color,
					className,
				}),
				"cursor-default",
			)}
			ref={ref}
		>
			<TouchTarget>{children}</TouchTarget>
		</Headless.Button>
	);
});

/* Expand the hit area to at least 44×44px on touch devices */
export function TouchTarget({ children }: { children: React.ReactNode }) {
	return (
		<>
			<span
				className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 size-[max(100%,2.75rem)] [@media(pointer:fine)]:hidden"
				aria-hidden="true"
			/>
			{children}
		</>
	);
}
