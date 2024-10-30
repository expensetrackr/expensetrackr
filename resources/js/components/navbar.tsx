import * as Headless from "@headlessui/react";
import { LayoutGroup, motion } from "framer-motion";
import * as React from "react";

import { cx } from "#/utils/cva.ts";
import { twc } from "#/utils/twc.ts";
import { TouchTarget } from "./button.tsx";
import { Link } from "./link.tsx";

export const Navbar = twc.nav`flex flex-1 items-center gap-4 py-2.5`;

export const NavbarDivider = twc.div.attrs({
	"aria-hidden": "true",
})`h-6 w-px bg-zinc-950/10 dark:bg-white/10`;

export function NavbarSection({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
	const id = React.useId();

	return (
		<LayoutGroup id={id}>
			<div {...props} className={cx("flex items-center gap-3", className)} />
		</LayoutGroup>
	);
}

export const NavbarSpacer = twc.div.attrs({
	"aria-hidden": "true",
})`-ml-4 flex-1`;

export const navbarItemClasses = cx(
	// Base
	"relative flex min-w-0 items-center gap-3 rounded-8 p-2 text-left font-medium text-base/6 text-zinc-950 transition sm:text-sm/5",
	// Leading icon/icon-only
	"data-[slot=icon]:*:size-6 data-[slot=icon]:*:shrink-0 data-[slot=icon]:*:fill-zinc-500 sm:data-[slot=icon]:*:size-5",
	// Trailing icon (down chevron or similar)
	"data-[slot=icon]:last:[&:not(:nth-child(2))]:*:ml-auto data-[slot=icon]:last:[&:not(:nth-child(2))]:*:size-5 sm:data-[slot=icon]:last:[&:not(:nth-child(2))]:*:size-4",
	// Avatar
	"data-[slot=avatar]:*:-m-0.5 data-[slot=avatar]:*:size-7 sm:data-[slot=avatar]:*:size-6 data-[slot=avatar]:*:[--avatar-radius:var(--radius-4)] data-[slot=avatar]:*:[--ring-opacity:10%]",
	// Hover
	"data-[hover]:bg-zinc-950/5 data-[slot=icon]:*:data-[hover]:fill-zinc-950",
	// Active
	"data-[active]:bg-zinc-950/5 data-[slot=icon]:*:data-[active]:fill-zinc-950",
	// Dark mode
	"dark:text-white dark:data-[slot=icon]:*:fill-zinc-400",
	"dark:data-[hover]:bg-white/5 dark:data-[slot=icon]:*:data-[hover]:fill-white",
	"dark:data-[active]:bg-white/5 dark:data-[slot=icon]:*:data-[active]:fill-white",
);

export const NavbarItem = React.forwardRef(function NavbarItem(
	{
		current,
		className,
		children,
		...props
	}: { current?: boolean; className?: string; children: React.ReactNode } & (
		| Omit<Headless.ButtonProps, "className">
		| Omit<React.ComponentPropsWithoutRef<typeof Link>, "className">
	),
	ref: React.ForwardedRef<HTMLButtonElement>,
) {
	return (
		<span className={cx(className, "relative")}>
			{current && (
				<motion.span
					layoutId="current-indicator"
					className="-bottom-2.5 absolute inset-x-2 h-0.5 rounded-full bg-zinc-950 dark:bg-white"
				/>
			)}
			{"href" in props ? (
				<Link
					{...props}
					className={cx(
						navbarItemClasses,
						// Custom classes
						className,
					)}
					data-current={current ? "true" : undefined}
					ref={ref as React.ForwardedRef<HTMLAnchorElement>}
				>
					<TouchTarget>{children}</TouchTarget>
				</Link>
			) : (
				<Headless.Button
					{...props}
					className={cx(navbarItemClasses, "cursor-default")}
					data-current={current ? "true" : undefined}
					ref={ref}
				>
					<TouchTarget>{children}</TouchTarget>
				</Headless.Button>
			)}
		</span>
	);
});

export const NavbarLabel = twc.span`truncate`;
