import * as LabelPrimivites from "@radix-ui/react-label";
import type * as v from "valibot";
import BankIcon from "virtual:icons/hugeicons/bank";
import BitcoinWalletIcon from "virtual:icons/hugeicons/bitcoin-wallet";
import ChartUpIcon from "virtual:icons/hugeicons/chart-up";
import CreditCardIcon from "virtual:icons/hugeicons/credit-card";
import PackageSearchIcon from "virtual:icons/hugeicons/package-search";
import ReceiptDollarIcon from "virtual:icons/hugeicons/receipt-dollar";
import TipsIcon from "virtual:icons/hugeicons/tips";

import { useCreateAccountParams } from "#/hooks/use-create-account-params.ts";
import { AccountTypeEnum, ConnectionTypeEnum } from "#/schemas/account.ts";
import { cn } from "#/utils/cn.ts";
import * as Radio from "../ui/radio.tsx";

const accountTypes = {
    [AccountTypeEnum.enum.Depository]: {
        icon: BankIcon,
        title: "Depository",
        description: "Checking, savings, or money market accounts",
        color: "bg-blue-50 text-blue-500 dark:bg-blue-400/20 dark:text-blue-400",
    },
    [AccountTypeEnum.enum.Investment]: {
        icon: ChartUpIcon,
        title: "Investment",
        description: "Stocks, bonds, mutual funds, and other investment accounts",
        color: "bg-teal-50 text-teal-500 dark:bg-teal-400/20 dark:text-teal-400",
    },
    [AccountTypeEnum.enum.Crypto]: {
        icon: BitcoinWalletIcon,
        title: "Crypto",
        description: "Cryptocurrency and digital asset accounts",
        color: "bg-yellow-50 text-yellow-500 dark:bg-yellow-400/20 dark:text-yellow-400",
    },
    [AccountTypeEnum.enum.CreditCard]: {
        icon: CreditCardIcon,
        title: "Credit card",
        description: "Track credit card balances and payments",
        color: "bg-purple-50 text-purple-500 dark:bg-purple-400/20 dark:text-purple-400",
    },
    [AccountTypeEnum.enum.Loan]: {
        icon: TipsIcon,
        title: "Loan",
        description: "Personal, auto, student, or mortgage loans",
        color: "bg-sky-50 text-sky-500 dark:bg-sky-400/20 dark:text-sky-400",
    },
    [AccountTypeEnum.enum.OtherAsset]: {
        icon: PackageSearchIcon,
        title: "Other asset",
        description: "Vehicles, property, or other valuable assets",
        color: "bg-teal-50 text-teal-500 dark:bg-teal-400/20 dark:text-teal-400",
    },
    [AccountTypeEnum.enum.OtherLiability]: {
        icon: ReceiptDollarIcon,
        title: "Other liability",
        description: "Any other debts or financial obligations",
        color: "bg-pink-50 text-pink-500 dark:bg-pink-400/20 dark:text-pink-400",
    },
};

export function TypeStep() {
    const { type, connection_type: connectionType, setParams } = useCreateAccountParams();

    async function handleChange(value: v.InferOutput<typeof AccountTypeEnum>) {
        const isConnectionAvailable =
            value === AccountTypeEnum.enum.Depository || value === AccountTypeEnum.enum.CreditCard;

        await setParams({
            type: value,
            ...(!isConnectionAvailable && connectionType === ConnectionTypeEnum.enum.Connect
                ? {
                      connection_type: null,
                  }
                : {}),
        });
    }

    return (
        <Radio.Group
            className="flex flex-col gap-3"
            name="type"
            onValueChange={handleChange}
            required
            value={type ?? undefined}
        >
            {AccountTypeEnum.options.map((option) => {
                const Icon = accountTypes[option].icon;
                return (
                    <LabelPrimivites.Root
                        className="flex cursor-pointer items-center gap-2 rounded-10 border border-(--stroke-soft-200) p-2 transition duration-200 ease-out has-focus-visible:border-primary has-focus-visible:shadow-button-primary-focus has-focus-visible:ring has-focus-visible:ring-primary has-aria-[checked=true]:border-primary has-aria-[checked=true]:bg-(--bg-weak-50) has-aria-[checked=true]:ring has-aria-[checked=true]:ring-primary"
                        htmlFor={option}
                        key={option}
                    >
                        <Radio.Item className="sr-only absolute size-px" id={option} value={option} />

                        <div className="flex items-center justify-start gap-3">
                            <span
                                className={cn(
                                    "inline-flex size-10 items-center justify-center rounded-full",
                                    accountTypes[option].color,
                                )}
                            >
                                <Icon className="!size-6" />
                            </span>

                            <div className="flex-1">
                                <div className="flex items-center gap-1">
                                    <span className="text-paragraph-sm text-(--text-strong-950)">
                                        {accountTypes[option].title}
                                    </span>
                                </div>
                                <div className="mt-1 line-clamp-1 text-paragraph-xs text-(--text-sub-600)">
                                    {accountTypes[option].description}
                                </div>
                            </div>
                        </div>
                    </LabelPrimivites.Root>
                );
            })}
        </Radio.Group>
    );
}
