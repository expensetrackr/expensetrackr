import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

import { type PolymorphicComponentProps } from "#/utils/polymorphic.ts";
import { recursiveCloneChildren } from "#/utils/recursive-clone-children.tsx";
import { tv, type VariantProps } from "#/utils/tv.ts";

const LINK_BUTTON_ROOT_NAME = "LinkButtonRoot";
const LINK_BUTTON_ICON_NAME = "LinkButtonIcon";

export const linkButtonVariants = tv({
    slots: {
        root: [
            // base
            "group inline-flex items-center justify-center whitespace-nowrap outline-none",
            "transition duration-200 ease-out",
            "underline decoration-transparent underline-offset-[3px]",
            // hover
            "hover:decoration-current",
            // focus
            "focus:outline-none focus-visible:underline",
            // disabled
            "disabled:pointer-events-none disabled:text-(--text-disabled-300) disabled:no-underline",
        ],
        icon: "shrink-0",
    },
    variants: {
        $style: {
            gray: {
                root: [
                    // base
                    "text-(--text-sub-600)",
                    // focus
                    "focus-visible:text-(--text-strong-950)",
                ],
            },
            black: {
                root: "text-(--text-strong-950)",
            },
            primary: {
                root: [
                    // base
                    "text-primary",
                    // hover
                    "hover:text-primary-darker",
                ],
            },
            error: {
                root: [
                    // base
                    "text-state-error-base",
                    // hover
                    "hover:text-red-700",
                ],
            },
            modifiable: {},
        },
        $size: {
            sm: {
                root: "h-4 gap-1 text-label-xs",
                icon: "size-4",
            },
            md: {
                root: "h-5 gap-1 text-label-sm",
                icon: "size-5",
            },
        },
        $underline: {
            true: {
                root: "decoration-current",
            },
        },
    },
    defaultVariants: {
        $style: "gray",
        $size: "md",
    },
});

type LinkButtonSharedProps = VariantProps<typeof linkButtonVariants>;

type LinkButtonProps = VariantProps<typeof linkButtonVariants> &
    React.ButtonHTMLAttributes<HTMLButtonElement> & {
        asChild?: boolean;
    };

const LinkButtonRoot = React.forwardRef<HTMLButtonElement, LinkButtonProps>(
    ({ asChild, children, $style, $size, $underline, className, ...rest }, forwardedRef) => {
        const uniqueId = React.useId();
        const Component = asChild ? Slot : "button";
        const { root } = linkButtonVariants({ $style, $size, $underline });

        const sharedProps: LinkButtonSharedProps = {
            $style,
            $size,
        };

        const extendedChildren = recursiveCloneChildren(
            children as React.ReactElement[],
            sharedProps,
            [LINK_BUTTON_ICON_NAME],
            uniqueId,
            asChild,
        );

        return (
            <Component className={root({ class: className })} ref={forwardedRef} {...rest}>
                {extendedChildren}
            </Component>
        );
    },
);
LinkButtonRoot.displayName = LINK_BUTTON_ROOT_NAME;

function LinkButtonIcon<T extends React.ElementType>({
    className,
    $style,
    $size,
    as,
    ...rest
}: PolymorphicComponentProps<T, LinkButtonSharedProps>) {
    const Component = as || "div";
    const { icon } = linkButtonVariants({ $style, $size });

    return <Component className={icon({ class: className })} {...rest} />;
}
LinkButtonIcon.displayName = LINK_BUTTON_ICON_NAME;

export { LinkButtonRoot as Root, LinkButtonIcon as Icon };
