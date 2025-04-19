import * as React from "react";

import { cn } from "#/utils/cn.ts";
import * as Hint from "../hint.tsx";
import * as Label from "../label.tsx";

type FieldProps = {
    label?: React.ReactNode;
    hiddenLabel?: boolean;
    hint?: string | Array<string>;
    id?: string;
    className?: string;
    disabled?: boolean;
    error?: string | Array<string>;
    children: React.ReactNode;
};

export function Field({ error, label, hiddenLabel, className, children, hint, ...props }: FieldProps) {
    const generatedId = React.useId();
    const id = props.id || generatedId;

    return (
        <div className={cn("flex flex-col gap-1", className)}>
            {label ? (
                <Label.Root className={cn(hiddenLabel && "sr-only")} disabled={props.disabled} htmlFor={id}>
                    {label}
                </Label.Root>
            ) : null}

            {children}

            {error || hint ? (
                <Hint.Root
                    $disabled={props.disabled}
                    $error={!!error}
                    id={[!!error && `${id}-error`, `${id}-description`].filter(Boolean).join(" ")}
                >
                    <Hint.Icon />
                    {error || hint}
                </Hint.Root>
            ) : null}
        </div>
    );
}
