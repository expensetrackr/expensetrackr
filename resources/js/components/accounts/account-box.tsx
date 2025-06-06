import NumberFlow, { type Format } from "@number-flow/react";
import { resolveCurrencyFormat } from "@sumup/intl";
import Decimal from "decimal.js";
import * as React from "react";
import ArrowReloadHorizontalIcon from "virtual:icons/hugeicons/arrow-reload-horizontal";
import CheckmarkCircle02SolidIcon from "virtual:icons/hugeicons/checkmark-circle-02-solid";

import * as Avatar from "#/components/ui/avatar.tsx";
import * as StatusBadge from "#/components/ui/status-badge.tsx";
import { useTranslation } from "#/hooks/use-translation.ts";
import { cn } from "#/utils/cn.ts";

function SVGCardBg(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg fill="none" height="129" viewBox="0 0 94 129" width="94" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                className="stroke-current"
                d="M137.386-140.5h159.669c7.952 0 12.866 8.673 8.779 15.494L196.6 57.309A20.966 20.966 0 0 1 178.614 67.5H18.944c-7.951 0-12.865-8.673-8.778-15.494L119.4-130.309a20.966 20.966 0 0 1 17.986-10.191Z"
            />
            <path
                className="stroke-current"
                d="M175.386-79.5h159.669c7.952 0 12.866 8.673 8.779 15.494L234.6 118.309a20.966 20.966 0 0 1-17.986 10.191H56.944c-7.952 0-12.865-8.673-8.778-15.494L157.4-69.309A20.966 20.966 0 0 1 175.386-79.5Z"
            />
        </svg>
    );
}

type CreditCardProps = {
    account: Resources.Account;
} & React.HTMLAttributes<HTMLDivElement>;

export function AccountBox({ account, className, ...rest }: CreditCardProps) {
    const { t, language } = useTranslation();
    const formatter = resolveCurrencyFormat(language, account.currencyCode);

    const format: Format = React.useMemo(
        () => ({
            style: "currency",
            currency: account.currencyCode,
            minimumFractionDigits: formatter?.minimumFractionDigits,
            maximumFractionDigits: formatter?.maximumFractionDigits,
        }),
        [account.currencyCode, formatter?.maximumFractionDigits, formatter?.minimumFractionDigits],
    );

    // Check if this account uses a different currency than the base currency
    const hasMultiCurrency = account.baseCurrency && account.baseCurrency !== account.currencyCode;

    // Format for base currency if different
    const baseFormatter =
        hasMultiCurrency && account.baseCurrency ? resolveCurrencyFormat(language, account.baseCurrency) : null;
    const baseFormat: Format | null = React.useMemo(() => {
        if (!hasMultiCurrency || !baseFormatter) return null;
        return {
            style: "currency",
            currency: account.baseCurrency!,
            minimumFractionDigits: baseFormatter.minimumFractionDigits,
            maximumFractionDigits: baseFormatter.maximumFractionDigits,
        };
    }, [hasMultiCurrency, baseFormatter, account.baseCurrency]);

    return (
        <div
            className={cn(
                "relative mx-auto flex aspect-video h-full w-full shrink-0 flex-col gap-3 rounded-16 bg-(--bg-white-0) p-5 pb-[18px] ring-1 ring-(--stroke-soft-200) ring-inset",
                "group-hover/account-link:ring-primary group-hover/account-link:[--tw-ring-inset:_] group-focus-visible/account-link:ring-primary group-focus-visible/account-link:[--tw-ring-inset:_]",
                "transition duration-700 [transition-timing-function:cubic-bezier(0.4,0.2,0.2,1)] [backface-visibility:hidden] [transform-style:preserve-3d]",
                className,
            )}
            {...rest}
        >
            <SVGCardBg className="absolute top-0 right-0 text-(--stroke-soft-200) transition duration-700 group-hover/account-link:text-primary/50 group-focus-visible/account-link:text-primary/50" />

            <div className="relative grid w-full items-center justify-between gap-2">
                <div className="flex w-full items-center gap-4">
                    <div className="flex flex-1 items-center gap-2">
                        <Avatar.Root $size="32" className="shrink-0" placeholderType="workspace">
                            {account.name
                                .split(" ")
                                .slice(0, 2)
                                .map((word) => word[0])
                                .join("")
                                .toUpperCase()}
                        </Avatar.Root>

                        {account.connection?.status === "connected" && (
                            <ArrowReloadHorizontalIcon className="size-5 rotate-90 text-(--text-sub-600)" />
                        )}
                    </div>

                    {account.connection?.status === "connected" && (
                        <StatusBadge.Root
                            status={account.connection.status === "connected" ? "completed" : "disabled"}
                            variant="stroke"
                        >
                            <StatusBadge.Icon as={CheckmarkCircle02SolidIcon} />
                            {t(`common.${account.connection.status === "connected" ? "active" : "disabled"}`)}
                        </StatusBadge.Root>
                    )}
                </div>

                <div className="line-clamp-1 text-paragraph-sm text-(--text-sub-600)">{account.name}</div>
            </div>

            <div className="relative mt-auto flex flex-col gap-1">
                <div className="flex flex-col gap-0.5">
                    <div className="line-clamp-1 space-x-1 text-h4">
                        <NumberFlow format={format} value={new Decimal(account.currentBalance).toNumber()} />
                        <span className="text-paragraph-sm text-(--text-soft-400)">{account.currencyCode}</span>
                    </div>

                    {hasMultiCurrency && account.baseCurrentBalance && baseFormat && (
                        <div className="line-clamp-1 space-x-1 text-paragraph-sm text-(--text-sub-600)">
                            <NumberFlow
                                format={baseFormat}
                                value={new Decimal(account.baseCurrentBalance).toNumber()}
                            />
                            <span className="text-paragraph-xs text-(--text-soft-400)">{account.baseCurrency}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
