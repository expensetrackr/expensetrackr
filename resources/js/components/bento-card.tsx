import { motion, type HTMLMotionProps } from "motion/react";
import * as React from "react";

import { cnMerge } from "#/utils/cn.ts";

type BentoCardProps = HTMLMotionProps<"div"> & {
    eyebrow?: string;
    title?: string;
    graphic?: React.ReactNode | ((isHovered: boolean) => React.ReactNode);
    fade?: ("top" | "bottom")[];
};

export function BentoCard({ eyebrow, title, graphic, fade = [], className, ...props }: BentoCardProps) {
    const [isHovered, setIsHovered] = React.useState(false);

    return (
        <motion.div
            className={cnMerge(
                "relative overflow-hidden rounded-16 border-[0.5px] from-(--bg-white-0) to-(--bg-weak-50) p-6 transition hover:border-(--stroke-sub-300)",
                className,
            )}
            initial="idle"
            onHoverEnd={() => setIsHovered(false)}
            onHoverStart={() => setIsHovered(true)}
            variants={{ idle: {}, active: {} }}
            whileHover="active"
            {...props}
        >
            <div className="relative z-10 flex h-full flex-col gap-5">
                {(eyebrow || title) && (
                    <div className="flex flex-col">
                        {eyebrow && <p className="text-subheading-2xs text-(--text-soft-400) uppercase">{eyebrow}</p>}
                        {title && <h2 className="text-label-md">{title}</h2>}
                    </div>
                )}
                {graphic && (
                    <div className="relative flex-1 shrink-0">
                        {typeof graphic === "function" ? graphic(isHovered) : graphic}
                    </div>
                )}
            </div>
            {fade.includes("top") && (
                <div className="absolute inset-0 bg-linear-to-b from-(--bg-white-0) to-50% group-data-dark:from-[-25%]" />
            )}
            {fade.includes("bottom") && (
                <div className="absolute inset-0 bg-linear-to-t from-(--bg-white-0) to-50% group-data-dark:from-[-25%]" />
            )}
        </motion.div>
    );
}
