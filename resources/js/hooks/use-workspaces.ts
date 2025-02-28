import { type PageProps } from "#/types/globals";
import { usePageProps } from "./use-page-props.ts";

export function useWorkspaces() {
    const { auth } = usePageProps<PageProps>().props;

    return auth?.workspaces as unknown as App.Data.WorkspaceData[];
}
