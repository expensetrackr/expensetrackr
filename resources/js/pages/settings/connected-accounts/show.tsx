import { Head } from "@inertiajs/react";
import EqualizerIcon from "virtual:icons/ri/equalizer-line";

import * as Divider from "#/components/ui/divider.tsx";
import { SettingsLayout } from "#/layouts/settings-layout.tsx";
import { type InertiaSharedProps } from "#/types/index.ts";
import ConnectedAccountsForm from "./partials/connected-accounts-form.tsx";

export default function ConnectedAccountsShow() {
    return (
        <>
            <Divider.Root />

            <ConnectedAccountsForm />
        </>
    );
}

ConnectedAccountsShow.layout = (page: React.ReactNode & { props: InertiaSharedProps }) => (
    <SettingsLayout
        {...page.props}
        description="Manage your social connected accounts."
        icon={EqualizerIcon}
        title="Connected accounts"
    >
        <Head title="Social accounts" />

        {page}
    </SettingsLayout>
);
