import * as Headless from "@headlessui/react";
import { type VariantProps } from "cva";

import { cva, cx } from "#/utils/cva.ts";
import { twc } from "#/utils/twc.ts";

export const InputGroup = twc.span.attrs({
    "data-slot": "control",
})(() => [
    "relative isolate block",
    "[&_input]:has-[[data-slot=icon]:last-child]:pr-10 sm:[&_input]:has-[[data-slot=icon]:last-child]:pr-8 [&_input]:has-[[data-slot=icon]:first-child]:pl-10 sm:[&_input]:has-[[data-slot=icon]:first-child]:pl-8",
    "[&>[data-slot=icon]]:absolute [&>[data-slot=icon]]:top-3 sm:[&>[data-slot=icon]]:top-2.5 [&>[data-slot=icon]]:z-10 [&>[data-slot=icon]]:size-5 sm:[&>[data-slot=icon]]:size-4",
    "[&>[data-slot=icon]:last-child]:right-3 sm:[&>[data-slot=icon]:last-child]:right-2.5 [&>[data-slot=icon]:first-child]:left-3 sm:[&>[data-slot=icon]:first-child]:left-2.5",
    "[&>[data-slot=icon]]:text-zinc-500",
]);

const dateTypes = ["date", "datetime-local", "month", "time", "week"];
type DateType = (typeof dateTypes)[number];

export const inputVariants = cva({
    base: [
        // Basic layout
        "relative block w-full appearance-none transition",
        // Typography
        "text-paragraph-sm placeholder:text-(--text-soft-400) placeholder:transition-colors focus-visible:placeholder:text-(--text-strong-950) data-hover:placeholder:text-(--text-sub-600)",
        // Border
        "border border-(--stroke-soft-200) focus-visible:border-(--stroke-strong-950) data-hover:border-(--bg-weak-50)",
        // Background color
        "bg-(--bg-white-0) focus-visible:border-(--stroke-strong-950) data-hover:bg-(--bg-weak-50)",
        // Hide default focus styles
        "focus:outline-none",
        // Focus ring
        "focus-visible:ring-0",
        // Invalid state
        "data-invalid:border-state-error-base",
        // Disabled state
        "data-disabled:bg-(--bg-weak-50) data-disabled:text-(--text-disabled-300)",
    ],
    variants: {
        $size: {
            xs: "h-8 rounded-8 p-1.5",
            sm: "h-9 rounded-8 p-2",
            md: "h-10 rounded-10 p-2.5",
        },
    },
    defaultVariants: {
        $size: "md",
    },
});

type InputProps = {
    ref?: React.ForwardedRef<HTMLInputElement>;
    className?: string;
    type?: "email" | "number" | "password" | "search" | "tel" | "text" | "url" | DateType;
} & Omit<Headless.InputProps, "className"> &
    VariantProps<typeof inputVariants>;

export function Input({ ref, className, $size = "md", ...props }: InputProps) {
    return (
        <span
            className={cx([
                // Basic layout
                "relative block w-full transition before:transition after:transition",
                // Background color + shadow applied to inset pseudo-element, so shadow blends with border in light mode
                "before:absolute before:inset-px before:bg-white before:shadow",
                ($size === "xs" || $size === "sm") && "before:rounded-[calc(var(--radius-8)-1px)]",
                $size === "md" && "before:rounded-[calc(var(--radius-10)-1px)]",
                // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
                "dark:before:hidden",
                // Focus ring
                "after:pointer-events-none after:absolute after:inset-0 after:outline after:outline-transparent sm:focus-within:after:outline-2 sm:focus-within:after:outline-offset-2 sm:focus-within:after:outline-neutral-alpha-16",
                ($size === "xs" || $size === "sm") && "after:rounded-8",
                $size === "md" && "after:rounded-10",
                // Disabled state
                "has-data-disabled:opacity-50 has-data-disabled:before:bg-(--bg-weak-50) has-data-disabled:before:shadow-none",
                // Invalid state
                "has-data-invalid:before:shadow-red-500/10",
                className,
            ])}
            data-slot="control"
        >
            <Headless.Input
                ref={ref}
                {...props}
                className={inputVariants({
                    $size,
                    className: [
                        props.type &&
                            dateTypes.includes(props.type) && [
                                "[&::-webkit-datetime-edit-fields-wrapper]:p-0",
                                "[&::-webkit-date-and-time-value]:min-h-[1.5em]",
                                "[&::-webkit-datetime-edit]:inline-flex",
                                "[&::-webkit-datetime-edit]:p-0",
                                "[&::-webkit-datetime-edit-year-field]:p-0",
                                "[&::-webkit-datetime-edit-month-field]:p-0",
                                "[&::-webkit-datetime-edit-day-field]:p-0",
                                "[&::-webkit-datetime-edit-hour-field]:p-0",
                                "[&::-webkit-datetime-edit-minute-field]:p-0",
                                "[&::-webkit-datetime-edit-second-field]:p-0",
                                "[&::-webkit-datetime-edit-millisecond-field]:p-0",
                                "[&::-webkit-datetime-edit-meridiem-field]:p-0",
                            ],
                    ],
                })}
            />
        </span>
    );
}
