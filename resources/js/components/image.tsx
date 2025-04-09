import { Image as UnpicImage, type ImageProps as UnpicImageProps } from "@unpic/react";

type ImageProps = UnpicImageProps & {
    isCdn?: boolean;
};

export function Image({ isCdn, ...props }: ImageProps) {
    return (
        <UnpicImage
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
