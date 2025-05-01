import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import * as React from "react";

import { cn } from "#/utils/cn.ts";

const RadioGroup = RadioGroupPrimitive.Root;
RadioGroup.displayName = "RadioGroup";

function RadioGroupItem({ className, ...rest }: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
    const filterId = React.useId();

    return (
        <RadioGroupPrimitive.Item
            className={cn("group/radio relative size-5 shrink-0 outline-none focus:outline-none", className)}
            {...rest}
        >
            <svg
                className={cn(["absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"])}
                fill="none"
                height="20"
                viewBox="0 0 20 20"
                width="20"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle
                    className={cn(
                        "fill-(--bg-soft-200) transition duration-200 ease-out",
                        // hover
                        "group-hover/radio:fill-(--bg-sub-300)",
                        // focus
                        "group-focus/radio:fill-primary",
                        // disabled
                        "group-disabled/radio:fill-(--bg-soft-200)",
                        // disabled chcked
                        "group-data-[state=checked]/radio:fill-(--bg-white-0)",
                    )}
                    cx="10"
                    cy="10"
                    r="8"
                />
                <g filter={`url(#${filterId})`}>
                    <circle
                        className={cn(
                            "fill-(--bg-white-0)",
                            // disabled
                            "group-disabled/radio:hidden",
                        )}
                        cx="10"
                        cy="10"
                        r="6.5"
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
                        <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_515_4243" />
                        <feBlend in="SourceGraphic" in2="effect1_dropShadow_515_4243" mode="normal" result="shape" />
                    </filter>
                </defs>
            </svg>

            <RadioGroupPrimitive.Indicator asChild>
                <svg
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    fill="none"
                    height="20"
                    viewBox="0 0 20 20"
                    width="20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <circle
                        className={cn(
                            "stroke-primary transition duration-200 ease-out",
                            // hover
                            "group-hover/radio:stroke-primary-darker",
                            // focus
                            "group-focus/radio:stroke-primary-dark",
                            // disabled
                            "group-disabled/radio:stroke-(--bg-soft-200)",
                        )}
                        cx="10"
                        cy="10"
                        r="6"
                        strokeWidth="4"
                    />
                </svg>
            </RadioGroupPrimitive.Indicator>
        </RadioGroupPrimitive.Item>
    );
}
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup as Group, RadioGroupItem as Item };
