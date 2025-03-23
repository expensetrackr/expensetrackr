import * as React from "react";

import { cnMerge } from "#/utils/cn.ts";
import * as Hint from "../ui/hint.tsx";
import * as Label from "../ui/label.tsx";
import * as SelectPrimitives from "../ui/select.tsx";

type SelectProps = Omit<React.CustomComponentPropsWithRef<typeof SelectPrimitives.Root>, "$error"> & {
    wrapperClassName?: string;
    label?: string;
    labelClassName?: string;
    id?: string;
    position?: "item-aligned" | "popper";
    triggerIcon?: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
    placeholder?: React.ReactNode;
    options: Array<{
        value: string;
        label: React.ReactNode;
        icon?: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
        disabled?: boolean;
    }>;
    hint?: string | Array<string>;
    error?: string | Array<string>;
};

export function Select({
    wrapperClassName,
    $size,
    $variant,
    error,
    label,
    labelClassName,
    id: idProp,
    triggerIcon,
    placeholder,
    position = "popper",
    options,
    hint,
    ...rest
}: SelectProps) {
    const generatedId = React.useId();
    const id = idProp || generatedId;

    return (
        <div className={cnMerge("flex flex-col gap-1", wrapperClassName)}>
            {label ? (
                <Label.Root className={labelClassName} disabled={rest.disabled} htmlFor={id}>
                    {label}
                </Label.Root>
            ) : null}

            <SelectPrimitives.Root $error={!!error} $size={$size} $variant={$variant} {...rest}>
                <SelectPrimitives.Trigger id={id}>
                    {triggerIcon ? <SelectPrimitives.TriggerIcon as={triggerIcon} /> : null}
                    <SelectPrimitives.Value placeholder={placeholder} />
                </SelectPrimitives.Trigger>
                <SelectPrimitives.Content position={position}>
                    {options.map((item) => (
                        <SelectPrimitives.Item disabled={item.disabled} key={item.value} value={item.value}>
                            {item.icon ? <SelectPrimitives.ItemIcon as={item.icon} /> : null}
                            {item.label}
                        </SelectPrimitives.Item>
                    ))}
                </SelectPrimitives.Content>
            </SelectPrimitives.Root>

            {error || hint ? (
                <Hint.Root
                    $disabled={rest.disabled}
                    $error={!!error}
                    aria-describedby={[!!error && `${id}-error`, `${id}-description`].filter(Boolean).join(" ")}
                >
                    <Hint.Icon />
                    {error || hint}
                </Hint.Root>
            ) : null}
        </div>
    );
}
