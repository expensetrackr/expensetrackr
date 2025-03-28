import { format } from "date-fns";

import * as Badge from "#/components/ui/badge.tsx";
import { cnMerge } from "#/utils/cn.ts";
import ChartStepLine from "../chart-step-line.tsx";

export function TotalBalanceWidget({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cnMerge(
                "relative flex h-[178px] flex-col rounded-16 bg-(--bg-white-0) p-5 pb-[18px] shadow-xs ring-1 ring-(--stroke-soft-200) ring-inset",
                className,
            )}
            {...rest}
        >
            <div className="flex flex-col gap-5">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="text-paragraph-sm text-(--text-sub-600)">Total Balance</div>
                        <div className="mt-1 flex items-center gap-2">
                            <div className="text-title-h5 text-text-strong-950">$14,480.24</div>
                            <Badge.Root $color="green" $size="md" $style="light">
                                +5%
                            </Badge.Root>
                        </div>
                    </div>
                </div>

                <ChartStepLine
                    categories={["value"]}
                    data={[]}
                    index="date"
                    xAxisProps={{
                        tickFormatter: (value) => format(value, "MMM").toLocaleUpperCase(),
                        tickMargin: 8,
                    }}
                    yAxisProps={{ hide: true }}
                />
            </div>
        </div>
    );
}
