import NumberFlow from "@number-flow/react";
import { format } from "date-fns";

import type Decimal from "decimal.js";
import { useTranslation } from "#/hooks/use-translation.ts";
import { type Trend } from "#/types/index.js";
import { cnMerge } from "#/utils/cn.ts";
import { decimalFlowFormatter } from "#/utils/currency-formatter.ts";
import { decimalFormatter } from "#/utils/number-formatter.ts";
import ChartStepLine from "../chart-step-line.tsx";
import * as Badge from "../ui/badge.tsx";

type TotalBalanceWidgetProps = React.HTMLAttributes<HTMLDivElement> & {
    netWorth: Decimal.Value;
    netWorthSeries: {
        startDate: string;
        endDate: string;
        interval: string;
        trend: Trend;
        values: {
            date: string;
            dateFormatted: string;
            trend: Trend;
        }[];
    };
};

export function TotalBalanceWidget({ netWorth, netWorthSeries, className, ...rest }: TotalBalanceWidgetProps) {
    const { language } = useTranslation();
    const netWorthFlow = decimalFlowFormatter({
        amount: netWorth,
        currency: "USD",
        language,
    });

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
                            <div className="text-h5">
                                <NumberFlow format={netWorthFlow.format} value={netWorthFlow.value} />
                            </div>
                            <Badge.Root
                                $color={netWorthSeries.trend.favorableDirection === "up" ? "green" : "red"}
                                $size="md"
                                $style="light"
                            >
                                {netWorthSeries.trend.percentageChange}%
                            </Badge.Root>
                        </div>
                    </div>
                </div>

                <ChartStepLine
                    categories={["value"]}
                    data={netWorthSeries.values.map((value) => ({
                        date: value.date,
                        value: +decimalFormatter(value.trend.current, language, "USD"),
                    }))}
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
