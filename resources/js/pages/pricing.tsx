import { PricingTable } from "#/components/pricing-table.tsx";
import { PricingSection } from "#/components/sections/pricing.tsx";
import { GuestLayout } from "#/layouts/guest-layout.tsx";
import { type PageProps } from "#/types/globals.js";

export default function PricingPage() {
    return (
        <>
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
