import * as React from "react";
import * as RechartsPrimitive from "recharts";

import { cn } from "#/utils/cn.ts";

export type ChartConfig = {
    [k in string]: {
        label?: React.ReactNode;
        color?: string;
    };
};

type ChartContextProps = {
    config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

// TODO: Remove this once we have a proper way to handle the context
// function useChart() {
//     const context = React.useContext(ChartContext);

//     if (!context) {
//         throw new Error("useChart must be used within a <ChartContainer />");
//     }

//     return context;
// }

const ChartContainer = React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<"div"> & {
        config: ChartConfig;
        children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"];
    }
>(({ id, config, className, children, ...props }, ref) => {
    const uniqueId = React.useId();
    const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

    return (
        <ChartContext.Provider value={{ config }}>
            <div
                className={cn(
                    "[&_.recharts-cartesian-axis-tick_text]:fill-(--text-sub-600) [&_.recharts-cartesian-axis-tick_text]:text-paragraph-xs",
                    className,
                )}
                data-chart={chartId}
                ref={ref}
                {...props}
            >
                <ChartStyle config={config} id={chartId} />
                <RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
            </div>
        </ChartContext.Provider>
    );
});
ChartContainer.displayName = "Chart";

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
    const colorConfig = Object.entries(config).filter(([_, config]) => config.color);

    if (!colorConfig.length) {
        return null;
    }

    return (
        <style
            dangerouslySetInnerHTML={{
                __html: `
                    [data-chart=${id}] {
                    ${colorConfig
                        .map(([key, itemConfig]) => {
                            const color = itemConfig.color;
                            return color ? `  --color-${key}: ${color};` : null;
                        })
                        .join("\n")}
                    }
                `,
            }}
        />
    );
};

const ChartLegend = React.forwardRef<
    HTMLDivElement,
    {
        color: string;
        label: string;
    } & React.HTMLAttributes<HTMLDivElement>
>(({ children, className, color, label, ...rest }, forwardedRef) => {
    return (
        <div
            className={cn("transition-default flex items-center gap-1 text-left text-paragraph-xs", className)}
            ref={forwardedRef}
            {...rest}
        >
            <div
                className="size-3 shrink-0 rounded-full border-2 border-(--stroke-white-0) shadow-sm"
                style={{
                    backgroundColor: color,
                }}
            />
            {label}
        </div>
    );
});
ChartLegend.displayName = "ChartLegend";

export { ChartContainer, ChartLegend, ChartStyle };
