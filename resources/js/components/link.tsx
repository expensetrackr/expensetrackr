import * as Headless from "@headlessui/react";
import { Link as InertiaLink, type InertiaLinkProps } from "@inertiajs/react";
import type { VariantProps } from "cva";
import * as React from "react";

import { cva } from "#/utils/cva.ts";

const linkVariants = cva({
	base: [
		// Base
		"relative isolate inline-flex items-center justify-center rounded-4 transition",
		// Focus
		"focus:outline-none data-[focus]:outline data-[focus]:outline-2 data-[focus]:outline-primary data-[focus]:outline-offset-2",
		// Icon
		"[&>[data-slot=icon]]:-mx-0.5 forced-colors:[--link-icon:ButtonText] forced-colors:data-[hover]:[--link-icon:ButtonText] [&>[data-slot=icon]]:my-0.5 [&>[data-slot=icon]]:size-5 [&>[data-slot=icon]]:shrink-0 [&>[data-slot=icon]]:text-[--link-icon] [&>[data-slot=icon]]:sm:my-1 [&>[data-slot=icon]]:sm:size-4",
	],
	variants: {
		$color: {
			gray: [
				"text-[var(--text-sub-600)] hover:underline",
				"focus-visible:text-[var(--text-strong-950)] focus-visible:underline",
			],
			black: ["text-[var(--text-strong-950)] hover:underline", "focus-visible:underline"],
			primary: ["text-primary hover:text-primary-dark hover:underline", "focus-visible:underline"],
			error: ["text-state-error-base hover:text-red-700 hover:underline", "focus-visible:underline"],
		},
		$size: {
			sm: "text-label-xs",
			md: "text-label-sm",
		},
	},
	defaultVariants: {
		$color: "gray",
		$size: "md",
	},
});

export const StyledLink = React.forwardRef(function Link(
	{ className, $color = "gray", $size = "md", ...props }: InertiaLinkProps & VariantProps<typeof linkVariants>,
	ref: React.ForwardedRef<HTMLAnchorElement>,
) {
	return (
		<Headless.DataInteractive>
			<InertiaLink {...props} className={linkVariants({ $color, $size, className })} ref={ref} />
		</Headless.DataInteractive>
	);
});

export const Link = React.forwardRef(function Link(
	props: InertiaLinkProps,
	ref: React.ForwardedRef<HTMLAnchorElement>,
) {
	return (
		<Headless.DataInteractive>
			<InertiaLink {...props} ref={ref} />
		</Headless.DataInteractive>
	);
});
