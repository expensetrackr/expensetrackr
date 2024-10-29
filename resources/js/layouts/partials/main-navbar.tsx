import InboxIcon from "virtual:icons/ri/inbox-line";
import LightbulbIcon from "virtual:icons/ri/lightbulb-fill";
import LogoutBoxRIcon from "virtual:icons/ri/logout-box-r-line";
import SearchIcon from "virtual:icons/ri/search-line";
import Settings2Icon from "virtual:icons/ri/settings-2-line";
import ShieldCheckIcon from "virtual:icons/ri/shield-check-fill";
import UserSettingsIcon from "virtual:icons/ri/user-settings-line";

import { Avatar } from "#/components/avatar";
import {
	Dropdown,
	DropdownButton,
	DropdownDivider,
	DropdownItem,
	DropdownLabel,
	DropdownMenu,
} from "#/components/dropdown";
import { Navbar, NavbarItem, NavbarSection, NavbarSpacer } from "#/components/navbar";
import type { Auth } from "#/types";

export function MainNavbar({
	user,
	logout,
}: {
	user: Auth["user"];
	logout: (e: React.FormEvent) => void;
}) {
	return (
		<Navbar>
			<NavbarSpacer />
			<NavbarSection>
				<NavbarItem href="/search" aria-label="Search">
					<SearchIcon />
				</NavbarItem>
				<NavbarItem href="/inbox" aria-label="Inbox">
					<InboxIcon />
				</NavbarItem>
				<Dropdown>
					<DropdownButton as={NavbarItem}>
						<Avatar
							user={user}
							src={user?.profile_photo_url}
							alt={user?.name}
							className="size-10"
							imageProps={{ className: "size-7 object-cover object-top sm:size-6" }}
						/>
					</DropdownButton>
					<DropdownMenu className="min-w-64" anchor="bottom end">
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
			</NavbarSection>
		</Navbar>
	);
}
