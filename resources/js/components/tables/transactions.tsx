import { Link } from "@inertiajs/react";
import NumberFlow, { type Format } from "@number-flow/react";
import { resolveCurrencyFormat } from "@sumup/intl";
import { getCoreRowModel, getSortedRowModel, useReactTable, type ColumnDef, flexRender } from "@tanstack/react-table";
import Decimal from "decimal.js";
import * as React from "react";
import MoreVerticalIcon from "virtual:icons/hugeicons/more-vertical";

import { CategoryIcon } from "#/components/category-icon.tsx";
import { Image } from "#/components/image.tsx";
import * as Avatar from "#/components/ui/avatar.tsx";
import * as Badge from "#/components/ui/badge.tsx";
import * as Button from "#/components/ui/button.tsx";
import * as Table from "#/components/ui/table.tsx";
import { usePaginationParams } from "#/hooks/use-pagination-params.ts";
import { useTranslation } from "#/hooks/use-translation.ts";
import { routes } from "#/routes.ts";
import { cn } from "#/utils/cn.ts";
import { formatDate } from "#/utils/date-formatter.ts";

type TransactionsTableProps = {
    data: Resources.Transaction[];
    total: number;
};

export function TransactionsTable({ data: initialData, total }: TransactionsTableProps) {
    const [pagination, setPagination] = usePaginationParams();
    const { language } = useTranslation();

    const columns: ColumnDef<Resources.Transaction>[] = React.useMemo(
        () => [
            {
                id: "name",
                accessorFn: (row) => row.name,
                header: "Name",
                cell({ row }) {
                    return (
                        <div className="flex items-center gap-3">
                            {row.original.merchant?.icon ? (
                                <Avatar.Root $size="40">
                                    <Avatar.Image
                                        alt={row.original.merchant.name}
                                        asChild
                                        src={row.original.merchant.icon}
                                    >
                                        <Image
                                            alt={row.original.merchant.name}
                                            height={40}
                                            src={row.original.merchant.icon}
                                            width={40}
                                        />
                                    </Avatar.Image>
                                </Avatar.Root>
                            ) : row.original.category ? (
                                <div
                                    className="ring-stroke-soft-200 flex size-10 shrink-0 items-center justify-center rounded-full bg-(--color-category-color)/10 shadow-xs"
                                    style={
                                        {
                                            "--color-category-color": row.original.category.color,
                                        } as React.CSSProperties
                                    }
                                >
                                    <CategoryIcon
                                        category={row.original.category.slug}
                                        className="size-5 text-(--color-category-color)"
                                        style={
                                            {
                                                "--color-category-color": row.original.category.color,
                                            } as React.CSSProperties
                                        }
                                    />
                                </div>
                            ) : null}
                            <div>
                                <div className="text-label-sm">{row.original.name}</div>
                                {row.original.note && (
                                    <div className="text-paragraph-xs text-(--text-sub-600)">{row.original.note}</div>
                                )}
                            </div>
                        </div>
                    );
                },
            },
            {
                id: "amount",
                accessorFn: (row) => row.amount,
                header: "Amount",
                cell: ({ row }) => {
                    const formatter = resolveCurrencyFormat(language, row.original.currency);
                    const decimalValue = new Decimal(row.original.amount)
                        .toDecimalPlaces(formatter?.minimumFractionDigits)
                        .toNumber();
                    const isPositive = decimalValue > 0;
                    const format: Format = {
                        style: "currency",
                        currency: row.original.currency,
                        minimumFractionDigits: formatter?.minimumFractionDigits,
                        maximumFractionDigits: formatter?.maximumFractionDigits,
                    };

                    return (
                        <div
                            className={cn(
                                "text-paragraph-sm",
                                isPositive ? "text-state-success-base" : "text-state-error-base",
                            )}
                        >
                            <NumberFlow animated={false} format={format} value={decimalValue} />
                            <span className="ml-1 text-subheading-2xs text-(--text-sub-600)">
                                {row.original.currency}
                            </span>
                        </div>
                    );
                },
            },
            {
                id: "dated_at",
                accessorFn: (row) => row.datedAt,
                header: "Date",
                cell({ row }) {
                    return (
                        <div className="text-paragraph-sm text-(--text-sub-600)">
                            {formatDate(row.original.datedAt, "MMM dd, yyyy", language)}
                        </div>
                    );
                },
            },
            {
                id: "category",
                accessorFn: (row) => row.category?.name,
                header: "Category",
                cell({ row }) {
                    return (
                        <div className="inline-flex items-center gap-1.5 text-paragraph-sm text-(--text-sub-600)">
                            <Badge.Root
                                className="size-2.5 bg-(--color-category-color) p-0"
                                style={
                                    {
                                        "--color-category-color": row.original.category?.color,
                                    } as React.CSSProperties
                                }
                            ></Badge.Root>
                            <span>{row.original.category?.name}</span>
                        </div>
                    );
                },
            },
            {
                id: "actions",
                enableHiding: false,
                cell({ row }) {
                    return (
                        <Button.Root $size="xs" $style="ghost" $type="neutral" asChild>
                            <Link
                                href={routes.transactions.index.url({
                                    query: {
                                        transaction_id: row.original.id,
                                    },
                                })}
                            >
                                <Button.Icon as={MoreVerticalIcon} className="size-6" />
                            </Link>
                        </Button.Root>
                    );
                },
                meta: {
                    className: "px-5 w-0",
                },
            },
        ],
        [language],
    );

    const table = useReactTable({
        data: initialData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        rowCount: total,
        getSortedRowModel: getSortedRowModel(),
        manualPagination: true,
        onPaginationChange: setPagination,
        state: {
            pagination,
        },
        initialState: {
            sorting: [
                {
                    id: "name",
                    desc: true,
                },
            ],
        },
    });

    return (
        <>
            <Table.Root className="relative left-1/2 w-screen -translate-x-1/2 px-4 lg:mx-0 lg:w-full lg:px-0 [&>table]:min-w-[860px]">
                <Table.Header className="whitespace-nowrap">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <Table.Row key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <Table.Head
                                        className={
                                            // @ts-expect-error - className is a custom optional property from meta
                                            header.column.columnDef.meta?.className
                                        }
                                        key={header.id}
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </Table.Head>
                                );
                            })}
                        </Table.Row>
                    ))}
                </Table.Header>

                <Table.Body>
                    {table.getRowModel().rows?.length > 0 &&
                        table.getRowModel().rows.map((row, i, arr) => (
                            <React.Fragment key={row.id}>
                                <Table.Row data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <Table.Cell
                                            className={cn(
                                                "h-12",
                                                // @ts-expect-error - className is a custom optional property from meta
                                                cell.column.columnDef.meta?.className,
                                            )}
                                            key={cell.id}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </Table.Cell>
                                    ))}
                                </Table.Row>
                                {i < arr.length - 1 && <Table.RowDivider />}
                            </React.Fragment>
                        ))}
                </Table.Body>
            </Table.Root>
        </>
    );
}
