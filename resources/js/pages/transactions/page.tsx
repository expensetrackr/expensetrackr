import { Head, Link } from "@inertiajs/react";
import PlusSignIcon from "virtual:icons/hugeicons/plus-sign";
import Share03Icon from "virtual:icons/hugeicons/share-03";
import TransactionIcon from "virtual:icons/hugeicons/transaction";

import { Header } from "#/components/header.tsx";
import { TablePagination } from "#/components/table-pagination.tsx";
import * as Button from "#/components/ui/button.tsx";
import * as Divider from "#/components/ui/divider.tsx";
import { usePaginationParams } from "#/hooks/use-pagination-params.ts";
import { usePermissions } from "#/hooks/use-permissions.ts";
import { AppLayout } from "#/layouts/app-layout.tsx";
import { type PageProps } from "#/types/globals.ts";
import { TransactionDetailsDrawer } from "./__components/details-drawer.tsx";
import { Filters } from "./__components/filters.tsx";
import { TransactionsTable } from "./__components/table.tsx";

type TransactionsPageProps = {
    transactions: Laravel.PaginatedResponse<Resources.Transaction>;
    transaction?: Resources.Transaction | null;
    categories: Array<Resources.Category>;
    requestId: string;
    permissions: {
        create: boolean;
        update: boolean;
    };
};

export default function TransactionsPage({ transactions, transaction, categories, requestId }: TransactionsPageProps) {
    const [, setPagination] = usePaginationParams();
    const { canCreateTransactions } = usePermissions();

    return (
        <>
            <Header
                contentClassName="hidden lg:flex"
                description="Manage your transactions and add new ones."
                icon={
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-(--bg-white-0) shadow-xs ring-1 ring-(--stroke-soft-200) ring-inset">
                        <TransactionIcon className="size-6 text-(--text-sub-600)" />
                    </div>
                }
                title="Transactions"
            >
                <Button.Root $style="stroke" $type="neutral" className="w-full md:w-auto">
                    <Button.Icon as={Share03Icon} />
                    Export
                </Button.Root>
                {canCreateTransactions && (
                    <Button.Root asChild>
                        <Link href={route("transactions.create")}>
                            <Button.Icon as={PlusSignIcon} />
                            Add Transaction
                        </Link>
                    </Button.Root>
                )}
            </Header>

            <div className="lg:px-8">
                <Divider.Root />
            </div>

            <div className="flex flex-1 flex-col gap-4 px-4 py-6 lg:px-8">
                <Filters />
                <TransactionsTable
                    // use a key to compare the data so the table is not re-rendered when the params change
                    data={transactions.data ?? []}
                    key={requestId}
                    total={transactions.meta.total}
                />
                <div className="mt-auto">
                    <TablePagination
                        links={transactions.links}
                        meta={transactions.meta}
                        onPerPageChange={(perPage) => setPagination({ pageSize: perPage })}
                    />
                </div>
            </div>

            <TransactionDetailsDrawer categories={categories} transaction={transaction} />
        </>
    );
}

TransactionsPage.layout = (page: React.ReactNode & { props: PageProps }) => (
    <AppLayout {...page.props}>
        <Head title="Transactions" />

        {page}
    </AppLayout>
);
