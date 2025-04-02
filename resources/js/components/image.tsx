import { type Operations } from "@unpic/core/base";
import { Image as UnpicImage, type ImageProps as UnpicImageProps } from "@unpic/react/base";
import { type URLExtractor, type URLTransformer, type URLGenerator } from "unpic";
import { createExtractAndGenerate, createOperationsHandlers, toCanonicalUrlString, toUrl } from "unpic/utils";

/**
 * Next Image Optimization provider.
 * @see https://github.com/coollabsio/next-image-transformation
 */
export interface ImageOperations extends Operations {
    /**
     * Resize the image to a specified width in pixels.
     * Shorthand for `width`.
     * @type {number} Range: 1-8192
     */
    w?: number;

    /**
     * Image quality for lossy formats like JPEG and WebP.
     * Shorthand for `quality`.
     * @type {number} Range: 1-100
     */
    q?: number;
}

export interface ImageOptions {
    baseUrl?: string;
}

const { operationsGenerator, operationsParser } = createOperationsHandlers<ImageOperations>({
    keyMap: {
        width: "w",
        quality: "q",
        height: false,
        format: false,
    },
    defaults: {
        q: 75,
    },
});

export const generate: URLGenerator<"vercel"> = (src, operations, options = {}) => {
    const baseSrc = typeof src === "string" ? (src.startsWith("/") ? src.slice(1) : src) : src.toString();
    const url = toUrl(`${options.baseUrl || ENV.IMAGE_URL}/image/${baseSrc}`);

    url.search = operationsGenerator(operations);

    return toCanonicalUrlString(url);
};

export const extract: URLExtractor<"vercel"> = (url, options = {}) => {
    const parsedUrl = toUrl(url);
    const operations = operationsParser(url);

    parsedUrl.search = "";

    return {
        src: parsedUrl.toString(),
        operations,
        options: {
            baseUrl: options.baseUrl,
        },
    };
};

export const transform: URLTransformer<"vercel"> = createExtractAndGenerate(extract, generate);

export function Image(props: Omit<UnpicImageProps<ImageOperations, ImageOptions>, "transformer">) {
    // @ts-ignore
    return <UnpicImage {...props} src={`${ENV.APP_URL}${props.src}`} transformer={transform} />;
}
