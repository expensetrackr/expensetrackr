import { Image as UnpicImage, type ImageProps as UnpicImageProps } from "@unpic/react";

type ImageProps = UnpicImageProps & {
    isCdn?: boolean;
};

export function Image({ isCdn, ...props }: ImageProps) {
    const src = props.src.startsWith("http") ? props.src : `${ENV.APP_URL}${props.src}`;

    return (
        <UnpicImage
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
