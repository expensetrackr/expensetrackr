import { composeRefs } from "@radix-ui/react-compose-refs";
import { Slottable } from "@radix-ui/react-slot";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as React from "react";

import { useTabObserver } from "#/hooks/use-tab-observer.ts";
import { cn, cnMerge } from "#/utils/cn.ts";

const SegmentedControlRoot = TabsPrimitive.Root;
SegmentedControlRoot.displayName = "SegmentedControlRoot";

function SegmentedControlList({
    floatingBgClassName,
    children,
    className,
    ...props
}: React.CustomComponentPropsWithRef<typeof TabsPrimitive.List> & {
    floatingBgClassName?: string;
}) {
    const [lineStyle, setLineStyle] = React.useState({ width: 0, left: 0 });

    const { mounted, listRef } = useTabObserver({
        onActiveTabChange: (_, activeTab) => {
            const { offsetWidth: width, offsetLeft: left } = activeTab;
            setLineStyle({ width, left });
        },
    });

    return (
        <TabsPrimitive.List
            className={cnMerge(
                "relative isolate grid w-full auto-cols-fr grid-flow-col gap-1 rounded-10 bg-(--bg-weak-50) p-1",
                className,
            )}
            {...props}
            ref={composeRefs(props.ref, listRef)}
        >
            <Slottable>{children}</Slottable>

            {/* floating bg */}
            <div
                aria-hidden="true"
                className={cn(
                    "absolute inset-y-1 left-0 -z-10 rounded-6 bg-(--bg-white-0) shadow-toggle-switch transition-transform duration-300",
                    {
                        hidden: !mounted,
                    },
                    floatingBgClassName,
                )}
                style={{
                    transform: `translate3d(${lineStyle.left}px, 0, 0)`,
                    width: `${lineStyle.width}px`,
                    transitionTimingFunction: "cubic-bezier(0.65, 0, 0.35, 1)",
                }}
            />
        </TabsPrimitive.List>
    );
}
SegmentedControlList.displayName = "SegmentedControlList";

function SegmentedControlTrigger({ className, ...rest }: React.ComponentPropsWithRef<typeof TabsPrimitive.Trigger>) {
    return (
        <TabsPrimitive.Trigger
            className={cnMerge(
                // base
                "peer",
                "rounded-md relative z-10 h-7 px-1 text-label-sm whitespace-nowrap text-(--text-soft-400) outline-none",
                "flex items-center justify-center gap-1.5",
                "transition duration-300 ease-out",
                // focus
                "focus:outline-none",
                // active
                "data-[state=active]:text-(--text-strong-950)",
                className,
            )}
            {...rest}
        />
    );
}
SegmentedControlTrigger.displayName = "SegmentedControlTrigger";

const SegmentedControlContent = TabsPrimitive.Content;
SegmentedControlContent.displayName = "SegmentedControlContent";

export {
    SegmentedControlRoot as Root,
    SegmentedControlList as List,
    SegmentedControlTrigger as Trigger,
    SegmentedControlContent as Content,
};
