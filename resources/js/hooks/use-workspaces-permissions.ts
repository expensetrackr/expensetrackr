import { type PageProps } from "#/types/globals";
import { usePageProps } from "./use-page-props.ts";

export function useWorkspacesPermissions() {
    const { workspaces } = usePageProps<PageProps>().props;

    return workspaces as unknown as App.Data.WorkspacesPermissionsData;
}
