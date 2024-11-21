import { usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import ArrowRightSIcon from "virtual:icons/ri/arrow-right-s-line";
import EqualizerIcon from "virtual:icons/ri/equalizer-line";
import PlanetIcon from "virtual:icons/ri/planet-line";
import ShieldUserIcon from "virtual:icons/ri/shield-user-line";
import UserSettingsIcon from "virtual:icons/ri/user-settings-line";
import { useRoute } from "ziggy-js";

import {
    Sidebar,
    SidebarBody,
    SidebarDivider,
    SidebarHeader,
    SidebarItem,
    SidebarLabel,
    SidebarSection,
} from "#/components/sidebar.tsx";
import { type InertiaSharedProps } from "#/types/index.ts";

export function SettingsMenu() {
    const page = usePage<InertiaSharedProps>();
    const user = page.props.auth.user;
    const route = useRoute();
    const currentRoute = route().current();

    return (
        <>
            <SidebarItem
                current={currentRoute === "settings.show"}
                currentIndicator={false}
                href={route("settings.show")}
            >
                <UserSettingsIcon />
                <SidebarLabel>Profile</SidebarLabel>

                {currentRoute === "settings.show" && (
                    <motion.span
                        className="ml-auto inline-flex rounded-full bg-(--bg-white-0) p-px shadow-xs"
                        layoutId="current-setting-indicator"
                    >
                        <ArrowRightSIcon className="size-[18px]" />
                    </motion.span>
                )}
            </SidebarItem>
            <SidebarItem
                current={route().current("workspaces.show", {
                    workspace: Number(user?.current_workspace_id),
                })}
                currentIndicator={false}
                href={route("workspaces.show", {
                    workspace: Number(user?.current_workspace_id),
                })}
            >
                <PlanetIcon />
                <SidebarLabel>Workspace</SidebarLabel>

                {currentRoute === "workspaces.show" && (
                    <motion.span
                        className="ml-auto inline-flex rounded-full bg-(--bg-white-0) p-px shadow-xs"
                        layoutId="current-setting-indicator"
                    >
                        <ArrowRightSIcon className="size-[18px]" />
                    </motion.span>
                )}
            </SidebarItem>
            <SidebarItem
                current={currentRoute === "settings.privacy-and-security.show"}
                currentIndicator={false}
                href={route("settings.privacy-and-security.show")}
            >
                <ShieldUserIcon />
                <SidebarLabel>Privacy & Security</SidebarLabel>

                {currentRoute === "settings.privacy-and-security.show" && (
                    <motion.span
                        className="ml-auto inline-flex rounded-full bg-(--bg-white-0) p-px shadow-xs"
                        layoutId="current-setting-indicator"
                    >
                        <ArrowRightSIcon className="size-[18px]" />
                    </motion.span>
                )}
            </SidebarItem>
            <SidebarItem
                current={currentRoute === "settings.connected-accounts.show"}
                currentIndicator={false}
                href={route("settings.connected-accounts.show")}
            >
                <EqualizerIcon />
                <SidebarLabel>Connected accounts</SidebarLabel>

                {currentRoute === "settings.connected-accounts.show" && (
                    <motion.span
                        className="ml-auto inline-flex rounded-full bg-(--bg-white-0) p-px shadow-xs"
                        layoutId="current-setting-indicator"
                    >
                        <ArrowRightSIcon className="size-[18px]" />
                    </motion.span>
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
                <p className="text-paragraph-sm text-(--text-sub-600)">Choose between categories.</p>
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
