import * as React from "react";

import { cn } from "#/utils/cn.ts";

type LegendDotProps = {} & React.HTMLAttributes<HTMLDivElement>;

export function LegendDot({ className, ...rest }: LegendDotProps) {
    return (
        <div
            className={cn(
                "size-3 shrink-0 rounded-full border-2 border-(--stroke-white-0) bg-(--bg-soft-200) shadow-sm",
                className,
            )}
            {...rest}
        />
    );
}
