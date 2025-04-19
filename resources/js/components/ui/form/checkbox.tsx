import * as React from "react";

import * as CheckboxPrimitive from "../checkbox.tsx";
import * as Hint from "../hint.tsx";
import * as Label from "../label.tsx";

type CheckboxProps = React.CustomComponentPropsWithRef<typeof CheckboxPrimitive.Root> & {
    $error?: boolean;
    label?: React.ReactNode;
    hint?: React.ReactNode;
};

export function Checkbox({ $error, label, hint, ...props }: CheckboxProps) {
    const generatedId = React.useId();
    const id = props.id || generatedId;

    return (
        <div className="flex items-start gap-2">
            <CheckboxPrimitive.Root
                aria-describedby={[$error && `${id}-error`, `${id}-description`].filter(Boolean).join(" ")}
                aria-invalid={$error ? true : undefined}
                id={id}
                {...props}
            />

            {label ? (
                <div className="flex flex-col gap-1">
                    <Label.Root
                        className="flex-wrap text-paragraph-sm text-balance"
                        disabled={props.disabled}
                        htmlFor={id}
                    >
                        {label}
                    </Label.Root>

                    {hint ? (
                        <Hint.Root
                            $disabled={props.disabled}
                            $error={$error}
                            id={[$error && `${id}-error`, `${id}-description`].filter(Boolean).join(" ")}
                        >
                            <Hint.Icon $disabled={props.disabled} $error={$error} />
                            {hint}
                        </Hint.Root>
                    ) : null}
                </div>
            ) : null}
        </div>
    );
}
