"use client";

import { format } from "date-fns";
import * as React from "react";
import {
    CartesianGrid,
    Line,
    LineChart,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from "recharts";

import useBreakpoint from "#/hooks/use-breakpoint.ts";
import { useTranslation } from "#/hooks/use-translation.ts";
import { type Trend } from "#/types/index.js";
import { cn } from "#/utils/cn.ts";
import { currencyFormatter } from "#/utils/number-formatter.ts";

function useTooltipPosition(chartRef: React.RefObject<HTMLDivElement | null>) {
    const [tooltipPos, setTooltipPos] = React.useState({
        x: 0,
        y: 0,
        position: "left" as "left" | "right",
    });

    React.useEffect(() => {
        const handleUpdate = () => {
            if (chartRef.current) {
                const activeDot = chartRef.current.querySelector(".recharts-active-dot") as HTMLElement;

                if (activeDot) {
                    const chartRect = chartRef.current.getBoundingClientRect();
                    const activeDotRect = activeDot.getBoundingClientRect();

                    // Calculate the x position relative to the chart
                    const xPos = activeDotRect.x - chartRect.x + activeDotRect.width / 2;
                    const yPos = activeDotRect.y - chartRect.y + activeDotRect.height / 2;

                    // Determine if the dot is in the left or right half of the chart
                    const position = xPos > chartRect.width / 2 ? "right" : "left";

                    setTooltipPos({
                        x: xPos,
                        y: yPos,
                        position,
                    });
                }
            }
        };

        const resizeObserver = new ResizeObserver(handleUpdate);
        const mutationObserver = new MutationObserver(handleUpdate);

        if (chartRef.current) {
            resizeObserver.observe(chartRef.current);
            mutationObserver.observe(chartRef.current, {
                childList: true,
                subtree: true,
                attributes: true,
            });
        }

        handleUpdate();

        return () => {
            resizeObserver.disconnect();
            mutationObserver.disconnect();
        };
    }, [chartRef]);

    return tooltipPos;
}

type CustomTooltipProps = React.ComponentProps<typeof RechartsTooltip>;

const CustomTooltip = ({ active, payload, wrapperClassName }: CustomTooltipProps) => {
    const { language } = useTranslation();

    if (active && payload && payload.length && payload[0]?.payload) {
        const currentValue = payload[0].payload.trend.current;
        const percentageChange = payload[0].payload.trend.percentageChange;
        const favorableDirection = payload[0].payload.trend.favorableDirection;

        return (
            <div className={cn("group", wrapperClassName)}>
                <div
                    className={cn(
                        "relative rounded-10 bg-(--bg-white-0) px-3 py-2.5 whitespace-nowrap ring-1 ring-(--stroke-soft-200)",
                        "-translate-y-1/2",
                        "group-[&.left]:translate-x-[21px]",
                        "group-[&.right]:-translate-x-[calc(100%+21px)]",
                    )}
                    style={{
                        filter: "drop-shadow(0px 12px 24px rgba(14, 18, 27, 0.06)) drop-shadow(0px 1px 2px rgba(14, 18, 27, 0.03))",
                    }}
                >
                    <div className="text-label-xs text-(--text-soft-400)">
                        {format(payload[0].payload.date, "E, MMM d")}
                    </div>
                    <div className="mt-1 flex items-center gap-1.5">
                        <div className="text-label-lg text-(--text-strong-950)">
                            {currencyFormatter({
                                amount: currentValue,
                                currency: "USD",
                                locale: language,
                            })}
                        </div>
                        {percentageChange && (
                            <div className="text-label-xs text-(--text-sub-600)">
                                <span
                                    className={cn({
                                        "text-state-success-base":
                                            favorableDirection === "up" && parseFloat(percentageChange) > 0,
                                        "text-state-error-base":
                                            favorableDirection === "down" && parseFloat(percentageChange) < 0,
                                    })}
                                >
                                    {parseFloat(percentageChange) > 0 ? "+" : ""}
                                    {percentageChange}%
                                </span>{" "}
                                vs prev
                            </div>
                        )}
                    </div>
                    <div
                        className={cn(
                            "absolute top-1/2 size-3 -translate-y-1/2",
                            "group-[&.right]:right-0 group-[&.right]:translate-x-[calc(100%-6px)]",
                            "group-[&.left]:left-0 group-[&.left]:-translate-x-[calc(100%-6px)]",
                        )}
                    >
                        <div
                            className={cn(
                                "absolute top-1/2 -translate-y-1/2 border [clip-path:polygon(0_100%,0_0,100%_100%)]",
                                "size-3 rounded-bl-4",
                                "border-stroke-soft-200 bg-(--bg-white-0)",
                                "group-[&.left]:rotate-45",
                                "group-[&.right]:-rotate-[135deg]",
                            )}
                        />
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export function TotalBalanceChart({
    interval,
    data,
}: {
    interval: string;
    data: {
        date: string;
        dateFormatted: string;
        trend: Trend;
    }[];
}) {
    const isFirstLoad = React.useRef(true);
    const { sm } = useBreakpoint();
    const chartRef = React.useRef<HTMLDivElement>(null);
    const { x: tooltipX, y: tooltipY, position } = useTooltipPosition(chartRef);

    React.useEffect(() => {
        isFirstLoad.current = false;
    }, []);

    const formatXAxis = (dateStr: string) => {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
            return dateStr;
        }

        switch (interval) {
            case "day":
                return format(date, "MM/dd");
            case "month":
                return format(date, "MMM");
            default:
                return format(date, "MMM");
        }
    };

    const yValues = data.map((d) => d.trend.current).filter((v) => v !== null && v !== undefined);
    const minValue = Math.min(...yValues);
    const maxValue = Math.max(...yValues);
    const range = maxValue - minValue;
    const padding = range > 0 ? range * 0.1 : maxValue * 0.05;

    const domainMin = minValue > 0 ? Math.max(0, minValue - padding) : minValue - padding;
    const domainMax = maxValue + padding;

    const yDomain = yValues.length > 0 ? [domainMin, domainMax] : ["auto", "auto"];

    return (
        <ResponsiveContainer height={192} ref={chartRef} width="100%">
            <LineChart
                className={cn(
                    "[&_.recharts-cartesian-grid-horizontal>line]:stroke-(--bg-weak-50) [&_.recharts-cartesian-grid-horizontal>line]:[stroke-dasharray:0]",
                    "[&_.recharts-cartesian-grid-vertical>line:last-child]:opacity-0 [&_.recharts-cartesian-grid-vertical>line:nth-last-child(2)]:opacity-0",
                )}
                data={data}
                margin={{ top: 6, right: 0, left: 0, bottom: 6 }}
            >
                <RechartsTooltip
                    animationDuration={100}
                    content={<CustomTooltip />}
                    cursor={false}
                    isAnimationActive={true}
                    offset={0}
                    position={{ x: tooltipX, y: tooltipY }}
                    wrapperClassName={position}
                />
                <CartesianGrid className="stroke-(--stroke-soft-200)" strokeDasharray="4 4" />
                <XAxis
                    axisLine={false}
                    className="[&_.recharts-cartesian-axis-tick_text]:fill-(--text-soft-400) [&_.recharts-cartesian-axis-tick_text]:text-label-xs"
                    dataKey="date"
                    minTickGap={40}
                    padding={{ left: sm ? 30 : 4, right: sm ? 30 : 4 }}
                    tickFormatter={formatXAxis}
                    tickLine={false}
                    tickMargin={8}
                />
                <YAxis
                    axisLine={false}
                    className="[&_.recharts-cartesian-axis-tick_text]:fill-(--text-soft-400) [&_.recharts-cartesian-axis-tick_text]:text-label-xs"
                    dataKey="trend.current"
                    domain={yDomain}
                    orientation="right"
                    tickFormatter={(value) => {
                        const numValue = Number(value);
                        if (isNaN(numValue)) return "";
                        return new Intl.NumberFormat("en-US", {
                            notation: "compact",
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 1,
                        }).format(numValue);
                    }}
                    tickLine={false}
                    tickMargin={16}
                    type="number"
                />
                <Line
                    activeDot={{
                        r: 5.5,
                        strokeWidth: 3,
                        className: cn(
                            "stroke-(--stroke-white-0) [filter:drop-shadow(0_6px_10px_#0e121b0f)_drop-shadow(0_2px_4px_#0e121b08)]",
                        ),
                    }}
                    dataKey="trend.current"
                    dot={true}
                    isAnimationActive={isFirstLoad.current}
                    stroke="var(--color-primary)"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    type="monotone"
                />
            </LineChart>
        </ResponsiveContainer>
    );
}
