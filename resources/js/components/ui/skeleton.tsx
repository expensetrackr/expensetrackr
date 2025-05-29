import { cn } from "#/utils/cn.ts";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("animate-pulse rounded-6 bg-(--bg-soft-200)", className)} {...props} />;
}

export { Skeleton };
