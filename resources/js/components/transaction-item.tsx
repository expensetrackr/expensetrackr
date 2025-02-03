import { Image } from "@unpic/react";
import ArrowRightSIcon from "virtual:icons/ri/arrow-right-s-line";

import * as CompactButton from "#/components/ui/compact-button.tsx";
import { type Transaction } from "#/lib/cards-data.ts";
import { cn, cnMerge } from "#/utils/cn.ts";
import { formatDate } from "#/utils/date-formatter.ts";
import { currencyFormatter } from "#/utils/number-formatter.ts";

export function TransactionItem({
    icon,
    name,
    description = "",
    transaction,
    date,
    type,
    className,
    ...props
}: Omit<React.ComponentPropsWithRef<"button">, "type"> & Omit<Transaction, "id">) {
    const renderIcon = () => {
        if (typeof icon === "string") {
            return <Image alt={name} className="size-6" height={24} src={icon} width={24} />;
        }
        const IconComponent = icon as React.ElementType;
        return <IconComponent className="size-5" />;
    };

    return (
        <button
            className={cnMerge(
                "flex w-full items-center gap-3 rounded-12 py-2 text-left transition-all duration-200 ease-out hover:bg-(--bg-weak-50) hover:px-3",
                className,
            )}
            type="button"
            {...props}
        >
            <div
                className={cn("flex size-10 shrink-0 items-center justify-center rounded-full", {
                    "bg-(--bg-white-0) text-(--text-sub-600) ring-1 shadow-xs ring-(--stroke-soft-200) ring-inset":
                        type === "other",
                    "bg-state-success-lighter text-state-success-base": type === "rent",
                    "bg-state-feature-lighter text-state-feature-base": type === "tax",
                    "bg-state-warning-lighter text-state-warning-base": type === "phone",
                    "bg-state-information-lighter text-state-information-base": type === "internet",
                    "bg-state-highlighted-lighter text-state-highlighted-base": type === "donate",
                    "bg-state-away-lighter text-state-away-base": type === "electricity",
                    "bg-state-error-lighter text-state-error-base": type === "gas",
                    "bg-state-verified-lighter text-state-verified-base": type === "water",
                })}
            >
                {renderIcon()}
            </div>
            <div className="min-w-0 flex-1 space-y-1">
                <div className="truncate text-label-sm">{name}</div>
                <div className="truncate text-paragraph-xs text-(--text-sub-600)">{description}</div>
            </div>
            <div className="space-y-1 text-right">
                <div className="text-label-sm">{currencyFormatter.format(transaction)}</div>
                <div className="text-paragraph-xs text-(--text-sub-600)">{formatDate(date)}</div>
            </div>
            <CompactButton.Root $size="md" $style="ghost" asChild>
                <div>
                    <CompactButton.Icon as={ArrowRightSIcon} />
                </div>
            </CompactButton.Root>
        </button>
    );
}
TransactionItem.displayName = "TransactionItem";
