import { Slot } from "radix-ui";
import * as ButtonPrimitives from "./ui/button.tsx";

export type ButtonProps = React.ComponentPropsWithoutRef<typeof ButtonPrimitives.Root> & {
    leadingIcon?: React.ElementType<React.SVGProps<SVGSVGElement>>;
    leadingIconClassName?: string;
    trailingIcon?: React.ElementType<React.SVGProps<SVGSVGElement>>;
    trailingIconClassName?: string;
};

export function Button({
    children,
    leadingIcon: LeadingIcon,
    leadingIconClassName,
    trailingIcon: TrailingIcon,
    trailingIconClassName,
    ...rest
}: ButtonProps) {
    return (
        <ButtonPrimitives.Root {...rest}>
            {LeadingIcon && <ButtonPrimitives.Icon as={LeadingIcon} className={leadingIconClassName} />}
            <Slot.Slottable>{children}</Slot.Slottable>
            {TrailingIcon && <ButtonPrimitives.Icon as={TrailingIcon} className={trailingIconClassName} />}
        </ButtonPrimitives.Root>
    );
}
Button.displayName = "Button";
