import * as React from "react";

import * as Hint from "../ui/hint.tsx";
import * as Label from "../ui/label.tsx";
import * as TextareaPrimitive from "../ui/textarea.tsx";

type TextareaProps = TextareaPrimitive.TextareaProps & {
    label?: React.ReactNode;
    hint?: string | Array<string>;
    charCounterCurrent?: number;
    charCounterMax?: number;
};

export function Textarea({ $error, label, charCounterCurrent, charCounterMax, hint, ...rest }: TextareaProps) {
    const generatedId = React.useId();
    const id = rest.id || generatedId;

    return (
        <div className="flex flex-col gap-1">
            {label ? (
                <Label.Root disabled={rest.disabled} htmlFor={id}>
                    {label}
                </Label.Root>
            ) : null}

            <TextareaPrimitive.Root
                $error={$error}
                aria-describedby={[$error && `${id}-error`, `${id}-description`].filter(Boolean).join(" ")}
                aria-invalid={$error ? true : undefined}
                id={id}
                {...rest}
            />

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
}
