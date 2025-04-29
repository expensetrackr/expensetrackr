import { Head } from "@inertiajs/react";
import DOMPurify from "dompurify";
import LegalDocument01Icon from "virtual:icons/hugeicons/legal-document-01";

import { GuestLayout } from "#/layouts/guest-layout.tsx";
import { type PageProps } from "#/types/globals.js";

interface Props {
    terms: string;
    excerpt: string;
}

export default function TermsOfService({ terms, excerpt }: Props) {
    const title = "Terms of Service";
    return (
        <>
            <Head title={title}>
                {/* Primary Tags */}
                <meta content={`${title} - ${ENV.APP_NAME}`} head-key="title" name="title" />
                <meta content={excerpt} head-key="description" name="description" />

                {/* Open Graph */}
                <meta content={title} head-key="og:title" property="og:title" />
                <meta content={excerpt} head-key="og:description" property="og:description" />

                {/* Twitter */}
                <meta content={title} head-key="twitter:title" property="twitter:title" />
                <meta content={excerpt} head-key="twitter:description" property="twitter:description" />

                <script
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "AboutPage",
                            name: "Terms of Service - ExpenseTrackr",
                            lastReviewed: "2025-04-08",
                            url: "https://expensetrackr.app/terms-of-service",
                        }),
                    }}
                    type="application/ld+json"
                />
            </Head>

            <section>
                <div className="container border-x bg-(--bg-white-0) pt-32 pb-12 lg:px-12">
                    <div className="mx-auto max-w-xl">
                        <p className="inline-flex items-center gap-2 text-paragraph-xs font-medium uppercase">
                            <LegalDocument01Icon className="size-4 text-primary" />
                            <time
                                dateTime={new Date("2025-04-08").toLocaleDateString("en-US", {
                                    day: "numeric",
                                    year: "numeric",
                                    month: "long",
                                })}
                            >
                                {new Date("2025-04-08").toLocaleDateString("en-US", {
                                    day: "numeric",
                                    year: "numeric",
                                    month: "long",
                                })}
                            </time>
                        </p>

                        <h3 className="mt-8 text-h5 font-bold tracking-tight lg:text-h4">Terms of Service</h3>
                        <p className="mt-2 text-(--text-sub-600)">
                            Contact us with any questions about these agreements.
                        </p>
                    </div>
                </div>

                <div className="container border-x border-t bg-(--bg-white-0) py-12 lg:px-12">
                    <div
                        className="mx-auto prose mt-6 w-full max-w-xl overflow-hidden text-(--text-sub-600) dark:prose-invert prose-headings:font-semibold prose-a:border-b prose-a:border-dashed prose-a:border-primary prose-a:no-underline prose-a:transition-colors prose-a:duration-200 prose-a:hover:border-solid prose-a:hover:bg-brand-primary-200 prose-blockquote:text-(--text-sub-600) prose-pre:rounded-12 prose-pre:border prose-ul:[list-style-type:'○'] prose-li:marker:text-brand-primary-600"
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(terms) }}
                    />
                </div>
            </section>
        </>
    );
}

TermsOfService.layout = (page: React.ReactNode & { props: PageProps }) => (
    <GuestLayout {...page.props}>{page}</GuestLayout>
);
