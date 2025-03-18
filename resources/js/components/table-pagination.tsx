import { Link } from "@inertiajs/react";
import ArrowLeft01Icon from "virtual:icons/hugeicons/arrow-left-01";
import ArrowLeftDoubleIcon from "virtual:icons/hugeicons/arrow-left-double";
import ArrowRight01Icon from "virtual:icons/hugeicons/arrow-right-01";
import ArrowRightDoubleIcon from "virtual:icons/hugeicons/arrow-right-double";

import { type PaginationLinks, type PaginationMeta } from "#/types/pagination.ts";
import * as Button from "./ui/button.tsx";
import * as Pagination from "./ui/pagination.tsx";
import * as Select from "./ui/select.tsx";

export function TablePagination({
    meta,
    links,
    onPerPageChange,
}: {
    meta: PaginationMeta;
    links: PaginationLinks;
    onPerPageChange?: (perPage: number) => void;
}) {
    const handlePerPageChange = (value: string) => {
        onPerPageChange?.(parseInt(value));
    };

    // Filter out previous/next pagination links
    const filteredLinks = meta.links.filter(
        (link) => link.label !== "pagination.previous" && link.label !== "pagination.next",
    );

    return (
        <>
            <div className="mt-4 flex items-center justify-between py-4 lg:hidden">
                <Button.Root
                    $size="xs"
                    $style="stroke"
                    $type="neutral"
                    asChild={links.prev !== null}
                    className="w-28"
                    disabled={links.prev === null}
                >
                    {links.prev !== null ? (
                        <Link href={links.prev} preserveScroll>
                            Previous
                        </Link>
                    ) : (
                        <span>Previous</span>
                    )}
                </Button.Root>
                <span className="text-text-sub-600 text-center text-paragraph-sm whitespace-nowrap">
                    Page {meta.current_page} of {meta.last_page}
                </span>
                <Button.Root
                    $size="xs"
                    $style="stroke"
                    $type="neutral"
                    asChild={links.next !== null}
                    className="w-28"
                    disabled={links.next === null}
                >
                    {links.next !== null ? (
                        <Link href={links.next} preserveScroll>
                            Next
                        </Link>
                    ) : (
                        <span>Next</span>
                    )}
                </Button.Root>
            </div>
            <div className="mt-10 hidden items-center gap-3 lg:flex">
                <span className="text-text-sub-600 flex-1 text-paragraph-sm whitespace-nowrap">
                    Page {meta.current_page} of {meta.last_page}
                </span>

                <Pagination.Root>
                    <Pagination.NavButton asChild={meta.current_page !== 1} disabled={meta.current_page === 1}>
                        {meta.current_page !== 1 ? (
                            <Link href={links.first}>
                                <Pagination.NavIcon as={ArrowLeftDoubleIcon} />
                            </Link>
                        ) : (
                            <Pagination.NavIcon as={ArrowLeftDoubleIcon} />
                        )}
                    </Pagination.NavButton>
                    <Pagination.NavButton asChild={links.prev !== null}>
                        {links.prev !== null ? (
                            <Link href={links.prev}>
                                <Pagination.NavIcon as={ArrowLeft01Icon} />
                            </Link>
                        ) : (
                            <Pagination.NavIcon as={ArrowLeft01Icon} />
                        )}
                    </Pagination.NavButton>
                    {filteredLinks.map((link) => {
                        if (link.url) {
                            return (
                                <Pagination.Item asChild current={link.active} key={link.url}>
                                    <Link href={link.url}>{link.label}</Link>
                                </Pagination.Item>
                            );
                        }

                        return (
                            <Pagination.Item current={link.active} key={link.url}>
                                {link.label}
                            </Pagination.Item>
                        );
                    })}
                    <Pagination.NavButton
                        asChild={meta.current_page !== meta.last_page}
                        disabled={meta.current_page === meta.last_page}
                    >
                        {meta.current_page !== meta.last_page ? (
                            <Link href={links.last}>
                                <Pagination.NavIcon as={ArrowRightDoubleIcon} />
                            </Link>
                        ) : (
                            <Pagination.NavIcon as={ArrowRightDoubleIcon} />
                        )}
                    </Pagination.NavButton>
                    <Pagination.NavButton asChild={links.next !== null}>
                        {links.next !== null ? (
                            <Link href={links.next}>
                                <Pagination.NavIcon as={ArrowRight01Icon} />
                            </Link>
                        ) : (
                            <Pagination.NavIcon as={ArrowRight01Icon} />
                        )}
                    </Pagination.NavButton>
                </Pagination.Root>

                <div className="flex flex-1 justify-end">
                    <Select.Root $size="xs" defaultValue={meta.per_page.toString()} onValueChange={handlePerPageChange}>
                        <Select.Trigger className="w-auto">
                            <Select.Value />
                        </Select.Trigger>
                        <Select.Content>
                            <Select.Item value={"12"}>12 / page</Select.Item>
                            <Select.Item value={"20"}>20 / page</Select.Item>
                            <Select.Item value={"50"}>50 / page</Select.Item>
                            <Select.Item value={"100"}>100 / page</Select.Item>
                        </Select.Content>
                    </Select.Root>
                </div>
            </div>
        </>
    );
}
