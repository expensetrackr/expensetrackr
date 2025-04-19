import * as React from "react";

import { cn } from "#/utils/cn.ts";
import * as Hint from "../hint.tsx";
import * as Input from "../input.tsx";
import * as Label from "../label.tsx";

type TextFieldProps = React.CustomComponentPropsWithRef<typeof Input.Input> &
    Pick<React.CustomComponentPropsWithRef<typeof Input.Root>, "$error" | "$size"> & {
        wrapperClassName?: string;
        label?: string;
        hiddenLabel?: boolean;
        labelClassName?: string;
        hint?: string | Array<string> | Array<undefined>;
        error?: string | Array<string>;
        leadingIcon?: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
        trailingIcon?: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
        leadingNode?: React.ReactNode;
        trailingNode?: React.ReactNode;
        inlineLeadingNode?: React.ReactNode;
        inlineTrailingNode?: React.ReactNode;
    };

export function TextField({
    wrapperClassName,
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
        <div className={cn("flex flex-col gap-1", wrapperClassName)}>
            {label ? (
                <Label.Root
                    className={cn({ "sr-only": hiddenLabel }, labelClassName)}
                    disabled={rest.disabled}
                    htmlFor={id}
                >
                    {label}
                </Label.Root>
            ) : null}

            <Input.Root $error={!!error} $size={$size}>
                {leadingNode}
                <Input.Wrapper>
                    {inlineLeadingNode}
                    {LeadingIcon && <Input.Icon as={LeadingIcon} />}
                    <Input.Input
                        aria-describedby={[error && `${id}-error`, `${id}-description`].filter(Boolean).join(" ")}
                        aria-invalid={error ? true : undefined}
                        id={id}
                        type="text"
                        {...rest}
                    />
                    {TrailingIcon && <Input.Icon as={TrailingIcon} />}
                    {inlineTrailingNode}
                </Input.Wrapper>
                {trailingNode}
            </Input.Root>

            {error || hint ? (
                <Hint.Root
                    $disabled={rest.disabled}
                    $error={!!error}
                    id={[error && `${id}-error`, `${id}-description`].filter(Boolean).join(" ")}
                >
                    <Hint.Icon />
                    {error || hint}
                </Hint.Root>
            ) : null}
        </div>
    );
}
TextField.displayName = "TextField";
