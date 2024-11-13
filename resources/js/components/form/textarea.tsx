import * as Headless from "@headlessui/react";
import { type VariantProps } from "cva";
import * as React from "react";

import { cx } from "#/utils/cva.ts";
import { inputVariants } from "./input.tsx";

export const Textarea = React.forwardRef(function Textarea(
    {
        className,
        resizable = true,
        $size = "md",
        ...props
    }: { className?: string; resizable?: boolean } & Omit<Headless.TextareaProps, "as" | "className"> &
        VariantProps<typeof inputVariants>,
    ref: React.ForwardedRef<HTMLTextAreaElement>,
) {
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
                "sm:focus-within:after:outline-neutral-alpha-16 after:pointer-events-none after:absolute after:inset-0 after:outline after:outline-transparent sm:focus-within:after:outline-2 sm:focus-within:after:outline-offset-2",
                ($size === "xs" || $size === "sm") && "after:rounded-8",
                $size === "md" && "after:rounded-10",
                // Disabled state
                "has-data-disabled:opacity-50 has-data-disabled:before:bg-[var(--bg-weak-50)] has-data-disabled:before:shadow-none",
                // Invalid state
                "has-data-invalid:before:shadow-red-500/10",
                className,
            ])}
            data-slot="control"
        >
            <Headless.Textarea
                ref={ref}
                {...props}
                className={inputVariants({
                    $size,
                    className: cx([
                        // This is to override the height classes by `inputVariants`
                        "h-auto",
                        // Resizable
                        resizable ? "resize-y" : "resize-none",
                    ]),
                })}
            />
        </span>
    );
});
