import { Link } from "@inertiajs/react";
import * as React from "react";
import { useDebounceCallback } from "usehooks-ts";
import CommandIcon from "virtual:icons/hugeicons/command";
import Search01Icon from "virtual:icons/hugeicons/search-01";
import TransactionIcon from "virtual:icons/hugeicons/transaction";

import { TransactionsTable } from "#/components/transactions/table.tsx";
import { useTransactionsParams } from "#/hooks/use-transactions-params.ts";
import { routes } from "#/routes.ts";
import { cn } from "#/utils/cn.ts";
import * as Button from "../ui/button.tsx";
import * as Input from "../ui/input.tsx";
import * as Kbd from "../ui/kbd.tsx";

type TransactionsTableWidgetProps = React.HTMLAttributes<HTMLDivElement> & {
    transactions: Resources.Transaction[];
    requestId: string;
};

export function TransactionsTableWidget({
    className,
    transactions,
    requestId,
    ...props
}: TransactionsTableWidgetProps) {
    const { setParams, ...params } = useTransactionsParams();

    const handleSearch = useDebounceCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        void setParams({ name: event.target.value }, { shallow: false });
    }, 300);

    return (
        <div
            className={cn(
                "relative left-1/2 flex w-screen -translate-x-1/2 flex-col gap-6 px-4 lg:w-auto lg:px-0",
                className,
            )}
            {...props}
        >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <div className="flex flex-1 items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-(--bg-white-0) shadow-xs ring-1 ring-(--stroke-soft-200) ring-inset">
                        <TransactionIcon className="size-5 text-(--text-sub-600)" />
                    </div>
                    <div>
                        <div className="text-label-sm">Recent Transactions</div>
                        <div className="mt-1 text-paragraph-xs text-(--text-sub-600)">
                            Display the recent transactions in the table below.
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Input.Root $size="sm" className="max-w-lg lg:w-[300px]">
                        <Input.Wrapper>
                            <Input.Icon as={Search01Icon} />
                            <Input.Input defaultValue={params.name} onChange={handleSearch} placeholder="Search..." />
                            <Kbd.Root>
                                <CommandIcon className="size-2.5" />1
                            </Kbd.Root>
                        </Input.Wrapper>
                    </Input.Root>
                    <Button.Root $size="sm" $style="stroke" $type="neutral" asChild>
                        <Link href={routes.transactions.index.url()}>See All</Link>
                    </Button.Root>
                </div>
            </div>

            <TransactionsTable data={transactions} key={requestId} total={transactions.length} />
        </div>
    );
}
