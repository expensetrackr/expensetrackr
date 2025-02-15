import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

import { type PolymorphicComponentProps } from "#/utils/polymorphic.ts";
import { recursiveCloneChildren } from "#/utils/recursive-clone-children.tsx";
import { tv, type VariantProps } from "#/utils/tv.ts";

const SOCIAL_BUTTON_ROOT_NAME = "SocialButtonRoot";
const SOCIAL_BUTTON_ICON_NAME = "SocialButtonIcon";

export const socialButtonVariants = tv({
    slots: {
        root: [
            // base
            "relative inline-flex h-10 items-center justify-center gap-3.5 rounded-10 px-4 text-label-sm whitespace-nowrap outline-none",
            "transition duration-200 ease-out",
            // focus
            "focus:outline-none",
        ],
        icon: "relative z-10 -mx-1.5 size-5 shrink-0",
    },
    variants: {
        $brand: {
            apple: {},
            twitter: {},
            google: {},
            facebook: {},
            linkedin: {},
            github: {},
            dropbox: {},
        },
        $style: {
            filled: {
                root: [
                    // base
                    "text-white",
                    // before
                    "before:pointer-events-none before:absolute before:inset-0 before:rounded-10 before:opacity-0 before:transition before:duration-200 before:ease-out",
                    // hover
                    "hover:before:opacity-100",
                    // focus
                    "focus-visible:shadow-button-important-focus",
                ],
            },
            stroke: {
                root: [
                    // base
                    "shadow-regular-xs bg-(--bg-white-0) text-(--text-strong-950) ring-1 ring-(--stroke-soft-200) ring-inset",
                    // hover
                    "hover:bg-(--bg-weak-50) hover:shadow-none hover:ring-transparent",
                    // focus
                    "focus-visible:shadow-button-important-focus focus-visible:ring-(--stroke-strong-950)",
                ],
            },
        },
    },
    compoundVariants: [
        //#region mode=filled
        {
            $brand: "apple",
            $style: "filled",
            class: {
                root: [
                    // base
                    "bg-black",
                    // before
                    "before:bg-white-alpha-16",
                ],
            },
        },
        {
            $brand: "twitter",
            $style: "filled",
            class: {
                root: [
                    // base
                    "bg-black",
                    // before
                    "before:bg-white-alpha-16",
                ],
            },
        },
        {
            $brand: "google",
            $style: "filled",
            class: {
                root: [
                    // base
                    "bg-[#f14336]",
                    // before
                    "before:bg-black/[.16]",
                ],
            },
        },
        {
            $brand: "facebook",
            $style: "filled",
            class: {
                root: [
                    // base
                    "bg-[#1977f3]",
                    // before
                    "before:bg-black/[.16]",
                ],
            },
        },
        {
            $brand: "linkedin",
            $style: "filled",
            class: {
                root: [
                    // base
                    "bg-[#0077b5]",
                    // before
                    "before:bg-black/[.16]",
                ],
            },
        },
        {
            $brand: "github",
            $style: "filled",
            class: {
                root: [
                    // base
                    "bg-[#24292f]",
                    // before
                    "before:bg-white-alpha-16",
                ],
            },
        },
        {
            $brand: "dropbox",
            $style: "filled",
            class: {
                root: [
                    // base
                    "bg-[#3984ff]",
                    // before
                    "before:bg-black/[.16]",
                ],
            },
        },
        //#endregion

        //#region mode=stroke
        {
            $brand: "apple",
            $style: "stroke",
            class: {
                root: [
                    // base
                    "text-social-apple",
                ],
            },
        },
        {
            $brand: "twitter",
            $style: "stroke",
            class: {
                root: [
                    // base
                    "text-social-twitter",
                ],
            },
        },
        {
            $brand: "github",
            $style: "stroke",
            class: {
                root: [
                    // base
                    "text-social-github",
                ],
            },
        },
        //#endregion
    ],
    defaultVariants: {
        $style: "filled",
    },
});

type SocialButtonSharedProps = VariantProps<typeof socialButtonVariants>;

type SocialButtonProps = VariantProps<typeof socialButtonVariants> &
    React.ComponentPropsWithRef<"button"> & {
        asChild?: boolean;
    };

function SocialButtonRoot({ asChild, children, $style, $brand, className, ...rest }: SocialButtonProps) {
    const uniqueId = React.useId();
    const Component = asChild ? Slot : "button";
    const { root } = socialButtonVariants({ $brand, $style });

    const sharedProps: SocialButtonSharedProps = {
        $style,
        $brand,
    };

    const extendedChildren = recursiveCloneChildren(
        children as React.ReactElement[],
        sharedProps,
        [SOCIAL_BUTTON_ICON_NAME],
        uniqueId,
        asChild,
    );

    return (
        <Component className={root({ class: className })} {...rest}>
            {extendedChildren}
        </Component>
    );
}
SocialButtonRoot.displayName = SOCIAL_BUTTON_ROOT_NAME;

function SocialButtonIcon<T extends React.ElementType>({
    $brand,
    $style,
    className,
    as,
    ...rest
}: PolymorphicComponentProps<T, SocialButtonSharedProps>) {
    const Component = as || "div";
    const { icon } = socialButtonVariants({ $brand, $style });

    return <Component className={icon({ class: className })} {...rest} />;
}
SocialButtonIcon.displayName = SOCIAL_BUTTON_ICON_NAME;

export { SocialButtonRoot as Root, SocialButtonIcon as Icon };
