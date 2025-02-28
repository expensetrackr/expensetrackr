import { Head } from "@inertiajs/react";
import EqualizerIcon from "virtual:icons/ri/equalizer-line";

import { Header } from "#/components/header.tsx";
import * as Divider from "#/components/ui/divider.tsx";
import { SettingsLayout } from "#/layouts/settings-layout.tsx";
import ConnectedAccountsForm from "./partials/connected-accounts-form.tsx";

export default function ConnectedAccountsShow() {
    return (
        <>
            <div className="px-4 lg:px-8">
                <Divider.Root />
            </div>

            <div className="flex w-full flex-col gap-5 px-4 py-6 lg:px-8">
                <ConnectedAccountsForm />
            </div>
        </>
    );
}

ConnectedAccountsShow.layout = (page: React.ReactNode & { props: App.Data.SharedInertiaData }) => (
    <SettingsLayout {...page.props}>
        <Head title="Social accounts" />

        <Header
            description="Manage your social connected accounts."
            icon={
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-(--bg-white-0) shadow-xs ring-1 ring-(--stroke-soft-200) ring-inset">
                    <EqualizerIcon className="size-6 text-(--text-sub-600)" />
                </div>
            }
            title="Connected accounts"
        />

        {page}
    </SettingsLayout>
);
