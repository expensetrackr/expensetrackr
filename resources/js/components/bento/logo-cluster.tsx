import { motion } from "motion/react";
import MastercardIcon from "virtual:icons/logos/mastercard";
import PayPalIcon from "virtual:icons/logos/paypal";
import VisaIcon from "virtual:icons/logos/visa";

import IsotypeDark from "#/assets/isotype-dark.svg";
import IsotypeLight from "#/assets/isotype-light.svg";
import { cn, cnMerge } from "#/utils/cn.ts";
import { Image } from "../image.tsx";

function Circle({ size, delay, opacity }: { size: number; delay: number; opacity: string }) {
    return (
        <motion.div
            className={cn(
                "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full",
                "bg-[radial-gradient(circle,transparent_25%,color-mix(in_srgb,var(--color-primary)_var(--opacity),transparent)_100%)]",
                "ring ring-primary/[8%] ring-inset",
            )}
            style={{ "--opacity": opacity } as React.CSSProperties}
            variants={{
                idle: { width: `${size}px`, height: `${size}px` },
                active: {
                    width: [`${size}px`, `${size + 10}px`, `${size}px`],
                    height: [`${size}px`, `${size + 10}px`, `${size}px`],
                    transition: {
                        duration: 0.75,
                        repeat: Infinity,
                        repeatDelay: 1.25,
                        ease: "easeInOut",
                        delay,
                    },
                },
            }}
        />
    );
}

function Circles() {
    return (
        <div className="absolute inset-0">
            <Circle delay={0.45} opacity="3%" size={528} />
            <Circle delay={0.3} opacity="5%" size={400} />
            <Circle delay={0.15} opacity="5%" size={272} />
            <Circle delay={0} opacity="10%" size={144} />
            <div className="absolute inset-0 bg-linear-to-t from-(--bg-white-0) to-35%" />
        </div>
    );
}

function MainLogo() {
    return (
        <div className="absolute top-1/2 left-1/2 flex size-16 -translate-1/2 items-center justify-center rounded-full bg-(--bg-white-0) shadow-sm ring ring-(--stroke-soft-200) ring-inset">
            <Image alt="" className="hidden h-7 dark:block" height={40} src={IsotypeDark} width={64} />
            <Image alt="" className="block h-7 dark:hidden" height={40} src={IsotypeLight} width={64} />
        </div>
    );
}

function Logo({
    left,
    top,
    hover,
    children,
}: {
    left: number;
    top: number;
    hover: { x: number; y: number; rotate: number; delay: number };
    children: React.ReactNode;
}) {
    return (
        <motion.div
            className="absolute flex size-16 items-center justify-center rounded-full bg-(--bg-white-0) shadow-sm ring ring-(--stroke-soft-200) ring-inset dark:bg-(--bg-weak-50)"
            style={{ left, top } as React.CSSProperties}
            variants={{
                idle: { x: 0, y: 0, rotate: 0 },
                active: {
                    x: [0, hover.x, 0],
                    y: [0, hover.y, 0],
                    rotate: [0, hover.rotate, 0],
                    transition: {
                        duration: 0.75,
                        repeat: Infinity,
                        repeatDelay: 1.25,
                        ease: "easeInOut",
                        delay: hover.delay,
                    },
                },
            }}
        >
            {children}
        </motion.div>
    );
}

export function BentoLogoCluster({ className, ...props }: React.ComponentPropsWithRef<"div">) {
    return (
        <div aria-hidden="true" className={cnMerge("relative h-full overflow-hidden", className)} {...props}>
            <Circles />
            <div className="absolute left-1/2 h-full w-[26rem] -translate-x-1/2">
                <MainLogo />
                <Logo hover={{ x: 6, y: 1, rotate: 5, delay: 0.38 }} left={360} top={144}>
                    <Image className="size-10" height={40} src="/major-brands/hsbc.png" width={40} />
                </Logo>
                <Logo hover={{ x: 4, y: -5, rotate: 6, delay: 0.3 }} left={285} top={20}>
                    <Image className="size-10" height={40} src="/major-brands/bofa.png" width={40} />
                </Logo>
                <Logo hover={{ x: 3, y: 5, rotate: 7, delay: 0.2 }} left={255} top={210}>
                    <Image className="size-10" height={40} src="/major-brands/payoneer.png" width={40} />
                </Logo>
                <Logo hover={{ x: -2, y: -5, rotate: -6, delay: 0.15 }} left={144} top={40}>
                    <VisaIcon className="size-10" />
                </Logo>
                <Logo hover={{ x: -4, y: -5, rotate: -6, delay: 0.35 }} left={36} top={56}>
                    <MastercardIcon className="size-10" />
                </Logo>
                <Logo hover={{ x: -3, y: 5, rotate: 3, delay: 0.15 }} left={96} top={176}>
                    <PayPalIcon className="size-10" />
                </Logo>
            </div>
        </div>
    );
}
