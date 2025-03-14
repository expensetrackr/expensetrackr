import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

import { type PolymorphicComponentProps } from "#/utils/polymorphic.ts";
import { recursiveCloneChildren } from "#/utils/recursive-clone-children.tsx";
import { tv, type VariantProps } from "#/utils/tv.ts";

const STATUS_BADGE_ROOT_NAME = "StatusBadgeRoot";
const STATUS_BADGE_ICON_NAME = "StatusBadgeIcon";
const STATUS_BADGE_DOT_NAME = "StatusBadgeDot";

export const statusBadgeVariants = tv({
    slots: {
        root: [
            "inline-flex h-6 items-center justify-center gap-2 rounded-6 px-2 text-label-xs whitespace-nowrap",
            "has-[>.dot]:gap-1.5",
        ],
        icon: "-mx-1 size-4",
        dot: [
            // base
            "dot -mx-1 flex size-4 items-center justify-center",
            // before
            "before:size-1.5 before:rounded-full before:bg-current",
        ],
    },
    variants: {
        variant: {
            stroke: {
                root: "bg-(--bg-white-0) text-(--text-sub-600) ring-1 ring-(--stroke-soft-200) ring-inset",
            },
            light: {},
        },
        status: {
            completed: {
                icon: "text-state-success-base",
                dot: "text-state-success-base",
            },
            pending: {
                icon: "text-state-warning-base",
                dot: "text-state-warning-base",
            },
            failed: {
                icon: "text-state-error-base",
                dot: "text-state-error-base",
            },
            disabled: {
                icon: "text-state-faded-base",
                dot: "text-state-faded-base",
            },
        },
    },
    compoundVariants: [
        {
            variant: "light",
            status: "completed",
            class: {
                root: "bg-state-success-lighter text-state-success-base",
            },
        },
        {
            variant: "light",
            status: "pending",
            class: {
                root: "bg-state-warning-lighter text-state-warning-base",
            },
        },
        {
            variant: "light",
            status: "failed",
            class: {
                root: "bg-state-error-lighter text-state-error-base",
            },
        },
        {
            variant: "light",
            status: "disabled",
            class: {
                root: "bg-state-faded-lighter text-state-faded-base",
            },
        },
    ],
    defaultVariants: {
        status: "disabled",
        variant: "stroke",
    },
});

type StatusBadgeSharedProps = VariantProps<typeof statusBadgeVariants>;

type StatusBadgeRootProps = React.ComponentPropsWithRef<"div"> &
    VariantProps<typeof statusBadgeVariants> & {
        asChild?: boolean;
    };

function StatusBadgeRoot({ asChild, children, variant, status, className, ...rest }: StatusBadgeRootProps) {
    const uniqueId = React.useId();
    const Component = asChild ? Slot : "div";
    const { root } = statusBadgeVariants({ variant, status });

    const sharedProps: StatusBadgeSharedProps = {
        variant,
        status,
    };

    const extendedChildren = recursiveCloneChildren(
        children as React.ReactElement[],
        sharedProps,
        [STATUS_BADGE_ICON_NAME, STATUS_BADGE_DOT_NAME],
        uniqueId,
        asChild,
    );

    return (
        <Component className={root({ class: className })} {...rest}>
            {extendedChildren}
        </Component>
    );
}
StatusBadgeRoot.displayName = STATUS_BADGE_ROOT_NAME;

function StatusBadgeIcon<T extends React.ElementType = "div">({
    variant,
    status,
    className,
    as,
}: PolymorphicComponentProps<T, StatusBadgeSharedProps>) {
    const Component = as || "div";
    const { icon } = statusBadgeVariants({ variant, status });

    return <Component className={icon({ class: className })} />;
}
StatusBadgeIcon.displayName = STATUS_BADGE_ICON_NAME;

function StatusBadgeDot({
    variant,
    status,
    className,
    ...rest
}: StatusBadgeSharedProps & React.HTMLAttributes<HTMLDivElement>) {
    const { dot } = statusBadgeVariants({ variant, status });

    return <div className={dot({ class: className })} {...rest} />;
}
StatusBadgeDot.displayName = STATUS_BADGE_DOT_NAME;

export { StatusBadgeRoot as Root, StatusBadgeIcon as Icon, StatusBadgeDot as Dot };
