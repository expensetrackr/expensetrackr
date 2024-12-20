import { Head } from "@inertiajs/react";

import { MobileMenu } from "#/layouts/partials/mobile-menu.tsx";
import { Link } from "./link.tsx";

export function HeaderMobile() {
    return (
        <>
            <Head>
                <link as="image" href="/img/isotype-light.svg" media="(prefers-color-scheme: light)" rel="preload" />
                <link as="image" href="/img/isotype-dark.svg" media="(prefers-color-scheme: dark)" rel="preload" />
            </Head>

            <div className="flex h-[60px] w-full items-center justify-between border-b border-(--stroke-soft-200) px-4 lg:hidden">
                <Link className="shrink-0" href="/">
                    <img
                        alt="ExpenseTrackr"
                        className="size-9 dark:hidden"
                        fetchPriority="high"
                        src="/img/isotype-light.svg"
                    />
                    <img
                        alt="ExpenseTrackr"
                        className="hidden size-9 dark:block"
                        fetchPriority="high"
                        src="/img/isotype-dark.svg"
                    />
                </Link>

                <div className="flex gap-3">
                    <div className="flex w-1 shrink-0 items-center before:h-full before:w-px before:bg-(--stroke-soft-200)" />

                    <MobileMenu />
                </div>
            </div>
        </>
    );
}
