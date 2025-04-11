import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

import { type PolymorphicComponentProps } from "#/utils/polymorphic.ts";
import { recursiveCloneChildren } from "#/utils/recursive-clone-children.tsx";
import { tv, type VariantProps } from "#/utils/tv.ts";

const BADGE_ROOT_NAME = "BadgeRoot";
const BADGE_ICON_NAME = "BadgeIcon";
const BADGE_DOT_NAME = "BadgeDot";

export const badgeVariants = tv({
    slots: {
        root: "inline-flex items-center justify-center rounded-full leading-none transition duration-200 ease-out",
        icon: "shrink-0",
        dot: [
            // base
            "dot",
            "flex items-center justify-center",
            // before
            "before:size-1 before:rounded-full before:bg-current",
        ],
    },
    variants: {
        $size: {
            sm: {
                root: "h-4 gap-1.5 px-2 text-subheading-2xs uppercase has-[>.dot]:gap-2",
                icon: "-mx-1 size-3",
                dot: "-mx-2 size-4",
            },
            md: {
                root: "h-5 gap-1.5 px-2 text-label-xs",
                icon: "-mx-1 size-4",
                dot: "-mx-1.5 size-4",
            },
        },
        $style: {
            filled: {
                root: "text-white",
            },
            light: {},
            lighter: {},
            stroke: {
                root: "ring-1 ring-current ring-inset",
            },
        },
        $color: {
            gray: {},
            blue: {},
            orange: {},
            red: {},
            green: {},
            yellow: {},
            purple: {},
            sky: {},
            pink: {},
            teal: {},
            primary: {},
        },
        disabled: {
            true: {
                root: "pointer-events-none",
            },
        },
        $square: {
            true: {},
        },
    },
    compoundVariants: [
        //#region variant=filled
        {
            $style: "filled",
            $color: "gray",
            class: {
                root: "bg-state-faded-base",
            },
        },
        {
            $style: "filled",
            $color: "blue",
            class: {
                root: "bg-state-information-base",
            },
        },
        {
            $style: "filled",
            $color: "orange",
            class: {
                root: "bg-state-warning-base",
            },
        },
        {
            $style: "filled",
            $color: "red",
            class: {
                root: "bg-state-error-base",
            },
        },
        {
            $style: "filled",
            $color: "green",
            class: {
                root: "bg-state-success-base",
            },
        },
        {
            $style: "filled",
            $color: "yellow",
            class: {
                root: "bg-state-away-base",
            },
        },
        {
            $style: "filled",
            $color: "purple",
            class: {
                root: "bg-state-feature-base",
            },
        },
        {
            $style: "filled",
            $color: "sky",
            class: {
                root: "bg-state-verified-base",
            },
        },
        {
            $style: "filled",
            $color: "pink",
            class: {
                root: "bg-state-highlighted-base",
            },
        },
        {
            $style: "filled",
            $color: "teal",
            class: {
                root: "bg-state-stable-base",
            },
        },
        {
            $style: "filled",
            $color: "primary",
            class: {
                root: "bg-primary",
            },
        },
        // #endregion

        //#region variant=light
        {
            $style: "light",
            $color: "gray",
            class: {
                root: "bg-state-faded-light text-state-faded-dark",
            },
        },
        {
            $style: "light",
            $color: "blue",
            class: {
                root: "bg-state-information-light text-state-information-dark",
            },
        },
        {
            $style: "light",
            $color: "orange",
            class: {
                root: "bg-state-warning-light text-state-warning-dark",
            },
        },
        {
            $style: "light",
            $color: "red",
            class: {
                root: "bg-state-error-light text-state-error-dark",
            },
        },
        {
            $style: "light",
            $color: "green",
            class: {
                root: "bg-state-success-light text-state-success-dark",
            },
        },
        {
            $style: "light",
            $color: "yellow",
            class: {
                root: "bg-state-away-light text-state-away-dark",
            },
        },
        {
            $style: "light",
            $color: "purple",
            class: {
                root: "bg-state-feature-light text-state-feature-dark",
            },
        },
        {
            $style: "light",
            $color: "sky",
            class: {
                root: "bg-state-verified-light text-state-verified-dark",
            },
        },
        {
            $style: "light",
            $color: "pink",
            class: {
                root: "bg-state-highlighted-light text-state-highlighted-dark",
            },
        },
        {
            $style: "light",
            $color: "teal",
            class: {
                root: "bg-state-stable-light text-state-stable-dark",
            },
        },
        {
            $style: "light",
            $color: "primary",
            class: {
                root: "bg-primary-light text-primary-dark",
            },
        },
        //#endregion

        //#region variant=lighter
        {
            $style: "lighter",
            $color: "gray",
            class: {
                root: "bg-state-faded-lighter text-state-faded-base",
            },
        },
        {
            $style: "lighter",
            $color: "blue",
            class: {
                root: "bg-state-information-lighter text-state-information-base",
            },
        },
        {
            $style: "lighter",
            $color: "orange",
            class: {
                root: "bg-state-warning-lighter text-state-warning-base",
            },
        },
        {
            $style: "lighter",
            $color: "red",
            class: {
                root: "bg-state-error-lighter text-state-error-base",
            },
        },
        {
            $style: "lighter",
            $color: "green",
            class: {
                root: "bg-state-success-lighter text-state-success-base",
            },
        },
        {
            $style: "lighter",
            $color: "yellow",
            class: {
                root: "bg-state-away-lighter text-state-away-base",
            },
        },
        {
            $style: "lighter",
            $color: "purple",
            class: {
                root: "bg-state-feature-lighter text-state-feature-base",
            },
        },
        {
            $style: "lighter",
            $color: "sky",
            class: {
                root: "bg-state-verified-lighter text-state-verified-base",
            },
        },
        {
            $style: "lighter",
            $color: "pink",
            class: {
                root: "bg-state-highlighted-lighter text-state-highlighted-base",
            },
        },
        {
            $style: "lighter",
            $color: "teal",
            class: {
                root: "bg-state-stable-lighter text-state-stable-base",
            },
        },
        {
            $style: "lighter",
            $color: "primary",
            class: {
                root: "bg-primary-lighter text-primary-dark",
            },
        },
        //#endregion

        //#region variant=stroke
        {
            $style: "stroke",
            $color: "gray",
            class: {
                root: "text-state-faded-base",
            },
        },
        {
            $style: "stroke",
            $color: "blue",
            class: {
                root: "text-state-information-base",
            },
        },
        {
            $style: "stroke",
            $color: "orange",
            class: {
                root: "text-state-warning-base",
            },
        },
        {
            $style: "stroke",
            $color: "red",
            class: {
                root: "text-state-error-base",
            },
        },
        {
            $style: "stroke",
            $color: "green",
            class: {
                root: "text-state-success-base",
            },
        },
        {
            $style: "stroke",
            $color: "yellow",
            class: {
                root: "text-state-away-base",
            },
        },
        {
            $style: "stroke",
            $color: "purple",
            class: {
                root: "text-state-feature-base",
            },
        },
        {
            $style: "stroke",
            $color: "sky",
            class: {
                root: "text-state-verified-base",
            },
        },
        {
            $style: "stroke",
            $color: "pink",
            class: {
                root: "text-state-highlighted-base",
            },
        },
        {
            $style: "stroke",
            $color: "teal",
            class: {
                root: "text-state-stable-base",
            },
        },
        {
            $style: "stroke",
            $color: "primary",
            class: {
                root: "text-primary",
            },
        },
        //#endregion

        //#region square
        {
            $size: "sm",
            $square: true,
            class: {
                root: "min-w-4 px-1",
            },
        },
        {
            $size: "md",
            $square: true,
            class: {
                root: "min-w-5 px-1",
            },
        },
        //#endregion

        //#region disabled
        {
            disabled: true,
            $style: ["stroke", "filled", "light", "lighter"],
            $color: ["red", "gray", "blue", "orange", "green", "yellow", "purple", "sky", "pink", "teal", "primary"],
            class: {
                root: ["ring-stroke-soft-200 ring-1 ring-inset", "bg-transparent text-(--text-disabled-300)"],
            },
        },
        //#endregion
    ],
    defaultVariants: {
        $style: "filled",
        $size: "sm",
        $color: "gray",
    },
});

type BadgeSharedProps = VariantProps<typeof badgeVariants>;

type BadgeRootProps = VariantProps<typeof badgeVariants> &
    React.ComponentPropsWithRef<"div"> & {
        asChild?: boolean;
    };

function BadgeRoot({
    asChild,
    $size,
    $style,
    $color,
    disabled,
    $square,
    children,
    className,
    ...rest
}: BadgeRootProps) {
    const uniqueId = React.useId();
    const Component = asChild ? Slot : "div";
    const { root } = badgeVariants({ $size, $style, $color, disabled, $square });

    const sharedProps: BadgeSharedProps = {
        $size,
        $style,
        $color,
    };

    const extendedChildren = recursiveCloneChildren(
        children as React.ReactElement[],
        sharedProps,
        [BADGE_ICON_NAME, BADGE_DOT_NAME],
        uniqueId,
        asChild,
    );

    return (
        <Component className={root({ class: className })} {...rest}>
            {extendedChildren}
        </Component>
    );
}
BadgeRoot.displayName = BADGE_ROOT_NAME;

function BadgeIcon<T extends React.ElementType>({
    className,
    $size,
    $style,
    $color,
    as,
    ...rest
}: PolymorphicComponentProps<T, BadgeSharedProps>) {
    const Component = as || "div";
    const { icon } = badgeVariants({ $size, $style, $color });

    return <Component className={icon({ class: className })} {...rest} />;
}
BadgeIcon.displayName = BADGE_ICON_NAME;

type BadgeDotProps = BadgeSharedProps & Omit<React.HTMLAttributes<HTMLDivElement>, "color">;

function BadgeDot({ $size, $style, $color, className, ...rest }: BadgeDotProps) {
    const { dot } = badgeVariants({ $size, $style, $color });

    return <div className={dot({ class: className })} {...rest} />;
}
BadgeDot.displayName = BADGE_DOT_NAME;

export { BadgeRoot as Root, BadgeIcon as Icon, BadgeDot as Dot };
