import { format } from "date-fns";
import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import ArrowRight01Icon from "virtual:icons/hugeicons/arrow-right-01";

import { routes } from "#/routes.ts";
import { Image } from "./image.tsx";
import { Link } from "./link.tsx";

interface ChangelogEntryProps {
    changelog: Resources.Changelog;
}

export function ChangelogEntry({ changelog }: ChangelogEntryProps) {
    const isReducedMotion = useReducedMotion();

    return (
        <m.div
            {...(!isReducedMotion && {
                animate: { opacity: 1, y: 0 },
                initial: { opacity: 0, y: 100 },
                transition: { duration: 1.5 },
            })}
            className="group/changelog-entry relative overflow-hidden rounded-12 bg-(--bg-white-0) pt-8 shadow lg:pt-24"
        >
            <Link
                aria-label={changelog.title}
                className="absolute inset-0"
                href={routes.changelog.show.url({
                    changelog: changelog.slug,
                })}
                prefetch
                title={changelog.title}
            ></Link>

            <div className="pointer-events-none relative grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div className="p-8 pt-0 lg:p-12 lg:pt-0">
                    <m.p
                        {...(!isReducedMotion && {
                            animate: { opacity: 1, y: 0 },
                            initial: { opacity: 0, y: -100 },
                            transition: { duration: 1 },
                        })}
                        className="flex items-center gap-2 text-paragraph-xs font-medium text-(--text-sub-600) uppercase"
                    >
                        {format(changelog.publishedAt, "MMMM d, yyyy")}
                    </m.p>
                    <m.h3
                        {...(!isReducedMotion && {
                            animate: { opacity: 1, y: 0 },
                            initial: { opacity: 0, y: 100 },
                            transition: { duration: 1 },
                        })}
                        className="mt-8 text-h5 font-bold tracking-tight"
                    >
                        {changelog.title}
                    </m.h3>
                    <m.p
                        {...(!isReducedMotion && {
                            animate: { opacity: 1, y: 0 },
                            initial: { opacity: 0, y: 100 },
                            transition: { duration: 1.5 },
                        })}
                        className="mt-8"
                    >
                        {changelog.excerpt}
                    </m.p>
                    <p className="mt-4 flex items-center gap-2 text-paragraph-sm font-medium">
                        <span>See update</span>
                        <ArrowRight01Icon className="size-4 duration-300 ease-in-out group-hover/changelog-entry:translate-x-2" />
                    </p>
                </div>

                <div className="flex aspect-16/8 size-full h-full shrink-0 items-center justify-center overflow-hidden rounded-t-16 shadow-lg lg:rounded-tr-none">
                    <Image
                        alt={changelog.title}
                        className="object-cover object-center"
                        height={600}
                        isCdn
                        src={changelog.imageUrl}
                        width={600}
                    />
                </div>
            </div>
        </m.div>
    );
}
