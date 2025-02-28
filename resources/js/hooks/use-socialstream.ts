import { type PageProps } from "#/types/globals";
import { usePageProps } from "./use-page-props";

export function useSocialstream() {
    const { socialstream } = usePageProps<PageProps>().props;

    return socialstream;
}
