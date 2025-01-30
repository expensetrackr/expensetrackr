import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

import { type PolymorphicComponentProps } from "#/utils/polymorphic.ts";
import { recursiveCloneChildren } from "#/utils/recursive-clone-children.tsx";
import { tv, type VariantProps } from "#/utils/tv.ts";

const FANCY_BUTTON_ROOT_NAME = "FancyButtonRoot";
const FANCY_BUTTON_ICON_NAME = "FancyButtonIcon";

export const fancyButtonVariants = tv({
    slots: {
        root: [
            // base
            "group relative inline-flex items-center justify-center whitespace-nowrap text-label-sm outline-none",
            "transition duration-200 ease-out",
            // focus
            "focus:outline-none",
            // disabled
            "disabled:pointer-events-none disabled:text-(--text-disabled-300)",
            "disabled:bg-(--bg-weak-50) disabled:bg-none disabled:shadow-none disabled:before:hidden disabled:after:hidden",
        ],
        icon: "relative z-10 $size-5 shrink-0",
    },
    variants: {
        $type: {
            neutral: {
                root: "bg-(--bg-strong-950) text-(--text-white-0) shadow-fancy-buttons-neutral",
            },
            primary: {
                root: "bg-primary text-white shadow-fancy-buttons-primary",
            },
            destructive: {
                root: "bg-state-error-base text-white shadow-fancy-buttons-error",
            },
            basic: {
                root: [
                    // base
                    "bg-(--bg-white-0) text-(--text-sub-600) shadow-fancy-buttons-stroke",
                    // hover
                    "hover:bg-(--bg-weak-50) hover:text-(--text-strong-950) hover:shadow-none",
                ],
            },
        },
        $size: {
            xs: {
                root: "h-8 gap-3 rounded-8 px-2.5",
                icon: "-mx-1",
            },
            sm: {
                root: "h-9 gap-3 rounded-8 px-3",
                icon: "-mx-1",
            },
            md: {
                root: "h-10 gap-3 rounded-10 px-3.5",
                icon: "-mx-1",
            },
        },
    },
    compoundVariants: [
        {
            $type: ["neutral", "primary", "destructive"],
            class: {
                root: [
                    // before
                    "before:pointer-events-none before:absolute before:inset-0 before:z-10 before:rounded-[inherit]",
                    "before:bg-gradient-to-b before:p-px",
                    "before:from-white/[.12] before:to-transparent",
                    // before mask
                    "before:[mask-clip:content-box,border-box] before:[mask-composite:exclude] before:[mask-image:linear-gradient(#fff_0_0),linear-gradient(#fff_0_0)]",
                    // after
                    "after:absolute after:inset-0 after:rounded-[inherit] after:bg-gradient-to-b after:from-white after:to-transparent",
                    "after:pointer-events-none after:opacity-[.16] after:transition after:duration-200 after:ease-out",
                    // hover
                    "hover:after:opacity-[.24]",
                ],
            },
        },
    ],
    defaultVariants: {
        $type: "neutral",
        $size: "md",
    },
});

type FancyButtonSharedProps = VariantProps<typeof fancyButtonVariants>;

type FancyButtonProps = VariantProps<typeof fancyButtonVariants> &
    React.ComponentPropsWithRef<"button"> & {
        asChild?: boolean;
    };

function FancyButtonRoot({ asChild, children, $type, $size, className, ...rest }: FancyButtonProps) {
    const uniqueId = React.useId();
    const Component = asChild ? Slot : "button";
    const { root } = fancyButtonVariants({ $type, $size });

    const sharedProps: FancyButtonSharedProps = {
        $type,
        $size,
    };

    const extendedChildren = recursiveCloneChildren(
        children as React.ReactElement[],
        sharedProps,
        [FANCY_BUTTON_ICON_NAME],
        uniqueId,
        asChild,
    );

    return (
        <Component className={root({ class: className })} {...rest}>
            {extendedChildren}
        </Component>
    );
}
FancyButtonRoot.displayName = FANCY_BUTTON_ROOT_NAME;

function FancyButtonIcon<T extends React.ElementType>({
    className,
    $type,
    $size,
    as,
    ...rest
}: PolymorphicComponentProps<T, FancyButtonSharedProps>) {
    const Component = as || "div";
    const { icon } = fancyButtonVariants({ $type, $size });

    return <Component className={icon({ class: className })} {...rest} />;
}
FancyButtonIcon.displayName = FANCY_BUTTON_ICON_NAME;

export { FancyButtonRoot as Root, FancyButtonIcon as Icon };
