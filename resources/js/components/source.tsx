import { Source as UnpicSource, type SourceProps } from "@unpic/react/base";

import { transform, type ImageOperations, type ImageOptions } from "./image.tsx";

export function Source({ src, ...props }: Omit<SourceProps<ImageOperations, ImageOptions>, "transformer">) {
    // @ts-ignore
    return <UnpicSource src={`${ENV.APP_URL}${src}`} transformer={transform} {...props} />;
}
