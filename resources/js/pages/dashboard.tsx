import { Head } from "@inertiajs/react";

import { Header } from "#/components/header.tsx";
import * as Avatar from "#/components/ui/avatar.tsx";
import { TotalBalanceWidget } from "#/components/widgets/total-balance.tsx";
import { AppLayout } from "#/layouts/app-layout.tsx";
import { type PageProps } from "#/types/globals.js";

export default function Dashboard(props: PageProps) {
    console.log(props);

    return (
        <div className="flex flex-col gap-6 overflow-hidden px-4 pb-6 lg:px-8 lg:pt-1">
            <div className="mx-auto grid w-full max-w-md grid-cols-1 items-start gap-6 min-[1300px]:max-w-4xl min-[1400px]:max-w-full min-[1400px]:grid-cols-3 lg:max-w-3xl lg:grid-cols-2 lg:justify-center">
                <TotalBalanceWidget />
            </div>
        </div>
    );
}

Dashboard.layout = (page: React.ReactNode & { props: PageProps }) => (
    <AppLayout {...page.props}>
        <Head title="Dashboard" />
        <Header
            description="Welcome back to Apex 👋🏻"
            icon={
                <Avatar.Root $color="blue" $size="48">
                    <Avatar.Image alt="" src="/images/avatar/illustration/arthur.png" />
                </Avatar.Root>
            }
            title="Arthur Taylor"
        >
            {/* <MoveMoneyButton className='hidden lg:flex' /> */}
        </Header>

        {page}
    </AppLayout>
);
