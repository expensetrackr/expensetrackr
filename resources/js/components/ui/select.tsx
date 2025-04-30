import * as ScrollAreaPrimitives from "@radix-ui/react-scroll-area";
import * as SelectPrimitives from "@radix-ui/react-select";
import { Slottable } from "@radix-ui/react-slot";
import * as React from "react";
import ArrowDown01Icon from "virtual:icons/hugeicons/arrow-down-01";
import Tick01Icon from "virtual:icons/hugeicons/tick-01";

import { cn } from "#/utils/cn.ts";
import { type PolymorphicComponentProps } from "#/utils/polymorphic.ts";
import { tv, type VariantProps } from "#/utils/tv.ts";

export const selectVariants = tv({
    slots: {
        triggerRoot: [
            // base
            "group/trigger min-w-0 shrink-0 bg-(--bg-white-0) shadow-xs ring-1 ring-(--stroke-soft-200) outline-none ring-inset",
            "text-paragraph-sm text-(--text-strong-950)",
            "flex items-center text-left",
            "transition duration-200 ease-out",
            // hover
            "hover:bg-(--bg-weak-50) hover:ring-transparent",
            // focus
            "focus:shadow-button-important-focus focus:ring-(--stroke-strong-950) focus:outline-none",
            "focus:text-(--text-strong-950) data-[placeholder]:focus:text-(--text-strong-950)",
            // disabled
            "disabled:pointer-events-none disabled:bg-(--bg-weak-50) disabled:text-(--text-disabled-300) disabled:shadow-none disabled:ring-transparent data-[placeholder]:disabled:text-(--text-disabled-300)",
            // placeholder state
            "data-[placeholder]:text-(--text-sub-600)",
        ],
        triggerArrow: [
            // base
            "ml-auto size-4 shrink-0",
            "transition duration-200 ease-out",
            // placeholder state
            "group-data-[placeholder]/trigger:text-(--text-soft-400)",
            // filled state
            "text-(--text-sub-600)",
            // hover
            "group-hover/trigger:text-(--text-sub-600) group-data-[placeholder]/trigger:group-hover:text-(--text-sub-600)",
            // focus
            "group-focus/trigger:text-(--text-strong-950) group-data-[placeholder]/trigger:group-focus/trigger:text-(--text-strong-950)",
            // disabled
            "group-disabled/trigger:text-(--text-disabled-300) group-data-[placeholder]/trigger:group-disabled/trigger:text-(--text-disabled-300)",
            // open
            "group-data-[state=open]/trigger:rotate-180",
        ],
        triggerIcon: [
            // base
            "h-5 w-auto min-w-0 shrink-0 object-contain text-(--text-sub-600)",
            "transition duration-200 ease-out",
            // placeholder state
            "group-data-[placeholder]/trigger:text-(--text-soft-400)",
            // hover
            "group-hover/trigger:text-(--text-sub-600) group-data-[placeholder]/trigger:group-hover:text-(--text-sub-600)",
            // disabled
            "group-disabled/trigger:text-(--text-disabled-300) group-data-[placeholder]/trigger:group-disabled/trigger:text-(--text-disabled-300)",
            "group-disabled/trigger:[&:not(.remixicon)]:opacity-[.48]",
        ],
        selectItemIcon: [
            "size-5 shrink-0 bg-[length:1.25rem] text-(--text-sub-600)",
            // 'group-has-[&]-ml-0.5',
            // disabled
            "[[data-disabled]_&]:text-(--text-disabled-300) [[data-disabled]_&:not(.remixicon)]:opacity-[.48]",
        ],
    },
    variants: {
        $size: {
            xs: {},
            sm: {},
            md: {},
        },
        $variant: {
            default: {
                triggerRoot: "w-full",
            },
            compact: {
                triggerRoot: "w-auto",
            },
            compactForInput: {
                triggerRoot: [
                    // base
                    "w-auto rounded-none shadow-none ring-0",
                    // focus
                    "focus:bg-(--bg-weak-50) focus:shadow-none focus:ring-0 focus:ring-transparent",
                ],
            },
            inline: {
                triggerRoot: [
                    // base
                    "h-5 min-h-5 w-auto gap-0 rounded-none bg-transparent p-0 text-(--text-sub-600) shadow-none ring-0",
                    // hover
                    "hover:bg-transparent hover:text-(--text-strong-950)",
                    // focus
                    "focus:shadow-none",
                    // open
                    "data-[state=open]:text-(--text-strong-950)",
                ],
                triggerIcon: [
                    // base
                    "mr-1.5 text-(--text-soft-400)",
                    // hover
                    "group-hover/trigger:text-(--text-sub-600)",
                    // open
                    "group-data-[state=open]/trigger:text-(--text-sub-600)",
                ],
                triggerArrow: [
                    // base
                    "ml-0.5",
                    // hover
                    "group-hover/trigger:text-(--text-strong-950)",
                    // open
                    "group-data-[state=open]/trigger:text-(--text-strong-950)",
                ],
                selectItemIcon: "text-(--text-soft-400) group-hover/trigger:text-(--text-sub-600)",
            },
        },
        $error: {
            true: {
                triggerRoot: [
                    // base
                    "ring-state-error-base",
                    // focus
                    "focus:shadow-button-error-focus focus:ring-state-error-base",
                ],
            },
        },
    },
    compoundVariants: [
        //#region default
        {
            $size: "md",
            $variant: "default",
            class: {
                triggerRoot: "h-10 min-h-10 gap-2 rounded-10 pr-2.5 pl-3",
            },
        },
        {
            $size: "sm",
            $variant: "default",
            class: {
                triggerRoot: "h-9 min-h-9 gap-2 rounded-8 pr-2 pl-2.5",
            },
        },
        {
            $size: "xs",
            $variant: "default",
            class: {
                triggerRoot: "h-8 min-h-8 gap-1.5 rounded-8 pr-1.5 pl-2",
            },
        },
        //#endregion

        //#region compact
        {
            $size: "md",
            $variant: "compact",
            class: {
                triggerRoot: "h-10 gap-1 rounded-10 pr-2.5 pl-3",
                triggerIcon: "-ml-0.5",
                selectItemIcon: "group-has-[&]/trigger:-ml-0.5",
            },
        },
        {
            $size: "sm",
            $variant: "compact",
            class: {
                triggerRoot: "h-9 gap-1 rounded-8 pr-2 pl-3",
                triggerIcon: "-ml-0.5",
                selectItemIcon: "group-has-[&]/trigger:-ml-0.5",
            },
        },
        {
            $size: "xs",
            $variant: "compact",
            class: {
                triggerRoot: "h-8 gap-0.5 rounded-8 pr-1.5 pl-2.5",
                triggerIcon: "-ml-0.5 size-4",
                selectItemIcon: "size-4 bg-[length:1rem] group-has-[&]/trigger:-ml-0.5",
            },
        },
        //#endregion

        //#region compactForInput
        {
            $size: "md",
            $variant: "compactForInput",
            class: {
                triggerRoot: "pr-2 pl-2.5",
                triggerIcon: "mr-2",
                triggerArrow: "ml-1",
            },
        },
        {
            $size: "sm",
            $variant: "compactForInput",
            class: {
                triggerRoot: "px-2",
                triggerIcon: "mr-2",
                triggerArrow: "ml-0.5",
            },
        },
        {
            $size: "xs",
            $variant: "compactForInput",
            class: {
                triggerRoot: "pr-1.5 pl-2",
                triggerIcon: "mr-1.5 size-4",
                triggerArrow: "ml-1",
                selectItemIcon: "size-4 bg-[length:1rem]",
            },
        },
        //#endregion
    ],
    defaultVariants: {
        $variant: "default",
        $size: "md",
    },
});

type SelectContextType = Pick<VariantProps<typeof selectVariants>, "$variant" | "$size" | "$error">;

const SelectContext = React.createContext<SelectContextType>({
    $size: "md",
    $variant: "default",
    $error: false,
});

const useSelectContext = () => React.useContext(SelectContext);

const SelectRoot = ({
    $size = "md",
    $variant = "default",
    $error = false,
    ...rest
}: React.CustomComponentPropsWithRef<typeof SelectPrimitives.Root> & SelectContextType) => {
    return (
        <SelectContext.Provider value={{ $size, $variant, $error }}>
            <SelectPrimitives.Root {...rest} />
        </SelectContext.Provider>
    );
};
SelectRoot.displayName = "SelectRoot";

const SelectGroup = SelectPrimitives.Group;
SelectGroup.displayName = "SelectGroup";

const SelectValue = SelectPrimitives.Value;
SelectValue.displayName = "SelectValue";

const SelectSeparator = SelectPrimitives.Separator;
SelectSeparator.displayName = "SelectSeparator";

const SelectGroupLabel = SelectPrimitives.Label;
SelectGroupLabel.displayName = "SelectGroupLabel";

const SELECT_TRIGGER_ICON_NAME = "SelectTriggerIcon";

function SelectTrigger({
    className,
    children,
    ...rest
}: React.CustomComponentPropsWithRef<typeof SelectPrimitives.Trigger>) {
    const { $size, $variant, $error } = useSelectContext();

    const { triggerRoot, triggerArrow } = selectVariants({
        $size,
        $variant,
        $error,
    });

    return (
        <SelectPrimitives.Trigger className={triggerRoot({ class: className })} {...rest}>
            <Slottable>{children}</Slottable>
            <SelectPrimitives.Icon asChild>
                <ArrowDown01Icon className={triggerArrow()} />
            </SelectPrimitives.Icon>
        </SelectPrimitives.Trigger>
    );
}

function TriggerIcon<T extends React.ElementType = "div">({ as, className, ...rest }: PolymorphicComponentProps<T>) {
    const Component = as || "div";

    const { $size, $variant, $error } = useSelectContext();
    const { triggerIcon } = selectVariants({ $size, $variant, $error });

    return <Component className={triggerIcon({ class: className })} {...rest} />;
}
TriggerIcon.displayName = SELECT_TRIGGER_ICON_NAME;

function SelectContent({
    className,
    position = "popper",
    children,
    sideOffset = 8,
    collisionPadding = 8,
    ...rest
}: React.CustomComponentPropsWithRef<typeof SelectPrimitives.Content>) {
    return (
        <SelectPrimitives.Portal>
            <SelectPrimitives.Content
                className={cn(
                    // base
                    "relative z-50 overflow-hidden rounded-16 bg-(--bg-white-0) shadow-md ring-1 ring-(--stroke-soft-200) ring-inset",
                    // widths
                    "max-w-[max(var(--radix-select-trigger-width),320px)] min-w-(--radix-select-trigger-width)",
                    // heights
                    "max-h-(--radix-select-content-available-height)",
                    // animation
                    position === "popper" && "data-[state=open]:animate-in data-[state=open]:fade-in-0",
                    position === "popper" && "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
                    position === "popper" && "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                    position === "popper" &&
                        "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
                    className,
                )}
                collisionPadding={collisionPadding}
                position={position}
                sideOffset={sideOffset}
                {...rest}
            >
                <ScrollAreaPrimitives.Root type="auto">
                    <SelectPrimitives.Viewport asChild>
                        <ScrollAreaPrimitives.Viewport
                            className="max-h-[196px] w-full scroll-py-2 overflow-auto p-2"
                            style={{ overflowY: undefined }}
                        >
                            {children}
                        </ScrollAreaPrimitives.Viewport>
                    </SelectPrimitives.Viewport>
                    <ScrollAreaPrimitives.Scrollbar orientation="vertical">
                        <ScrollAreaPrimitives.Thumb className="!w-1 rounded-4 bg-(--bg-soft-200)" />
                    </ScrollAreaPrimitives.Scrollbar>
                </ScrollAreaPrimitives.Root>
            </SelectPrimitives.Content>
        </SelectPrimitives.Portal>
    );
}

function SelectItem({ className, children, ...rest }: React.ComponentProps<typeof SelectPrimitives.Item>) {
    const { $size } = useSelectContext();

    return (
        <SelectPrimitives.Item
            className={cn(
                // base
                "group relative cursor-pointer rounded-8 p-2 pr-9 text-paragraph-sm text-(--text-strong-950) select-none",
                "flex items-center gap-2 transition duration-200 ease-out",
                // disabled
                "data-[disabled]:pointer-events-none data-[disabled]:text-(--text-disabled-300)",
                // hover, focus
                "data-[highlighted]:bg-(--bg-weak-50) data-[highlighted]:outline-0",
                $size === "xs" && "gap-1.5 pr-[34px]",
                className,
            )}
            {...rest}
        >
            <SelectPrimitives.ItemText asChild>
                <span
                    className={cn(
                        // base
                        "flex flex-1 items-center gap-2",
                        // disabled
                        "group-disabled:text-(--text-disabled-300)",
                        $size === "xs" && "gap-1.5",
                    )}
                >
                    {typeof children === "string" ? <span className="line-clamp-1">{children}</span> : children}
                </span>
            </SelectPrimitives.ItemText>
            <SelectPrimitives.ItemIndicator asChild>
                <Tick01Icon className="absolute top-1/2 right-2 size-5 shrink-0 -translate-y-1/2 text-(--text-sub-600)" />
            </SelectPrimitives.ItemIndicator>
        </SelectPrimitives.Item>
    );
}

function SelectItemIcon<T extends React.ElementType>({ as, className, ...rest }: PolymorphicComponentProps<T>) {
    const { $size, $variant } = useSelectContext();
    const { selectItemIcon } = selectVariants({ $size, $variant });

    const Component = as || "div";

    return <Component className={selectItemIcon({ class: className })} {...rest} />;
}

export {
    SelectRoot as Root,
    SelectContent as Content,
    SelectGroup as Group,
    SelectGroupLabel as GroupLabel,
    SelectItem as Item,
    SelectItemIcon as ItemIcon,
    SelectSeparator as Separator,
    SelectTrigger as Trigger,
    TriggerIcon,
    SelectValue as Value,
};
