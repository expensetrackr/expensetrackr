import { router, usePage } from "@inertiajs/react";
import AddIcon from "virtual:icons/ri/add-line";
import CheckIcon from "virtual:icons/ri/check-line";
import ExpandUpDownIcon from "virtual:icons/ri/expand-up-down-line";
import Settings2Icon from "virtual:icons/ri/settings-2-line";

import { type Workspace, type InertiaSharedProps, type User } from "#/types/index.ts";
import { cnMerge } from "#/utils/cn.ts";
import { Link } from "./link.tsx";
import * as Avatar from "./ui/avatar.tsx";
import * as Divider from "./ui/divider.tsx";
import * as Dropdown from "./ui/dropdown.tsx";

function WorkspaceItem({ user, workspace }: { user: User; workspace: Workspace }) {
    function switchToWorkspace(workspace: Workspace) {
        router.put(
            route("current-workspace.update"),
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
            <div className="flex size-10 items-center justify-center rounded-full ring-1 shadow-xs ring-(--stroke-soft-200) ring-inset">
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
            {workspace.id === user.current_workspace_id ? <CheckIcon className="size-5 text-(--text-sub-600)" /> : null}
        </button>
    );
}

export function WorkspaceSwitch({ className }: { className?: string }) {
    const { auth, workspaces } = usePage<InertiaSharedProps>().props;
    const user = auth.user;
    const workspace = user?.current_workspace;

    return (
        <Dropdown.Root>
            <Dropdown.Trigger
                className={cnMerge(
                    "flex w-full items-center gap-3 p-3 text-left whitespace-nowrap outline-none focus:outline-none",
                    className,
                )}
            >
                <Avatar.Root $size="40">
                    {workspace?.name
                        .split(" ")
                        .slice(0, 2)
                        .map((word) => word[0])
                        .join("")
                        .toUpperCase()}
                </Avatar.Root>
                <div className="flex w-[172px] shrink-0 items-center gap-3" data-hide-collapsed>
                    <div className="flex-1 space-y-1">
                        <div className="text-label-sm">{user?.current_workspace.name}</div>
                    </div>
                    <div className="flex size-6 items-center justify-center rounded-6 border border-(--stroke-soft-200) bg-(--bg-white-0) shadow-xs">
                        <ExpandUpDownIcon className="size-5 text-(--text-sub-600)" />
                    </div>
                </div>
            </Dropdown.Trigger>

            <Dropdown.Content align="start" side="right" sideOffset={24}>
                {user && workspaces.hasWorkspaceFeatures ? (
                    <>
                        <Dropdown.Group>
                            <Dropdown.Item asChild>
                                <Link
                                    href={route("workspaces.show", {
                                        workspace: user.current_workspace_id,
                                    })}
                                >
                                    <Dropdown.ItemIcon as={Settings2Icon} />
                                    Manage workspace
                                </Link>
                            </Dropdown.Item>
                        </Dropdown.Group>

                        <Divider.Root $type="line-spacing" />
                    </>
                ) : null}

                {user?.all_workspaces && user.all_workspaces?.length > 1 ? (
                    <>
                        {user.all_workspaces.map((workspace) => (
                            <WorkspaceItem key={workspace.id} user={user} workspace={workspace} />
                        ))}

                        <Divider.Root $type="line-spacing" />
                    </>
                ) : null}

                {workspaces.canCreateWorkspaces ? (
                    <Dropdown.Group>
                        <Dropdown.Item asChild>
                            <Link href={route("workspaces.create")}>
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
