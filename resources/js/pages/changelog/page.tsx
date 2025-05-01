import { Head } from "@inertiajs/react";
import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import Clock01Icon from "virtual:icons/hugeicons/clock-01";

import { ChangelogEntry } from "#/components/changelog-entry.tsx";
import { useTranslation } from "#/hooks/use-translation.ts";
import { GuestLayout } from "#/layouts/guest-layout.tsx";
import { type PageProps } from "#/types/globals.js";

interface ChangelogPageProps {
    changelogs: Array<Resources.Changelog>;
}

export default function ChangelogPage({ changelogs }: ChangelogPageProps) {
    const isReducedMotion = useReducedMotion();
    const { t } = useTranslation();
    const title = t("pages.changelog.title");
    const description = t("pages.changelog.description");

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

            <section>
                <div className="container border-x bg-(--bg-white-0) pt-32 pb-12 lg:px-12">
                    <m.p
                        {...(!isReducedMotion && {
                            animate: { opacity: 1, y: 0 },
                            initial: { opacity: 0, y: -100 },
                            transition: { duration: 1 },
                        })}
                        className="inline-flex items-center gap-2 text-paragraph-xs font-medium uppercase"
                    >
                        <Clock01Icon className="size-4 text-primary" />
                        Changelog
                    </m.p>

                    <m.h3
                        {...(!isReducedMotion && {
                            animate: { opacity: 1, y: 0 },
                            initial: { opacity: 0, y: 100 },
                            transition: { duration: 1 },
                        })}
                        className="mt-8 text-h3 font-bold tracking-tight md:text-h2 lg:text-h1"
                    >
                        Follow our journey and keep track of us.
                    </m.h3>
                </div>
            </section>

            <section>
                <div className="container border-x border-t bg-(--bg-white-0) py-4 lg:px-12">
                    <div className="flex flex-col gap-4">
                        {changelogs.map((changelog) => (
                            <ChangelogEntry changelog={changelog} key={changelog.id} />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}

ChangelogPage.layout = (page: React.ReactNode & { props: PageProps }) => (
    <GuestLayout {...page.props}>{page}</GuestLayout>
);
