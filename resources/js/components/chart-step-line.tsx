// @ts-ignore - d3-curve-circlecorners is not typed
import circleCorners from "d3-curve-circlecorners";
import { line } from "d3-shape";
import * as React from "react";
import {
    CartesianGrid,
    Line,
    LineChart as RechartsLineChart,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    XAxis,
    YAxis,
    type XAxisProps,
    type YAxisProps,
} from "recharts";
import { type AxisDomain } from "recharts/types/util/types";

import { cn } from "#/utils/cn.ts";
import { tooltipVariants } from "./ui/tooltip.tsx";

const TOOLTIP_OFFSET = 4;
const CORNER_RADIUS = 8;
const CHART_ITEMS_LENGTH_FOR_GAP = 4;

function addGapToPath(path: string) {
    const commands = path.match(/[ML][^ML]*/g);

    if (!commands) {
        throw new Error("Invalid path format");
    }

    const xOccurrences: { [key: number]: string[] } = {};

    commands.forEach((command) => {
        const coords = command
            .slice(1)
            .trim()
            .split(/\s*,\s*/)
            .map(Number);

        if (coords.length !== 2) {
            throw new Error(`Invalid coordinates in command: ${command}`);
        }
        const [x] = coords;
        if (!xOccurrences[x as number]) {
            xOccurrences[x as number] = [];
        }
        xOccurrences[x as number]?.push(command);
    });

    const newCommands = commands.map((command) => {
        const cmd = command[0];
        const coords = command
            .slice(1)
            .trim()
            .split(/\s*,\s*/)
            .map(Number);
        const [x, y] = coords;

        let [, secondX, thirdX] = [
            ...Object.keys(xOccurrences)
                .map((p) => Number.parseFloat(p))
                .sort((a, b) => a - b),
        ];

        let gap = Math.max(((thirdX ?? secondX ?? 0) - (secondX ?? 0)) / CHART_ITEMS_LENGTH_FOR_GAP, 0);

        if (x !== undefined && xOccurrences[x] && xOccurrences[x].length > 1) {
            const index = xOccurrences[x].indexOf(command);
            if (index === 0) {
                return `${cmd} ${x - gap},${y}`;
            } else if (index === xOccurrences[x].length - 1) {
                return `${cmd} ${x + gap},${y}`;
            }
        }

        return `${cmd} ${x},${y}`;
    });

    return newCommands.join(" ");
}

function convertPathToCurvedPath(pathData: string) {
    const points: { x: number; y: number }[] = [];
    const pathCommands = pathData.match(/[ML][^ML]*/g);

    if (!pathCommands) return;

    pathCommands.forEach((cmd) => {
        if (cmd.startsWith("M") || cmd.startsWith("L")) {
            const coords = cmd
                .slice(1)
                .trim()
                .split(/[\s,]+/)
                .map(Number);

            for (let i = 0; i < coords.length; i += 2) {
                const x = coords[i];
                const y = coords[i + 1];
                if (typeof x === "number" && typeof y === "number") {
                    points.push({ x, y });
                }
            }
        }
    });

    const lineGenerator = line<{ x: number; y: number }>()
        .x((d) => d.x)
        .y((d) => d.y)
        .curve(circleCorners.radius(CORNER_RADIUS));

    return lineGenerator(points);
}

function useTooltipPosition(chartRef: React.RefObject<HTMLDivElement | null>) {
    const [tooltipPos, setTooltipPos] = React.useState({ x: 0, y: 0 });

    React.useEffect(() => {
        const handleUpdate = () => {
            if (chartRef?.current) {
                const activeDot = chartRef.current.querySelector(".recharts-active-dot") as HTMLElement;
                if (activeDot) {
                    const chartRect = chartRef.current.getBoundingClientRect();
                    const activeDotRect = activeDot.getBoundingClientRect();
                    setTooltipPos({
                        x: activeDotRect.x - chartRect.x + activeDotRect.width / 2,
                        y: activeDotRect.y - chartRect.y - TOOLTIP_OFFSET - activeDotRect.height / 2,
                    });
                }
            }
        };

        const resizeObserver = new ResizeObserver(handleUpdate);
        const mutationObserver = new MutationObserver(handleUpdate);

        if (chartRef?.current) {
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

function useUpdatedPaths(chartRef: React.RefObject<HTMLDivElement | null>) {
    const [newPathsAttrs, setNewPathsAttrs] = React.useState<{ [k: string]: any }[]>([]);

    React.useEffect(() => {
        const handleUpdate = () => {
            setNewPathsAttrs([]);
            if (chartRef?.current) {
                const paths = chartRef.current.querySelectorAll(".recharts-line-curve") as NodeListOf<SVGPathElement>;
                paths.forEach((path) => {
                    const d = path.getAttribute("d")!;
                    const pathWithGapAndCurve = convertPathToCurvedPath(addGapToPath(d));
                    const attrs = ["width", "height", "stroke-width", "stroke", "fill"].reduce((acc, attr) => {
                        acc[attr] = path.getAttribute(attr)!;
                        return acc;
                    }, {} as any);

                    setNewPathsAttrs((prev) => [
                        ...prev,
                        {
                            width: attrs["width"],
                            height: attrs["height"],
                            strokeWidth: attrs["stroke-width"],
                            stroke: attrs["stroke"],
                            fill: attrs["fill"],
                            d: pathWithGapAndCurve,
                        },
                    ]);
                });
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

    return newPathsAttrs;
}

type ChartStepLineProps<T extends string> = {
    data: { [key in T]: number | string }[];
    index: T;
    categories: T[];
    showTooltip?: boolean;
    showGridLines?: boolean;
    domain?: AxisDomain;
    tooltipContent?: (payload: any) => React.ReactNode;
    xAxisProps?: XAxisProps;
    yAxisProps?: YAxisProps;
};

const ChartStepLine = <T extends string>({
    data,
    index,
    categories,
    showTooltip = true,
    showGridLines = true,
    tooltipContent,
    xAxisProps,
    yAxisProps,
}: ChartStepLineProps<T>) => {
    const chartRef = React.useRef<HTMLDivElement>(null);
    const tooltipPos = useTooltipPosition(chartRef);
    const newPathsAttrs = useUpdatedPaths(chartRef);

    return (
        <ResponsiveContainer height={70} ref={chartRef} width="100%">
            <RechartsLineChart data={data} margin={{ top: 1, right: 0, bottom: 0, left: 0 }}>
                <XAxis
                    axisLine={false}
                    className="[&_.recharts-cartesian-axis-tick_text]:fill-(--text-soft-400) [&_.recharts-cartesian-axis-tick_text]:text-subheading-2xs"
                    dataKey={index}
                    tickLine={false}
                    {...(xAxisProps as any)}
                />
                <YAxis domain={["auto", "auto"]} type="number" {...(yAxisProps as any)} />

                {showGridLines && (
                    <CartesianGrid
                        className="stroke-(--stroke-soft-200)"
                        horizontal={false}
                        strokeDasharray="2 2"
                        strokeWidth={1}
                        vertical={true}
                    />
                )}

                {showTooltip && tooltipContent && (
                    <RechartsTooltip
                        animationDuration={100}
                        content={<CustomTooltip renderContent={tooltipContent} />}
                        cursor={false}
                        isAnimationActive={true}
                        offset={0}
                        position={{ y: tooltipPos.y, x: tooltipPos.x }}
                    />
                )}

                {newPathsAttrs.map((attr, i) => (
                    <path className={i === 0 ? "stroke-primary" : "stroke-orange-500"} key={i} {...attr} />
                ))}

                {categories.map((category, i) => (
                    <Line
                        activeDot={{
                            r: 6,
                            strokeWidth: 2,
                            className: cn("stroke-(--stroke-white-0) [filter:drop-shadow(0_1px_2px_#0a0d1408)]", {
                                "fill-primary": i === 0,
                                "fill-orange-500": i === 1,
                            }),
                        }}
                        dataKey={category}
                        dot={false}
                        isAnimationActive={false}
                        key={i}
                        opacity={0}
                        strokeWidth={2}
                        type="step"
                    />
                ))}
            </RechartsLineChart>
        </ResponsiveContainer>
    );
};

type CustomTooltipProps = React.ComponentProps<typeof RechartsTooltip> & {
    renderContent: (props: { payload: any }) => React.ReactNode;
};

const CustomTooltip = ({ active, payload, renderContent }: CustomTooltipProps) => {
    const { arrow, content } = tooltipVariants({
        $size: "xs",
        $variant: "light",
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

export default ChartStepLine;
