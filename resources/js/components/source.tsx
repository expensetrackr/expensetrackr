import { Source as UnpicSource, type SourceProps as UnpicSourceProps } from "@unpic/react";

type SourceProps = UnpicSourceProps & {
    isCdn?: boolean;
};

export function Source({ isCdn, ...props }: SourceProps) {
    return (
        <UnpicSource
            background="auto"
            {...props}
            cdn={isCdn && process.env.NODE_ENV === "production" ? "cloudflare" : undefined}
            options={{
                cloudflare: {
                    domain: "expensetrackr.app",
                },
            }}
            src={isCdn && process.env.NODE_ENV === "production" ? `${ENV.APP_URL}${props.src}` : props.src}
        />
    );
}
