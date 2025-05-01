import { Slot, Tabs as TabsPrimitives } from "radix-ui";
import { composeRefs } from "radix-ui/internal";
import * as React from "react";

import { useTabObserver } from "#/hooks/use-tab-observer.ts";
import { cn } from "#/utils/cn.ts";
import { type PolymorphicComponentProps } from "#/utils/polymorphic.ts";

const TabMenuHorizontalContent = TabsPrimitives.Content;
TabMenuHorizontalContent.displayName = "TabMenuHorizontalContent";

function TabMenuHorizontalRoot({
    className,
    ...rest
}: Omit<React.ComponentPropsWithoutRef<typeof TabsPrimitives.Root>, "orientation">) {
    return <TabsPrimitives.Root className={cn("w-full", className)} orientation="horizontal" {...rest} />;
}

function TabMenuHorizontalList({
    children,
    className,
    wrapperClassName,
    ...rest
}: React.CustomComponentPropsWithRef<typeof TabsPrimitives.List> & {
    wrapperClassName?: string;
}) {
    const [lineStyle, setLineStyle] = React.useState({ width: 0, left: 0 });
    const listWrapperRef = React.useRef<HTMLDivElement>(null);

    const { mounted, listRef } = useTabObserver({
        onActiveTabChange: (_, activeTab) => {
            const { offsetWidth: width, offsetLeft: left } = activeTab;
            setLineStyle({ width, left });

            const listWrapper = listWrapperRef.current;
            if (listWrapper) {
                const containerWidth = listWrapper.clientWidth;
                const scrollPosition = left - containerWidth / 2 + width / 2;

                listWrapper.scrollTo({
                    left: scrollPosition,
                    behavior: "smooth",
                });
            }
        },
    });

    return (
        <div
            className={cn("relative grid overflow-x-auto overflow-y-hidden overscroll-contain", wrapperClassName)}
            ref={listWrapperRef}
        >
            <TabsPrimitives.List
                className={cn(
                    "group/tab-list relative flex h-12 min-w-auto items-center gap-6 border-y border-(--stroke-soft-200) whitespace-nowrap",
                    className,
                )}
                ref={composeRefs(rest.ref, listRef)}
                {...rest}
            >
                <Slot.Slottable>{children}</Slot.Slottable>

                {/* Floating Bg */}
                <div
                    aria-hidden="true"
                    className={cn(
                        "absolute -bottom-px left-0 h-0.5 bg-primary opacity-0 transition-all duration-300 group-has-[[data-state=active]]/tab-list:opacity-100",
                        {
                            hidden: !mounted,
                        },
                    )}
                    style={{
                        transform: `translate3d(${lineStyle.left}px, 0, 0)`,
                        width: `${lineStyle.width}px`,
                        transitionTimingFunction: "cubic-bezier(0.65, 0, 0.35, 1)",
                    }}
                />
            </TabsPrimitives.List>
        </div>
    );
}

function TabMenuHorizontalTrigger({
    className,
    ...rest
}: React.ComponentPropsWithoutRef<typeof TabsPrimitives.Trigger>) {
    return (
        <TabsPrimitives.Trigger
            className={cn(
                // base
                "group/tab-item h-12 py-3.5 text-label-sm text-(--text-sub-600) outline-none",
                "flex items-center justify-center gap-1.5",
                "transition duration-200 ease-out",
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

function TabMenuHorizontalIcon<T extends React.ElementType>({ className, as, ...rest }: PolymorphicComponentProps<T>) {
    const Component = as || "div";

    return (
        <Component
            className={cn(
                // base
                "size-5 text-(--text-sub-600)",
                "transition duration-200 ease-out",
                // active
                "group-data-[state=active]/tab-item:text-primary",
                className,
            )}
            {...rest}
        />
    );
}
TabMenuHorizontalIcon.displayName = "TabsHorizontalIcon";

function TabMenuHorizontalArrowIcon<T extends React.ElementType>({
    className,
    as,
    ...rest
}: PolymorphicComponentProps<T, React.HTMLAttributes<HTMLDivElement>>) {
    const Component = as || "div";

    return <Component className={cn("size-5 text-(--text-sub-600)", className)} {...rest} />;
}
TabMenuHorizontalArrowIcon.displayName = "TabsHorizontalArrow";

export {
    TabMenuHorizontalRoot as Root,
    TabMenuHorizontalList as List,
    TabMenuHorizontalTrigger as Trigger,
    TabMenuHorizontalIcon as Icon,
    TabMenuHorizontalArrowIcon as ArrowIcon,
    TabMenuHorizontalContent as Content,
};
