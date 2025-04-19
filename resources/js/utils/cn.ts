import clsx, { type ClassValue } from "clsx";

import { twMerge } from "./tw-merge.ts";

/**
 * Utilizes `clsx` with `tailwind-merge`, use in cases of possible class conflicts.
 */
export function cn(...classes: ClassValue[]) {
    return twMerge(clsx(...classes));
}
