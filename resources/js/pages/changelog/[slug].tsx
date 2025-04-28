import { Head } from "@inertiajs/react";
import * as React from "react";
import ArrowRight01Icon from "virtual:icons/hugeicons/arrow-right-01";

import { Link } from "#/components/link.tsx";
import { useTranslation } from "#/hooks/use-translation.ts";
import { GuestLayout } from "#/layouts/guest-layout.tsx";
import { routes } from "#/routes.ts";
import { type PageProps } from "#/types/globals.js";
import { formatDate } from "#/utils/date-formatter.ts";

interface ChangelogPageProps {
    changelog: Resources.Changelog;
}

export default function ChangelogPage({ changelog }: ChangelogPageProps) {
    const { language } = useTranslation();

    const breadcrumbs = React.useMemo(
        () => [
            { label: "Home", href: routes.home.url() },
            { label: "Changelog", href: routes.changelog.index.url() },
            { label: changelog.title, href: "#" }, // Current page (unstyled)
        ],
        [changelog.title],
    );

    return (
        <>
            <Head title={changelog.title}>
                {/* Primary Tags */}
                <meta content={`${changelog.title} - ${ENV.APP_NAME}`} head-key="title" property="og:title" />
                <meta content={changelog.excerpt} head-key="description" property="og:description" />

                {/* Open Graph */}
                <meta content={changelog.imageUrl} head-key="og:image" property="og:image" />
                <meta content={changelog.title} head-key="og:title" property="og:title" />
                <meta content={changelog.excerpt} head-key="og:description" property="og:description" />

                {/* Twitter */}
                <meta content={changelog.imageUrl} head-key="twitter:image" property="twitter:image" />
                <meta content={changelog.title} head-key="twitter:title" property="twitter:title" />
                <meta content={changelog.excerpt} head-key="twitter:description" property="twitter:description" />
            </Head>

            <section>
                <div className="container border-x bg-(--bg-white-0) pt-32 pb-12 lg:px-12">
                    <div className="mx-auto max-w-2xl">
                        <nav aria-label="Breadcrumb" className="mb-6">
                            <ol className="flex items-center space-x-2 text-paragraph-sm text-(--text-sub-600)">
                                {breadcrumbs.map((item, index) => (
                                    <React.Fragment key={`changelog-breadcrumb-${index}`}>
                                        <li>
                                            {index < breadcrumbs.length - 1 ? (
                                                <Link
                                                    className="text-paragraph-xs font-medium hover:text-brand-primary-700"
                                                    href={item.href}
                                                    prefetch
                                                >
                                                    {item.label}
                                                </Link>
                                            ) : (
                                                <span className="text-paragraph-xs font-medium text-brand-primary-600">
                                                    {item.label}
                                                </span>
                                            )}
                                        </li>
                                        {index < breadcrumbs.length - 1 && (
                                            <li className="text-(--text-sub-600)">
                                                <ArrowRight01Icon className="size-4" />
                                            </li>
                                        )}
                                    </React.Fragment>
                                ))}
                            </ol>
                        </nav>
                        <h3 className="mt-12 text-h5 font-semibold tracking-tight lg:text-h4">{changelog.title}</h3>
                    </div>
                </div>
            </section>

            <section>
                <div className="container border-x border-t bg-(--bg-white-0) py-12 lg:px-12">
                    <div className="mx-auto w-full max-w-2xl">
                        <span className="text-paragraph-sm text-(--text-sub-600)">
                            <span>Published </span>
                            <time dateTime={changelog.publishedAt}>
                                {formatDate(changelog.publishedAt, "MMMM d, yyyy", language)}
                            </time>
                        </span>

                        <div
                            className="prose mt-5 w-full overflow-hidden text-(--text-sub-600) dark:prose-invert prose-headings:font-semibold prose-a:border-b prose-a:border-dashed prose-a:border-primary prose-a:no-underline prose-a:transition-colors prose-a:duration-200 prose-a:hover:border-solid prose-a:hover:bg-brand-primary-200 prose-blockquote:text-(--text-sub-600) prose-pre:rounded-12 prose-pre:border prose-ul:[list-style-type:'○'] prose-li:marker:text-brand-primary-600"
                            dangerouslySetInnerHTML={{ __html: changelog.content }}
                        />
                    </div>
                </div>
            </section>
        </>
    );
}

ChangelogPage.layout = (page: React.ReactNode & { props: PageProps }) => (
    <GuestLayout {...page.props}>{page}</GuestLayout>
);
