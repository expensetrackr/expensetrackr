import { motion, type HTMLMotionProps } from "motion/react";
import { useState } from "react";

import { cnMerge } from "#/utils/cn.ts";

type BentoCardProps = HTMLMotionProps<"div"> & {
    eyebrow?: string;
    title?: string;
    graphic?: React.ReactNode | ((isHovered: boolean) => React.ReactNode);
};

export function BentoCard({ className, eyebrow, title, graphic, ...props }: BentoCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            className={cnMerge(
                "rounded-16 border-[0.5px] from-(--bg-white-0) to-(--bg-weak-50) p-6 transition hover:border-(--stroke-sub-300)",
                className,
            )}
            initial="idle"
            onHoverEnd={() => setIsHovered(false)}
            onHoverStart={() => setIsHovered(true)}
            variants={{ idle: {}, active: {} }}
            whileHover="active"
            {...props}
        >
            <div className="flex flex-col gap-5">
                {eyebrow || title ? (
                    <div className="flex flex-col">
                        {eyebrow ? (
                            <p className="text-subheading-2xs text-(--text-soft-400) uppercase">{eyebrow}</p>
                        ) : null}
                        {title ? <h2 className="text-label-md">{title}</h2> : null}
                    </div>
                ) : null}
                {graphic ? (
                    <div className="relative shrink-0">
                        {typeof graphic === "function" ? graphic(isHovered) : graphic}
                    </div>
                ) : null}
            </div>
        </motion.div>
    );
}
