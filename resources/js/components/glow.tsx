import * as React from "react";

import { cn } from "#/utils/cn.ts";

interface GlowAreaProps extends React.ComponentPropsWithoutRef<"div"> {
    size?: number;
}

function GlowArea(props: GlowAreaProps) {
    const { className = "", size = 300, ...rest } = props;
    const element = React.useRef<HTMLDivElement>(null);
    const frameId = React.useRef<number | null>(null);
    const latestCoords = React.useRef<{ x: number; y: number } | null>(null);

    const updateGlow = () => {
        if (latestCoords.current && element.current) {
            element.current.style.setProperty("--glow-x", `${latestCoords.current.x}px`);
            element.current.style.setProperty("--glow-y", `${latestCoords.current.y}px`);
            frameId.current = null;
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const bounds = e.currentTarget.getBoundingClientRect();
        latestCoords.current = {
            x: e.clientX - bounds.left,
            y: e.clientY - bounds.top,
        };

        if (!frameId.current) {
            frameId.current = requestAnimationFrame(() => updateGlow());
        }
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        e.currentTarget.style.removeProperty("--glow-x");
        e.currentTarget.style.removeProperty("--glow-y");
    };
    return (
        <div
            className={cn(className, "")}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            ref={element}
            style={
                {
                    position: "relative",
                    "--glow-size": `${size}px`,
                } as React.CSSProperties
            }
            {...rest}
        />
    );
}
GlowArea.displayName = "GlowArea";

interface GlowProps extends React.ComponentPropsWithoutRef<"div"> {
    color?: string;
}

function GlowRoot(props: GlowProps) {
    const { className, color = "blue", children, ...rest } = props;
    const element = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        element.current?.style.setProperty("--glow-top", `${element.current?.offsetTop}px`);
        element.current?.style.setProperty("--glow-left", `${element.current?.offsetLeft}px`);
    }, []);

    return (
        <div className={cn(className, "relative")} ref={element}>
            <div
                {...rest}
                className={cn(
                    className,
                    "pointer-events-none absolute inset-0 mix-blend-multiply after:absolute after:inset-0.25 after:rounded-[inherit] after:bg-(--bg-white-0)/90 after:content-[''] dark:mix-blend-lighten",
                )}
                style={{
                    backgroundImage: `radial-gradient(
                    var(--glow-size) var(--glow-size) at calc(var(--glow-x, -99999px) - var(--glow-left, 0px))
                    calc(var(--glow-y, -99999px) - var(--glow-top, 0px)),
                    ${color} 0%,
                    transparent 100%
                )`,
                }}
            ></div>
            {children}
        </div>
    );
}
GlowRoot.displayName = "GlowRoot";

export { GlowArea as Area, GlowRoot as Root };
