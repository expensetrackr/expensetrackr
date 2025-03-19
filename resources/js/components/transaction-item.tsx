import NumberFlow, { type Format } from "@number-flow/react";
import { resolveCurrencyFormat } from "@sumup/intl";
import { Image } from "@unpic/react";
import Decimal from "decimal.js";
import ArrowRightSIcon from "virtual:icons/ri/arrow-right-s-line";

import * as CompactButton from "#/components/ui/compact-button.tsx";
import { useTranslation } from "#/hooks/use-translation.ts";
import { cn, cnMerge } from "#/utils/cn.ts";
import { formatDate } from "#/utils/date-formatter.ts";
import { CategoryIcon } from "./category-icon.tsx";
import * as Avatar from "./ui/avatar.tsx";

type TransactionItemProps = {
    name: string;
    description?: string;
    amount: string;
    currency: string;
    date: Date | string;
    category?: {
        id: string;
        name: string;
        slug: string;
        color: string;
    };
    enrichment?: {
        icon: string;
        merchantName: string;
    };
};

export function TransactionItem({
    name,
    description = "",
    amount,
    currency,
    date,
    category,
    enrichment,
    className,
    ...props
}: Omit<React.ComponentPropsWithRef<"div">, "type"> & TransactionItemProps) {
    const { language } = useTranslation();
    const formatter = resolveCurrencyFormat(language, currency);
    const decimalValue = new Decimal(amount).toDecimalPlaces(formatter?.minimumFractionDigits).toNumber();
    const isPositive = decimalValue > 0;
    const format: Format = {
        style: "currency",
        currency,
        minimumFractionDigits: formatter?.minimumFractionDigits,
        maximumFractionDigits: formatter?.maximumFractionDigits,
    };

    return (
        <div
            className={cnMerge(
                "flex w-full items-center gap-3 rounded-12 py-2 text-left transition-all duration-200 ease-out hover:bg-(--bg-weak-50) hover:px-3",
                className,
            )}
            {...props}
        >
            {enrichment?.icon ? (
                <Avatar.Root $color="blue" $size="40" className="shrink-0">
                    <Avatar.Image alt={enrichment.merchantName} asChild src={enrichment.icon}>
                        <Image alt={enrichment.merchantName} height={24} src={enrichment.icon} width={24} />
                    </Avatar.Image>
                </Avatar.Root>
            ) : category ? (
                <div
                    className="ring-stroke-soft-200 flex size-10 shrink-0 items-center justify-center rounded-full bg-(--color-category-color)/10 shadow-xs"
                    style={
                        {
                            "--color-category-color": category?.color,
                        } as React.CSSProperties
                    }
                >
                    <CategoryIcon
                        category={category.slug}
                        className="size-5 text-(--color-category-color)"
                        style={
                            {
                                "--color-category-color": category.color,
                            } as React.CSSProperties
                        }
                    />
                </div>
            ) : null}
            <div className="min-w-0 flex-1 space-y-1">
                <div className="truncate text-label-sm">{name}</div>
                {description ? (
                    <div className="truncate text-paragraph-xs text-(--text-sub-600)">{description}</div>
                ) : null}
            </div>
            <div className="space-y-1 text-right">
                <div className={cn("text-label-sm", isPositive ? "text-state-success-base" : "text-state-error-base")}>
                    <NumberFlow animated={false} format={format} value={decimalValue} />
                    <span className="ml-1 text-subheading-2xs text-(--text-sub-600)">{currency}</span>
                </div>
                <div className="text-paragraph-xs text-(--text-sub-600)">{formatDate(date)}</div>
            </div>
            <CompactButton.Root $size="md" $style="ghost" asChild>
                <div>
                    <CompactButton.Icon as={ArrowRightSIcon} />
                </div>
            </CompactButton.Root>
        </div>
    );
}
TransactionItem.displayName = "TransactionItem";
