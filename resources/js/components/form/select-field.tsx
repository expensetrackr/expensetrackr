import * as React from "react";

import { cn } from "#/utils/cn.ts";
import * as Hint from "../ui/hint.tsx";
import * as Label from "../ui/label.tsx";
import * as SelectPrimitives from "../ui/select.tsx";

type SelectProps = Omit<React.CustomComponentPropsWithRef<typeof SelectPrimitives.Root>, "$error"> & {
    wrapperClassName?: string;
    label?: string;
    labelSub?: string;
    labelClassName?: string;
    id?: string;
    position?: "item-aligned" | "popper";
    triggerIcon?: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
    triggerClassName?: string;
    placeholder?: React.ReactNode;
    options: Array<{
        value: string;
        label: React.ReactNode;
        icon?:
            | React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>
            | React.ComponentType<React.SVGProps<SVGSVGElement>>;
        disabled?: boolean;
    }>;
    hint?: string | Array<string>;
    error?: string | Array<string>;
};

export function SelectField({
    wrapperClassName,
    $size,
    $variant,
    error,
    label,
    labelSub,
    labelClassName,
    id: idProp,
    triggerIcon,
    triggerClassName,
    placeholder,
    position = "popper",
    options,
    hint,
    ...rest
}: SelectProps) {
    const generatedId = React.useId();
    const id = idProp || generatedId;

    return (
        <div className={cn("flex flex-col gap-1", wrapperClassName)}>
            {label ? (
                <Label.Root className={labelClassName} disabled={rest.disabled} htmlFor={id}>
                    {label}
                    {labelSub ? <Label.Sub className="ml-1">{labelSub}</Label.Sub> : null}
                </Label.Root>
            ) : null}

            <SelectPrimitives.Root $error={!!error} $size={$size} $variant={$variant} {...rest}>
                <SelectPrimitives.Trigger className={triggerClassName} id={id}>
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
                    id={[!!error && `${id}-error`, `${id}-description`].filter(Boolean).join(" ")}
                >
                    <Hint.Icon />
                    {error || hint}
                </Hint.Root>
            ) : null}
        </div>
    );
}
