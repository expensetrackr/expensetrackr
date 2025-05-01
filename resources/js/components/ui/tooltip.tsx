import { Tooltip as TooltipPrimitives } from "radix-ui";
import * as React from "react";

import { tv, type VariantProps } from "#/utils/tv.ts";

const TooltipProvider = TooltipPrimitives.Provider;
const TooltipRoot = TooltipPrimitives.Root;
const TooltipTrigger = TooltipPrimitives.Trigger;

export const tooltipVariants = tv({
    slots: {
        content: [
            "shadow-tooltip z-50",
            "animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        ],
        arrow: "-translate-y-1/2 -rotate-45 border [clip-path:polygon(0_100%,0_0,100%_100%)]",
    },
    variants: {
        $size: {
            xs: {
                content: "rounded-4 px-1.5 py-0.5 text-paragraph-xs",
                arrow: "rounded-bl-[2px]",
            },
            sm: {
                content: "rounded-6 px-2.5 py-1 text-paragraph-sm",
                arrow: "rounded-bl-[3px]",
            },
            md: {
                content: "rounded-8 p-3 text-label-sm",
                arrow: "rounded-bl-[2px]",
            },
        },
        $variant: {
            dark: {
                content: "bg-(--bg-strong-950) text-(--text-white-0)",
                arrow: "border-(--stroke-strong-950) bg-(--bg-strong-950)",
            },
            light: {
                content: "bg-(--bg-white-0) text-(--text-strong-950) ring-1 ring-(--stroke-soft-200)",
                arrow: "border-(--stroke-soft-200) bg-(--bg-white-0)",
            },
        },
    },
    compoundVariants: [
        {
            $size: "xs",
            $variant: "dark",
            class: {
                arrow: "size-1.5",
            },
        },
        {
            $size: "xs",
            $variant: "light",
            class: {
                arrow: "size-2",
            },
        },
        {
            $size: ["sm", "md"],
            $variant: "dark",
            class: {
                arrow: "size-2",
            },
        },
        {
            $size: ["sm", "md"],
            $variant: "light",
            class: {
                arrow: "size-2.5",
            },
        },
    ],
    defaultVariants: {
        $size: "sm",
        $variant: "dark",
    },
});

function TooltipContent({
    $size,
    $variant,
    className,
    children,
    sideOffset = 4,
    ...rest
}: React.CustomComponentPropsWithRef<typeof TooltipPrimitives.Content> & VariantProps<typeof tooltipVariants>) {
    const { content, arrow } = tooltipVariants({
        $size,
        $variant,
    });

    return (
        <TooltipPrimitives.Portal>
            <TooltipPrimitives.Content className={content({ class: className })} sideOffset={sideOffset} {...rest}>
                {children}
                <TooltipPrimitives.Arrow asChild>
                    <div className={arrow()} />
                </TooltipPrimitives.Arrow>
            </TooltipPrimitives.Content>
        </TooltipPrimitives.Portal>
    );
}
TooltipContent.displayName = TooltipPrimitives.Content.displayName;

export { TooltipProvider as Provider, TooltipRoot as Root, TooltipTrigger as Trigger, TooltipContent as Content };
