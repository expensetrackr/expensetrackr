import * as Headless from "@headlessui/react";
import { type VariantProps } from "cva";

import { cx } from "#/utils/cva.ts";
import { inputVariants } from "./input.tsx";

type TextareaProps = {
    ref?: React.ForwardedRef<HTMLElement>;
    className?: string;
    resizable?: boolean;
} & Omit<Headless.TextareaProps, "as" | "className"> &
    VariantProps<typeof inputVariants>;

export function Textarea({ ref, className, resizable = true, $size = "md", ...props }: TextareaProps) {
    return (
        <span
            className={cx([
                // Basic layout
                "relative block w-full transition duration-200 ease-out",
                // Background color + shadow applied to inset pseudo-element, so shadow blends with border in light mode
                "before:absolute before:inset-px before:bg-white before:shadow",
                ($size === "xs" || $size === "sm") && "before:rounded-[calc(var(--radius-8)-1px)]",
                $size === "md" && "before:rounded-[calc(var(--radius-10)-1px)]",
                // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
                "dark:before:hidden",
                // Focus ring
                "after:pointer-events-none after:absolute after:inset-0 after:outline after:outline-transparent has-data-focus:after:outline-2 has-data-focus:after:outline-offset-2 has-data-focus:after:outline-neutral-alpha-16",
                ($size === "xs" || $size === "sm") && "after:rounded-8",
                $size === "md" && "after:rounded-10",
                // Disabled state
                "has-data-disabled:opacity-50 has-data-disabled:before:bg-(--bg-weak-50) has-data-disabled:before:shadow-none",
                // Invalid state
                "has-data-focus:has-data-invalid:after:outline-red-alpha-10",
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
                        "h-auto px-3 py-2.5",
                        // Resizable
                        resizable ? "resize-y" : "resize-none",
                    ]),
                })}
            />
        </span>
    );
}
