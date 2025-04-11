import { Head } from "@inertiajs/react";
import type Decimal from "decimal.js";

import { Header } from "#/components/header.tsx";
import * as Avatar from "#/components/ui/avatar.tsx";
import { TotalBalanceWidget } from "#/components/widgets/total-balance.tsx";
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
        lastWeek: NetWorthSeries;
        lastMonth: NetWorthSeries;
        lastYear: NetWorthSeries;
    };
};

export default function Dashboard(props: PageProps<DashboardProps>) {
    console.log(props);
    return (
        <div className="flex flex-col gap-6 overflow-hidden px-4 pb-6 lg:px-8 lg:pt-1">
            <div className="mx-auto grid w-full max-w-md grid-cols-1 items-start gap-6 min-[1300px]:max-w-4xl lg:max-w-3xl lg:grid-cols-2 lg:justify-center 2xl:max-w-full 2xl:grid-cols-3">
                <TotalBalanceWidget
                    className="h-64"
                    formatStr="EEE"
                    netWorth={props.netWorth}
                    netWorthSeries={props.series.lastWeek}
                    title="Last week balance"
                />
                <TotalBalanceWidget
                    className="[grid-column:1/-1] h-64 min-[1300px]:col-span-2"
                    formatStr="EEE"
                    netWorth={props.netWorth}
                    netWorthSeries={props.series.lastMonth}
                    title="Last month balance"
                />
                <TotalBalanceWidget
                    className="h-64 lg:col-span-full"
                    netWorth={props.netWorth}
                    netWorthSeries={props.series.lastYear}
                    title="Last year balance"
                />
            </div>
        </div>
    );
}

Dashboard.layout = (page: React.ReactNode & { props: PageProps }) => (
    <AppLayout {...page.props}>
        <Head title="Dashboard" />
        <Header
            description="Welcome back to ExpenseTracker 👋🏻"
            icon={
                <Avatar.Root $color="blue" $size="48">
                    {page.props.auth?.user?.profilePhotoUrl ? (
                        <Avatar.Image alt="" src={page.props.auth?.user?.profilePhotoUrl ?? undefined} />
                    ) : (
                        page.props.auth?.user?.name?.slice(0, 2)
                    )}
                </Avatar.Root>
            }
            title={page.props.auth?.user?.name}
        >
            {/* <MoveMoneyButton className='hidden lg:flex' /> */}
        </Header>

        {page}
    </AppLayout>
);
