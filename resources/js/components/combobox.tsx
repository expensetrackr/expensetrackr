import * as Headless from "@headlessui/react";
import { type VariantProps } from "cva";
import { forwardRef } from "react";

import { cva, cx } from "#/utils/cva.ts";

const comboboxVariants = cva({
    base: [
        // Basic layout
        "relative block w-full appearance-none ring-0 shadow-none transition",
        // Typography
        "text-paragraph-sm placeholder:text-[var(--text-soft-400)] placeholder:transition-colors focus-visible:placeholder:text-[var(--text-strong-950)] data-hover:placeholder:text-[var(--text-sub-600)]",
        // Border
        "border border-[var(--stroke-soft-200)] focus-visible:border-[var(--stroke-strong-950)] data-hover:border-[var(--bg-weak-50)]",
        // Background color
        "bg-[var(--bg-white-0)] focus-visible:border-[var(--stroke-strong-950)] data-hover:bg-[var(--bg-weak-50)]",
        // Hide default focus styles
        "focus:outline-none",
        // Invalid state
        "data-invalid:border-state-error-base",
        // Disabled state
        "data-disabled:bg-[var(--bg-weak-50)] data-disabled:text-[var(--text-disabled-300)]",
    ],
    variants: {
        $size: {
            xs: "rounded-8 h-8 p-1.5",
            sm: "rounded-8 h-9 p-2",
            md: "rounded-10 h-10 p-2.5",
        },
    },
    defaultVariants: {
        $size: "md",
    },
});

export const ComboboxInput = forwardRef(function Combobox(
    {
        className,
        multiple,
        $size = "md",
        ...props
    }: { className?: string } & Omit<Headless.ComboboxInputProps, "as" | "className"> &
        VariantProps<typeof comboboxVariants>,
    ref: React.ForwardedRef<HTMLInputElement>,
) {
    return (
        <span
            data-slot="control"
            className={cx([
                className,
                // Basic layout
                "group relative block w-full before:transition after:transition",
                // Background color + shadow applied to inset pseudo-element, so shadow blends with border in light mode
                "before:absolute before:inset-px before:bg-white before:shadow",
                ($size === "xs" || $size === "sm") && "before:rounded-[calc(var(--radius-8)-1px)]",
                $size === "md" && "before:rounded-[calc(var(--radius-10)-1px)]",
                // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
                "dark:before:hidden",
                // Focus ring
                "sm:focus-within:after:outline-neutral-alpha-16 after:pointer-events-none after:absolute after:inset-0 after:ring-transparent after:outline after:outline-transparent sm:focus-within:after:outline-2 sm:focus-within:after:outline-offset-2",
                ($size === "xs" || $size === "sm") && "after:rounded-8",
                $size === "md" && "after:rounded-10",
                // Disabled state
                "has-data-disabled:opacity-50 before:has-data-disabled:bg-zinc-950/5 before:has-data-disabled:shadow-none",
            ])}
        >
            <Headless.ComboboxInput
                ref={ref}
                multiple={multiple}
                {...props}
                className={comboboxVariants({
                    $size,
                })}
            />
        </span>
    );
});

export function ComboboxOptions({
    anchor = "bottom",
    className,
    transition = true,
    ...props
}: { className?: string } & Omit<Headless.ComboboxOptionsProps, "className">) {
    return (
        <Headless.ComboboxOptions
            {...props}
            anchor={anchor}
            transition={transition}
            className={cx([
                // Anchor positioning
                "[--anchor-gap:var(--spacing-2)] [--anchor-padding:var(--spacing-1)] data-[anchor~=end]:[--anchor-offset:6px] data-[anchor~=start]:[--anchor-offset:-6px] sm:data-[anchor~=end]:[--anchor-offset:4px] sm:data-[anchor~=start]:[--anchor-offset:-4px]",
                // Base styles
                "rounded-16 isolate flex w-[var(--input-width)] flex-col gap-1 p-2 [--anchor-max-height:252px] empty:invisible",
                // Invisible border that is only visible in `forced-colors` mode for accessibility purposes
                "outline outline-transparent focus:outline-none",
                // Handle scrolling when menu won't fit in viewport
                "overflow-y-auto",
                // Popover background
                "bg-[var(--bg-white-0)]/85 backdrop-blur-lg",
                // Shadows
                "ring-1 shadow-md ring-[var(--stroke-soft-200)]",
                // Transitions
                "origin-top transition duration-200 ease-out data-leave:ease-in data-closed:data-leave:opacity-0",
                // Put className last to allow overriding
                className,
            ])}
        />
    );
}

const comboboxOptionClasses = cx([
    // Base styles
    "group rounded-8 w-full cursor-default p-2 transition duration-100 focus:outline-none",
    // Text styles
    "text-paragraph-sm text-left forced-colors:text-[CanvasText]",
    // Focus
    "data-focus:bg-[var(--bg-weak-50)]",
    // Disabled state
    "data-disabled:opacity-50",
    // Forced colors mode
    "forced-color-adjust-none forced-colors:data-focus:bg-[Highlight] forced-colors:data-focus:text-[HighlightText] forced-colors:[&>[data-slot=icon]]:data-focus:text-[HighlightText]",
    // Use subgrid when available but fallback to an explicit grid layout if not
    "flex items-center gap-2",
    // Icons
    "[&>[data-slot=icon]]:col-start-1 [&>[data-slot=icon]]:row-start-1 [&>[data-slot=icon]]:mr-2.5 [&>[data-slot=icon]]:-ml-0.5 [&>[data-slot=icon]]:size-5 sm:[&>[data-slot=icon]]:mr-2",
    "[&>[data-slot=icon]]:text-[var(--icon-sub-600)]",
    // Avatar
    "[&>[data-slot=avatar]]:mr-2.5 [&>[data-slot=avatar]]:-ml-1 [&>[data-slot=avatar]]:size-6 sm:[&>[data-slot=avatar]]:mr-2 sm:[&>[data-slot=avatar]]:size-5",
]);

export function ComboboxOption({
    className,
    ...props
}: { className?: string } & Omit<Headless.ComboboxOptionProps, "className">) {
    return <Headless.ComboboxOption {...props} className={cx(comboboxOptionClasses, className)} />;
}
