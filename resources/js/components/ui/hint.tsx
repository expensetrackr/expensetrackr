import * as React from "react";
import InformationFillIcon from "virtual:icons/ri/information-fill";

import { type PolymorphicComponentProps } from "#/utils/polymorphic.ts";
import { recursiveCloneChildren } from "#/utils/recursive-clone-children.tsx";
import { tv, type VariantProps } from "#/utils/tv.ts";

const HINT_ROOT_NAME = "HintRoot";
const HINT_ICON_NAME = "HintIcon";

export const hintVariants = tv({
    slots: {
        root: "group flex items-start gap-1 text-paragraph-xs text-(--text-sub-600)",
        icon: "mt-px size-4 shrink-0 text-(--text-soft-400)",
    },
    variants: {
        $disabled: {
            true: {
                root: "text-(--text-disabled-300)",
                icon: "text-(--text-disabled-300)",
            },
        },
        $error: {
            true: {
                root: "text-state-error-base",
                icon: "text-state-error-base",
            },
        },
    },
});

type HintSharedProps = VariantProps<typeof hintVariants>;

type HintRootProps = VariantProps<typeof hintVariants> & React.HTMLAttributes<HTMLDivElement>;

export function Root({ children, $error, $disabled, className, ...rest }: HintRootProps) {
    const uniqueId = React.useId();
    const { root } = hintVariants({ $error, $disabled });

    const sharedProps: HintSharedProps = {
        $error,
        $disabled,
    };

    const extendedChildren = recursiveCloneChildren(
        children as React.ReactElement[],
        sharedProps,
        [HINT_ICON_NAME],
        uniqueId,
    );

    return (
        <div className={root({ class: className })} {...rest}>
            {extendedChildren}
        </div>
    );
}
Root.displayName = HINT_ROOT_NAME;

export function Icon<T extends React.ElementType>({
    as,
    className,
    $error,
    $disabled,
    ...rest
}: PolymorphicComponentProps<T, HintSharedProps>) {
    const Component = as || InformationFillIcon;
    const { icon } = hintVariants({ $error, $disabled });

    return <Component className={icon({ class: className })} {...rest} />;
}
Icon.displayName = HINT_ICON_NAME;
