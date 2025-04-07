import { Head } from "@inertiajs/react";
import type Decimal from "decimal.js";

import { Header } from "#/components/header.tsx";
import * as Avatar from "#/components/ui/avatar.tsx";
import { TotalBalanceWidget } from "#/components/widgets/total-balance.tsx";
import { AppLayout } from "#/layouts/app-layout.tsx";
import { type PageProps } from "#/types/globals.js";
import { type Trend } from "#/types/index.js";

type DashboardProps = {
    netWorth: Decimal.Value;
    netWorthSeries: {
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
};

export default function Dashboard(props: PageProps<DashboardProps>) {
    return (
        <div className="flex flex-col gap-6 overflow-hidden px-4 pb-6 lg:px-8 lg:pt-1">
            <div className="mx-auto grid w-full max-w-md grid-cols-1 items-start gap-6 min-[1300px]:max-w-4xl min-[1400px]:max-w-full min-[1400px]:grid-cols-3 lg:max-w-3xl lg:grid-cols-2 lg:justify-center">
                <TotalBalanceWidget netWorth={props.netWorth} netWorthSeries={props.netWorthSeries} />
            </div>
        </div>
    );
}

Dashboard.layout = (page: React.ReactNode & { props: PageProps }) => (
    <AppLayout {...page.props}>
        <Head title="Dashboard" />
        <Header
            description="Welcome back to Expense Tracker 👋🏻"
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
