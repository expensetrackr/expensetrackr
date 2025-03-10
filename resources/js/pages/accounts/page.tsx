import { Head } from "@inertiajs/react";
import WalletIcon from "virtual:icons/ri/wallet-line";

import { Header } from "#/components/header.tsx";
import * as Divider from "#/components/ui/divider.tsx";
import { AppLayout } from "#/layouts/app-layout.tsx";
import { type PageProps } from "#/types/globals.js";
import { Filters } from "./__components/filters.tsx";

export default function AccountsPage(props: PageProps) {
    console.info(props);
    return (
        <>
            <Header
                contentClassName="hidden lg:flex"
                description="Manage your accounts and add new ones."
                icon={
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-(--bg-white-0) shadow-xs ring-1 ring-(--stroke-soft-200) ring-inset">
                        <WalletIcon className="size-6 text-(--text-sub-600)" />
                    </div>
                }
                title="Accounts"
            >
                <></>
            </Header>

            <div className="lg:px-8">
                <Divider.Root />
            </div>

            <div className="flex flex-col gap-6 px-4 py-6 lg:px-8">
                <Filters />
            </div>
        </>
    );
}

AccountsPage.layout = (page: React.ReactNode & { props: PageProps }) => (
    <AppLayout {...page.props}>
        <Head title="Accounts" />

        {page}
    </AppLayout>
);
