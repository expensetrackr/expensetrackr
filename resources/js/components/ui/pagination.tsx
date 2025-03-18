import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

import { cnMerge } from "#/utils/cn.ts";
import { type PolymorphicComponentProps } from "#/utils/polymorphic.ts";
import { recursiveCloneChildren } from "#/utils/recursive-clone-children.tsx";
import { tv, type VariantProps } from "#/utils/tv.ts";

const PAGINATION_ROOT_NAME = "PaginationRoot";
const PAGINATION_ITEM_NAME = "PaginationItem";
const PAGINATION_NAV_BUTTON_NAME = "PaginationNavButton";
const PAGINATION_NAV_ICON_NAME = "PaginationNavIcon";

const paginationVariants = tv({
    slots: {
        root: "flex flex-wrap items-center justify-center",
        item: "flex items-center justify-center text-center text-label-sm text-(--text-sub-600) transition duration-200 ease-out",
        navButton: "flex items-center justify-center text-(--text-sub-600) transition duration-200 ease-out",
        navIcon: "size-5",
    },
    variants: {
        variant: {
            basic: {
                root: "gap-2",
                item: [
                    // base
                    "h-8 min-w-8 rounded-8 px-1.5 ring-1 ring-(--stroke-soft-200) ring-inset",
                    // hover
                    "hover:bg-(--bg-weak-50) hover:ring-transparent",
                ],
                navButton: [
                    // base
                    "size-8 rounded-8",
                    // hover
                    "hover:bg-(--bg-weak-50)",
                ],
            },
            rounded: {
                root: "gap-2",
                item: [
                    // base
                    "h-8 min-w-8 rounded-full px-1.5 ring-1 ring-(--stroke-soft-200) ring-inset",
                    // hover
                    "hover:bg-(--bg-weak-50) hover:ring-transparent",
                ],
                navButton: [
                    // base
                    "size-8 rounded-full",
                    // hover
                    "hover:bg-(--bg-weak-50)",
                ],
            },
            group: {
                root: "border-stroke-soft-200 divide-x divide-(--stroke-soft-200) overflow-hidden rounded-8 border",
                item: [
                    // base
                    "h-8 min-w-10 px-1.5",
                    // hover
                    "hover:bg-(--bg-weak-50)",
                ],
                navButton: [
                    // base
                    "h-8 w-10 px-1.5",
                    // hover
                    "hover:bg-(--bg-weak-50)",
                ],
            },
        },
    },
    defaultVariants: {
        variant: "basic",
    },
});

type PaginationSharedProps = VariantProps<typeof paginationVariants>;

type PaginationRootProps = React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof paginationVariants> & {
        asChild?: boolean;
    };

function PaginationRoot({ asChild, children, className, variant, ...rest }: PaginationRootProps) {
    const uniqueId = React.useId();
    const Component = asChild ? Slot : "div";
    const { root } = paginationVariants({ variant });

    const sharedProps: PaginationSharedProps = {
        variant,
    };

    const extendedChildren = recursiveCloneChildren(
        children as React.ReactElement[],
        sharedProps,
        [PAGINATION_ITEM_NAME, PAGINATION_NAV_BUTTON_NAME, PAGINATION_NAV_ICON_NAME],
        uniqueId,
        asChild,
    );

    return (
        <Component className={root({ class: className })} {...rest}>
            {extendedChildren}
        </Component>
    );
}
PaginationRoot.displayName = PAGINATION_ROOT_NAME;

type PaginationItemProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
    PaginationSharedProps & {
        asChild?: boolean;
        current?: boolean;
    };

const PaginationItem = React.forwardRef<HTMLButtonElement, PaginationItemProps>(
    ({ asChild, children, className, variant, current, ...rest }, forwardedRef) => {
        const Component = asChild ? Slot : "button";
        const { item } = paginationVariants({ variant });

        return (
            <Component
                className={cnMerge(item({ class: className }), current && "text-(--text-strong-950)")}
                ref={forwardedRef}
                {...rest}
            >
                {children}
            </Component>
        );
    },
);
PaginationItem.displayName = PAGINATION_ITEM_NAME;

type PaginationNavButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
    PaginationSharedProps & {
        asChild?: boolean;
    };

const PaginationNavButton = React.forwardRef<HTMLButtonElement, PaginationNavButtonProps>(
    ({ asChild, children, className, variant, ...rest }, forwardedRef) => {
        const Component = asChild ? Slot : "button";
        const { navButton } = paginationVariants({ variant });

        return (
            <Component className={navButton({ class: className })} ref={forwardedRef} {...rest}>
                {children}
            </Component>
        );
    },
);
PaginationNavButton.displayName = PAGINATION_NAV_BUTTON_NAME;

function PaginationNavIcon<T extends React.ElementType>({
    variant,
    className,
    as,
    ...rest
}: PolymorphicComponentProps<T, PaginationSharedProps>) {
    const Component = as || "div";
    const { navIcon } = paginationVariants({ variant });

    return <Component className={navIcon({ class: className })} {...rest} />;
}
PaginationNavIcon.displayName = PAGINATION_NAV_ICON_NAME;

export {
    PaginationRoot as Root,
    PaginationItem as Item,
    PaginationNavButton as NavButton,
    PaginationNavIcon as NavIcon,
};
