import { type TooltipArrowProps } from "@radix-ui/react-tooltip";
import * as React from "react";
import { Bar, BarChart, type BarProps, Tooltip as RechartsTooltip, XAxis, YAxis } from "recharts";

import useBreakpoint from "#/hooks/use-breakpoint.ts";
import { useTranslation } from "#/hooks/use-translation.ts";
import { currencyFormatter } from "#/utils/number-formatter.ts";
import { ChartContainer, type ChartConfig } from "./chart.tsx";
import { tooltipVariants } from "./ui/tooltip.tsx";

const GAP = 2;

export const chartConfig = {
    scheduled: {
        label: "Scheduled",
        color: "var(--state-feature-base)",
    },
    expenses: {
        label: "Expenses",
        color: "var(--state-verified-base)",
    },
    income: {
        label: "Income",
        color: "var(--state-information-base)",
    },
} satisfies ChartConfig;

type CustomTooltipProps = React.ComponentProps<typeof RechartsTooltip> & {
    renderContent: (props: { payload: any }) => React.ReactNode;
};

const CustomTooltip = ({ active, payload, renderContent }: CustomTooltipProps) => {
    const { arrow, content } = tooltipVariants({
        $size: "sm",
        $variant: "dark",
    });

    if (active && payload && payload.length) {
        return (
            <div className="-translate-x-1/2 -translate-y-full">
                <div className={content()}>
                    {renderContent({ payload })}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
                        <div className={arrow()} />
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

const TooltipContent = ({ payload }: { payload: any }) => {
    const { language } = useTranslation();

    return (
        <div className="flex flex-col gap-1">
            <p className="text-state-information-base">
                <span className="font-bold">Income: </span>
                <span>{currencyFormatter({ locale: language, amount: payload[0].payload.income })}</span>
            </p>
            <p className="text-state-verified-base">
                <span className="font-bold">Expenses: </span>
                <span>{currencyFormatter({ locale: language, amount: payload[0].payload.expenses })}</span>
            </p>
            <p className="text-state-feature-base">
                <span className="font-bold">Scheduled: </span>
                <span>{currencyFormatter({ locale: language, amount: payload[0].payload.scheduled })}</span>
            </p>
        </div>
    );
};

export function BudgetOverviewChart({ data }: { data: any }) {
    const { md, lg } = useBreakpoint();
    const [tooltipPos, setTooltipPos] = React.useState<TooltipArrowProps>({
        x: undefined,
        y: undefined,
    });

    return (
        <ChartContainer className="h-[212px] w-full" config={chartConfig}>
            <BarChart
                barCategoryGap={lg ? 12 : md ? 4 : 2}
                data={data}
                margin={{
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                }}
            >
                <RechartsTooltip
                    allowEscapeViewBox={{
                        x: true,
                        y: true,
                    }}
                    animationDuration={200}
                    content={<CustomTooltip renderContent={TooltipContent} />}
                    cursor={false}
                    isAnimationActive={true}
                    offset={0}
                    position={{
                        x: tooltipPos.x as number,
                        y: tooltipPos.y as number,
                    }}
                />
                <XAxis
                    axisLine={false}
                    dataKey="month"
                    tickFormatter={(value) => value.slice(0, 1)}
                    tickLine={false}
                    tickMargin={12}
                />
                <YAxis
                    axisLine={false}
                    tickFormatter={(value) => {
                        return Intl.NumberFormat("en", { notation: "compact" }).format(value);
                    }}
                    tickLine={false}
                    tickMargin={0}
                    width={32}
                />
                {Object.keys(chartConfig).map((dataKey, i) => {
                    return (
                        <Bar
                            dataKey={dataKey}
                            fill={chartConfig[dataKey as keyof typeof chartConfig].color}
                            key={dataKey}
                            onMouseEnter={(e: any) => {
                                setTooltipPos({ x: e.width + e.x - 8, y: e.y - 8 });
                            }}
                            shape={(props: BarProps) => {
                                let { fill, x, y, width, height } = props;
                                y = Number(y);

                                const isFirst = i === 0;
                                const isLast = i === Object.keys(chartConfig).length - 1;
                                const computedHeight = isLast || isFirst ? height! - GAP / 2 : height! - GAP;

                                return (
                                    <>
                                        {isLast && (
                                            <rect fill="var(--bg-weak-50)" height={y - GAP} width={width} x={x} y={0} />
                                        )}
                                        <rect
                                            fill={fill}
                                            height={computedHeight}
                                            width={width}
                                            x={x}
                                            y={isLast ? y : y + GAP / 2}
                                        />
                                    </>
                                );
                            }}
                            stackId="a"
                        />
                    );
                })}
            </BarChart>
        </ChartContainer>
    );
}
