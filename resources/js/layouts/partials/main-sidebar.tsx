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
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { router } from "@inertiajs/react";

import { Avatar } from "#/components/avatar";
import { CompactButton } from "#/components/compact-button";
import {
	Dropdown,
	DropdownButton,
	DropdownDivider,
	DropdownHeading,
	DropdownItem,
	DropdownLabel,
	DropdownMenu,
	DropdownSection,
} from "#/components/dropdown";
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
} from "#/components/sidebar";
import type { Auth, InertiaSharedProps, Workspace } from "#/types";
import { SettingsMenu } from "./settings-sidebar";

export function MainSidebar({
	user,
	workspaces,
	logout,
}: {
	user: Auth["user"];
	workspaces: InertiaSharedProps["workspaces"];
	logout: (e: React.FormEvent) => void;
}) {
	function switchToWorkspace(e: React.FormEvent, workspace: Workspace) {
		e.preventDefault();
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
							src="/img/isotype-dark.svg"
							alt="ExpenseTrackr logo"
							className="!size-10 inline-flex items-center justify-center bg-primary p-1"
						/>
						<SidebarLabel className="flex-1 text-label-sm">{user?.current_workspace.name}</SidebarLabel>
						{/* @ts-expect-error - TODO: this type is wrong (Headless UI side) */}
						<CompactButton as="span" className="ml-auto">
							<ExpandUpDownIcon />
						</CompactButton>
					</DropdownButton>
					<DropdownMenu
						className="min-w-80 lg:min-w-64 data-[anchor~=start]:[--anchor-offset:0] sm:data-[anchor~=start]:[--anchor-offset:0]"
						anchor="bottom start"
					>
						{user && workspaces.hasWorkspaceFeatures && (
							<DropdownSection>
								<DropdownHeading>Manage workspace</DropdownHeading>
								<DropdownItem href={route("workspaces.show", { workspace: user?.current_workspace.id })}>
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
										<form key={workspace.id} onSubmit={(e) => switchToWorkspace(e, workspace)}>
											<DropdownItem>
												{workspace.id === user.current_workspace_id ? (
													<CheckIcon />
												) : (
													<Avatar slot="icon" initials={workspace.name.slice(0, 1)} alt={workspace.name} />
												)}

												<DropdownLabel>{workspace.name}</DropdownLabel>
											</DropdownItem>
										</form>
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

			<SidebarDivider className="mx-5" />

			<SidebarBody>
				<SidebarSection>
					<SidebarHeading className="pb-3">Main</SidebarHeading>
					<SidebarItem href={route("dashboard")} current={route().current("dashboard")}>
						<LayoutGridIcon />
						<SidebarLabel>Dashboard</SidebarLabel>
					</SidebarItem>
					<SidebarItem href="/transactions">
						<HistoryIcon />
						<SidebarLabel>Transactions</SidebarLabel>
					</SidebarItem>
				</SidebarSection>
				<SidebarSection>
					<SidebarHeading className="pb-3">Other</SidebarHeading>
					<SidebarItem
						href={route("settings.show")}
						current={route().current("settings.*") || route().current("workspaces.show")}
						className="max-lg:hidden"
					>
						<Settings2Icon />
						<SidebarLabel>Settings</SidebarLabel>
					</SidebarItem>

					<Disclosure defaultOpen={route().current("settings.*")}>
						<DisclosureButton as={SidebarItem} current={route().current("settings.*")} className="lg:hidden">
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
					<DropdownButton as={SidebarItem} className="-mx-4 rounded-10">
						<span className="flex min-w-0 items-center gap-3">
							<Avatar
								user={user}
								src={user?.profile_photo_url}
								className="size-10"
								imageProps={{ className: "size-10 object-cover object-top" }}
								alt={user?.name}
							/>
							<span className="min-w-0 space-y-1">
								<span className="block truncate text-label-sm">{user?.name}</span>
								<span className="block truncate text-[var(--text-sub-600)] text-paragraph-xs">{user?.email}</span>
							</span>
						</span>
						<ArrowUpSIcon className="size-5" />
					</DropdownButton>
					<DropdownMenu
						className="min-w-64 data-[anchor~=start]:[--anchor-offset:0] sm:data-[anchor~=start]:[--anchor-offset:0]"
						anchor="top start"
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
