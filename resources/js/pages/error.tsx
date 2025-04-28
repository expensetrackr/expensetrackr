import { Head } from "@inertiajs/react";
import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import ArrowLeft01Icon from "virtual:icons/hugeicons/arrow-left-01";
import ArrowRight01Icon from "virtual:icons/hugeicons/arrow-right-01";

import { Link } from "#/components/link.tsx";
import * as Button from "#/components/ui/button.tsx";
import { useTranslation } from "#/hooks/use-translation.ts";
import { GuestLayout } from "#/layouts/guest-layout.tsx";
import { routes } from "#/routes.ts";
import { type PageProps } from "#/types/globals.js";

interface ErrorPageProps {
    status: number;
}

export default function ErrorPage({ status }: ErrorPageProps) {
    const { t } = useTranslation();
    const isReducedMotion = useReducedMotion();

    const title = t(`errors.${status}.title`);
    const description = t(`errors.${status}.description`);

    return (
        <>
            <Head title={title}>
                {/* Primary Tags */}
                <meta content={`${title} - ${ENV.APP_NAME}`} head-key="title" property="og:title" />
                <meta content={description} head-key="description" property="og:description" />

                {/* Open Graph */}
                <meta content={title} head-key="og:title" property="og:title" />
                <meta content={description} head-key="og:description" property="og:description" />
            </Head>

            <section className="relative">
                <div className="container flex min-h-dvh flex-col items-center justify-center border-x bg-(--bg-white-0) py-32 lg:px-12">
                    <div className="mx-auto text-center">
                        <m.h1
                            {...(!isReducedMotion && {
                                animate: { opacity: 1, y: 0 },
                                initial: { opacity: 0, y: 100 },
                                transition: { duration: 1 },
                            })}
                            className="text-h2 font-bold tracking-tight lg:text-h1"
                        >
                            {title}
                        </m.h1>

                        <m.p
                            {...(!isReducedMotion && {
                                animate: { opacity: 1, y: 0 },
                                initial: { opacity: 0, y: 100 },
                                transition: { duration: 1.5 },
                            })}
                            className="mt-4 text-paragraph-lg text-(--text-sub-600)"
                        >
                            {description}
                        </m.p>

                        <m.div
                            {...(!isReducedMotion && {
                                animate: { opacity: 1, y: 0 },
                                initial: { opacity: 0, y: 100 },
                                transition: { duration: 2 },
                            })}
                            className="mx-auto mt-12 flex max-w-xs flex-col items-center justify-center gap-2"
                        >
                            <Button.Root asChild className="w-full">
                                <Link href={routes.home.url()}>
                                    <Button.Icon
                                        as={ArrowLeft01Icon}
                                        className="easy-out-in size-4 duration-300 group-hover:-translate-x-1"
                                    />
                                    Go to Home
                                </Link>
                            </Button.Root>
                            <Button.Root $style="stroke" asChild className="w-full">
                                <Link href={routes.register.url()}>
                                    Sign up
                                    <Button.Icon
                                        as={ArrowRight01Icon}
                                        className="easy-out-in size-4 duration-300 group-hover:translate-x-1"
                                    />
                                </Link>
                            </Button.Root>
                        </m.div>
                    </div>
                </div>
            </section>
        </>
    );
}

ErrorPage.layout = (page: React.ReactNode & { props: PageProps }) => <GuestLayout {...page.props}>{page}</GuestLayout>;
