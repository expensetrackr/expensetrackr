import { createTV } from "tailwind-variants";

import { twMergeConfig } from "./tw-merge.ts";

export type { VariantProps, ClassValue } from "tailwind-variants";

export const tv = createTV({
    twMergeConfig,
});
