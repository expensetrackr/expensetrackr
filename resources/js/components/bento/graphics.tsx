import * as React from "react";
import ArrowLeftDownFillIcon from "virtual:icons/ri/arrow-left-down-fill";
import ArrowRightUpFillIcon from "virtual:icons/ri/arrow-right-up-fill";
import CalendarCheckFillIcon from "virtual:icons/ri/calendar-check-fill";
import FileChartIcon from "virtual:icons/ri/file-chart-line";

import { BudgetOverviewChart, chartConfig } from "../budget-overview-stack-bar-chart.tsx";
import { ChartLegend } from "../chart.tsx";
import * as Badge from "../ui/badge.tsx";
import * as Divider from "../ui/divider.tsx";
import * as Select from "../ui/select.tsx";
import * as WidgetBox from "../widget-box.tsx";

const periods = [
    {
        value: "3-months",
        label: "3 Months",
    },
    {
        value: "6-months",
        label: "6 Months",
    },
    {
        value: "last-year",
        label: "Last Year",
    },
    {
        value: "all",
        label: "All Time",
    },
];

const chartData = [
    { month: "January", income: 18600, expenses: 8000, scheduled: 15000 },
    { month: "February", income: 3050, expenses: 20000, scheduled: 12000 },
    { month: "March", income: 23700, expenses: 12000, scheduled: 17000 },
    { month: "April", income: 7300, expenses: 19000, scheduled: 9000 },
    { month: "May", income: 20900, expenses: 13000, scheduled: 5000 },
    { month: "June", income: 21400, expenses: 14000, scheduled: 7000 },
    { month: "July", income: 21400, expenses: 14000, scheduled: 8000 },
    { month: "August", income: 12000, expenses: 14000, scheduled: 14000 },
    { month: "September", income: 10000, expenses: 11000, scheduled: 13000 },
    { month: "October", income: 7000, expenses: 15000, scheduled: 16000 },
    { month: "November", income: 19000, expenses: 14000, scheduled: 12000 },
    { month: "December", income: 17000, expenses: 16000, scheduled: 20000 },
];

export function BentoHistoricalGraphics({ ...rest }: React.CustomComponentPropsWithRef<typeof WidgetBox.Root>) {
    return (
        <WidgetBox.Root {...rest}>
            <WidgetBox.Header>
                <WidgetBox.HeaderIcon as={FileChartIcon} />
                Budget Overview
                <div className="flex items-center gap-6">
                    <div className="hidden items-center gap-6 lg:flex">
                        {Object.entries(chartConfig).map(([key, value]) => (
                            <ChartLegend color={value.color} key={key} label={value.label} />
                        ))}
                    </div>
                    <Select.Root $size="xs" $variant="compact" defaultValue="last-year">
                        <Select.Trigger>
                            <Select.Value />
                        </Select.Trigger>
                        <Select.Content align="end">
                            {periods.map((item) => (
                                <Select.Item key={item.value} value={item.value}>
                                    {item.label}
                                </Select.Item>
                            ))}
                        </Select.Content>
                    </Select.Root>
                </div>
            </WidgetBox.Header>

            <div className="flex flex-col gap-4">
                <Divider.Root />
                <div className="-my-1 flex flex-col divide-y divide-(--stroke-soft-200) lg:my-0 lg:flex-row lg:divide-x lg:divide-y-0">
                    <div className="flex w-full min-w-0 gap-3 py-3 first:pt-0 last:pb-0 lg:px-8 lg:py-0 lg:first:pl-0">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full shadow-xs ring-1 ring-(--stroke-soft-200) ring-inset">
                            <ArrowLeftDownFillIcon className="text-information-base size-5" />
                        </div>
                        <div className="space-y-1">
                            <div className="text-subheading-2xs text-(--text-soft-400) uppercase">INCOME</div>
                            <div className="flex items-center gap-1">
                                <span className="text-label-md">$96,000.00</span>
                                <Badge.Root $color="green" $size="md" $style="light">
                                    +5%
                                </Badge.Root>
                            </div>
                        </div>
                    </div>

                    <div className="flex w-full min-w-0 gap-3 py-3 first:pt-0 last:pb-0 lg:px-8 lg:py-0 lg:first:pl-0">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full shadow-xs ring-1 ring-(--stroke-soft-200) ring-inset">
                            <ArrowRightUpFillIcon className="size-5 text-state-verified-base" />
                        </div>
                        <div className="space-y-1">
                            <div className="text-subheading-2xs text-(--text-soft-400) uppercase">EXPENSES</div>
                            <div className="flex items-center gap-1">
                                <span className="text-label-md">$24,000.00</span>
                                <Badge.Root $color="red" $size="md" $style="light">
                                    -3%
                                </Badge.Root>
                            </div>
                        </div>
                    </div>

                    <div className="flex w-full min-w-0 gap-3 py-3 first:pt-0 last:pb-0 lg:px-8 lg:py-0 lg:first:pl-0">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full shadow-xs ring-1 ring-(--stroke-soft-200) ring-inset">
                            <CalendarCheckFillIcon className="size-5 text-state-feature-base" />
                        </div>
                        <div className="space-y-1">
                            <div className="text-subheading-2xs text-(--text-soft-400) uppercase">scheduled</div>
                            <div className="flex items-center gap-1">
                                <span className="text-label-md">$14,000.00</span>
                            </div>
                        </div>
                    </div>
                </div>
                <Divider.Root />
                <BudgetOverviewChart data={chartData} />
                <div className="flex flex-wrap items-center justify-center gap-4 lg:hidden">
                    {Object.entries(chartConfig).map(([key, value]) => (
                        <ChartLegend color={value.color} key={key} label={value.label} />
                    ))}
                </div>
            </div>
        </WidgetBox.Root>
    );
}
