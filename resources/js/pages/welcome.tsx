import { Head } from "@inertiajs/react";

import { type PageProps } from "#/types/index.ts";

export default function WelcomePage(props: PageProps<{ laravelVersion: string; phpVersion: string }>) {
    console.info(props);

    return (
        <>
            <Head title="Welcome" />
        </>
    );
}
