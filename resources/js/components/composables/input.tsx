import * as React from "react";

import * as InputPrimitives from "../ui/input.tsx";

export type InputProps = React.CustomComponentPropsWithRef<typeof InputPrimitives.Input> &
    Pick<React.CustomComponentPropsWithRef<typeof InputPrimitives.Root>, "$error" | "$size"> & {
        leadingIcon?: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
        trailingIcon?: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
        leadingNode?: React.ReactNode;
        trailingNode?: React.ReactNode;
        inlineLeadingNode?: React.ReactNode;
        inlineTrailingNode?: React.ReactNode;
    };

export function Input({
    $size,
    $error,
    leadingIcon: LeadingIcon,
    trailingIcon: TrailingIcon,
    leadingNode,
    trailingNode,
    inlineLeadingNode,
    inlineTrailingNode,
    ...rest
}: InputProps) {
    return (
        <InputPrimitives.Root $error={$error} $size={$size}>
            {leadingNode}
            <InputPrimitives.Wrapper>
                {inlineLeadingNode}
                {LeadingIcon && <InputPrimitives.Icon as={LeadingIcon} />}
                <InputPrimitives.Input type="text" {...rest} />
                {TrailingIcon && <InputPrimitives.Icon as={TrailingIcon} />}
                {inlineTrailingNode}
            </InputPrimitives.Wrapper>
            {trailingNode}
        </InputPrimitives.Root>
    );
}
