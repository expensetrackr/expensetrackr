import { cnMerge } from "#/utils/cn.ts";

function Kbd({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cnMerge(
                "flex h-5 items-center gap-0.5 rounded-6 bg-(--bg-white-0) px-1.5 text-subheading-xs whitespace-nowrap text-(--text-soft-400) ring-1 ring-(--stroke-soft-200) ring-inset",
                className,
            )}
            {...rest}
        />
    );
}

export { Kbd as Root };
