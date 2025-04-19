import OtpInput, { type OTPInputProps } from "react-otp-input";

import { type TwcComponentProps } from "react-twc";
import { cn } from "#/utils/cn.ts";
import { twc } from "#/utils/twc.ts";

type OtpOptions = Omit<OTPInputProps, "renderInput">;

type DigitInputProps = {
    $error?: boolean;
    className?: string;
    disabled?: boolean;
} & OtpOptions;

function DigitInput({ $error, className, disabled, ...rest }: DigitInputProps) {
    return (
        <OtpInput
            containerStyle={cn("flex w-full items-center gap-2.5", className)}
            renderInput={(inputProps) => <DigitInputSlot $error={$error} disabled={disabled} {...inputProps} />}
            skipDefaultStyles
            {...rest}
        />
    );
}
DigitInput.displayName = "DigitInput";

type DigitInputSlotProps = TwcComponentProps<"input"> & {
    $error?: boolean;
};

const DigitInputSlot = twc.input<DigitInputSlotProps>(({ $error }) => [
    "h-16 w-full min-w-0 rounded-10 bg-(--bg-white-0) text-center text-h5 text-(--text-strong-950) ring-1 shadow-xs ring-(--stroke-soft-200) outline-none ring-inset",
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
]);

export { DigitInput as Root };
