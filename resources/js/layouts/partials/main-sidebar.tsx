import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { router } from "@inertiajs/react";
import AddIcon from "virtual:icons/ri/add-line";
import ArrowUpSIcon from "virtual:icons/ri/arrow-up-s-line";
import CheckIcon from "virtual:icons/ri/check-line";
import ExpandUpDownIcon from "virtual:icons/ri/expand-up-down-line";
import HistoryIcon from "virtual:icons/ri/history-line";
import LayoutGridIcon from "virtual:icons/ri/layout-grid-line";
import LightbulbIcon from "virtual:icons/ri/lightbulb-fill";
import LogoutBoxRIcon from "virtual:icons/ri/logout-box-r-line";
import QuestionIcon from "virtual:icons/ri/question-fill";
import Settings2Icon from "virtual:icons/ri/settings-2-line";
import ShieldCheckIcon from "virtual:icons/ri/shield-check-fill";
import Sparkling2Icon from "virtual:icons/ri/sparkling-2-fill";
import UserSettingsIcon from "virtual:icons/ri/user-settings-line";
import WalletIcon from "virtual:icons/ri/wallet-line";
import { useRoute } from "ziggy-js";

import { Avatar } from "#/components/avatar.tsx";
import { CompactButton } from "#/components/compact-button.tsx";
import {
    Dropdown,
    DropdownButton,
    DropdownDivider,
    DropdownHeading,
    DropdownItem,
    DropdownLabel,
    DropdownMenu,
    DropdownSection,
} from "#/components/dropdown.tsx";
import {
    Sidebar,
    SidebarBody,
    SidebarDivider,
    SidebarFooter,
    SidebarHeader,
    SidebarHeading,
    SidebarItem,
    SidebarLabel,
    SidebarSection,
    SidebarSpacer,
} from "#/components/sidebar.tsx";
import { type Auth, type InertiaSharedProps, type Workspace } from "#/types/index.ts";
import { SettingsMenu } from "./settings-sidebar.tsx";

export function MainSidebar({
    user,
    workspaces,
    logout,
}: {
    user: Auth["user"];
    workspaces: InertiaSharedProps["workspaces"];
    logout: (e: React.FormEvent) => void;
}) {
    const route = useRoute();
    const currentRoute = route().current();

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
        <Sidebar>
            <SidebarHeader>
                <Dropdown>
                    <DropdownButton as={SidebarItem} buttonClassName="p-3">
                        <Avatar
                            alt="ExpenseTrackr logo"
                            className="bg-primary inline-flex !size-10 items-center justify-center p-1"
                            src="/img/isotype-dark.svg"
                        />
                        <SidebarLabel className="text-label-sm flex-1">{user?.current_workspace.name}</SidebarLabel>
                        {/* @ts-expect-error - TODO: this type is wrong (Headless UI side) */}
                        <CompactButton as="span" className="ml-auto">
                            <ExpandUpDownIcon />
                        </CompactButton>
                    </DropdownButton>
                    <DropdownMenu
                        anchor="bottom start"
                        className="min-w-80 data-[anchor~=start]:[--anchor-offset:0] sm:data-[anchor~=start]:[--anchor-offset:0] lg:min-w-64"
                    >
                        {user && workspaces.hasWorkspaceFeatures && (
                            <DropdownSection>
                                <DropdownHeading>Manage workspace</DropdownHeading>
                                <DropdownItem
                                    href={route("workspaces.show", {
                                        workspace: user?.current_workspace.id,
                                    })}
                                >
                                    <Settings2Icon />
                                    <DropdownLabel>Settings</DropdownLabel>
                                </DropdownItem>
                            </DropdownSection>
                        )}

                        {user?.all_workspaces && user?.all_workspaces?.length > 1 && (
                            <>
                                <DropdownDivider />

                                <DropdownSection>
                                    <DropdownHeading>Switch workspace</DropdownHeading>

                                    {user.all_workspaces.map((workspace) => (
                                        <DropdownItem key={workspace.id} onClick={() => switchToWorkspace(workspace)}>
                                            {workspace.id === user.current_workspace_id ? (
                                                <CheckIcon />
                                            ) : (
                                                <Avatar
                                                    alt={workspace.name}
                                                    initials={workspace.name.slice(0, 1)}
                                                    slot="icon"
                                                />
                                            )}

                                            <DropdownLabel>{workspace.name}</DropdownLabel>
                                        </DropdownItem>
                                    ))}
                                </DropdownSection>
                            </>
                        )}

                        {workspaces.canCreateWorkspaces && (
                            <>
                                <DropdownDivider />
                                <DropdownItem href={route("workspaces.create")}>
                                    <AddIcon />
                                    <DropdownLabel>New workspace&hellip;</DropdownLabel>
                                </DropdownItem>
                            </>
                        )}
                    </DropdownMenu>
                </Dropdown>
            </SidebarHeader>

            <SidebarDivider className="mx-5 my-1.5" />

            <SidebarBody>
                <SidebarSection>
                    <SidebarHeading className="pb-3">Main</SidebarHeading>
                    <SidebarItem current={currentRoute === "dashboard"} href={route("dashboard")}>
                        <LayoutGridIcon />
                        <SidebarLabel>Dashboard</SidebarLabel>
                    </SidebarItem>
                    <SidebarItem current={currentRoute === "accounts.index"} href={route("accounts.index")}>
                        <WalletIcon />
                        <SidebarLabel>Accounts</SidebarLabel>
                    </SidebarItem>
                    <SidebarItem href="/transactions">
                        <HistoryIcon />
                        <SidebarLabel>Transactions</SidebarLabel>
                    </SidebarItem>
                </SidebarSection>
                <SidebarSection>
                    <SidebarHeading className="pb-3">Other</SidebarHeading>
                    <SidebarItem
                        className="max-lg:hidden"
                        current={currentRoute?.startsWith("settings.") || currentRoute === "workspaces.show"}
                        href={route("settings.show")}
                    >
                        <Settings2Icon />
                        <SidebarLabel>Settings</SidebarLabel>
                    </SidebarItem>

                    <Disclosure
                        defaultOpen={currentRoute?.startsWith("settings.") || currentRoute === "workspaces.show"}
                    >
                        <DisclosureButton
                            as={SidebarItem}
                            className="lg:hidden"
                            current={currentRoute?.startsWith("settings.") || currentRoute === "workspaces.show"}
                        >
                            <Settings2Icon />
                            <SidebarLabel>Settings</SidebarLabel>
                        </DisclosureButton>
                        <DisclosurePanel className="flex flex-col gap-1 pl-4 lg:hidden">
                            <SettingsMenu />
                        </DisclosurePanel>
                    </Disclosure>
                </SidebarSection>
                <SidebarSpacer />
                <SidebarSection>
                    <SidebarItem href="/support">
                        <QuestionIcon />
                        <SidebarLabel>Support</SidebarLabel>
                    </SidebarItem>
                    <SidebarItem href="/changelog">
                        <Sparkling2Icon />
                        <SidebarLabel>Changelog</SidebarLabel>
                    </SidebarItem>
                </SidebarSection>
            </SidebarBody>
            <SidebarFooter className="max-lg:hidden">
                <Dropdown>
                    <DropdownButton as={SidebarItem} className="rounded-10 -mx-4">
                        <span className="flex min-w-0 items-center gap-3">
                            <Avatar
                                alt={user?.name}
                                className="size-10"
                                imageProps={{
                                    className: "size-10 object-cover object-top",
                                }}
                                src={user?.profile_photo_url}
                                user={user}
                            />
                            <span className="min-w-0 space-y-1">
                                <span className="text-label-sm block truncate">{user?.name}</span>
                                <span className="text-paragraph-xs block truncate text-[var(--text-sub-600)]">
                                    {user?.email}
                                </span>
                            </span>
                        </span>
                        <ArrowUpSIcon className="size-5" />
                    </DropdownButton>
                    <DropdownMenu
                        anchor="top start"
                        className="min-w-64 data-[anchor~=start]:[--anchor-offset:0] sm:data-[anchor~=start]:[--anchor-offset:0]"
                    >
                        <DropdownItem href={route("settings.show")}>
                            <UserSettingsIcon />
                            <DropdownLabel>My profile</DropdownLabel>
                        </DropdownItem>
                        <DropdownItem href="/settings">
                            <Settings2Icon />
                            <DropdownLabel>Settings</DropdownLabel>
                        </DropdownItem>
                        <DropdownDivider />
                        <DropdownItem href={route("policy.show")}>
                            <ShieldCheckIcon />
                            <DropdownLabel>Privacy policy</DropdownLabel>
                        </DropdownItem>
                        <DropdownItem href="/share-feedback">
                            <LightbulbIcon />
                            <DropdownLabel>Share feedback</DropdownLabel>
                        </DropdownItem>
                        <DropdownDivider />
                        <form
                            // mimic the subgrid behavior of the dropdown menu item
                            className="col-span-full grid grid-cols-[auto_1fr_1.5rem_0.5rem_auto] items-center supports-[grid-template-columns:subgrid]:grid-cols-subgrid"
                            onSubmit={logout}
                        >
                            <DropdownItem type="submit">
                                <LogoutBoxRIcon />
                                <DropdownLabel>Sign out</DropdownLabel>
                            </DropdownItem>
                        </form>
                    </DropdownMenu>
                </Dropdown>
            </SidebarFooter>
        </Sidebar>
    );
}
