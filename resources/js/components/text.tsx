import { cn } from "#/utils/cn.ts";
import { Link } from "./link.tsx";

export function Text({ className, ...props }: React.ComponentPropsWithoutRef<"p">) {
    return <p data-slot="text" {...props} className={cn("text-paragraph-sm text-(--text-sub-600)", className)} />;
}

export function TextLink({ className, ...props }: React.ComponentPropsWithoutRef<typeof Link>) {
    return (
        <Link
            {...props}
            className={cn(
                "text-zinc-950 decoration-zinc-950/50 data-hover:decoration-zinc-950 underline dark:text-white dark:decoration-white/50 dark:data-hover:decoration-white",
                className,
            )}
        />
    );
}

export function Strong({ className, ...props }: React.ComponentPropsWithoutRef<"strong">) {
    return <strong {...props} className={cn(className, "text-zinc-950 font-medium dark:text-white")} />;
}

export function Code({ className, ...props }: React.ComponentPropsWithoutRef<"code">) {
    return (
        <code
            {...props}
            className={cn(
                "rounded border-zinc-950/10 bg-zinc-950/[2.5%] text-sm text-zinc-950 border px-0.5 font-medium sm:text-[0.8125rem] dark:border-white/20 dark:bg-white/5 dark:text-white",
                className,
            )}
        />
    );
}
