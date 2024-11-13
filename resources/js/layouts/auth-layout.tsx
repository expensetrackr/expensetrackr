import { Head, Link } from "@inertiajs/react";

import { Toaster } from "#/components/toaster.tsx";

export function AuthLayout({
    logoOrIcon,
    title,
    description,
    footer,
    children,
}: {
    logoOrIcon?: React.ReactNode;
    title?: string;
    description?: string;
    footer?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-dvh flex-col overflow-hidden">
            <Head>
                <link as="image" href="/img/auth-light.jpeg" media="(prefers-color-scheme: light)" rel="preload" />
                <link as="image" href="/img/auth-dark.jpeg" media="(prefers-color-scheme: dark)" rel="preload" />
            </Head>

            <img
                alt=""
                className="absolute inset-0 h-full w-full object-cover object-top dark:hidden"
                loading="lazy"
                src="/img/auth-light.jpeg"
            />
            <img
                alt=""
                className="absolute inset-0 hidden h-full w-full object-cover object-top dark:block"
                loading="lazy"
                src="/img/auth-dark.jpeg"
            />
            <div className="absolute inset-0 bg-white/70 mix-blend-multiply" id="filter" />

            <div className="relative flex min-h-screen flex-col items-center px-4 py-8 sm:justify-center sm:pt-0">
                <div className="rounded-12 relative flex w-full max-w-[400px] flex-col gap-2 overflow-hidden bg-white/60 px-4 py-6 backdrop-blur-md sm:px-6 dark:bg-neutral-950/60">
                    <svg
                        aria-hidden="true"
                        className="text-primary absolute top-[-91px] left-[-87px] h-[430.84px] w-[362.5px] opacity-20"
                        fill="none"
                        height="960"
                        viewBox="0 0 960 960"
                        width="960"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <g clipPath="url(#clip0_4940_405681)">
                            <mask
                                height="960"
                                id="mask0_4940_405681"
                                maskUnits="userSpaceOnUse"
                                style={{
                                    maskType: "alpha",
                                }}
                                width="960"
                                x="0"
                                y="0"
                            >
                                <rect fill="url(#paint0_radial_4940_405681)" height="960" width="960" />
                            </mask>
                            <g mask="url(#mask0_4940_405681)">
                                <g clipPath="url(#clip1_4940_405681)">
                                    <line stroke="currentColor" x1="80.5" x2="80.5" y2="960" />
                                    <line stroke="currentColor" x1="160.5" x2="160.5" y2="960" />
                                    <line stroke="currentColor" x1="240.5" x2="240.5" y2="960" />
                                    <line stroke="currentColor" x1="320.5" x2="320.5" y2="960" />
                                    <line stroke="currentColor" x1="400.5" x2="400.5" y2="960" />
                                    <line stroke="currentColor" x1="480.5" x2="480.5" y2="960" />
                                    <line stroke="currentColor" x1="560.5" x2="560.5" y2="960" />
                                    <line stroke="currentColor" x1="640.5" x2="640.5" y2="960" />
                                    <line stroke="currentColor" x1="720.5" x2="720.5" y2="960" />
                                    <line stroke="currentColor" x1="800.5" x2="800.5" y2="960" />
                                    <line stroke="currentColor" x1="880.5" x2="880.5" y2="960" />
                                </g>
                                <g clipPath="url(#clip2_4940_405681)">
                                    <line stroke="currentColor" x2="960" y1="79.5" y2="79.5" />
                                    <line stroke="currentColor" x2="960" y1="159.5" y2="159.5" />
                                    <line stroke="currentColor" x2="960" y1="239.5" y2="239.5" />
                                    <line stroke="currentColor" x2="960" y1="319.5" y2="319.5" />
                                    <line stroke="currentColor" x2="960" y1="399.5" y2="399.5" />
                                    <line stroke="currentColor" x2="960" y1="479.5" y2="479.5" />
                                    <line stroke="currentColor" x2="960" y1="559.5" y2="559.5" />
                                    <line stroke="currentColor" x2="960" y1="639.5" y2="639.5" />
                                    <line stroke="currentColor" x2="960" y1="719.5" y2="719.5" />
                                    <line stroke="currentColor" x2="960" y1="799.5" y2="799.5" />
                                    <line stroke="currentColor" x2="960" y1="879.5" y2="879.5" />
                                </g>
                            </g>
                        </g>
                        <defs>
                            <radialGradient
                                cx="0"
                                cy="0"
                                gradientTransform="translate(480 -0.000114441) rotate(90) scale(960 501.059)"
                                gradientUnits="userSpaceOnUse"
                                id="paint0_radial_4940_405681"
                                r="1"
                            >
                                <stop />
                                <stop offset="0.953125" stopOpacity="0" />
                            </radialGradient>
                            <clipPath id="clip0_4940_405681">
                                <rect fill="white" height="960" width="960" />
                            </clipPath>
                            <clipPath id="clip1_4940_405681">
                                <rect fill="white" height="960" width="960" />
                            </clipPath>
                            <clipPath id="clip2_4940_405681">
                                <rect fill="white" height="960" width="960" />
                            </clipPath>
                        </defs>
                    </svg>

                    <div className="relative flex flex-col gap-3">
                        {logoOrIcon ?? (
                            <Link className="outline-none" href="/">
                                <img
                                    alt="ExpenseTrackr"
                                    className="mx-auto w-16 dark:hidden"
                                    src="/img/isotype-light.svg"
                                />
                                <img
                                    alt="ExpenseTrackr"
                                    className="mx-auto hidden w-16 dark:block"
                                    src="/img/isotype-dark.svg"
                                />
                                <span className="sr-only">ExpenseTrackr</span>
                            </Link>
                        )}

                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1">
                                {title && <h1 className="font-inter text-label-lg text-center font-bold">{title}</h1>}

                                {description && (
                                    <p className="text-paragraph-sm text-center text-[var(--text-sub-600)]">
                                        {description}
                                    </p>
                                )}
                            </div>

                            {children}
                        </div>

                        {footer && (
                            <p className="text-label-sm pt-1 text-center text-[var(--text-sub-600)]">{footer}</p>
                        )}
                    </div>
                </div>
            </div>

            <Toaster position="top-center" />
        </div>
    );
}
