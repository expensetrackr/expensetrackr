import * as React from "react";
import Cancel01Icon from "virtual:icons/hugeicons/cancel-01";

import { type PolymorphicComponentProps } from "#/utils/polymorphic.ts";
import { recursiveCloneChildren } from "#/utils/recursive-clone-children.tsx";
import { tv, type ClassValue, type VariantProps } from "#/utils/tv.ts";

const ALERT_ROOT_NAME = "AlertRoot";
const ALERT_ICON_NAME = "AlertIcon";
const ALERT_CLOSE_ICON_NAME = "AlertCloseIcon";

export const alertVariants = tv({
    slots: {
        root: "w-full",
        wrapper: [
            "grid w-full auto-cols-auto grid-flow-col grid-cols-1 items-start has-[>svg:first-child]:grid-cols-[auto_minmax(0,1fr)]",
            "transition duration-200 ease-out group-data-[expanded=false]/toast:group-data-[front=false]/toast:opacity-0",
        ],
        icon: "shrink-0",
        closeIcon: "",
    },
    variants: {
        $variant: {
            filled: {
                root: "text-white",
                closeIcon: "text-white opacity-[.72]",
            },
            light: {
                root: "text-(--text-strong-950)",
                closeIcon: "text-(--text-strong-950) opacity-40",
            },
            lighter: {
                root: "text-(--text-strong-950)",
                closeIcon: "text-(--text-strong-950) opacity-40",
            },
            stroke: {
                root: "bg-(--bg-white-0) text-(--text-strong-950) shadow-md ring-1 ring-(--stroke-soft-200) ring-inset",
                closeIcon: "text-(--text-strong-950) opacity-40",
            },
        },
        $status: {
            error: {},
            warning: {},
            success: {},
            information: {},
            feature: {},
        },
        $size: {
            xs: {
                root: "rounded-8 p-2 text-paragraph-xs",
                wrapper: "gap-2",
                icon: "size-4",
                closeIcon: "size-4",
            },
            sm: {
                root: "rounded-8 px-2.5 py-2 text-paragraph-sm",
                wrapper: "gap-2",
                icon: "size-5",
                closeIcon: "size-5",
            },
            lg: {
                root: "rounded-16 p-3.5 pb-4 text-paragraph-sm",
                wrapper: "items-start gap-3",
                icon: "size-5",
                closeIcon: "size-5",
            },
        },
    },
    compoundVariants: [
        //#region filled
        {
            $variant: "filled",
            $status: "error",
            class: {
                root: "bg-state-error-base",
            },
        },
        {
            $variant: "filled",
            $status: "warning",
            class: {
                root: "bg-state-warning-base",
            },
        },
        {
            $variant: "filled",
            $status: "success",
            class: {
                root: "bg-state-success-base",
            },
        },
        {
            $variant: "filled",
            $status: "information",
            class: {
                root: "bg-state-information-base",
            },
        },
        {
            $variant: "filled",
            $status: "feature",
            class: {
                root: "bg-state-faded-base",
            },
        },
        //#endregion

        //#region light
        {
            $variant: "light",
            $status: "error",
            class: {
                root: "bg-state-error-light",
            },
        },
        {
            $variant: "light",
            $status: "warning",
            class: {
                root: "bg-state-warning-light",
            },
        },
        {
            $variant: "light",
            $status: "success",
            class: {
                root: "bg-state-success-light",
            },
        },
        {
            $variant: "light",
            $status: "information",
            class: {
                root: "bg-state-information-light",
            },
        },
        {
            $variant: "light",
            $status: "feature",
            class: {
                root: "bg-state-faded-light",
            },
        },
        //#endregion

        //#region lighter
        {
            $variant: "lighter",
            $status: "error",
            class: {
                root: "bg-state-error-lighter",
            },
        },
        {
            $variant: "lighter",
            $status: "warning",
            class: {
                root: "bg-state-warning-lighter",
            },
        },
        {
            $variant: "lighter",
            $status: "success",
            class: {
                root: "bg-state-success-lighter",
            },
        },
        {
            $variant: "lighter",
            $status: "information",
            class: {
                root: "bg-state-information-lighter",
            },
        },
        {
            $variant: "lighter",
            $status: "feature",
            class: {
                root: "bg-state-faded-lighter",
            },
        },
        //#endregion

        //#region light, lighter, stroke
        {
            $variant: ["light", "lighter", "stroke"],
            $status: "error",
            class: {
                icon: "text-state-error-base",
            },
        },
        {
            $variant: ["light", "lighter", "stroke"],
            $status: "warning",
            class: {
                icon: "text-state-warning-base",
            },
        },
        {
            $variant: ["light", "lighter", "stroke"],
            $status: "success",
            class: {
                icon: "text-state-success-base",
            },
        },
        {
            $variant: ["light", "lighter", "stroke"],
            $status: "information",
            class: {
                icon: "text-state-information-base",
            },
        },
        {
            $variant: ["light", "lighter", "stroke"],
            $status: "feature",
            class: {
                icon: "text-state-faded-base",
            },
        },
        //#endregion
    ],
    defaultVariants: {
        $size: "sm",
        $variant: "filled",
        $status: "information",
    },
});

type AlertSharedProps = VariantProps<typeof alertVariants>;

export type AlertProps = VariantProps<typeof alertVariants> &
    React.HTMLAttributes<HTMLDivElement> & {
        wrapperClassName?: ClassValue;
    };

const AlertRoot = React.forwardRef<HTMLDivElement, AlertProps>(
    ({ children, className, wrapperClassName, $size, $variant, $status, ...rest }, forwardedRef) => {
        const uniqueId = React.useId();
        const { root, wrapper } = alertVariants({ $size, $variant, $status });

        const sharedProps: AlertSharedProps = {
            $size,
            $variant,
            $status,
        };

        const extendedChildren = recursiveCloneChildren(
            children as React.ReactElement[],
            sharedProps,
            [ALERT_ICON_NAME, ALERT_CLOSE_ICON_NAME],
            uniqueId,
        );

        return (
            <div className={root({ class: className })} ref={forwardedRef} {...rest}>
                <div className={wrapper({ class: wrapperClassName })}>{extendedChildren}</div>
            </div>
        );
    },
);
AlertRoot.displayName = ALERT_ROOT_NAME;

function AlertIcon<T extends React.ElementType>({
    $size,
    $variant,
    $status,
    className,
    as,
}: PolymorphicComponentProps<T, AlertSharedProps>) {
    const Component = as || "div";
    const { icon } = alertVariants({ $size, $variant, $status });

    return <Component className={icon({ class: className })} />;
}
AlertIcon.displayName = ALERT_ICON_NAME;

function AlertCloseIcon<T extends React.ElementType>({
    $size,
    $variant,
    $status,
    className,
    as,
}: PolymorphicComponentProps<T, AlertSharedProps>) {
    const Component = as || Cancel01Icon;
    const { closeIcon } = alertVariants({ $size, $variant, $status });

    return <Component className={closeIcon({ class: className })} />;
}
AlertCloseIcon.displayName = ALERT_CLOSE_ICON_NAME;

export { AlertRoot as Root, AlertIcon as Icon, AlertCloseIcon as CloseIcon };
