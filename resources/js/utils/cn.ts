import clsx from "clsx";

import { type ClassValue } from "./tv.ts";
import { twMerge } from "./tw-merge.ts";

/**
 * Utilizes `clsx` with `tailwind-merge`, use in cases of possible class conflicts.
 */
export function cnMerge(...classes: ClassValue[]) {
    return twMerge(clsx(...classes));
}

/**
 * A direct export of `clsx` without `tailwind-merge`.
 */
export const cn = clsx;
