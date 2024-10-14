import { createContext, useContext, useState } from "react";
import { cx } from "#/utils/cva";
import { Link } from "./link";

const TableContext = createContext<{ bleed: boolean; dense: boolean; grid: boolean; striped: boolean }>({
	bleed: false,
	dense: false,
	grid: false,
	striped: false,
});

export function Table({
	bleed = false,
	dense = false,
	grid = false,
	striped = false,
	className,
	children,
	...props
}: { bleed?: boolean; dense?: boolean; grid?: boolean; striped?: boolean } & React.ComponentPropsWithoutRef<"div">) {
	return (
		<TableContext.Provider value={{ bleed, dense, grid, striped } as React.ContextType<typeof TableContext>}>
			<div className="flow-root">
				<div {...props} className={cx(className, "-mx-[var(--gutter)] overflow-x-auto whitespace-nowrap")}>
					<div className={cx("!min-w-full inline-block align-middle", !bleed && "sm:px-[var(--gutter)]")}>
						<table className="!min-w-full text-left text-sm/6">{children}</table>
					</div>
				</div>
			</div>
		</TableContext.Provider>
	);
}

export function TableHead({ className, ...props }: React.ComponentPropsWithoutRef<"thead">) {
	return <thead {...props} className={cx(className, "text-[var(--text-sub-600)] text-paragraph-sm")} />;
}

export function TableBody(props: React.ComponentPropsWithoutRef<"tbody">) {
	return <tbody {...props} />;
}

const TableRowContext = createContext<{ href?: string; target?: string; title?: string }>({
	href: undefined,
	target: undefined,
	title: undefined,
});

export function TableRow({
	href,
	target,
	title,
	className,
	...props
}: { href?: string; target?: string; title?: string } & React.ComponentPropsWithoutRef<"tr">) {
	const { striped } = useContext(TableContext);

	return (
		<TableRowContext.Provider value={{ href, target, title } as React.ContextType<typeof TableRowContext>}>
			<tr
				{...props}
				className={cx(
					className,
					href &&
						"has-[[data-row-link][data-focus]]:-outline-offset-2 has-[[data-row-link][data-focus]]:outline has-[[data-row-link][data-focus]]:outline-2 has-[[data-row-link][data-focus]]:outline-blue-500 dark:focus-within:bg-white/[2.5%]",
					striped && "even:bg-zinc-950/[2.5%] dark:even:bg-white/[2.5%]",
					href && striped && "hover:bg-zinc-950/5 dark:hover:bg-white/5",
					href && !striped && "hover:bg-zinc-950/[2.5%] dark:hover:bg-white/[2.5%]",
				)}
			/>
		</TableRowContext.Provider>
	);
}

export function TableHeader({ className, ...props }: React.ComponentPropsWithoutRef<"th">) {
	const { bleed, grid } = useContext(TableContext);

	return (
		<th
			{...props}
			className={cx(
				className,
				"bg-[var(--bg-weak-50)] px-3 py-2 font-medium first:rounded-l-8 last:rounded-r-8",
				grid && "border-l border-l-zinc-950/5 first:border-l-0 dark:border-l-white/5",
				!bleed && "sm:last:pr-1 sm:first:pl-1",
			)}
		/>
	);
}

export function TableCell({ className, children, ...props }: React.ComponentPropsWithoutRef<"td">) {
	const { bleed, dense, grid, striped } = useContext(TableContext);
	const { href, target, title } = useContext(TableRowContext);
	const [cellRef, setCellRef] = useState<HTMLElement | null>(null);

	return (
		<td
			ref={href ? setCellRef : undefined}
			{...props}
			className={cx(
				className,
				"relative px-3 py-3.5 text-[var(--text-sub-600)] text-paragraph-sm",
				!striped && "border-zinc-950/5 border-b dark:border-white/5",
				grid && "border-l border-l-zinc-950/5 first:border-l-0 dark:border-l-white/5",
				dense ? "py-2.5" : "py-4",
				!bleed && "sm:last:pr-1 sm:first:pl-1",
			)}
		>
			{href && (
				<Link
					data-row-link
					href={href}
					target={target}
					aria-label={title}
					tabIndex={cellRef?.previousElementSibling === null ? 0 : -1}
					className="absolute inset-0 focus:outline-none"
				/>
			)}
			{children}
		</td>
	);
}
