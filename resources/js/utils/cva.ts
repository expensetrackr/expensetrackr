import { defineConfig } from "cva";

import { twMerge } from "./twc.ts";

export const { cva, cx, compose } = defineConfig({
	hooks: {
		onComplete: (className) => twMerge(className),
	},
});
