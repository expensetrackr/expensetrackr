import * as Headless from "@headlessui/react";
import clsx from "clsx";
import { LayoutGroup, motion } from "framer-motion";
import * as React from "react";

import { cx } from "#/utils/cva.ts";
import { twc } from "#/utils/twc.ts";
import { TouchTarget } from "./button.tsx";
import { Link } from "./link.tsx";

export const Sidebar = twc.nav`flex h-full flex-col`;

export const SidebarHeader = twc.div`flex flex-col p-3 [&>[data-slot=section]+[data-slot=section]]:mt-2.5`;

export const SidebarBody = twc.div`flex flex-1 flex-col overflow-y-auto p-5 [&>[data-slot=section]+[data-slot=section]]:mt-8`;

export const SidebarFooter = twc.div`flex flex-col mx-5 p-3 border-t border-[var(--stroke-soft-200)] [&>[data-slot=section]+[data-slot=section]]:mt-2.5`;

export function SidebarSection({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
	const id = React.useId();

	return (
		<LayoutGroup id={id}>
			<div {...props} data-slot="section" className={cx("flex flex-col gap-1", className)} />
		</LayoutGroup>
	);
}

export const SidebarDivider = twc.hr`border-t border-[var(--stroke-soft-200)]`;

export const SidebarSpacer = twc.div.attrs({
	"aria-hidden": "true",
})`mt-8 flex-1`;

export const SidebarHeading = twc.h3`p-1 text-subheading-xs uppercase text-[var(--text-soft-400)]`;

export const SidebarItem = React.forwardRef(function SidebarItem(
	{
		current,
		currentIndicator = true,
		className,
		buttonClassName,
		children,
		...props
	}: {
		current?: boolean;
		currentIndicator?: boolean;
		className?: string;
		buttonClassName?: string;
		children: React.ReactNode;
	} & (
		| Omit<Headless.ButtonProps, "className">
		| Omit<React.ComponentPropsWithoutRef<typeof Link>, "type" | "className">
	),
	ref: React.ForwardedRef<HTMLButtonElement>,
) {
	const classes = cx(
		// Base
		"flex w-full items-center gap-2 rounded-8 px-3 py-2 text-left text-[var(--text-sub-600)] text-label-sm transition",
		// Leading icon/icon-only
		"*:data-[slot=icon]:size-5 data-[slot=icon]:*:shrink-0 data-[slot=icon]:*:text-[var(--icon-sub-600)] data-[slot=icon]:*:transition",
		// Trailing icon (down chevron or similar)
		"data-[slot=icon]:last:*:ml-auto data-[slot=icon]:last:*:size-5 sm:data-[slot=icon]:last:*:size-4",
		// Avatar
		"data-[slot=avatar]:*:-m-0.5 data-[slot=avatar]:*:size-7 sm:data-[slot=avatar]:*:size-6 data-[slot=avatar]:*:[--ring-opacity:10%]",
		// Hover
		"data-[hover]:bg-[var(--bg-weak-50)] data-[hover]:*:data-[slot=icon]:text-[var(--icon-sub-600)] data-[current]:data-[hover]:*:data-[slot=icon]:text-primary",
		// Active
		"data-[active]:bg-[var(--bg-weak-50)] data-[active]:*:data-[slot=icon]:text-[var(--icon-sub-600)]",
		// Current
		"data-[current]:bg-[var(--bg-weak-50)] data-[current]:text-[var(--text-strong-950)] data-[current]:*:data-[slot=icon]:text-primary",
		// Custom classes
		buttonClassName,
	);

	return (
		<span className={cx("relative", className)}>
			{current && currentIndicator && (
				<motion.span
					layoutId="current-indicator"
					className="-left-5 absolute inset-y-2 h-5 w-1 rounded-r-4 bg-primary"
				/>
			)}
			{"href" in props ? (
				<Headless.CloseButton
					// @ts-expect-error - TODO: this type is wrong (Headless UI side)
					as={Link}
					{...props}
					className={classes}
					data-current={current ? "true" : undefined}
					ref={ref}
				>
					<TouchTarget>{children}</TouchTarget>
				</Headless.CloseButton>
			) : (
				<Headless.Button
					{...props}
					className={cx(classes, "cursor-default")}
					data-current={current ? "true" : undefined}
					ref={ref}
				>
					<TouchTarget>{children}</TouchTarget>
				</Headless.Button>
			)}
		</span>
	);
});

export function SidebarLabel({ className, ...props }: React.ComponentPropsWithoutRef<"span">) {
	return <span {...props} className={clsx(className, "truncate")} />;
}
