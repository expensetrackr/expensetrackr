import { Head, Link } from "@inertiajs/react";
import AddIcon from "virtual:icons/ri/add-line";
import WalletIcon from "virtual:icons/ri/wallet-line";
import { route } from "ziggy-js";

import { Divider } from "#/components/divider.tsx";
import { PageHeader } from "#/components/page-header.tsx";
import * as Button from "#/components/ui/button.tsx";
import { AppLayout } from "#/layouts/app-layout.tsx";
import { type InertiaSharedProps } from "#/types/index.ts";

export default function AccountsPage() {
    return (
        <>
            <div className="flex flex-col gap-5">
                <PageHeader className="-mb-5">
                    <PageHeader.Content>
                        <PageHeader.Icon>
                            <WalletIcon className="size-6" />
                        </PageHeader.Icon>

                        <div className="flex flex-1 flex-col gap-1">
                            <PageHeader.Title>Accounts</PageHeader.Title>
                            <PageHeader.Description>Manage your accounts and add new ones.</PageHeader.Description>
                        </div>

                        <PageHeader.Actions>
                            <Button.Root asChild>
                                <Link href={route("accounts.create")}>
                                    <Button.Icon as={AddIcon} />
                                    <span>Create account</span>
                                </Link>
                            </Button.Root>
                        </PageHeader.Actions>
                    </PageHeader.Content>
                </PageHeader>

                <Divider />
            </div>
        </>
    );
}

AccountsPage.layout = (page: React.ReactNode & { props: InertiaSharedProps }) => (
    <AppLayout {...page.props}>
        <Head title="Accounts" />

        {page}
    </AppLayout>
);
