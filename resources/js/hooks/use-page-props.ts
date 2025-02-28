import { usePage } from "@inertiajs/react";

import { type PageProps } from "#/types/globals.js";

export function usePageProps<T extends Record<never, never> | unknown[] = Record<never, never> | unknown[]>() {
    // @ts-expect-error - This is a workaround to get the type of the page props, the types are actually correct.
    return usePage<PageProps<T>>();
}
