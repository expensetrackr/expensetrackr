import { Head } from "@inertiajs/react";

import { MobileMenu } from "#/layouts/partials/mobile-menu.tsx";
import { Image } from "./image.tsx";
import { Link } from "./link.tsx";
import { Source } from "./source.tsx";

export function HeaderMobile() {
    return (
        <>
            <Head>
                <link as="image" href="/img/isotype-light.svg" media="(prefers-color-scheme: light)" rel="preload" />
                <link as="image" href="/img/isotype-dark.svg" media="(prefers-color-scheme: dark)" rel="preload" />
            </Head>

            <div className="flex h-[60px] w-full items-center justify-between border-b border-(--stroke-soft-200) px-4 lg:hidden">
                <Link className="shrink-0" href="/">
                    <picture>
                        <Source
                            height={36}
                            media="(prefers-color-scheme: dark)"
                            src="/img/isotype-dark.svg"
                            width={36}
                        />
                        <Image
                            alt="ExpenseTrackr"
                            className="size-9"
                            fetchPriority="high"
                            height={36}
                            src="/img/isotype-light.svg"
                            width={36}
                        />
                    </picture>
                </Link>

                <div className="flex gap-3">
                    <div className="flex w-1 shrink-0 items-center before:h-full before:w-px before:bg-(--stroke-soft-200)" />

                    <MobileMenu />
                </div>
            </div>
        </>
    );
}
