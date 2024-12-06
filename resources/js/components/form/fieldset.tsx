import * as Headless from "@headlessui/react";
import ErrorWarningFillIcon from "virtual:icons/ri/error-warning-fill";

import { cx } from "#/utils/cva.ts";
import { twc } from "#/utils/twc.ts";

export const Fieldset = twc(Headless.Fieldset)`[&>*+[data-slot=control]]:mt-5 [&>[data-slot=text]]:mt-1`;

export const Legend = twc(Headless.Legend).attrs({
    "data-slot": "legend",
})`font-semibold text-base/6 text-zinc-950 sm:text-sm/6 data-disabled:opacity-50`;

export const FieldGroup = twc(Headless.Fieldset).attrs({
    "data-slot": "control",
})`space-y-3`;

export const Field = twc(Headless.Field)(() => [
    "[&>[data-slot=label]+[data-slot=control]]:mt-1",
    "[&>[data-slot=label]+[data-slot=description]]:mt-1",
    "[&>[data-slot=description]+[data-slot=control]]:mt-1",
    "[&>[data-slot=control]+[data-slot=description]]:mt-1",
    "[&>[data-slot=control]+[data-slot=error]]:mt-1",
]);

export const Label = twc(Headless.Label).attrs({
    "data-slot": "label",
})`select-none flex items-center gap-px text-label-sm data-disabled:text-(--text-disabled-300)`;

export const LabelAsterisk = twc.span.attrs({
    children: "*",
})`text-primary group-data-disabled:text-(--text-disabled-300)`;

export const LabelSub = twc.span`text-paragraph-sm text-(--text-sub-600) group-data-disabled:text-(--text-disabled-300)`;

export function Hint({
    className,
    children,
    invalid,
    ...props
}: { className?: string; invalid?: boolean } & Omit<Headless.DescriptionProps, "className">) {
    return (
        <Headless.Description
            data-slot={invalid ? "error" : "description"}
            {...props}
            className={cx(
                "flex items-center gap-1 text-paragraph-xs data-disabled:text-(--text-disabled-300)",
                invalid ? "text-state-error-base" : "text-(--text-sub-600)",
                className,
            )}
        >
            <ErrorWarningFillIcon
                className={cx(
                    "size-4 shrink-0 data-disabled:text-(--text-disabled-300)",
                    invalid ? "text-state-error-base" : "text-(--text-soft-400)",
                )}
            />
            <span>{typeof children === "string" ? children : children?.toString?.()}</span>
        </Headless.Description>
    );
}
