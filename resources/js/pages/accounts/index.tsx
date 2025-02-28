import { Head } from "@inertiajs/react";

import * as Divider from "#/components/ui/divider.tsx";
import { AppLayout } from "#/layouts/app-layout.tsx";
import { type PageProps } from "#/types/globals.js";

export default function AccountsPage() {
    return (
        <>
            <div className="flex flex-col gap-5">
                {/* <PageHeader className="-mb-5">
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
                </PageHeader> */}

                <Divider.Root />
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
