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
    transaction: Resources.Transaction;
};

export function TransactionItem({
    transaction,
    className,
    ...props
}: Omit<React.ComponentPropsWithRef<"div">, "type"> & TransactionItemProps) {
    const { language } = useTranslation();
    const formatter = resolveCurrencyFormat(language, transaction.currency);
    const decimalValue = new Decimal(transaction.amount).toDecimalPlaces(formatter?.minimumFractionDigits).toNumber();
    const isPositive = decimalValue > 0;
    const format: Format = {
        style: "currency",
        currency: transaction.currency,
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
            {transaction.merchant?.icon ? (
                <Avatar.Root $color="blue" $size="40" className="shrink-0">
                    <Avatar.Image alt={transaction.merchant.name} asChild src={transaction.merchant.icon}>
                        <Image alt={transaction.merchant.name} height={24} src={transaction.merchant.icon} width={24} />
                    </Avatar.Image>
                </Avatar.Root>
            ) : transaction.category ? (
                <div
                    className="ring-stroke-soft-200 flex size-10 shrink-0 items-center justify-center rounded-full bg-(--color-category-color)/10 shadow-xs"
                    style={
                        {
                            "--color-category-color": transaction.category?.color,
                        } as React.CSSProperties
                    }
                >
                    <CategoryIcon
                        category={transaction.category.slug}
                        className="size-5 text-(--color-category-color)"
                        style={
                            {
                                "--color-category-color": transaction.category.color,
                            } as React.CSSProperties
                        }
                    />
                </div>
            ) : null}
            <div className="min-w-0 flex-1 space-y-1">
                <div className="truncate text-label-sm">{transaction.name}</div>
                {transaction.note ? (
                    <div className="truncate text-paragraph-xs text-(--text-sub-600)">{transaction.note}</div>
                ) : null}
            </div>
            <div className="space-y-1 text-right">
                <div className={cn("text-label-sm", isPositive ? "text-state-success-base" : "text-state-error-base")}>
                    <NumberFlow animated={false} format={format} value={decimalValue} />
                    <span className="ml-1 text-subheading-2xs text-(--text-sub-600)">{transaction.currency}</span>
                </div>
                <div className="text-paragraph-xs text-(--text-sub-600)">{formatDate(transaction.datedAt)}</div>
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
