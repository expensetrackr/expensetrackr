import { Label as LabelPrimitives } from "radix-ui";

import { cn } from "#/utils/cn.ts";

type LabelRootProps = React.ComponentPropsWithoutRef<typeof LabelPrimitives.Root> & {
    disabled?: boolean;
};

function LabelRoot({ className, ...props }: LabelRootProps) {
    return (
        <LabelPrimitives.Root
            className={cn(
                "group flex cursor-pointer items-center gap-px text-label-sm aria-disabled:text-(--text-disabled-300)",
                {
                    "aria-disabled": props.disabled,
                },
                className,
            )}
            {...props}
        />
    );
}

function LabelAsterisk({ className, ...props }: React.ComponentPropsWithRef<"span">) {
    return (
        <span className={cn("text-primary group-aria-disabled:text-(--text-disabled-300)", className)} {...props}>
            *
        </span>
    );
}

function LabelSub({ className, ...props }: React.ComponentPropsWithRef<"span">) {
    return (
        <span
            className={cn(
                "text-paragraph-sm text-(--text-sub-600) group-aria-disabled:text-(--text-disabled-300)",
                className,
            )}
            {...props}
        />
    );
}

export { LabelRoot as Root, LabelAsterisk as Asterisk, LabelSub as Sub };
