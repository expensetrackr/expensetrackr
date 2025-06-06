import type Decimal from "decimal.js";
import { Select as SelectPrimitives } from "radix-ui";
import * as React from "react";
import ArrowDown01Icon from "virtual:icons/hugeicons/arrow-down-01";

import { totalBalancePeriods, useDashboardParams } from "#/hooks/use-dashboard-params.ts";
import { useTranslation } from "#/hooks/use-translation.ts";
import { type Trend } from "#/types/index.js";
import { cn } from "#/utils/cn.ts";
import { currencyFormatter } from "#/utils/number-formatter.ts";
import { Button } from "../button.tsx";
import { TotalBalanceChart } from "../charts/total-balance-chart.tsx";
import * as Badge from "../ui/badge.tsx";
import * as Select from "../ui/select.tsx";

type TotalBalanceWidgetProps = React.HTMLAttributes<HTMLDivElement> & {
    title: string;
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

export function TotalBalanceWidget({ title, netWorth, netWorthSeries, className, ...rest }: TotalBalanceWidgetProps) {
    const { t, language } = useTranslation();
    const { totalBalancePeriod, setParams } = useDashboardParams();

    return (
        <div className={cn(className)} {...rest}>
            <div className="flex flex-col justify-between gap-3 min-[1100px]:flex-col min-[1100px]:items-start sm:flex-row sm:items-center xl:flex-row xl:items-center">
                <div>
                    <div className="text-label-sm text-(--text-sub-600)">{title}</div>
                    <div className="mt-1 flex items-center gap-2">
                        <div className="text-h5 text-(--text-strong-950)">
                            {currencyFormatter({
                                amount: netWorth,
                                currency: "USD",
                                locale: language,
                            })}
                        </div>
                        <Badge.Root
                            $color={netWorthSeries.trend.favorableDirection === "up" ? "green" : "red"}
                            $size="md"
                            $style="lighter"
                        >
                            {netWorthSeries.trend.percentageChange}%
                        </Badge.Root>
                        <div className="text-label-xs text-(--text-sub-600)">
                            vs <span className="lowercase">{t(`common.periods.${totalBalancePeriod}`)}</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Select.Root
                        onValueChange={(value) => setParams({ totalBalancePeriod: value }, { shallow: false })}
                        value={totalBalancePeriod}
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
                        <Select.Content>
                            {totalBalancePeriods.map((item) => (
                                <Select.Item key={item} value={item}>
                                    {t(`common.periods.${item}`)}
                                </Select.Item>
                            ))}
                        </Select.Content>
                    </Select.Root>
                </div>
            </div>

            <div className="mt-4 h-full">
                <TotalBalanceChart data={netWorthSeries.values} interval={netWorthSeries.interval} />
            </div>
        </div>
    );
}
