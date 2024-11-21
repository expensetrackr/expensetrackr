import * as Headless from "@headlessui/react";
import { type VariantProps } from "cva";
import * as React from "react";

import { TouchTarget } from "#/components/button.tsx";
import { Link } from "#/components/link.tsx";
import { cva, cx } from "#/utils/cva.ts";

const compactButtonVariants = cva({
    base: [
        // Base
        "relative isolate inline-flex items-center justify-center text-(--icon-sub-600) transition",
        // Hover
        "data-[hover]:bg-(--bg-weak-50) data-[hover]:text-(--icon-strong-950)",
        // Focus
        "focus:outline-none data-[focus]:bg-(--bg-strong-950) data-[focus]:text-(--icon-white-0) data-[focus]:outline data-[focus]:outline-2 data-[focus]:outline-offset-2 data-[focus]:outline-neutral-alpha-16",
        // Disabled
        "data-[disabled]:bg-transparent data-[disabled]:text-(--icon-disabled-300)",
        // Icon
        "forced-colors:[--btn-icon:ButtonText] forced-colors:data-[hover]:[--btn-icon:ButtonText] [&>[data-slot=icon]]:-mx-0.5 [&>[data-slot=icon]]:my-0.5 [&>[data-slot=icon]]:size-5 [&>[data-slot=icon]]:shrink-0 [&>[data-slot=icon]]:text-[--btn-icon] [&>[data-slot=icon]]:sm:my-1 [&>[data-slot=icon]]:sm:size-4",
    ],
    variants: {
        $variant: {
            stroke: [
                // Base
                "border border-(--stroke-soft-200) bg-(--bg-white-0) shadow-xs",
                // Hover
                "data-[hover]:border-0 data-[hover]:shadow-none",
                // Focus
                "data-[focus]:border-0 data-[focus]:shadow-none",
            ],
            ghost: [
                // Hover
                "data-[hover]:bg-(--bg-weak-50) data-[hover]:text-(--icon-strong-950)",
            ],
            white: [
                // Base
                "bg-(--bg-white-0) shadow-xs",
                // Hover
                "data-[hover]:shadow-none",
                // Focus
                "data-[focus]:shadow-none",
            ],
        },
        $size: {
            lg: "size-6",
            md: "size-5",
        },
        $fullRadius: {
            true: "rounded-full",
            false: "rounded-6",
        },
    },
    defaultVariants: {
        $variant: "stroke",
        $size: "lg",
        $fullRadius: false,
    },
});

type CompactButtonProps = { className?: string; children: React.ReactNode } & (
    | Omit<Headless.ButtonProps, "className">
    | Omit<React.ComponentPropsWithoutRef<typeof Link>, "className">
) &
    VariantProps<typeof compactButtonVariants>;

export const CompactButton = React.forwardRef(function Button(
    { className, children, $variant = "stroke", $size = "lg", $fullRadius = false, ...props }: CompactButtonProps,
    ref: React.ForwardedRef<HTMLElement>,
) {
    if ("href" in props) {
        return (
            <Link
                {...props}
                className={compactButtonVariants({
                    $variant,
                    $size,
                    $fullRadius,
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
                compactButtonVariants({
                    $variant,
                    $size,
                    $fullRadius,
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
