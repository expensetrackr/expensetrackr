import { Slot } from "radix-ui";
import * as React from "react";

import { cn } from "#/utils/cn.ts";
import { type PolymorphicComponentProps } from "#/utils/polymorphic.ts";

type TopbarItemButtonProps = {
    hasNotification?: boolean;
    asChild?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

function TopbarItemButton({ children, asChild, hasNotification, className, ...rest }: TopbarItemButtonProps) {
    const Component = asChild ? Slot.Root : "button";

    return (
        <Component
            className={cn(
                // base
                "transition-default relative flex size-10 shrink-0 items-center justify-center rounded-10 text-(--text-sub-600) outline-none",
                // hover
                "hover:bg-(--bg-weak-50)",
                // open
                "data-[state=open]:bg-(--bg-weak-50) data-[state=open]:text-primary",
                className,
            )}
            {...rest}
        >
            <Slot.Slottable>{children}</Slot.Slottable>
            {hasNotification && (
                <div className="absolute top-2.5 right-2.5 size-2 rounded-full border-2 border-(--stroke-white-0) bg-state-error-base shadow-xs" />
            )}
        </Component>
    );
}

function TopbarItemButtonIcon<T extends React.ElementType>({
    as,
    className,
    ...rest
}: PolymorphicComponentProps<T, React.HTMLAttributes<HTMLDivElement>>) {
    const Component = as || "div";

    return <Component className={cn("size-5", className)} {...rest} />;
}

export { TopbarItemButton as Root, TopbarItemButtonIcon as Icon };
