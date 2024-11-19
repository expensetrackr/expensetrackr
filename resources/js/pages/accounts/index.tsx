import { Head } from "@inertiajs/react";
import AddIcon from "virtual:icons/ri/add-line";
import WalletIcon from "virtual:icons/ri/wallet-line";
import { route } from "ziggy-js";

import { Button } from "#/components/button.tsx";
import { Divider } from "#/components/divider.tsx";
import { PageHeader } from "#/components/page-header.tsx";
import { AppLayout } from "#/layouts/app-layout.tsx";
import { type InertiaSharedProps } from "#/types/index.ts";

export default function AccountsPage() {
    return (
        <>
            <Head title="Accounts" />

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
                            <Button href={route("accounts.create")}>
                                <AddIcon />
                                <span>Create account</span>
                            </Button>
                        </PageHeader.Actions>
                    </PageHeader.Content>
                </PageHeader>

                <Divider />
            </div>
        </>
    );
}

AccountsPage.layout = (page: React.ReactNode & { props: InertiaSharedProps }) => (
    <AppLayout {...page.props}>{page}</AppLayout>
);
