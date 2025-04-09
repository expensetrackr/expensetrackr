import { Image as UnpicImage, type ImageProps as UnpicImageProps } from "@unpic/react";

type ImageProps = UnpicImageProps & {
    isBunny?: boolean;
};

export function Image({ isBunny, ...props }: ImageProps) {
    return (
        <UnpicImage
            background="auto"
            {...props}
            cdn={isBunny ? "bunny" : undefined}
            src={isBunny ? `https://cdn.expensetrackr.app${props.src}` : props.src}
        />
    );
}
