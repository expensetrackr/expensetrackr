import type * as v from "valibot";
import BankIcon from "virtual:icons/hugeicons/bank";
import BitcoinWalletIcon from "virtual:icons/hugeicons/bitcoin-wallet";
import ChartUpIcon from "virtual:icons/hugeicons/chart-up";
import CreditCardIcon from "virtual:icons/hugeicons/credit-card";
import DashboardSquare01Icon from "virtual:icons/hugeicons/dashboard-square-01";
import PackageSearchIcon from "virtual:icons/hugeicons/package-search";
import ReceiptDollarIcon from "virtual:icons/hugeicons/receipt-dollar";
import TipsIcon from "virtual:icons/hugeicons/tips";

import { type AccountTypeEnum } from "#/schemas/account.ts";

export const accountTypeColors: Record<v.InferOutput<typeof AccountTypeEnum>, string> = {
    depository: "var(--light, var(--color-blue-600)) var(--dark, var(--color-blue-500))",
    investment: "var(--light, var(--color-teal-600)) var(--dark, var(--color-teal-500))",
    crypto: "var(--light, var(--color-yellow-600)) var(--dark, var(--color-yellow-500))",
    credit_card: "var(--light, var(--color-purple-600)) var(--dark, var(--color-purple-500))",
    loan: "var(--light, var(--color-red-600)) var(--dark, var(--color-red-500))",
    other_asset: "var(--light, var(--color-neutral-600)) var(--dark, var(--color-neutral-500))",
    other_liability: "var(--light, var(--color-neutral-600)) var(--dark, var(--color-neutral-500))",
};

export const accountTypeIcons: Record<
    v.InferOutput<typeof AccountTypeEnum>,
    React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
    depository: BankIcon,
    investment: ChartUpIcon,
    crypto: BitcoinWalletIcon,
    credit_card: CreditCardIcon,
    loan: TipsIcon,
    other_asset: PackageSearchIcon,
    other_liability: ReceiptDollarIcon,
};

export function AccountTypeIcon({ accountType, ...props }: { accountType?: string } & React.SVGProps<SVGSVGElement>) {
    const Component = accountTypeIcons[accountType as keyof typeof accountTypeIcons] ?? DashboardSquare01Icon;

    return <Component {...props} />;
}
