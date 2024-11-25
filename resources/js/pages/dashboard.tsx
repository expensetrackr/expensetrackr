import { Head } from "@inertiajs/react";

import { AppLayout } from "#/layouts/app-layout.tsx";
import { type InertiaSharedProps } from "#/types/index.ts";

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="sm:rounded-lg overflow-hidden bg-white shadow-sm">
                        <div className="text-gray-900 p-6">You're logged in!</div>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = (page: React.ReactNode & { props: InertiaSharedProps }) => (
    <AppLayout {...page.props}>{page}</AppLayout>
);
