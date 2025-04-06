import { Source as UnpicSource, type SourceProps } from "@unpic/react/base";

import { transform, type ImageOperations, type ImageOptions } from "./image.tsx";

export function Source({ src, ...props }: Omit<SourceProps<ImageOperations, ImageOptions>, "transformer">) {
    return (
        // @ts-ignore
        <UnpicSource
            src={`${import.meta.env.VITE_APP_URL}${src}`}
            // @ts-expect-error - transformer is not needed on development
            transformer={process.env.NODE_ENV === "production" ? transform : undefined}
            {...props}
        />
    );
}
