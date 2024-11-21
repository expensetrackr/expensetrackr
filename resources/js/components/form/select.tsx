import * as Headless from "@headlessui/react";
import { type VariantProps } from "cva";

import { cva, cx } from "#/utils/cva.ts";

const selectVariants = cva({
    base: [
        // Basic layout
        "relative block w-full appearance-none ring-0 shadow-none transition",
        // Typography
        "text-paragraph-sm placeholder:text-(--text-soft-400) placeholder:transition-colors focus-visible:placeholder:text-(--text-strong-950) data-hover:placeholder:text-(--text-sub-600)",
        // Border
        "border border-(--stroke-soft-200) focus-visible:border-(--stroke-strong-950) data-hover:border-(--bg-weak-50)",
        // Background color
        "bg-(--bg-white-0) focus-visible:border-(--stroke-strong-950) data-hover:bg-(--bg-weak-50)",
        // Hide default focus styles
        "focus:outline-none",
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

type SelectProps = {
    ref?: React.ForwardedRef<HTMLElement>;
    className?: string;
    multiple?: boolean;
} & VariantProps<typeof selectVariants> &
    Omit<Headless.SelectProps, "as" | "className">;

export function Select({ ref, className, multiple, $size = "md", ...props }: SelectProps) {
    return (
        <span
            className={cx(
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
                "after:pointer-events-none after:absolute after:inset-0 after:ring-transparent after:outline after:outline-transparent sm:focus-within:after:outline-2 sm:focus-within:after:outline-offset-2 sm:focus-within:after:outline-neutral-alpha-16",
                ($size === "xs" || $size === "sm") && "after:rounded-8",
                $size === "md" && "after:rounded-10",
                // Disabled state
                "before:has-data-disabled:bg-zinc-950/5 has-data-disabled:opacity-50 before:has-data-disabled:shadow-none",
            )}
            data-slot="control"
        >
            <Headless.Select
                multiple={multiple}
                ref={ref}
                {...props}
                className={selectVariants({
                    $size,
                })}
            />
            {!multiple && (
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <svg
                        aria-hidden="true"
                        className="stroke-zinc-500 group-has-data-disabled:stroke-zinc-600 dark:stroke-zinc-400 size-5 sm:size-4 forced-colors:stroke-[CanvasText]"
                        fill="none"
                        viewBox="0 0 16 16"
                    >
                        <path
                            d="M5.75 10.75L8 13L10.25 10.75"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                        />
                        <path
                            d="M10.25 5.25L8 3L5.75 5.25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                        />
                    </svg>
                </span>
            )}
        </span>
    );
}
