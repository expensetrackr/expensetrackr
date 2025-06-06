"use client";

import type Decimal from "decimal.js";
import { Cell, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Sector, Tooltip } from "recharts";
import { type PieSectorDataItem } from "recharts/types/polar/Pie";
import { type ActiveShape } from "recharts/types/util/types";

import { cn } from "#/utils/cn.ts";
import { currencyFormatter } from "#/utils/number-formatter.ts";

export const CIRCLE_SIZE = 90;
const INNER_RADIUS = 32;
const OUTER_RADIUS = 45;

const renderActiveShape: ActiveShape<PieSectorDataItem> = (props: PieSectorDataItem) => {
    const { cx, cy, innerRadius = 0, outerRadius = 0, startAngle, endAngle, ...rest } = props;

    return (
        <Sector
            cx={cx}
            cy={cy}
            endAngle={endAngle}
            innerRadius={innerRadius + 1}
            outerRadius={outerRadius - 1}
            startAngle={startAngle}
            {...rest}
            cornerRadius={0}
        />
    );
};

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        if (data.id === "empty") return null;

        return (
            <div className="rounded-12 bg-(--bg-white-0) px-3 py-2 shadow-lg ring-1 ring-(--stroke-soft-200) ring-inset">
                <div className="text-paragraph-xs font-medium text-(--text-strong-950)">{data.name}</div>
                <div className="mt-1 text-paragraph-xs text-(--text-sub-600)">
                    {currencyFormatter({ amount: data.value, currency: "USD", locale: "en-US" })} ({data.percentage}%)
                </div>
            </div>
        );
    }
    return null;
};

type PieChartData = {
    id: string;
    name: string;
    value: Decimal.Value;
    color: string;
    percentage?: number;
};

type PieChartProps = {
    data: PieChartData[];
    className?: string;
    circleSize?: number;
};

export default function PieChart({ data, className, circleSize }: PieChartProps) {
    // If circleSize is provided, use fixed size mode (legacy behavior)
    if (circleSize) {
        return (
            <div
                className={className}
                style={{
                    width: circleSize,
                    height: circleSize,
                }}
            >
                <RechartsPieChart
                    height={circleSize}
                    margin={{
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                    }}
                    width={circleSize}
                >
                    <Pie
                        activeIndex={data.length > 0 ? data.findIndex((d) => d.id === "others") : -1}
                        activeShape={data.length > 0 ? renderActiveShape : undefined}
                        cornerRadius={2}
                        cx={circleSize / 2}
                        cy={circleSize / 2}
                        data={data.length > 0 ? data : [{ id: "empty", name: "No data", value: 1, color: "#E5E7EB" }]}
                        dataKey="value"
                        endAngle={450}
                        height={circleSize}
                        innerRadius={INNER_RADIUS}
                        outerRadius={OUTER_RADIUS}
                        paddingAngle={data.length > 0 ? 2 : 0}
                        startAngle={90}
                        width={circleSize}
                    >
                        {(data.length > 0 ? data : [{ id: "empty", name: "No data", value: 1, color: "#E5E7EB" }]).map(
                            (entry: any) => (
                                <Cell
                                    className={cn(
                                        "cursor-pointer stroke-(--stroke-white-0) transition-opacity hover:opacity-80",
                                    )}
                                    key={entry.id}
                                    style={{
                                        fill: entry.color,
                                    }}
                                />
                            ),
                        )}
                    </Pie>
                    {data.length > 0 && <Tooltip content={<CustomTooltip />} />}
                </RechartsPieChart>
            </div>
        );
    }

    // Responsive mode - fills the container
    return (
        <div className={cn("h-full w-full", className)}>
            <ResponsiveContainer height="100%" width="100%">
                <RechartsPieChart
                    margin={{
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                    }}
                >
                    <Pie
                        activeIndex={data.length > 0 ? data.findIndex((d) => d.id === "others") : -1}
                        activeShape={data.length > 0 ? renderActiveShape : undefined}
                        cornerRadius={2}
                        cx="50%"
                        cy="50%"
                        data={data.length > 0 ? data : [{ id: "empty", name: "No data", value: 1, color: "#E5E7EB" }]}
                        dataKey="value"
                        endAngle={450}
                        innerRadius="45%"
                        outerRadius="85%"
                        paddingAngle={data.length > 0 ? 2 : 0}
                        startAngle={90}
                    >
                        {(data.length > 0 ? data : [{ id: "empty", name: "No data", value: 1, color: "#E5E7EB" }]).map(
                            (entry: any) => (
                                <Cell
                                    className={cn(
                                        "cursor-pointer stroke-(--stroke-white-0) transition-opacity hover:opacity-80",
                                    )}
                                    key={entry.id}
                                    style={{
                                        fill: entry.color,
                                    }}
                                />
                            ),
                        )}
                    </Pie>
                    {data.length > 0 && <Tooltip content={<CustomTooltip />} />}
                </RechartsPieChart>
            </ResponsiveContainer>
        </div>
    );
}
