import { Head } from "@inertiajs/react";

import { PricingTable } from "#/components/pricing-table.tsx";
import { PricingSection } from "#/components/sections/pricing.tsx";
import { useTranslation } from "#/hooks/use-translation.ts";
import { GuestLayout } from "#/layouts/guest-layout.tsx";
import { type PageProps } from "#/types/globals.js";

export default function PricingPage() {
    const { t } = useTranslation();
    const title = t("pages.pricing.title");
    const description = t("pages.pricing.description");

    return (
        <>
            <Head title={title}>
                {/* Primary Tags */}
                <meta content={`${title} - ${ENV.APP_NAME}`} head-key="title" name="title" />
                <meta content={description} head-key="description" name="description" />

                {/* Open Graph */}
                <meta content={`${title} - ${ENV.APP_NAME}`} head-key="og:title" property="og:title" />
                <meta content={description} head-key="og:description" property="og:description" />

                {/* Twitter */}
                <meta content={`${title} - ${ENV.APP_NAME}`} head-key="twitter:title" property="twitter:title" />
                <meta content={description} head-key="twitter:description" property="twitter:description" />
            </Head>

            <PricingSection containerClassName="pt-24 lg:pt-32" />

            <div className="container border-x border-t bg-(--bg-white-0) py-12 lg:px-12">
                <PricingTable />
            </div>
        </>
    );
}

PricingPage.layout = (page: React.ReactNode & { props: PageProps }) => (
    <GuestLayout {...page.props}>{page}</GuestLayout>
);
