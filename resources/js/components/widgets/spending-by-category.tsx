import type Decimal from "decimal.js";
import * as React from "react";

import { totalBalancePeriods, useDashboardParams } from "#/hooks/use-dashboard-params.ts";
import { useTranslation } from "#/hooks/use-translation.ts";
import { cn } from "#/utils/cn.ts";
import { currencyFormatter } from "#/utils/number-formatter.ts";
import { Button } from "../button.tsx";
import { LegendDot } from "../legend-dot.tsx";
import PieChart from "../pie-chart.tsx";
import { ScrollArea } from "../ui/scroll-sarea.tsx";
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
    const [showAllCategories, setShowAllCategories] = React.useState(false);

    return (
        <div
            className={cn(
                "relative flex h-full flex-col rounded-16 bg-(--bg-white-0) p-5 shadow-xs ring-1 ring-(--stroke-soft-200) ring-inset",
                className,
            )}
            {...rest}
        >
            <div className="flex items-center gap-2">
                <div className="flex-1">
                    <div className="flex items-start gap-1">
                        <div className="text-paragraph-sm text-(--text-sub-600)">{title}</div>
                    </div>
                    <div className="mt-1 text-paragraph-xs text-(--text-soft-400)">
                        Hover over chart segments for details
                    </div>
                </div>

                <div>
                    <Select.Root
                        $size="xs"
                        $variant="compact"
                        onValueChange={(value) => setParams({ spendingByCategoryPeriod: value }, { shallow: false })}
                        value={spendingByCategoryPeriod}
                    >
                        <Select.Trigger>
                            <Select.Value />
                        </Select.Trigger>
                        <Select.Content align="center">
                            {totalBalancePeriods.map((item) => (
                                <Select.Item key={item} value={item}>
                                    {t(`common.periods.${item}`)}
                                </Select.Item>
                            ))}
                        </Select.Content>
                    </Select.Root>
                </div>
            </div>

            <div className="mt-4 grid flex-1 grid-cols-1 gap-4 lg:grid-cols-5 lg:items-center">
                <div className="min-h-64 flex-1 lg:col-span-2 lg:h-full lg:min-h-auto">
                    <PieChart data={data} />
                </div>

                <div className="min-w-0 flex-1 lg:col-span-3">
                    <ScrollArea aria-orientation="horizontal" className="h-49 space-y-1.5">
                        {data.length > 0 ? (
                            (showAllCategories ? data : data.slice(0, 5)).map((item) => (
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

                        {data.length > 5 && (
                            <div className="pt-2 text-center">
                                <Button
                                    $size="xxs"
                                    $style="ghost"
                                    $type="neutral"
                                    onClick={() => setShowAllCategories(!showAllCategories)}
                                >
                                    {showAllCategories ? (
                                        <>
                                            Show less
                                            <span className="transform transition-transform duration-200">↑</span>
                                        </>
                                    ) : (
                                        <>
                                            +{data.length - 5} more categories
                                            <span className="transform transition-transform duration-200">↓</span>
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
}
