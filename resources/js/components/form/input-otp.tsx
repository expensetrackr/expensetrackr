import { OTPInput, OTPInputContext, type OTPInputProps } from "input-otp";
import * as React from "react";
import DotIcon from "virtual:icons/lucide/dot";

import { cx } from "#/utils/cva.ts";
import { twc } from "#/utils/twc.ts";

export function InputOTP({
    ref,
    className,
    containerClassName,
    ...props
}: OTPInputProps & { ref?: React.ForwardedRef<HTMLInputElement> }) {
    return (
        <OTPInput
            className={cx("disabled:cursor-not-allowed", className)}
            containerClassName={cx("flex items-center has-[:disabled]:opacity-50", containerClassName)}
            ref={ref}
            {...props}
        />
    );
}

export const InputOTPGroup = twc.div`flex items-center`;

type InputOTPSlotProps = React.ComponentProps<"div"> & {
    index: number;
    invalid?: boolean;
};

export function InputOTPSlot({ ref, index, invalid, className, ...props }: InputOTPSlotProps) {
    const inputOTPContext = React.useContext(OTPInputContext);
    const slot = inputOTPContext.slots[index];

    return (
        <div
            className={cx(
                "relative flex h-16 w-full items-center justify-center border-y border-r bg-(--bg-white-0) text-h5 transition after:outline after:outline-transparent first:rounded-l-10 first:border-l last:rounded-r-10 hover:bg-(--bg-weak-50)",
                slot?.isActive &&
                    "z-10 border-(--stroke-strong-950) after:pointer-events-none after:absolute after:inset-0 after:outline-2 after:outline-offset-[3px] after:outline-neutral-alpha-16 after:transition",
                invalid && "border-state-error-base",
                className,
            )}
            ref={ref}
            {...props}
        >
            {slot?.char}
            {slot?.hasFakeCaret && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="h-8 w-px animate-caret-blink bg-(--text-strong-950) duration-1000" />
                </div>
            )}
        </div>
    );
}

export function InputOTPSeparator({ ref, ...props }: React.ComponentProps<"div">) {
    return (
        <div ref={ref} role="separator" tabIndex={0} {...props}>
            <DotIcon />
        </div>
    );
}
