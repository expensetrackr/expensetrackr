import * as React from "react";

import { cn, cnMerge } from "#/utils/cn.ts";
import * as Hint from "../ui/hint.tsx";
import * as Label from "../ui/label.tsx";
import * as TextareaPrimitive from "../ui/textarea.tsx";

type TextareaProps = TextareaPrimitive.TextareaRootProps & {
    wrapperClassName?: string;
    label?: React.ReactNode;
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
                    aria-describedby={[!!error && `${id}-error`, `${id}-description`].filter(Boolean).join(" ")}
                >
                    <Hint.Icon />
                    {hint || error}
                </Hint.Root>
            ) : null}
        </div>
    );
}
