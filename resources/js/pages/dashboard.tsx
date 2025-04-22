import { Head } from "@inertiajs/react";
import type Decimal from "decimal.js";
import Add01Icon from "virtual:icons/hugeicons/add-01";

import { Header } from "#/components/header.tsx";
import * as Avatar from "#/components/ui/avatar.tsx";
import * as Button from "#/components/ui/button.tsx";
import { TotalBalanceWidget } from "#/components/widgets/total-balance.tsx";
import { TransactionsTableWidget } from "#/components/widgets/transactions-table-widget.tsx";
import { useActionsParams } from "#/hooks/use-actions-params.ts";
import { AppLayout } from "#/layouts/app-layout.tsx";
import { type PageProps } from "#/types/globals.js";
import { type Trend } from "#/types/index.js";

type NetWorthSeries = {
    startDate: string;
    endDate: string;
    interval: string;
    trend: Trend;
    values: {
        date: string;
        dateFormatted: string;
        trend: Trend;
    }[];
};

type DashboardProps = {
    netWorth: Decimal.Value;
    series: {
        totalBalance: NetWorthSeries;
    };
    transactions: Resources.Transaction[];
    requestId: string;
};

export default function Dashboard(props: PageProps<DashboardProps>) {
    const actions = useActionsParams();

    return (
        <>
            <Header
                description="Welcome back to ExpenseTracker 👋🏻"
                icon={
                    <Avatar.Root $color="blue" $size="48">
                        {props.auth?.user?.profilePhotoUrl ? (
                            <Avatar.Image alt="" src={props.auth?.user?.profilePhotoUrl ?? undefined} />
                        ) : (
                            props.auth?.user?.name?.slice(0, 2)
                        )}
                    </Avatar.Root>
                }
                title={props.auth?.user?.name}
            >
                <Button.Root onClick={() => actions.setParams({ action: "create", resource: "transactions" })}>
                    <Button.Icon as={Add01Icon} className="size-4" />
                    Create transaction
                </Button.Root>
            </Header>

            <div className="flex flex-col gap-6 overflow-hidden px-4 pb-6 lg:px-8 lg:pt-1">
                <div className="mx-auto grid w-full max-w-md grid-cols-1 items-start gap-6 min-[1300px]:max-w-4xl min-[1400px]:max-w-full min-[1400px]:grid-cols-3 lg:max-[1300px]:max-w-3xl lg:max-[1300px]:grid-cols-2 lg:max-[1300px]:justify-center">
                    <TotalBalanceWidget
                        className="[grid-column:1/-1] h-64"
                        netWorth={props.netWorth}
                        netWorthSeries={props.series.totalBalance}
                        title="Total balance"
                    />
                    <TransactionsTableWidget
                        className="[grid-column:1/-1]"
                        requestId={props.requestId}
                        transactions={props.transactions}
                    />
                </div>
            </div>
        </>
    );
}

Dashboard.layout = (page: React.ReactNode & { props: PageProps }) => (
    <AppLayout {...page.props}>
        <Head title="Dashboard" />
        {page}
    </AppLayout>
);
