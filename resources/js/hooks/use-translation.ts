import { usePage } from "@inertiajs/react";

import { type InertiaSharedProps } from "#/types/index.ts";

export function useTranslation(key: string, replacements: Record<string, string> = {}) {
    let translation = usePage<InertiaSharedProps>().props.translations[key] || key;

    Object.keys(replacements).forEach((replacement) => {
        translation = translation.replace(`:${replacement}`, replacements[replacement] || "");
    });

    return translation;
}
