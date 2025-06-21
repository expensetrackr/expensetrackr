import { usePageProps } from "./use-page-props.ts";

export function useTranslation() {
    const pageProps = usePageProps().props;
    const translations = pageProps.translations;

    return {
        language: pageProps.language,
        t(key: string, replacements: Record<string, string> = {}, fallback: string = key) {
            let translation = translations[key] || fallback;

            Object.keys(replacements).forEach((replacement) => {
                translation = translation.replace(`:${replacement}`, replacements[replacement] || "");
            });

            return translation;
        },
    };
}
