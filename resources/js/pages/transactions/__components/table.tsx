import NumberFlow, { type Format } from "@number-flow/react";
import { resolveCurrencyFormat } from "@sumup/intl";
import {
    getCoreRowModel,
    getSortedRowModel,
    type SortingState,
    useReactTable,
    type ColumnDef,
    flexRender,
} from "@tanstack/react-table";
import Decimal from "decimal.js";
import * as React from "react";

import { CategoryIcon } from "#/components/category-icon.tsx";
import * as Badge from "#/components/ui/badge.tsx";
import * as Table from "#/components/ui/table.tsx";
import { usePaginationParams } from "#/hooks/use-pagination-params.ts";
import { useTranslation } from "#/hooks/use-translation.ts";
import { cn } from "#/utils/cn.ts";
import { formatDate } from "#/utils/date-formatter.ts";

type TransactionsTableProps = {
    data: Array<Resources.Transaction>;
    total: number;
};

export function TransactionsTable({ data: initialData, total }: TransactionsTableProps) {
    const [pagination, setPagination] = usePaginationParams();
    const [sorting, setSorting] = React.useState<SortingState>([]);
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
                            {row.original.category && (
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-(--bg-white-0) shadow-xs ring-1 ring-(--stroke-soft-200) ring-inset">
                                    <CategoryIcon
                                        category={row.original.category?.slug}
                                        className="size-5 text-(--text-sub-600)"
                                    />
                                </div>
                            )}
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
                    // TODO: revisit this later
                    //const isPositive = decimalValue > 0;
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
                                //isPositive ? "text-state-success-base" : "text-state-error-base",
                            )}
                        >
                            <NumberFlow format={format} value={decimalValue} />
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
                        <div className="text-paragraph-sm text-(--text-sub-600)">
                            <Badge.Root
                                className="bg-(--color-category-color)/20 text-(--color-category-color)"
                                color={row.original.category?.color}
                                style={
                                    {
                                        "--color-category-color": row.original.category?.color,
                                    } as React.CSSProperties
                                }
                            >
                                {row.original.category?.name}
                            </Badge.Root>
                        </div>
                    );
                },
            },
        ],
        [language],
    );

    const table = useReactTable({
        data: initialData,
        columns,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        rowCount: total,
        getSortedRowModel: getSortedRowModel(),
        manualPagination: true,
        onPaginationChange: setPagination,
        state: {
            sorting,
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

    console.log(initialData);

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
