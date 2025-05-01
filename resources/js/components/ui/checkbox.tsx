import { Checkbox as CheckboxPrimitive } from "radix-ui";
import * as React from "react";

import { cn } from "#/utils/cn.ts";

function IconCheck({ ...rest }: React.SVGProps<SVGSVGElement>) {
    return (
        <svg fill="none" height="8" viewBox="0 0 10 8" width="10" xmlns="http://www.w3.org/2000/svg" {...rest}>
            <path className="stroke-white" d="M1 3.5L4 6.5L9 1.5" strokeWidth="1.5" />
        </svg>
    );
}

function IconIndeterminate({ ...rest }: React.SVGProps<SVGSVGElement>) {
    return (
        <svg fill="none" height="2" viewBox="0 0 8 2" width="8" xmlns="http://www.w3.org/2000/svg" {...rest}>
            <path className="stroke-white" d="M0 1H8" strokeWidth="1.5" />
        </svg>
    );
}

function Checkbox({ className, checked, ...rest }: React.CustomComponentPropsWithRef<typeof CheckboxPrimitive.Root>) {
    const filterId = React.useId();

    // precalculated by .getTotalLength()
    const TOTAL_LENGTH_CHECK = 11.313708305358887;
    const TOTAL_LENGTH_INDETERMINATE = 8;

    return (
        <CheckboxPrimitive.Root
            checked={checked}
            className={cn(
                "group/checkbox relative flex size-5 shrink-0 items-center justify-center outline-none",
                "focus:outline-none",
                className,
            )}
            {...rest}
        >
            <svg fill="none" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                <rect
                    className={cn(
                        "fill-(--bg-soft-200) transition duration-200 ease-out",
                        // hover
                        "group-hover/checkbox:fill-(--bg-sub-300)",
                        // focus
                        "group-focus/checkbox:fill-primary",
                        // disabled
                        "group-disabled/checkbox:fill-(--bg-soft-200)",
                        // hover
                        "group-hover/checkbox:group-data-[state=checked]/checkbox:fill-primary-darker",
                        "group-hover/checkbox:group-data-[state=indeterminate]/checkbox:fill-primary-darker",
                        // focus
                        "group-focus/checkbox:group-data-[state=checked]/checkbox:fill-primary-dark",
                        "group-focus/checkbox:group-data-[state=indeterminate]/checkbox:fill-primary-dark",
                        // checked
                        "group-data-[state=checked]/checkbox:fill-primary",
                        "group-data-[state=indeterminate]/checkbox:fill-primary",
                        // disabled checked
                        "group-disabled/checkbox:group-data-[state=checked]/checkbox:fill-(--bg-soft-200)",
                        "group-disabled/checkbox:group-data-[state=indeterminate]/checkbox:fill-(--bg-soft-200)",
                    )}
                    height="16"
                    rx="4"
                    width="16"
                    x="2"
                    y="2"
                />
                <g filter={`url(#${filterId})`}>
                    <rect
                        className={cn(
                            "fill-(--bg-white-0) transition duration-200 ease-out",
                            // disabled
                            "group-disabled/checkbox:hidden",
                            // checked
                            "group-data-[state=checked]/checkbox:opacity-0",
                            "group-data-[state=indeterminate]/checkbox:opacity-0",
                        )}
                        height="13"
                        rx="2.6"
                        width="13"
                        x="3.5"
                        y="3.5"
                    />
                </g>
                <defs>
                    <filter
                        colorInterpolationFilters="sRGB"
                        filterUnits="userSpaceOnUse"
                        height="17"
                        id={filterId}
                        width="17"
                        x="1.5"
                        y="3.5"
                    >
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feColorMatrix
                            in="SourceAlpha"
                            result="hardAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        />
                        <feOffset dy="2" />
                        <feGaussianBlur stdDeviation="1" />
                        <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 0.105882 0 0 0 0 0.109804 0 0 0 0 0.113725 0 0 0 0.12 0"
                        />
                        <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_34646_2602" />
                        <feBlend in="SourceGraphic" in2="effect1_dropShadow_34646_2602" mode="normal" result="shape" />
                    </filter>
                </defs>
            </svg>
            <CheckboxPrimitive.Indicator
                className="[&_path]:transition-all [&_path]:duration-300 [&_path]:ease-out [&_svg]:opacity-0"
                forceMount
            >
                <IconCheck
                    className={cn(
                        "absolute top-1/2 left-1/2 shrink-0 -translate-x-1/2 -translate-y-1/2",
                        // checked
                        "group-data-[state=checked]/checkbox:opacity-100",
                        "group-data-[state=checked]/checkbox:[&>path]:[stroke-dashoffset:0]",
                        // path
                        "[&>path]:[stroke-dasharray:var(--total-length)] [&>path]:[stroke-dashoffset:var(--total-length)]",
                        "group-data-[state=indeterminate]/checkbox:invisible",
                    )}
                    style={{
                        ["--total-length" as any]: TOTAL_LENGTH_CHECK,
                    }}
                />
                <IconIndeterminate
                    className={cn(
                        "absolute top-1/2 left-1/2 shrink-0 -translate-x-1/2 -translate-y-1/2",
                        // indeterminate
                        "group-data-[state=indeterminate]/checkbox:opacity-100",
                        "group-data-[state=indeterminate]/checkbox:[&>path]:[stroke-dashoffset:0]",
                        // path
                        "[&>path]:[stroke-dasharray:var(--total-length)] [&>path]:[stroke-dashoffset:var(--total-length)]",
                        "invisible group-data-[state=indeterminate]/checkbox:visible",
                    )}
                    style={{
                        ["--total-length" as any]: TOTAL_LENGTH_INDETERMINATE,
                    }}
                />
            </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
    );
}
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox as Root };
