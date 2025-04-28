import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import ArrowRight01Icon from "virtual:icons/hugeicons/arrow-right-01";

import { routes } from "#/routes.ts";
import { Image } from "../image.tsx";
import { Link } from "../link.tsx";
import * as Button from "../ui/button.tsx";

export function HeroSection() {
    const isReducedMotion = useReducedMotion();

    return (
        <section className="pt-16 lg:pt-0" id="hero">
            <div className="relative isolate container overflow-hidden border-x bg-(--bg-white-0)">
                <m.svg
                    {...(!isReducedMotion && {
                        animate: { opacity: 1 },
                        initial: { opacity: 0 },
                        transition: { duration: 1 },
                    })}
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 size-full [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)] stroke-(--stroke-soft-200)"
                >
                    <defs>
                        <pattern
                            height={200}
                            id="0787a7c5-978c-4f66-83c7-11c213f99cb7"
                            patternUnits="userSpaceOnUse"
                            width={200}
                            x="50%"
                            y={-1}
                        >
                            <path d="M.5 200V.5H200" fill="none" />
                        </pattern>
                    </defs>
                    <rect fill="url(#0787a7c5-978c-4f66-83c7-11c213f99cb7)" height="100%" width="100%" />
                </m.svg>

                <div className="mx-auto max-w-7xl px-6 pt-10 pb-24 sm:pb-32 lg:flex lg:items-center lg:px-8 lg:py-40">
                    <div className="mx-auto max-w-2xl lg:mx-0 lg:shrink-0 lg:pt-8">
                        <m.h1
                            {...(!isReducedMotion && {
                                animate: { opacity: 1, y: 0 },
                                initial: { opacity: 0, y: 100 },
                                transition: { duration: 1 },
                            })}
                            className="text-h2 font-semibold tracking-tight text-pretty lg:text-h1"
                        >
                            Tracking your finances? It just got <span className="text-primary">simpler.</span>
                        </m.h1>
                        <m.p
                            {...(!isReducedMotion && {
                                animate: { opacity: 1, y: 0 },
                                initial: { opacity: 0, y: 100 },
                                transition: { duration: 1.5 },
                            })}
                            className="mt-4 text-pretty text-(--text-sub-600) lg:text-paragraph-lg"
                        >
                            Track <strong>expenses</strong>, <strong>budgets</strong>, <strong>investments</strong>, and{" "}
                            <strong>assets</strong> effortlessly, managing your money confidently.
                        </m.p>
                        <m.div
                            {...(!isReducedMotion && {
                                animate: { opacity: 1, y: 0 },
                                initial: { opacity: 0, y: 100 },
                                transition: { duration: 2 },
                            })}
                            className="mt-8 flex flex-col items-center gap-2 lg:flex-row lg:gap-3"
                        >
                            <Button.Root asChild className="w-full gap-2 lg:w-auto">
                                <Link href={routes.register.url()}>
                                    Get started now
                                    <Button.Icon
                                        as={ArrowRight01Icon}
                                        className="easy-out-in duration-300 group-hover:translate-x-1"
                                    />
                                </Link>
                            </Button.Root>
                            <Button.Root $style="lighter" asChild className="w-full gap-2 lg:w-auto">
                                <Link href="/">
                                    Contact sales
                                    <Button.Icon
                                        as={ArrowRight01Icon}
                                        className="easy-out-in duration-300 group-hover:translate-x-1"
                                    />
                                </Link>
                            </Button.Root>
                        </m.div>
                    </div>

                    <m.div
                        {...(!isReducedMotion && {
                            animate: { opacity: 1, x: 0 },
                            initial: { opacity: 0, x: 100 },
                            transition: { duration: 1 },
                        })}
                        className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:mt-0 lg:mr-0 lg:ml-10 lg:max-w-none lg:flex-none xl:ml-4"
                    >
                        <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
                            <div className="-m-2 rounded-12 bg-(--bg-weak-50) p-2 ring-1 ring-(--stroke-soft-200) ring-inset lg:-m-4 lg:rounded-16 lg:p-4">
                                <Image
                                    alt="App screenshot"
                                    className="w-5xl rounded-6 shadow-2xl ring-1 ring-(--stroke-soft-200)"
                                    height={2106}
                                    src="/img/hero-showcase.png"
                                    width={3403}
                                />
                            </div>
                        </div>
                    </m.div>
                </div>
            </div>
        </section>
    );
}
