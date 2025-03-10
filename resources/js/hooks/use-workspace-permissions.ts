import { type PageProps } from "#/types/globals";
import { usePageProps } from "./use-page-props.ts";

export function useWorkspacePermissions() {
    const { workspaces } = usePageProps<PageProps>().props;

    return workspaces as unknown as App.Data.Workspace.WorkspacePermissionsData;
}
