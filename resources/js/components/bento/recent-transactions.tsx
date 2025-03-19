import Refund2Icon from "virtual:icons/ri/refund-2-line";

import { cnMerge } from "#/utils/cn.ts";
import { TransactionItem } from "../transaction-item.tsx";
import * as Button from "../ui/button.tsx";
import * as SegmentedControl from "../ui/segmented-control.tsx";
import * as WidgetBox from "../widget-box.tsx";

const transactions: Resources.Transaction[] = [
    {
        id: "2441s347",
        name: "Salary Deposit",
        note: "Monthly salary from Apex Finance",
        amount: "3500",
        currency: "USD",
        datedAt: "09/18/2024",
        category: {
            id: "salary",
            name: "Salary",
            slug: "salary",
            color: "#00A86B",
        },
    },
    {
        id: "2421c347",
        name: "Stock Dividend",
        note: "Payment from stock investments.",
        amount: "846.14",
        currency: "USD",
        datedAt: "09/17/2024",
        category: {
            id: "investments",
            name: "Investments",
            slug: "investments",
            color: "#50C878",
        },
    },
    {
        id: "ab193fd6",
        type: "rent",
        name: "Rental Income",
        note: "Rental payment from Mr. Dudley.",
        amount: "100",
        currency: "USD",
        datedAt: "09/15/2024",
        category: {
            id: "housing",
            name: "Housing",
            slug: "housing",
            color: "#FF6B6B",
        },
    },
    {
        id: "7a2dc594",
        type: "other",
        name: "Refund from Amazon",
        note: "Refund of Order No #124235",
        amount: "36.24",
        currency: "USD",
        datedAt: "09/12/2024",
        enrichment: {
            merchantName: "Amazon",
            icon: `${ENV.PUBLIC_ASSETS_URL}/major-brands/amazon.svg`,
        },
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
                        amount={trx.amount}
                        category={trx.category}
                        currency={trx.currency}
                        date={trx.datedAt}
                        description={trx.note}
                        enrichment={trx.enrichment}
                        key={trx.id}
                        name={trx.name}
                    />
                ))}
            </div>
        </WidgetBox.Root>
    );
}
