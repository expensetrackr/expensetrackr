import { type PageProps } from "#/types/globals";
import { usePageProps } from "./use-page-props.ts";

export function useCurrentWorkspace() {
    const { auth } = usePageProps<PageProps>().props;

    return auth?.currentWorkspace as unknown as App.Data.WorkspaceData;
}
