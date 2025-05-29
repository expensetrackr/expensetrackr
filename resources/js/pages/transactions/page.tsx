import { Head } from "@inertiajs/react";
import PlusSignIcon from "virtual:icons/hugeicons/plus-sign";
import TransactionIcon from "virtual:icons/hugeicons/transaction";

import { Header } from "#/components/page-header.tsx";
import { TablePagination } from "#/components/table-pagination.tsx";
import { TransactionDetailsDrawer } from "#/components/transactions/details-drawer.tsx";
import { TransactionsFilters } from "#/components/transactions/filters.tsx";
import { TransactionsTable } from "#/components/transactions/table.tsx";
import * as Button from "#/components/ui/button.tsx";
import * as Divider from "#/components/ui/divider.tsx";
import { useActionsParams } from "#/hooks/use-actions-params.ts";
import { useFeaturesAndPermissions } from "#/hooks/use-features-and-permissions.ts";
import { usePaginationParams } from "#/hooks/use-pagination-params.ts";
import { AppLayout } from "#/layouts/app-layout.tsx";
import { type PageProps } from "#/types/globals.ts";

type TransactionsPageProps = {
    transactions: Laravel.PaginatedResponse<Resources.Transaction>;
    requestId: string;
    permissions: {
        create: boolean;
        update: boolean;
    };
};

export default function TransactionsPage({ transactions, requestId }: TransactionsPageProps) {
    const [, setPagination] = usePaginationParams();
    const { permissions } = useFeaturesAndPermissions();
    const actions = useActionsParams();

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
                {permissions?.canCreateTransactions && (
                    <Button.Root onClick={() => actions.setParams({ action: "create", resource: "transactions" })}>
                        <Button.Icon as={PlusSignIcon} className="size-4" />
                        Add transaction
                    </Button.Root>
                )}
            </Header>

            <div className="lg:px-8">
                <Divider.Root />
            </div>

            <div className="flex flex-1 flex-col gap-4 px-4 py-6 lg:px-8">
                <TransactionsFilters />
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

            <TransactionDetailsDrawer />
        </>
    );
}

TransactionsPage.layout = (page: React.ReactNode & { props: PageProps }) => (
    <AppLayout {...page.props}>
        <Head title="Transactions" />

        {page}
    </AppLayout>
);
