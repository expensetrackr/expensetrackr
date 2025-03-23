import { type Step, type Stepper } from "@stepperize/react";

import { Text } from "#/components/text.tsx";
import * as Button from "#/components/ui/button.tsx";
import { cn } from "#/utils/cn.ts";

interface CardFormProps<Steps extends Step[]> extends React.ComponentProps<"div"> {
    title?: string;
    description?: string;
    icon?: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
    stepper?: Stepper<Steps>;
    actions?: React.ReactNode;
    children: React.ReactNode;
}

export function Card<Steps extends Step[]>({
    icon,
    title,
    description,
    children,
    stepper,
    actions,
    ...props
}: CardFormProps<Steps>) {
    const Icon = icon;

    return (
        <div
            className={cn(
                "w-full duration-500 ease-out animate-in outline-none fade-in-0 slide-in-from-bottom-3 focus:outline-none min-[390px]:w-max",
                props.className,
            )}
            {...props}
        >
            <div className="flex w-full max-w-[572px] shrink-0 flex-col items-center gap-6 px-4">
                {Icon || title || description ? (
                    <div className="flex w-full flex-col items-center gap-2">
                        {Icon ? (
                            <div
                                className={cn(
                                    "relative flex size-[68px] shrink-0 items-center justify-center rounded-full backdrop-blur-xl lg:size-24",
                                    // bg
                                    "before:absolute before:inset-0 before:rounded-full",
                                    "before:bg-gradient-to-b before:from-neutral-500 before:to-transparent before:opacity-10",
                                )}
                            >
                                <div className="relative z-10 flex size-12 items-center justify-center rounded-full bg-(--bg-white-0) shadow-xs ring-1 ring-(--stroke-soft-200) ring-inset lg:size-16">
                                    <Icon className="size-6 text-(--icon-sub-600) lg:size-8" />
                                </div>
                            </div>
                        ) : null}

                        {title || description ? (
                            <div className="flex flex-col items-center gap-1">
                                {title ? <h1 className="text-h6 lg:text-h5">{title}</h1> : null}
                                {description ? (
                                    <Text
                                        className="text-center lg:text-paragraph-md"
                                        key={`${stepper?.current.id}-description`}
                                    >
                                        {description}
                                    </Text>
                                ) : null}
                            </div>
                        ) : null}
                    </div>
                ) : null}

                <div
                    className="w-full shrink-0 rounded-20 bg-(--bg-white-0) shadow-xs ring-1 ring-(--stroke-soft-200) ring-inset min-[420px]:w-[400px]"
                    data-card-content-wrapper
                >
                    <div className="flex flex-col gap-3.5 p-4" data-card-content>
                        {children}
                    </div>

                    {(!stepper?.isFirst || actions) && (
                        <div className="flex items-center gap-3 border-t border-t-(--stroke-soft-200) px-5 py-4">
                            {stepper && !stepper.isFirst && (
                                <Button.Root
                                    $size="sm"
                                    $style="stroke"
                                    $type="neutral"
                                    className="w-full"
                                    disabled={stepper.isFirst}
                                    onClick={stepper.prev}
                                >
                                    Back
                                </Button.Root>
                            )}
                            {actions}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
