import * as Headless from "@headlessui/react";
import { type VariantProps } from "cva";
import CheckIcon from "virtual:icons/ri/check-line";
import SubtractLineIcon from "virtual:icons/ri/subtract-line";

import { cva, cx } from "#/utils/cva.ts";
import { twc } from "#/utils/twc.ts";

export const CheckboxGroup = twc.div.attrs({
    "data-slot": "control",
})(() => [
    //Basic groups
    "space-y-3",
    // With descriptions
    "has-[[data-slot=description]]:space-y-6 [&_[data-slot=label]]:has-[[data-slot=description]]:font-medium",
]);

export const CheckboxField = twc(Headless.Field).attrs({
    "data-slot": "field",
})(() => [
    // Base layout
    "grid grid-cols-[1.125rem_1fr] items-center gap-x-2 gap-y-1 sm:grid-cols-[1rem_1fr]",
    // Control layout
    "[&>[data-slot=control]]:col-start-1 [&>[data-slot=control]]:row-start-1 [&>[data-slot=control]]:justify-self-center",
    // Label layout
    "[&>[data-slot=label]]:col-start-2 [&>[data-slot=label]]:row-start-1 [&>[data-slot=label]]:justify-self-start",
    // Description layout
    "[&>[data-slot=description]]:col-start-2 [&>[data-slot=description]]:row-start-2",
    // With description
    "[&_[data-slot=label]]:has-[[data-slot=description]]:font-medium",
]);

const checkboxVariants = cva({
    base: [
        // Basic layout
        "relative isolate flex size-4 items-center justify-center rounded-4 transition",
        // Background color + shadow applied to inset pseudo-element, so it blends with border in light mode
        "before:absolute before:inset-0 before:-z-10 before:rounded-[calc(4px-2px)] before:bg-(--bg-white-0) before:shadow before:transition",
        // Background color when checked
        "group-data-checked:group-data-focus:bg-primary-dark group-data-checked:group-data-hover:bg-primary-darker group-data-checked:before:bg-(--checkbox-checked-bg)",
        "group-data-indeterminate:group-data-focus:bg-primary-dark group-data-indeterminate:group-data-hover:bg-primary-darker group-data-indeterminate:before:bg-(--checkbox-checked-bg)",
        // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
        "dark:before:hidden",
        // Background color applied to control in dark mode
        "bg-(--bg-white-0)",
        "dark:group-data-indeterminate:bg-(--checkbox-checked-bg)",
        // Border
        "border-2 border-(--bg-soft-200) group-data-checked:border-transparent group-data-checked:bg-(--checkbox-checked-border) group-data-hover:border-(--bg-sub-300) group-data-checked:group-data-hover:border-transparent",
        "group-data-indeterminate:border-transparent group-data-indeterminate:bg-(--checkbox-checked-border) group-data-indeterminate:group-data-hover:border-transparent",
        // Focus ring
        "group-data-focus:border-primary-dark group-data-focus:bg-(--bg-white-0)",
        // Disabled state
        "group-data-disabled:border-(--bg-soft-200) group-data-disabled:bg-(--bg-soft-200) group-data-disabled:[--checkbox-check:var(--color-white)] group-data-disabled:before:bg-transparent",
        // Forced colors mode
        "forced-colors:[--checkbox-check:HighlightText] forced-colors:[--checkbox-checked-bg:Highlight] forced-colors:group-data-disabled:[--checkbox-check:Highlight]",
        undefined,
    ],
    variants: {
        $color: {
            default:
                "[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-primary)] [--checkbox-checked-border:var(--color-primary)]",
        },
    },
    defaultVariants: {
        $color: "default",
    },
});

export function Checkbox({
    className,
    $color = "default",
    ...props
}: {
    className?: string;
} & Omit<Headless.CheckboxProps, "className"> &
    VariantProps<typeof checkboxVariants>) {
    return (
        <Headless.Checkbox
            data-slot="control"
            {...props}
            className={cx("group inline-flex focus:outline-none", className)}
        >
            <span
                className={checkboxVariants({
                    $color,
                    className,
                })}
            >
                {props.indeterminate ? (
                    <SubtractLineIcon className="size-4 stroke-(--checkbox-check) opacity-0 group-data-indeterminate:opacity-100 sm:size-2.5" />
                ) : (
                    <CheckIcon className="size-4 stroke-(--checkbox-check) opacity-0 group-data-checked:opacity-100 sm:size-2.5" />
                )}
            </span>
        </Headless.Checkbox>
    );
}
