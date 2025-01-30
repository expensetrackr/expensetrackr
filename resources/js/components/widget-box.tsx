import { cnMerge } from "#/utils/cn.ts";
import { type PolymorphicComponentProps } from "#/utils/polymorphic.ts";

function WidgetBox({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cnMerge(
                "w-full min-w-0 rounded-16 bg-(--bg-white-0) p-4 ring-1 shadow-xs ring-(--stroke-soft-200) ring-inset",
                className,
            )}
            {...rest}
        />
    );
}

function WidgetBoxHeader({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cnMerge(
                "grid auto-cols-auto grid-flow-col grid-cols-1 items-center gap-2 has-[>svg:first-child]:grid-cols-[auto_minmax(0,1fr)]",
                "h-12 pb-4 text-label-sm md:text-label-md",
                className,
            )}
            {...rest}
        />
    );
}

function WidgetBoxHeaderIcon<T extends React.ElementType>({
    className,
    as,
    ...rest
}: PolymorphicComponentProps<T, React.HTMLAttributes<HTMLDivElement>>) {
    const Component = as || "div";
    return <Component className={cnMerge("size-6 text-(--text-sub-600)", className)} {...rest} />;
}

export { WidgetBox as Root, WidgetBoxHeader as Header, WidgetBoxHeaderIcon as HeaderIcon };
