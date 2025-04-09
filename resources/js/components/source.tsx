import { Source as UnpicSource, type SourceProps as UnpicSourceProps } from "@unpic/react";

type SourceProps = UnpicSourceProps & {
    isCdn?: boolean;
};

export function Source({ isCdn, ...props }: SourceProps) {
    return (
        <UnpicSource
            background="auto"
            {...props}
            cdn={isCdn ? "cloudflare" : undefined}
            options={{
                cloudflare: {
                    domain: "expensetrackr.app",
                },
            }}
            src={isCdn ? `${ENV.APP_URL}${props.src}` : props.src}
        />
    );
}
