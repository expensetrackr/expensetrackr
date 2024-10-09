import { cx } from "#/utils/cva";

export function Divider({ className, ...props }: React.ComponentPropsWithoutRef<"hr">) {
	return (
		<hr
			{...props}
			className={cx(
				className,
				"shrink-0 border-[var(--stroke-soft-200)] aria-orientation-horizontal:h-px aria-orientation-vertical:h-full aria-orientation-horizontal:w-full aria-orientation-vertical:w-px",
			)}
		/>
	);
}
