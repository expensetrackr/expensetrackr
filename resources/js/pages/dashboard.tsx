import { Head } from "@inertiajs/react";
import type Decimal from "decimal.js";
import Add01Icon from "virtual:icons/hugeicons/add-01";

import { DashedDivider } from "#/components/dashed-divider.tsx";
import { Header } from "#/components/page-header.tsx";
import * as Avatar from "#/components/ui/avatar.tsx";
import * as Button from "#/components/ui/button.tsx";
import * as Divider from "#/components/ui/divider.tsx";
import { SpendingByCategoryWidget } from "#/components/widgets/spending-by-category.tsx";
import { TotalBalanceWidget } from "#/components/widgets/total-balance.tsx";
import { TransactionsTableWidget } from "#/components/widgets/transactions-table-widget.tsx";
import { useActionsParams } from "#/hooks/use-actions-params.ts";
import { useTranslation } from "#/hooks/use-translation.ts";
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

type SpendingByCategoryData = {
    id: string;
    name: string;
    value: Decimal.Value;
    color: string;
    percentage: number;
};

type DashboardProps = {
    netWorth: Decimal.Value;
    series: {
        totalBalance: NetWorthSeries;
    };
    spendingByCategory: SpendingByCategoryData[];
    transactions: Resources.Transaction[];
    requestId: string;
};

export default function Dashboard(props: PageProps<DashboardProps>) {
    const actions = useActionsParams();
    const { t } = useTranslation();

    return (
        <>
            <Header
                description={t("dashboard.description")}
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
                    {t("dashboard.actions.createTransaction")}
                </Button.Root>
            </Header>

            <div className="px-4 lg:px-8">
                <Divider.Root />
            </div>

            <div className="flex flex-1 flex-col gap-6 px-4 py-6 min-[1100px]:flex-row lg:px-8">
                <div className="min-w-0 flex-1">
                    <TotalBalanceWidget
                        netWorth={props.netWorth}
                        netWorthSeries={props.series.totalBalance}
                        title="Total balance"
                    />

                    <DashedDivider className="my-6" />

                    <div className="pt-6">
                        <TransactionsTableWidget
                            className="w-full"
                            requestId={props.requestId}
                            transactions={props.transactions}
                        />
                    </div>
                </div>

                <div className="w-px bg-(--stroke-soft-200) lg:block" />

                <div className="shrink-0 min-[1100px]:w-[328px]">
                    <SpendingByCategoryWidget data={props.spendingByCategory} title="Spending by category" />
                </div>
            </div>
        </>
    );
}

Dashboard.layout = (page: React.ReactNode & { props: PageProps }) => (
    <AppLayout {...page.props}>
        <Head title={page.props.translations["dashboard.seo.title"]} />
        {page}
    </AppLayout>
);
