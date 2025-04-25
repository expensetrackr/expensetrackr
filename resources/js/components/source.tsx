import { Source as UnpicSource, type SourceProps as UnpicSourceProps } from "@unpic/react";

type SourceProps = UnpicSourceProps & {
    isCdn?: boolean;
};

export function Source({ isCdn, ...props }: SourceProps) {
    const src = props.src.startsWith("http") ? `${ENV.APP_URL}/${props.src}` : `${ENV.APP_URL}${props.src}`;

    return (
        <UnpicSource
            background="auto"
            {...props}
            cdn={isCdn && import.meta.env.PROD ? "cloudflare" : undefined}
            options={{
                cloudflare: {
                    domain: "expensetrackr.app",
                },
            }}
            src={isCdn && import.meta.env.PROD ? src : props.src}
        />
    );
}
