import { cx } from "#/utils/cva";
import { Link } from "./link";

export function Text({ className, ...props }: React.ComponentPropsWithoutRef<"p">) {
	return <p data-slot="text" {...props} className={cx("text-[var(--text-sub-600)] text-paragraph-sm", className)} />;
}

export function TextLink({ className, ...props }: React.ComponentPropsWithoutRef<typeof Link>) {
	return (
		<Link
			{...props}
			className={cx(
				"text-zinc-950 underline decoration-zinc-950/50 data-[hover]:decoration-zinc-950 dark:text-white dark:decoration-white/50 dark:data-[hover]:decoration-white",
				className,
			)}
		/>
	);
}

export function Strong({ className, ...props }: React.ComponentPropsWithoutRef<"strong">) {
	return <strong {...props} className={cx(className, "font-medium text-zinc-950 dark:text-white")} />;
}

export function Code({ className, ...props }: React.ComponentPropsWithoutRef<"code">) {
	return (
		<code
			{...props}
			className={cx(
				"rounded border border-zinc-950/10 bg-zinc-950/[2.5%] px-0.5 font-medium text-sm text-zinc-950 sm:text-[0.8125rem] dark:border-white/20 dark:bg-white/5 dark:text-white",
				className,
			)}
		/>
	);
}
