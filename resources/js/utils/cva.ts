import { defineConfig } from "cva";

import { twMerge } from "./tw-merge.ts";

export const { cva, cx, compose } = defineConfig({
    hooks: {
        onComplete: (className) => twMerge(className),
    },
});
