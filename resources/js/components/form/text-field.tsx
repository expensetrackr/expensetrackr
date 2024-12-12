import * as React from "react";

import * as Hint from "../ui/hint.tsx";
import * as InputPrimitives from "../ui/input-primitives.tsx";
import { type InputProps } from "../ui/input.tsx";
import * as Label from "../ui/label.tsx";

type TextFieldProps = InputProps & {
    label?: string;
    hint?: string;
};

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
    (
        {
            $size,
            $error,
            label,
            leadingIcon: LeadingIcon,
            trailingIcon: TrailingIcon,
            leadingNode,
            trailingNode,
            inlineLeadingNode,
            inlineTrailingNode,
            hint,
            ...rest
        },
        forwardedRef,
    ) => {
        const generatedId = React.useId();
        const id = rest.id || generatedId;

        return (
            <div className="flex flex-col gap-1">
                {label ? (
                    <Label.Root disabled={rest.disabled} htmlFor={id}>
                        {label}
                    </Label.Root>
                ) : null}

                <InputPrimitives.Root $error={$error} $size={$size}>
                    {leadingNode}
                    <InputPrimitives.Wrapper>
                        {inlineLeadingNode}
                        {LeadingIcon && <InputPrimitives.Icon as={LeadingIcon} />}
                        <InputPrimitives.Input
                            aria-describedby={[$error && `${id}-error`, `${id}-description`].filter(Boolean).join(" ")}
                            aria-invalid={$error ? true : undefined}
                            id={id}
                            ref={forwardedRef}
                            type="text"
                            {...rest}
                        />
                        {TrailingIcon && <InputPrimitives.Icon as={TrailingIcon} />}
                        {inlineTrailingNode}
                    </InputPrimitives.Wrapper>
                    {trailingNode}
                </InputPrimitives.Root>

                {hint ? (
                    <Hint.Root
                        $disabled={rest.disabled}
                        $error={$error}
                        aria-describedby={$error ? `${id}-error` : `${id}-description`}
                    >
                        <Hint.Icon />
                        {hint}
                    </Hint.Root>
                ) : null}
            </div>
        );
    },
);
TextField.displayName = "TextField";
