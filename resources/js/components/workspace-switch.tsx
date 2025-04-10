import { router } from "@inertiajs/react";
import UnfoldMoreIcon from "virtual:icons/hugeicons/unfold-more";
import AddIcon from "virtual:icons/ri/add-line";
import CheckIcon from "virtual:icons/ri/check-line";
import Settings2Icon from "virtual:icons/ri/settings-2-line";

import { useCurrentWorkspace } from "#/hooks/use-current-workspace.ts";
import { useUser } from "#/hooks/use-user.ts";
import { useWorkspacesPermissions } from "#/hooks/use-workspaces-permissions.ts";
import { useWorkspaces } from "#/hooks/use-workspaces.ts";
import { routes } from "#/routes.ts";
import { cnMerge } from "#/utils/cn.ts";
import { Link } from "./link.tsx";
import * as Avatar from "./ui/avatar.tsx";
import * as Divider from "./ui/divider.tsx";
import * as Dropdown from "./ui/dropdown.tsx";

function WorkspaceItem({ workspace }: { workspace: App.Data.Workspace.WorkspaceData }) {
    const currentWorkspace = useCurrentWorkspace();

    console.info(workspace);

    function switchToWorkspace(workspace: App.Data.Workspace.WorkspaceData) {
        router.put(
            routes.currentWorkspace.update.url(),
            {
                workspace_id: workspace.id,
            },
            {
                preserveState: false,
            },
        );
    }

    return (
        <button
            className="group/item transition-default flex w-full cursor-pointer items-center gap-3 rounded-10 p-2 text-left outline-none hover:bg-(--bg-weak-50) focus:outline-none"
            onClick={() => switchToWorkspace(workspace)}
            type="button"
        >
            <div className="flex size-10 items-center justify-center rounded-full shadow-xs ring-1 ring-(--stroke-soft-200) ring-inset">
                <Avatar.Root $size="24">
                    {workspace.name
                        .split(" ")
                        .slice(0, 2)
                        .map((word) => word[0])
                        .join("")
                        .toUpperCase()}
                </Avatar.Root>
            </div>
            <div className="flex-1 space-y-1">
                <div className="text-label-sm">{workspace.name}</div>
            </div>
            {workspace.id === currentWorkspace.id ? <CheckIcon className="size-5 text-(--text-sub-600)" /> : null}
        </button>
    );
}

export function WorkspaceSwitch({ className }: { className?: string }) {
    const user = useUser();
    const currentWorkspace = useCurrentWorkspace();
    const workspaces = useWorkspaces();
    const permissions = useWorkspacesPermissions();

    return (
        <Dropdown.Root>
            <Dropdown.Trigger
                className={cnMerge(
                    "flex w-full items-center gap-3 p-3 text-left whitespace-nowrap outline-none focus:outline-none",
                    className,
                )}
            >
                <Avatar.Root $size="40">
                    {currentWorkspace?.name
                        .split(" ")
                        .slice(0, 2)
                        .map((word) => word[0])
                        .join("")
                        .toUpperCase()}
                </Avatar.Root>
                <div className="flex w-[172px] shrink-0 items-center gap-3" data-hide-collapsed>
                    <div className="flex-1 space-y-1">
                        <div className="truncate text-label-sm">{currentWorkspace?.name}</div>
                    </div>
                    <div className="flex size-6 items-center justify-center rounded-6 border border-(--stroke-soft-200) bg-(--bg-white-0) shadow-xs">
                        <UnfoldMoreIcon className="size-5 text-(--text-sub-600)" />
                    </div>
                </div>
            </Dropdown.Trigger>

            <Dropdown.Content align="start" side="right" sideOffset={24}>
                {user && permissions.hasWorkspaceFeatures ? (
                    <Dropdown.Group>
                        <Dropdown.Item asChild>
                            <Link
                                href={routes.workspaces.show.url({
                                    workspace: currentWorkspace.id,
                                })}
                            >
                                <Dropdown.ItemIcon as={Settings2Icon} />
                                Manage workspace
                            </Link>
                        </Dropdown.Item>
                    </Dropdown.Group>
                ) : null}

                {workspaces.length > 1 ? (
                    <>
                        <Divider.Root $type="line-spacing" />

                        {workspaces.map((workspace) => (
                            <WorkspaceItem key={workspace.id} workspace={workspace} />
                        ))}

                        <Divider.Root $type="line-spacing" />
                    </>
                ) : null}

                {permissions.canCreateWorkspaces ? (
                    <Dropdown.Group>
                        <Dropdown.Item asChild>
                            <Link href={routes.workspaces.create.url()}>
                                <Dropdown.ItemIcon as={AddIcon} />
                                New workspace&hellip;
                            </Link>
                        </Dropdown.Item>
                    </Dropdown.Group>
                ) : null}
            </Dropdown.Content>
        </Dropdown.Root>
    );
}
