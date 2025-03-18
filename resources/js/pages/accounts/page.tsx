import { Head, Link } from "@inertiajs/react";
import Wallet01Icon from "virtual:icons/hugeicons/wallet-01";
import WalletAdd01 from "virtual:icons/hugeicons/wallet-add-01";

import { IllustrationEmptyAccounts } from "#/components/empty-illustrations/accounts.tsx";
import { Header } from "#/components/header.tsx";
import * as Button from "#/components/ui/button.tsx";
import * as Divider from "#/components/ui/divider.tsx";
import { AppLayout } from "#/layouts/app-layout.tsx";
import { type PageProps } from "#/types/globals.js";
import { AccountsList } from "./__components/accounts-lists.tsx";
import { AccountDetailsDrawer } from "./__components/details-drawer.tsx";
import { Filters } from "./__components/filters.tsx";

type AccountsPageProps = {
    accounts: Laravel.PaginatedResponse<Resources.Account>;
    account?: Resources.Account | null;
};

export default function AccountsPage({ accounts, account }: AccountsPageProps) {
    return (
        <>
            <Header
                contentClassName="hidden lg:flex"
                description="Manage your accounts and add new ones."
                icon={
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-(--bg-white-0) shadow-xs ring-1 ring-(--stroke-soft-200) ring-inset">
                        <Wallet01Icon className="size-6 text-(--text-sub-600)" />
                    </div>
                }
                title="Accounts"
            >
                <Button.Root asChild className="w-full md:w-auto">
                    <Link href={route("accounts.create")}>
                        <Button.Icon as={WalletAdd01} />
                        Add account
                    </Link>
                </Button.Root>
            </Header>

            <div className="lg:px-8">
                <Divider.Root />
            </div>

            <div className="flex flex-col gap-6 px-4 py-6 lg:px-8">
                <Filters />
                <AccountsList accounts={accounts.data} />

                {accounts.data.length === 0 && (
                    <div className="flex flex-1 flex-col justify-center pt-4">
                        <div className="flex flex-col items-center gap-5 p-5">
                            <IllustrationEmptyAccounts className="size-[108px]" />
                            <div className="text-center text-paragraph-sm text-(--text-soft-400)">
                                You do not have any accounts yet.
                                <br />
                                Click the button to add one.
                            </div>
                            <Button.Root $size="xs" $style="stroke" asChild>
                                <Link href={route("accounts.create")}>
                                    <Button.Icon as={WalletAdd01} />
                                    Add account
                                </Link>
                            </Button.Root>
                        </div>
                    </div>
                )}
            </div>

            <AccountDetailsDrawer account={account} />
        </>
    );
}

AccountsPage.layout = (page: React.ReactNode & { props: PageProps }) => (
    <AppLayout {...page.props}>
        <Head title="Accounts" />

        {page}
    </AppLayout>
);
