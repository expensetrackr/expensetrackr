import BankIcon from "virtual:icons/ri/bank-line";
import HomeSmileFillIcon from "virtual:icons/ri/home-smile-fill";
import LineChartIcon from "virtual:icons/ri/line-chart-line";
import Refund2Icon from "virtual:icons/ri/refund-2-line";

import { type Transaction } from "#/lib/cards-data.ts";
import { cnMerge } from "#/utils/cn.ts";
import { TransactionItem } from "../transaction-item.tsx";
import * as Button from "../ui/button.tsx";
import * as SegmentedControl from "../ui/segmented-control.tsx";
import * as WidgetBox from "../widget-box.tsx";

const transactions: Transaction[] = [
    {
        id: "2441s347",
        type: "other",
        name: "Salary Deposit",
        description: "Monthly salary from Apex Finance",
        transaction: 3500,
        date: new Date("09/18/2024"),
        icon: BankIcon,
    },
    {
        id: "2421c347",
        type: "other",
        name: "Stock Dividend",
        description: "Payment from stock investments.",
        transaction: 846.14,
        date: new Date("09/17/2024"),
        icon: LineChartIcon,
    },
    {
        id: "ab193fd6",
        type: "rent",
        name: "Rental Income",
        description: "Rental payment from Mr. Dudley.",
        transaction: 100,
        date: new Date("09/15/2024"),
        icon: HomeSmileFillIcon,
    },
    {
        id: "7a2dc594",
        type: "other",
        name: "Refund from Amazon",
        description: "Refund of Order No #124235",
        transaction: 36.24,
        date: new Date("09/12/2024"),
        icon: `${import.meta.env.VITE_PUBLIC_ASSETS_URL}/major-brands/amazon.svg`,
    },
];

export function BentoRecentTransactions({
    className,
    ...props
}: React.CustomComponentPropsWithRef<typeof WidgetBox.Root>) {
    return (
        <WidgetBox.Root className={cnMerge("pb-5", className)} {...props}>
            <WidgetBox.Header>
                <WidgetBox.HeaderIcon as={Refund2Icon} />
                Recent Transactions
                <Button.Root $size="xs" $style="stroke" $type="neutral">
                    See All
                </Button.Root>
            </WidgetBox.Header>

            <SegmentedControl.Root defaultValue="incoming">
                <SegmentedControl.List>
                    <SegmentedControl.Trigger value="incoming">Incoming</SegmentedControl.Trigger>
                    <SegmentedControl.Trigger value="outgoing">Outgoing</SegmentedControl.Trigger>
                    <SegmentedControl.Trigger value="pending">Pending</SegmentedControl.Trigger>
                </SegmentedControl.List>
            </SegmentedControl.Root>

            <div className="mt-3 flex flex-col gap-2">
                {transactions.map((trx) => (
                    <TransactionItem
                        date={trx.date}
                        description={trx.description}
                        icon={trx.icon}
                        key={trx.id}
                        name={trx.name}
                        transaction={trx.transaction}
                        type={trx.type}
                    />
                ))}
            </div>
        </WidgetBox.Root>
    );
}
