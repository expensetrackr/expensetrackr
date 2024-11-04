import * as Headless from "@headlessui/react";
import ErrorWarningFillIcon from "virtual:icons/ri/error-warning-fill";

import { cx } from "#/utils/cva.ts";
import { twc } from "#/utils/twc.ts";

export const Fieldset = twc(Headless.Fieldset)`[&>*+[data-slot=control]]:mt-5 [&>[data-slot=text]]:mt-1`;

export const Legend = twc(Headless.Legend).attrs({
    "data-slot": "legend",
})`font-semibold text-base/6 text-zinc-950 sm:text-sm/6 data-[disabled]:opacity-50`;

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
})`select-none text-label-sm data-[disabled]:opacity-50`;

export function Description({
    className,
    children,
    ...props
}: { className?: string } & Omit<Headless.DescriptionProps, "className">) {
    return (
        <Headless.Description
            data-slot="description"
            {...props}
            className={cx(
                "text-paragraph-xs inline-flex items-center gap-1 text-[var(--text-sub-600)] data-[disabled]:opacity-50",
                className,
            )}
        >
            <ErrorWarningFillIcon className="size-4 text-[var(--icon-soft-400)]" />
            <span>{typeof children === "string" ? children : children?.toString?.()}</span>
        </Headless.Description>
    );
}

export function ErrorMessage({
    className,
    children,
    ...props
}: { className?: string } & Omit<Headless.DescriptionProps, "className">) {
    return (
        <Headless.Description
            data-slot="error"
            {...props}
            className={cx(
                "text-paragraph-xs text-state-error-base inline-flex items-start gap-1 data-[disabled]:opacity-50",
                className,
            )}
        >
            <ErrorWarningFillIcon className="size-4" />
            <span>{typeof children === "string" ? children : children?.toString?.()}</span>
        </Headless.Description>
    );
}
