import type Decimal from "decimal.js";
import { Select as SelectPrimitives } from "radix-ui";
import * as React from "react";
import ArrowDown01Icon from "virtual:icons/hugeicons/arrow-down-01";

import { totalBalancePeriods, useDashboardParams } from "#/hooks/use-dashboard-params.ts";
import { useTranslation } from "#/hooks/use-translation.ts";
import { cn } from "#/utils/cn.ts";
import { currencyFormatter } from "#/utils/number-formatter.ts";
import { Button } from "../button.tsx";
import { LegendDot } from "../legend-dot.tsx";
import PieChart from "../pie-chart.tsx";
import * as Select from "../ui/select.tsx";

type SpendingByCategoryData = {
    id: string;
    name: string;
    value: Decimal.Value;
    color: string;
    percentage: number;
};

type SpendingByCategoryWidgetProps = React.HTMLAttributes<HTMLDivElement> & {
    title: string;
    data: SpendingByCategoryData[];
};

export function SpendingByCategoryWidget({ title, data, className, ...rest }: SpendingByCategoryWidgetProps) {
    const { t, language } = useTranslation();
    const { spendingByCategoryPeriod, setParams } = useDashboardParams();

    return (
        <div className={cn("w-full", className)} {...rest}>
            <div className="flex items-start gap-3">
                <div className="flex-1">
                    <div className="text-label-md text-(--text-strong-950)">{title}</div>
                    <div className="mt-1 text-paragraph-sm text-(--text-sub-600)">
                        Hover over chart segments for details
                    </div>
                </div>

                <Select.Root
                    $size="xs"
                    $variant="compact"
                    onValueChange={(value) => setParams({ spendingByCategoryPeriod: value }, { shallow: false })}
                    value={spendingByCategoryPeriod}
                >
                    <SelectPrimitives.Trigger asChild>
                        <Button
                            $size="xxs"
                            $style="stroke"
                            $type="neutral"
                            className="gap-2 px-2.5"
                            trailingIcon={ArrowDown01Icon}
                            trailingIconClassName="size-4"
                        >
                            <Select.Value />
                        </Button>
                    </SelectPrimitives.Trigger>
                    <Select.Content align="center">
                        {totalBalancePeriods.map((item) => (
                            <Select.Item key={item} value={item}>
                                {t(`common.periods.${item}`)}
                            </Select.Item>
                        ))}
                    </Select.Content>
                </Select.Root>
            </div>

            <div className="grid gap-4">
                <div className="min-h-64 flex-1 lg:col-span-2 lg:h-full">
                    <PieChart data={data} />
                </div>

                <div className="min-w-0 flex-1 lg:col-span-3">
                    <div className="space-y-1.5">
                        {data.length > 0 ? (
                            data.map((item) => (
                                <div
                                    className="flex items-center justify-between gap-2 rounded-6 px-2 py-1.5 transition-colors hover:bg-(--bg-weak-50)"
                                    key={item.name}
                                    title={`${item.name}: ${currencyFormatter({ amount: item.value, currency: "USD", locale: language })} (${item.percentage}%)`}
                                >
                                    <div className="flex items-center gap-2 text-label-sm text-(--text-sub-600)">
                                        <LegendDot className="flex-shrink-0" style={{ backgroundColor: item.color }} />
                                        <span className="truncate">{item.name}</span>
                                    </div>

                                    <div className="flex flex-shrink-0 items-center gap-1.5 tabular-nums">
                                        <div className="text-label-sm text-(--text-sub-600)">
                                            {currencyFormatter({
                                                amount: item.value,
                                                currency: "USD",
                                                locale: language,
                                            })}
                                        </div>
                                        <div className="text-paragraph-sm text-(--text-disabled-300)">·</div>
                                        <div className="text-paragraph-sm text-(--text-soft-400)">
                                            {item.percentage}%
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex items-center justify-center py-8">
                                <div className="text-center">
                                    <div className="text-paragraph-sm text-(--text-sub-600)">No spending data</div>
                                    <div className="mt-1 text-paragraph-xs text-(--text-soft-400)">
                                        No expenses found for the selected period
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
