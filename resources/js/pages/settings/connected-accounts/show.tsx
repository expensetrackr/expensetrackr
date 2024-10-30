import { Head } from "@inertiajs/react";
import EqualizerIcon from "virtual:icons/ri/equalizer-line";

import { Divider } from "#/components/divider.tsx";
import { PageHeader } from "#/components/page-header.tsx";
import { AppLayout } from "#/layouts/app-layout.tsx";
import { SettingsSidebar } from "#/layouts/partials/settings-sidebar.tsx";
import ConnectedAccountsForm from "./partials/connected-accounts-form.tsx";

export default function SocialAccountsShow() {
    return (
        <AppLayout subSidebar={<SettingsSidebar />}>
            <Head title="Social accounts" />

            <PageHeader>
                <PageHeader.Content>
                    <PageHeader.Icon>
                        <EqualizerIcon className="size-6" />
                    </PageHeader.Icon>

                    <div className="flex flex-1 flex-col gap-1">
                        <PageHeader.Title>Connected accounts</PageHeader.Title>
                        <PageHeader.Description>Manage your social connected accounts.</PageHeader.Description>
                    </div>
                </PageHeader.Content>
            </PageHeader>

            <Divider />

            <ConnectedAccountsForm />
        </AppLayout>
    );
}
