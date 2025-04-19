import { type PageProps } from "#/types/globals";
import { usePageProps } from "./use-page-props.ts";

export function useFeaturesAndPermissions() {
    const { permissions, features } = usePageProps<PageProps>().props;

    return { permissions, features };
}
