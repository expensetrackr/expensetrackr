import { type PageProps } from "#/types/globals";
import { usePageProps } from "./use-page-props.ts";

export function usePermissions() {
    const { permissions } = usePageProps<PageProps>().props;

    return permissions;
}
