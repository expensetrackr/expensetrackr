import * as React from "react";

import { cn, cnMerge } from "#/utils/cn.ts";
import { Input, type InputProps } from "../composables/input.tsx";
import * as Hint from "../ui/hint.tsx";
import * as Label from "../ui/label.tsx";

type TextFieldProps = Omit<InputProps, "error"> & {
    wrapperClassName?: string;
    label?: string;
    hiddenLabel?: boolean;
    labelClassName?: string;
    hint?: string | Array<string> | Array<undefined>;
    error?: string | Array<string>;
};

export function TextField({
    wrapperClassName,
    $error,
    $size,
    error,
    label,
    hiddenLabel,
    labelClassName,
    leadingIcon: LeadingIcon,
    trailingIcon: TrailingIcon,
    leadingNode,
    trailingNode,
    inlineLeadingNode,
    inlineTrailingNode,
    hint,
    ...rest
}: TextFieldProps) {
    const generatedId = React.useId();
    const id = rest.id || generatedId;

    return (
        <div className={cnMerge("flex flex-col gap-1", wrapperClassName)}>
            {label ? (
                <Label.Root
                    className={cn({ "sr-only": hiddenLabel }, labelClassName)}
                    disabled={rest.disabled}
                    htmlFor={id}
                >
                    {label}
                </Label.Root>
            ) : null}

            <Input
                $error={!!error}
                $size={$size}
                aria-describedby={[error && `${id}-error`, `${id}-description`].filter(Boolean).join(" ")}
                aria-invalid={error ? true : undefined}
                id={id}
                inlineLeadingNode={inlineLeadingNode}
                inlineTrailingNode={inlineTrailingNode}
                leadingIcon={LeadingIcon}
                leadingNode={leadingNode}
                trailingIcon={TrailingIcon}
                trailingNode={trailingNode}
                {...rest}
            />

            {error || hint ? (
                <Hint.Root
                    $disabled={rest.disabled}
                    $error={!!error}
                    aria-describedby={[$error && `${id}-error`, `${id}-description`].filter(Boolean).join(" ")}
                >
                    <Hint.Icon />
                    {error || hint}
                </Hint.Root>
            ) : null}
        </div>
    );
}
TextField.displayName = "TextField";
