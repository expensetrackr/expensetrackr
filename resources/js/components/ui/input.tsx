import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

import { type PolymorphicComponentProps } from "#/utils/polymorphic.ts";
import { recursiveCloneChildren } from "#/utils/recursive-clone-children.tsx";
import { tv, type VariantProps } from "#/utils/tv.ts";

const INPUT_ROOT_NAME = "InputRoot";
const INPUT_WRAPPER_NAME = "InputWrapper";
const INPUT_EL_NAME = "InputEl";
const INPUT_ICON_NAME = "InputIcon";
const INPUT_AFFIX_NAME = "InputAffixButton";
const INPUT_INLINE_AFFIX_NAME = "InputInlineAffixButton";

export const inputVariants = tv({
    slots: {
        root: [
            // base
            "group relative flex w-full overflow-hidden bg-(--bg-white-0) shadow-xs",
            "transition duration-200 ease-out",
            "divide-x divide-(--stroke-soft-200)",
            // before
            "before:absolute before:inset-0 before:ring-1 before:ring-inset before:ring-(--stroke-soft-200)",
            "before:pointer-events-none before:rounded-[inherit]",
            "before:transition before:duration-200 before:ease-out",
            // hover
            "hover:shadow-none",
            // focus
            "has-[input:focus]:shadow-button-important-focus has-[input:focus]:before:ring-(--stroke-strong-950)",
            // disabled
            "has-[input]:disabled:shadow-none has-[input]:disabled:before:ring-transparent",
        ],
        wrapper: [
            // base
            "group/input-wrapper flex w-full cursor-text items-center bg-(--bg-white-0)",
            "transition duration-200 ease-out",
            // hover
            "hover:[&:not(&:has(input:focus))]:bg-(--bg-weak-50)",
            // disabled
            "has-[input]:disabled:pointer-events-none has-[input]:disabled:bg-(--bg-weak-50)",
        ],
        input: [
            // base
            "w-full bg-transparent bg-none text-paragraph-sm outline-none",
            "transition duration-200 ease-out",
            // placeholder
            "placeholder:select-none placeholder:text-(--text-soft-400) placeholder:transition placeholder:duration-200 placeholder:ease-out",
            // hover placeholder
            "group-hover/input-wrapper:placeholder:text-(--text-sub-600)",
            // focus
            "focus:outline-none",
            // focus placeholder
            "group-has-[input]:focus:placeholder:text-(--text-sub-600)",
            // disabled
            "disabled:text-(--text-disabled-300) disabled:placeholder:text-(--text-disabled-300)",
        ],
        icon: [
            // base
            "flex size-5 shrink-0 select-none items-center justify-center",
            "transition duration-200 ease-out",
            // placeholder state
            "group-has-[:placeholder-shown]:text-(--text-soft-400)",
            // filled state
            "text-(--text-sub-600)",
            // hover
            "group-has-[:placeholder-shown]:group-hover/input-wrapper:text-(--text-sub-600)",
            // focus
            "group-has-[:placeholder-shown]:group-has-[input]:focus/input-wrapper:text-(--text-sub-600)",
            // disabled
            "group-has-[input]:disabled/input-wrapper:text-(--text-disabled-300)",
        ],
        affix: [
            // base
            "shrink-0 bg-(--bg-white-0) text-paragraph-sm text-(--text-sub-600)",
            "flex items-center justify-center truncate",
            "transition duration-200 ease-out",
            // placeholder state
            "group-has-[:placeholder-shown]:text-(--text-soft-400)",
            // focus state
            "group-has-[:placeholder-shown]:group-has-[input]:focus:text-(--text-sub-600)",
        ],
        inlineAffix: [
            // base
            "text-paragraph-sm text-(--text-sub-600)",
            // placeholder state
            "group-has-[:placeholder-shown]:text-(--text-soft-400)",
            // focus state
            "group-has-[:placeholder-shown]:group-has-[input]:focus:text-(--text-sub-600)",
        ],
    },
    variants: {
        $size: {
            xs: {
                root: "rounded-8",
                wrapper: "gap-1.5 px-2",
                input: "h-8",
            },
            sm: {
                root: "rounded-8",
                wrapper: "gap-2 px-2.5",
                input: "h-9",
            },
            md: {
                root: "rounded-10",
                wrapper: "gap-2 px-3",
                input: "h-10",
            },
        },
        $error: {
            true: {
                root: [
                    // base
                    "before:ring-state-error-base",
                    // base
                    "hover:before:ring-state-error-base hover:[&:not(&:has(input:focus)):has(>:only-child)]:before:ring-state-error-base",
                    // focus
                    "has-[input]:focus:shadow-button-error-focus has-[input]:focus:before:ring-state-error-base",
                ],
            },
            false: {
                root: [
                    // hover
                    "hover:[&:not(:has(input:focus)):has(>:only-child)]:before:ring-transparent",
                ],
            },
        },
    },
    compoundVariants: [
        //#region affix
        {
            size: "md",
            class: {
                affix: "px-3",
            },
        },
        {
            size: ["sm", "xs"],
            class: {
                affix: "px-2.5",
            },
        },
        //#endregion
    ],
    defaultVariants: {
        $size: "md",
    },
});

type InputSharedProps = VariantProps<typeof inputVariants>;

function InputRoot({
    className,
    children,
    $size,
    $error,
    asChild,
    ...rest
}: React.HTMLAttributes<HTMLDivElement> &
    InputSharedProps & {
        asChild?: boolean;
    }) {
    const uniqueId = React.useId();
    const Component = asChild ? Slot : "div";

    const { root } = inputVariants({
        $size,
        $error,
    });

    const sharedProps: InputSharedProps = {
        $size,
        $error,
    };

    const extendedChildren = recursiveCloneChildren(
        children as React.ReactElement[],
        sharedProps,
        [INPUT_WRAPPER_NAME, INPUT_EL_NAME, INPUT_ICON_NAME, INPUT_AFFIX_NAME, INPUT_INLINE_AFFIX_NAME],
        uniqueId,
        asChild,
    );

    return (
        <Component className={root({ class: className })} {...rest}>
            {extendedChildren}
        </Component>
    );
}
InputRoot.displayName = INPUT_ROOT_NAME;

function InputWrapper({
    className,
    children,
    $size,
    $error,
    asChild,
    ...rest
}: React.HTMLAttributes<HTMLLabelElement> &
    InputSharedProps & {
        asChild?: boolean;
    }) {
    const Component = asChild ? Slot : "label";

    const { wrapper } = inputVariants({
        $size,
        $error,
    });

    return (
        <Component className={wrapper({ class: className })} {...rest}>
            {children}
        </Component>
    );
}
InputWrapper.displayName = INPUT_WRAPPER_NAME;

type InputProps = React.ComponentPropsWithRef<"input"> &
    InputSharedProps & {
        asChild?: boolean;
    };

function Input({ className, type = "text", $size, $error, asChild, ...rest }: InputProps) {
    const Component = asChild ? Slot : "input";

    const { input } = inputVariants({
        $size,
        $error,
    });

    return <Component className={input({ class: className })} type={type} {...rest} />;
}
Input.displayName = INPUT_EL_NAME;

function InputIcon<T extends React.ElementType = "div">({
    $size,
    $error,
    as,
    className,
    ...rest
}: PolymorphicComponentProps<T, InputSharedProps>) {
    const Component = as || "div";
    const { icon } = inputVariants({ $size, $error });

    return <Component className={icon({ class: className })} {...rest} />;
}
InputIcon.displayName = INPUT_ICON_NAME;

function InputAffix({
    className,
    children,
    $size,
    $error,
    ...rest
}: React.HTMLAttributes<HTMLDivElement> & InputSharedProps) {
    const { affix } = inputVariants({
        $size,
        $error,
    });

    return (
        <div className={affix({ class: className })} {...rest}>
            {children}
        </div>
    );
}
InputAffix.displayName = INPUT_AFFIX_NAME;

function InputInlineAffix({
    className,
    children,
    $size,
    $error,
    ...rest
}: React.HTMLAttributes<HTMLSpanElement> & InputSharedProps) {
    const { inlineAffix } = inputVariants({
        $size,
        $error,
    });

    return (
        <span className={inlineAffix({ class: className })} {...rest}>
            {children}
        </span>
    );
}
InputInlineAffix.displayName = INPUT_INLINE_AFFIX_NAME;

export {
    InputRoot as Root,
    InputWrapper as Wrapper,
    Input,
    InputIcon as Icon,
    InputAffix as Affix,
    InputInlineAffix as InlineAffix,
};
