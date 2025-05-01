import { unstable_OneTimePasswordField as OneTimePasswordFieldPrimitives } from "radix-ui";

import { cn } from "#/utils/cn.ts";

type DigitInputProps = {
    $error?: boolean;
    className?: string;
    disabled?: boolean;
} & OneTimePasswordFieldPrimitives.OneTimePasswordFieldProps;

function DigitInputRoot({ $error, className, ...rest }: DigitInputProps) {
    return (
        <OneTimePasswordFieldPrimitives.Root className={cn("flex w-full items-center gap-2.5", className)} {...rest} />
    );
}
DigitInput.displayName = "DigitInput";

type DigitInputSlotProps = OneTimePasswordFieldPrimitives.OneTimePasswordFieldInputProps & {
    $error?: boolean;
};

function DigitInput({ $error, className, ...rest }: DigitInputSlotProps) {
    return (
        <OneTimePasswordFieldPrimitives.Input
            className={cn(
                "h-16 w-full min-w-0 rounded-10 bg-(--bg-white-0) text-center text-h5 text-(--text-strong-950) shadow-xs ring-1 ring-(--stroke-soft-200) outline-none ring-inset",
                "transition duration-200 ease-out",
                // hover
                "hover:bg-(--bg-weak-50) hover:shadow-none hover:ring-transparent",
                // focus
                "focus:shadow-button-important-focus focus:ring-(--stroke-strong-950) focus:outline-none",
                // selection
                "selection:bg-none",
                // disabled
                "disabled:bg-(--bg-weak-50) disabled:text-(--text-disabled-300) disabled:shadow-none disabled:ring-transparent",
                $error &&
                    "ring-state-error-base hover:ring-state-error-base focus:shadow-button-error-focus focus:ring-state-error-base",
            )}
            {...rest}
        />
    );
}

const DigitInputHiddenInput = OneTimePasswordFieldPrimitives.OneTimePasswordFieldHiddenInput;

export { DigitInputRoot as Root, DigitInput as Input, DigitInputHiddenInput as HiddenInput };
