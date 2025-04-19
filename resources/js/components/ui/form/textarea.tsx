import * as React from "react";

import { cn } from "#/utils/cn.ts";
import * as Hint from "../hint.tsx";
import * as Label from "../label.tsx";
import * as TextareaPrimitive from "../textarea.tsx";

type TextareaProps = TextareaPrimitive.TextareaRootProps & {
    wrapperClassName?: string;
    label?: React.ReactNode;
    labelSub?: React.ReactNode;
    hiddenLabel?: boolean;
    labelClassName?: string;
    hint?: string | Array<string>;
    charCounterCurrent?: number;
    charCounterMax?: number;
    error?: string | Array<string>;
};

export function Textarea({
    $error,
    wrapperClassName,
    label,
    labelSub,
    hiddenLabel,
    labelClassName,
    charCounterCurrent,
    charCounterMax,
    hint,
    error,
    ...rest
}: TextareaProps) {
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
                    {labelSub ? <Label.Sub>{labelSub}</Label.Sub> : null}
                </Label.Root>
            ) : null}

            <TextareaPrimitive.Root
                $error={!!error}
                aria-describedby={[!!error && `${id}-error`, `${id}-description`].filter(Boolean).join(" ")}
                aria-invalid={!!error ? true : undefined}
                id={id}
                {...rest}
            />

            {hint || error ? (
                <Hint.Root
                    $disabled={rest.disabled}
                    $error={!!error}
                    id={[!!error && `${id}-error`, `${id}-description`].filter(Boolean).join(" ")}
                >
                    <Hint.Icon />
                    {hint || error}
                </Hint.Root>
            ) : null}
        </div>
    );
}
