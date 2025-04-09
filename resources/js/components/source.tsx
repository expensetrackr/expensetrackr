import { Source as UnpicSource, type SourceProps as UnpicSourceProps } from "@unpic/react";

type SourceProps = UnpicSourceProps & {
    isBunny?: boolean;
};

export function Source({ isBunny, ...props }: SourceProps) {
    return (
        <UnpicSource
            background="auto"
            {...props}
            cdn={isBunny ? "bunny" : undefined}
            src={isBunny ? `https://cdn.expensetrackr.app${props.src}` : props.src}
        />
    );
}
