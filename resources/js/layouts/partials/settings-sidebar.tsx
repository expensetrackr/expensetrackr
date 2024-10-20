import ArrowRightSIcon from "virtual:icons/ri/arrow-right-s-line";
import EqualizerIcon from "virtual:icons/ri/equalizer-line";
import ShieldUserIcon from "virtual:icons/ri/shield-user-line";
import UserSettingsIcon from "virtual:icons/ri/user-settings-line";

import {
	Sidebar,
	SidebarBody,
	SidebarDivider,
	SidebarHeader,
	SidebarItem,
	SidebarLabel,
	SidebarSection,
} from "#/components/sidebar";

export function SettingsMenu() {
	return (
		<>
			<SidebarItem href={route("settings.show")} current={route().current("settings.show")} currentIndicator={false}>
				<UserSettingsIcon />
				<SidebarLabel>Profile</SidebarLabel>

				{route().current("settings.show") && (
					<span className="ml-auto inline-flex rounded-full bg-[var(--bg-white-0)] p-px shadow-xs">
						<ArrowRightSIcon className="size-[18px]" />
					</span>
				)}
			</SidebarItem>
			<SidebarItem
				href={route("settings.privacy-and-security.show")}
				current={route().current("settings.privacy-and-security.show")}
				currentIndicator={false}
			>
				<ShieldUserIcon />
				<SidebarLabel>Privacy & Security</SidebarLabel>

				{route().current("settings.privacy-and-security.show") && (
					<span className="ml-auto inline-flex rounded-full bg-[var(--bg-white-0)] p-px shadow-xs">
						<ArrowRightSIcon className="size-[18px]" />
					</span>
				)}
			</SidebarItem>
			<SidebarItem
				href={route("settings.connected-accounts.show")}
				current={route().current("settings.connected-accounts.show")}
				currentIndicator={false}
			>
				<EqualizerIcon />
				<SidebarLabel>Connected accounts</SidebarLabel>

				{route().current("settings.connected-accounts.show") && (
					<span className="ml-auto inline-flex rounded-full bg-[var(--bg-white-0)] p-px shadow-xs">
						<ArrowRightSIcon className="size-[18px]" />
					</span>
				)}
			</SidebarItem>
		</>
	);
}

export function SettingsSidebar() {
	return (
		<Sidebar className="gap-5 px-5 py-7">
			<SidebarHeader className="gap-1 p-0">
				<h2 className="text-label-lg">Settings</h2>
				<p className="text-[var(--text-sub-600)] text-paragraph-sm">Choose between categories.</p>
			</SidebarHeader>

			<SidebarDivider />

			<SidebarBody className="p-0">
				<SidebarSection>
					<SettingsMenu />
				</SidebarSection>
			</SidebarBody>
		</Sidebar>
	);
}
