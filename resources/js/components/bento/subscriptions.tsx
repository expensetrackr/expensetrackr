import NumberFlow, { type Format } from "@number-flow/react";
import { resolveCurrencyFormat } from "@sumup/intl";
import { Image } from "@unpic/react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

import * as Badge from "#/components/ui/badge.tsx";
import * as Divider from "#/components/ui/divider.tsx";
import { useCycle } from "#/hooks/use-cycle.ts";
import { useTranslation } from "#/hooks/use-translation.ts";
import { cn, cnMerge } from "#/utils/cn.ts";

type Subscription = {
    type: string;
    name: string;
    price: number;
    currency: string;
    status: string;
    interval: string;
};

type Subscriptions = {
    music: Array<Subscription>;
    video: Array<Subscription>;
    software: Array<Subscription>;
};

const subscriptions: Subscriptions = {
    music: [
        {
            type: "spotify",
            name: "Spotify Family",
            price: 19.99,
            currency: "USD",
            status: "paid",
            interval: "month",
        },
        {
            type: "youtube-music",
            name: "Youtube Music",
            price: 10.99,
            currency: "CAD",
            status: "cancelled",
            interval: "month",
        },
    ],
    video: [
        {
            type: "amazon-prime",
            name: "Amazon Prime",
            price: 14.99,
            currency: "EUR",
            status: "expiring",
            interval: "month",
        },
        {
            type: "netflix",
            name: "Netflix",
            price: 17.99,
            currency: "MXN",
            status: "processing",
            interval: "month",
        },
    ],
    software: [
        {
            type: "jira",
            name: "Jira",
            price: 875,
            currency: "USD",
            status: "paused",
            interval: "year",
        },
        {
            type: "adobe",
            name: "Adobe Creative Cloud",
            price: 659.88,
            currency: "YEN",
            status: "delayed",
            interval: "year",
        },
    ],
};

export function BentoSubscriptions({
    isHovered,
    className,
    ...props
}: React.ComponentPropsWithRef<"div"> & { isHovered: boolean }) {
    return (
        <div className={cn("flex flex-col gap-2", className)} {...props}>
            <BentoSubscriptionItem isHovered={isHovered} subscriptions={subscriptions.music} />

            <Divider.Root $type="line-spacing" />

            <BentoSubscriptionItem isHovered={isHovered} subscriptions={subscriptions.video} />

            <Divider.Root $type="line-spacing" />

            <BentoSubscriptionItem isHovered={isHovered} subscriptions={subscriptions.software} />
        </div>
    );
}

type BentoSubscriptionItemProps = React.ComponentPropsWithRef<"div"> & {
    subscriptions: Array<Subscription>;
    isHovered: boolean;
};

const MotionBadge = motion.create(Badge.Root);

function BentoSubscriptionItem({ subscriptions, isHovered, className, ...props }: BentoSubscriptionItemProps) {
    const [item, cycleItem] = useCycle(subscriptions);
    const { language } = useTranslation();
    const currencyFormat = resolveCurrencyFormat(language, item.currency);

    const timeoutRef = React.useRef<NodeJS.Timeout>(undefined);
    React.useEffect(() => {
        if (!isHovered) return;

        cycleItem();

        timeoutRef.current = setInterval(() => {
            cycleItem();
        }, 1750);

        return () => {
            clearInterval(timeoutRef.current);
        };
    }, [cycleItem, isHovered]);

    const format: Format = React.useMemo(
        () => ({
            style: "currency",
            currency: item.currency,
            minimumFractionDigits: currencyFormat?.minimumFractionDigits,
            maximumFractionDigits: currencyFormat?.maximumFractionDigits,
        }),
        [item.currency, currencyFormat?.maximumFractionDigits, currencyFormat?.minimumFractionDigits],
    );

    return (
        <div {...props} className={cnMerge("flex w-full items-center gap-3", className)}>
            <AnimatePresence mode="wait">
                <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    className="flex size-10 shrink-0 items-center justify-center rounded-full bg-(--bg-white-0) ring-1 shadow-xs ring-(--stroke-soft-200) ring-inset"
                    exit={{ opacity: 0, y: -2 }}
                    initial={{ opacity: 0, y: 2 }}
                    key={item.type}
                    transition={{ duration: 0.2 }}
                >
                    <Image
                        alt={item.name}
                        className="size-6"
                        height={24}
                        src={`https://public-assets.expensetrackr.app/major-brands/${item.type}.svg`}
                        width={24}
                    />
                </motion.div>
            </AnimatePresence>

            <div className="flex-1">
                <AnimatePresence mode="wait">
                    <motion.div
                        animate={{
                            opacity: 1,
                            transition: {
                                duration: 0.2,
                            },
                        }}
                        className="text-paragraph-xs text-(--text-sub-600)"
                        initial={{ opacity: 0 }}
                        key={item.type}
                    >
                        {item.name.split("").map((char, index) => (
                            <motion.span
                                animate={{ opacity: 1 }}
                                initial={{ opacity: 0 }}
                                key={index}
                                transition={{
                                    duration: 0.1,
                                    delay: index * 0.03,
                                }}
                            >
                                {char}
                            </motion.span>
                        ))}
                    </motion.div>
                </AnimatePresence>

                <div className="mt-1 flex items-baseline">
                    <NumberFlow
                        animated={isHovered}
                        className="text-label-sm [--number-flow-char-height:0.85em]"
                        format={format}
                        locales={currencyFormat?.locale}
                        trend={0}
                        value={item.price}
                        willChange
                    />
                    <span className="ml-1 text-paragraph-xs text-(--text-soft-400)">/{item.interval}</span>
                </div>
            </div>

            <MotionBadge
                $color={getStatusColor(item.status)}
                $size="md"
                $style="lighter"
                animate={{
                    opacity: 1,
                    scale: 1,
                    x: 0,
                }}
                className="origin-right capitalize"
                exit={{
                    opacity: 0,
                    scale: 0.8,
                    x: -10,
                }}
                initial={{
                    opacity: 0,
                    scale: 0.8,
                    x: 10,
                }}
                key={item.type}
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                }}
            >
                {item.status}
            </MotionBadge>
        </div>
    );
}

function getStatusColor(status: string) {
    switch (status) {
        case "paid":
            return "green";
        case "expiring":
            return "gray";
        case "paused":
            return "orange";
        case "cancelled":
            return "red";
        case "processing":
            return "blue";
        case "delayed":
            return "yellow";
        case "expired":
            return "gray";
        default:
            return "gray";
    }
}
