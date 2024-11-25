import { Button } from "#/components/button.tsx";
import { Text } from "#/components/text.tsx";

import { stepperInstance } from "./stepper.ts";

type CardFormProps = {
    title?: string;
    description?: string;
    icon?: (props: React.SVGProps<SVGSVGElement>) => React.ReactElement;
    children: React.ReactNode;
};

export function Card({ icon, title, description, children }: CardFormProps) {
    const stepper = stepperInstance.useStepper();

    const Icon = icon;

    return (
        <div className="flex flex-col gap-6 sm:mx-auto sm:max-w-[540px]">
            {Icon || title || description ? (
                <div className="flex flex-col items-center gap-2">
                    {Icon ? (
                        <div className="rounded-full bg-gradient-to-b from-neutral-500/10 to-transparent p-4 backdrop-blur-md">
                            <div className="rounded-full border border-(--stroke-soft-200) bg-(--bg-white-0) p-4">
                                <Icon className="size-8 text-(--icon-sub-600)" />
                            </div>
                        </div>
                    ) : null}

                    {title || description ? (
                        <div className="flex flex-col items-center gap-1">
                            {title && <h1 className="text-h5">{title}</h1>}
                            {description && <Text className="text-center text-paragraph-md">{description}</Text>}
                        </div>
                    ) : null}
                </div>
            ) : null}

            <div className="mx-auto w-full max-w-[400px] rounded-20 border border-(--stroke-soft-200) bg-(--bg-white-0) shadow-xs">
                <div className="flex flex-col gap-3 p-4">{children}</div>

                <div className="flex items-center gap-3 border-t border-t-(--stroke-soft-200) px-5 py-4">
                    {!stepper.isLast && !stepper.isFirst && (
                        <Button
                            $color="neutral"
                            $size="sm"
                            $variant="stroke"
                            className="w-full"
                            disabled={stepper.isFirst}
                            onClick={stepper.prev}
                        >
                            Back
                        </Button>
                    )}
                    <Button $size="sm" className="w-full" type="submit">
                        Continue
                    </Button>
                </div>
            </div>
        </div>
    );
}
