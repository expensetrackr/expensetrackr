import * as React from "react";

import { Input, type InputProps } from "../composables/input.tsx";
import * as Hint from "../ui/hint.tsx";
import * as Label from "../ui/label.tsx";

type TextFieldProps = Omit<InputProps, "error"> & {
    error?: string | Array<string>;
    label?: string;
    hint?: string | Array<string>;
};

export function TextField({
    $size,
    error,
    label,
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
        <div className="flex flex-col gap-1">
            {label ? (
                <Label.Root disabled={rest.disabled} htmlFor={id}>
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
                    aria-describedby={error ? `${id}-error` : `${id}-description`}
                >
                    <Hint.Icon />
                    {error || hint}
                </Hint.Root>
            ) : null}
        </div>
    );
}
TextField.displayName = "TextField";
