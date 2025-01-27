import { usePage } from "@inertiajs/react";

import { type InertiaSharedProps } from "#/types/index.ts";

export function useTranslation() {
    const pageProps = usePage<InertiaSharedProps>().props;
    const translations = pageProps.translations;

    return {
        language: pageProps.language,
        t(key: string, replacements: Record<string, string> = {}) {
            let translation = translations[key] || key;

            Object.keys(replacements).forEach((replacement) => {
                translation = translation.replace(`:${replacement}`, replacements[replacement] || "");
            });

            return translation;
        },
    };
}
