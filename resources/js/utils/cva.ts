import { defineConfig } from "cva";
import { twMerge } from "#/utils/twc";

export const { cva, cx, compose } = defineConfig({
	hooks: {
		onComplete: (className) => twMerge(className),
	},
});
