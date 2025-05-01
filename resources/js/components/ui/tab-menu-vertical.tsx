import { Tabs as TabsPrimitives } from "radix-ui";
import * as React from "react";

import { cn } from "#/utils/cn.ts";
import { type PolymorphicComponentProps } from "#/utils/polymorphic.ts";

const TabMenuVerticalContent = TabsPrimitives.Content;
TabMenuVerticalContent.displayName = "TabMenuVerticalContent";

type TabMenuVerticalRootProps = Omit<React.CustomComponentPropsWithRef<typeof TabsPrimitives.Root>, "orientation">;

function TabMenuVerticalRoot({ ...rest }: TabMenuVerticalRootProps) {
    return <TabsPrimitives.Root orientation="vertical" {...rest} />;
}

function TabMenuVerticalList({ className, ...rest }: React.CustomComponentPropsWithRef<typeof TabsPrimitives.List>) {
    return <TabsPrimitives.List className={cn("w-full space-y-2", className)} {...rest} />;
}

function TabMenuVerticalTrigger({ className, ...rest }: React.ComponentPropsWithoutRef<typeof TabsPrimitives.Trigger>) {
    return (
        <TabsPrimitives.Trigger
            className={cn(
                // base
                "group/tab-item w-full rounded-8 p-2 text-left text-label-sm text-(--text-sub-600) outline-none",
                "grid auto-cols-auto grid-flow-col grid-cols-[auto_minmax(0,1fr)] items-center gap-1.5",
                "transition duration-200 ease-out",
                // hover
                "hover:bg-(--bg-weak-50)",
                // focus
                "focus:outline-none",
                // active
                "data-[state=active]:bg-(--bg-weak-50) data-[state=active]:text-(--text-strong-950)",
                className,
            )}
            {...rest}
        />
    );
}

function TabMenuVerticalIcon<T extends React.ElementType>({ className, as, ...rest }: PolymorphicComponentProps<T>) {
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
TabMenuVerticalIcon.displayName = "TabsVerticalIcon";

function TabMenuVerticalArrowIcon<T extends React.ElementType>({
    className,
    as,
    ...rest
}: PolymorphicComponentProps<T>) {
    const Component = as || "div";

    return (
        <Component
            className={cn(
                // base
                "size-5 p-px text-(--text-sub-600)",
                "rounded-full bg-(--bg-white-0) opacity-0 shadow-xs",
                "scale-75 transition ease-out",
                // active
                "group-data-[state=active]/tab-item:scale-100 group-data-[state=active]/tab-item:opacity-100",
                className,
            )}
            {...rest}
        />
    );
}
TabMenuVerticalArrowIcon.displayName = "TabMenuVerticalArrowIcon";

export {
    TabMenuVerticalRoot as Root,
    TabMenuVerticalList as List,
    TabMenuVerticalTrigger as Trigger,
    TabMenuVerticalIcon as Icon,
    TabMenuVerticalArrowIcon as ArrowIcon,
    TabMenuVerticalContent as Content,
};
