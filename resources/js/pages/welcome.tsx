import { FeaturesSection } from "#/components/sections/features.tsx";
import { HeroSection } from "#/components/sections/hero.tsx";
import { GuestLayout } from "#/layouts/guest-layout.tsx";
import { type PageProps } from "#/types/globals.js";

export default function WelcomePage() {
    return (
        <>
            <HeroSection />
            <FeaturesSection />
        </>
    );
}

WelcomePage.layout = (page: React.ReactNode & { props: PageProps }) => (
    <GuestLayout {...page.props}>{page}</GuestLayout>
);
