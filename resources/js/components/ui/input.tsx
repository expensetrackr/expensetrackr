import * as React from "react";

import * as InputPrimitives from "./input-primitives.tsx";

export type InputProps = React.ComponentPropsWithoutRef<typeof InputPrimitives.Input> &
    Pick<React.ComponentPropsWithoutRef<typeof InputPrimitives.Root>, "$error" | "$size"> & {
        leadingIcon?: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
        trailingIcon?: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
        leadingNode?: React.ReactNode;
        trailingNode?: React.ReactNode;
        inlineLeadingNode?: React.ReactNode;
        inlineTrailingNode?: React.ReactNode;
    };

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        {
            $size,
            $error,
            leadingIcon: LeadingIcon,
            trailingIcon: TrailingIcon,
            leadingNode,
            trailingNode,
            inlineLeadingNode,
            inlineTrailingNode,
            ...rest
        },
        forwardedRef,
    ) => {
        return (
            <InputPrimitives.Root $error={$error} $size={$size}>
                {leadingNode}
                <InputPrimitives.Wrapper>
                    {inlineLeadingNode}
                    {LeadingIcon && <InputPrimitives.Icon as={LeadingIcon} />}
                    <InputPrimitives.Input ref={forwardedRef} type="text" {...rest} />
                    {TrailingIcon && <InputPrimitives.Icon as={TrailingIcon} />}
                    {inlineTrailingNode}
                </InputPrimitives.Wrapper>
                {trailingNode}
            </InputPrimitives.Root>
        );
    },
);
Input.displayName = "Input";
