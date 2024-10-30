import { usePage } from "@inertiajs/react";

import { type PageProps } from "#/types/index.ts";

export function useUser() {
    const page = usePage<PageProps>();

    return page.props.auth.user;
}
