import NumberFlow, { type Format } from "@number-flow/react";
import { resolveCurrencyFormat } from "@sumup/intl";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

import { useCycle } from "#/hooks/use-cycle.ts";
import { useTranslation } from "#/hooks/use-translation.ts";
import { cn } from "#/utils/cn.ts";

const items = [
    {
        numbers: [1, 1.44, 5.86],
        currencies: ["USD", "CAD", "BRL"],
    },
    {
        numbers: [0.96, 99.25, 155],
        currencies: ["EUR", "RUB", "JPY"],
    },
    {
        numbers: [57.39, 4169.58, 1051.24],
        currencies: ["VES", "COP", "ARS"],
    },
];

type MultiCurrencyProps = React.ComponentPropsWithRef<"div"> & {
    isHovered: boolean;
};

export function MultiCurrency({ isHovered, className, ...props }: MultiCurrencyProps) {
    return (
        <div {...props} className={cn("flex flex-col items-center gap-1.5", className)}>
            {items.map((item, index) => (
                <MultiCurrencyItem key={index} {...item} isHovered={isHovered} />
            ))}
        </div>
    );
}

type MultiCurrencyItemProps = (typeof items)[number] & {
    isHovered: boolean;
};

function MultiCurrencyItem({ numbers, currencies, isHovered }: MultiCurrencyItemProps) {
    const [value, cycleValue] = useCycle(numbers);
    const [currency, cycleCurrency] = useCycle(currencies);
    const { language } = useTranslation();
    const currencyFormat = resolveCurrencyFormat(language, currency);

    const timeoutRef = React.useRef<NodeJS.Timeout>(undefined);
    React.useEffect(() => {
        if (!isHovered) return;

        // Immediate first cycle
        cycleValue();
        cycleCurrency();

        // Subsequent cycles
        timeoutRef.current = setInterval(() => {
            cycleValue();
            cycleCurrency();
        }, 1750);

        return () => {
            clearInterval(timeoutRef.current);
        };
    }, [cycleCurrency, cycleValue, isHovered]);

    const format: Format = React.useMemo(
        () => ({
            style: "currency",
            currency: currency,
            minimumFractionDigits: currencyFormat?.minimumFractionDigits,
            maximumFractionDigits: currencyFormat?.maximumFractionDigits,
        }),
        [currency, currencyFormat?.maximumFractionDigits, currencyFormat?.minimumFractionDigits],
    );

    return (
        <div className="flex w-full items-center gap-1.5 rounded-full border px-2.5 py-1.5">
            <AnimatePresence mode="wait">
                <motion.svg
                    animate={{ opacity: 1, y: 0 }}
                    aria-label={`${currency} flag`}
                    className="size-6 rounded-full"
                    exit={{ opacity: 0, y: -2 }}
                    initial={{ opacity: 0, y: 2 }}
                    key={currency}
                    preserveAspectRatio="xMidYMid meet"
                    role="img"
                    transition={{ duration: 0.2 }}
                >
                    <use href={`/img/flags.svg#${currency}`} />
                </motion.svg>
            </AnimatePresence>

            <NumberFlow
                animated={isHovered}
                className="text-label-xs [--number-flow-char-height:0.85em]"
                format={format}
                locales={language}
                value={value}
                willChange
            />
        </div>
    );
}
