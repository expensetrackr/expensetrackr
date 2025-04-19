import { cn } from "#/utils/cn.ts";
import * as Divider from "./divider.tsx";

function Table({ className, ...rest }: React.ComponentPropsWithRef<"table">) {
    return (
        <div className={cn("w-full overflow-x-auto", className)}>
            <table className="w-full" {...rest} />
        </div>
    );
}
Table.displayName = "Table";

function TableHeader(rest: React.ComponentPropsWithRef<"thead">) {
    return <thead {...rest} />;
}
TableHeader.displayName = "TableHeader";

function TableHead({ className, ...rest }: React.ComponentPropsWithRef<"th">) {
    return (
        <th
            className={cn(
                "bg-(--bg-weak-50) px-3 py-2 text-left text-paragraph-sm font-medium text-(--text-sub-600) first:rounded-l-8 last:rounded-r-8",
                className,
            )}
            {...rest}
        />
    );
}
TableHead.displayName = "TableHead";

function TableBody({ spacing = 8, ...rest }: React.ComponentPropsWithRef<"tbody"> & { spacing?: number }) {
    return (
        <>
            {/* to have space between thead and tbody */}
            <tbody
                aria-hidden="true"
                className="table-row"
                style={{
                    height: spacing,
                }}
            />

            <tbody {...rest} />
        </>
    );
}
TableBody.displayName = "TableBody";

function TableRow({ className, ...rest }: React.ComponentPropsWithRef<"tr">) {
    return <tr className={cn("group/row", className)} {...rest} />;
}
TableRow.displayName = "TableRow";

function TableRowDivider({
    className,
    dividerClassName,
    ...rest
}: React.CustomComponentPropsWithRef<typeof Divider.Root> & {
    dividerClassName?: string;
}) {
    return (
        <tr aria-hidden="true" className={className}>
            <td className="py-1" colSpan={999}>
                <Divider.Root $type="line-spacing" className={dividerClassName} {...rest} />
            </td>
        </tr>
    );
}
TableRowDivider.displayName = "TableRowDivider";

function TableCell({ className, ...rest }: React.ComponentPropsWithRef<"td">) {
    return (
        <td
            className={cn(
                "h-16 px-3 transition duration-200 ease-out group-hover/row:bg-(--bg-weak-50) first:rounded-l-12 last:rounded-r-12",
                className,
            )}
            {...rest}
        />
    );
}
TableCell.displayName = "TableCell";

function TableCaption({ className, ...rest }: React.ComponentPropsWithRef<"caption">) {
    return <caption className={cn("mt-4 text-paragraph-sm text-(--text-sub-600)", className)} {...rest} />;
}
TableCaption.displayName = "TableCaption";

export {
    Table as Root,
    TableHeader as Header,
    TableBody as Body,
    TableHead as Head,
    TableRow as Row,
    TableRowDivider as RowDivider,
    TableCell as Cell,
    TableCaption as Caption,
};
