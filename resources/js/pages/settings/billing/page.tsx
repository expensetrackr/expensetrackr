import { Head } from "@inertiajs/react";
import CreditCardSolidIcon from "virtual:icons/hugeicons/credit-card-solid";

import { Header } from "#/components/page-header.tsx";
import { PricingSection } from "#/components/sections/pricing.tsx";
import * as Divider from "#/components/ui/divider.tsx";
import { SettingsLayout } from "#/layouts/settings-layout.tsx";
import { type PageProps } from "#/types/globals.js";

export default function SettingsBillingPage() {
    return (
        <>
            <PricingSection containerClassName="pt-0 pb-12" isInternal />
        </>
    );
}

SettingsBillingPage.layout = (page: React.ReactNode & { props: PageProps }) => (
    <SettingsLayout {...page.props}>
        <Head title="Billing" />

        <Header
            description="Manage your billing information and subscription details."
            icon={
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-(--bg-white-0) shadow-xs ring-1 ring-(--stroke-soft-200) ring-inset">
                    <CreditCardSolidIcon className="size-6 text-(--text-sub-600)" />
                </div>
            }
            title="Billing"
        />

        <div className="px-4 lg:px-8">
            <Divider.Root />
        </div>

        {page}
    </SettingsLayout>
);
