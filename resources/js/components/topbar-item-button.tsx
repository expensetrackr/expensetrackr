import { Slot, Slottable } from "@radix-ui/react-slot";
import * as React from "react";

import { cnMerge } from "#/utils/cn.ts";
import { type PolymorphicComponentProps } from "#/utils/polymorphic.ts";

type TopbarItemButtonProps = {
    hasNotification?: boolean;
    asChild?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

function TopbarItemButton({ children, asChild, hasNotification, className, ...rest }: TopbarItemButtonProps) {
    const Component = asChild ? Slot : "button";

    return (
        <Component
            className={cnMerge(
                // base
                "transition-default relative flex size-10 shrink-0 items-center justify-center rounded-10 text-(--text-sub-600)",
                // hover
                "hover:bg-(--bg-weak-50)",
                // open
                "data-[state=open]:bg-(--bg-weak-50) data-[state=open]:text-primary",
                className,
            )}
            {...rest}
        >
            <Slottable>{children}</Slottable>
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

    return <Component className="size-5" {...rest} />;
}

export { TopbarItemButton as Root, TopbarItemButtonIcon as Icon };
