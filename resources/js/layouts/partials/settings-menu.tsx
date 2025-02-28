import { router } from "@inertiajs/react";
import ArrowRightSIcon from "virtual:icons/ri/arrow-right-s-line";
import EqualizerIcon from "virtual:icons/ri/equalizer-line";
import PlanetIcon from "virtual:icons/ri/planet-line";
import ShieldUserIcon from "virtual:icons/ri/shield-user-line";
import UserSettingsIcon from "virtual:icons/ri/user-settings-line";

import { Link } from "#/components/link.tsx";
import * as Divider from "#/components/ui/divider.tsx";
import * as TabMenuHorizontal from "#/components/ui/tab-menu-horizontal.tsx";
import * as TabMenuVertical from "#/components/ui/tab-menu-vertical.tsx";
import { useCurrentWorkspace } from "#/hooks/use-current-workspace.ts";
import { usePageProps } from "#/hooks/use-page-props.ts";

export function SettingsVerticalMenu() {
    const { url } = usePageProps();
    const currentWorkspace = useCurrentWorkspace();

    const links = [
        {
            label: "Profile",
            icon: UserSettingsIcon,
            href: "/settings",
        },
        {
            label: "Workspace",
            icon: PlanetIcon,
            href: `/workspaces/${currentWorkspace.id}`,
        },
        {
            label: "Privacy & Security",
            icon: ShieldUserIcon,
            href: "/settings/privacy-and-security",
        },
        {
            label: "Connected Accounts",
            icon: EqualizerIcon,
            href: "/settings/connected-accounts",
        },
    ];

    return (
        <>
            {/* mobile */}
            <TabMenuHorizontal.Root
                className="lg:hidden"
                defaultValue={url}
                onValueChange={(v) =>
                    router.push({
                        url: v,
                    })
                }
            >
                <TabMenuHorizontal.List className="border-t-0 px-4">
                    {links.map(({ label, icon: Icon, href }) => (
                        <TabMenuHorizontal.Trigger asChild key={label} value={href}>
                            <Link href={href}>
                                <TabMenuHorizontal.Icon as={Icon} />
                                {label}
                            </Link>
                        </TabMenuHorizontal.Trigger>
                    ))}
                </TabMenuHorizontal.List>
            </TabMenuHorizontal.Root>

            {/* desktop */}
            <div className="hidden w-[264px] shrink-0 flex-col gap-5 border-r border-(--stroke-soft-200) p-5 lg:flex">
                <div>
                    <div className="text-label-lg text-(--text-strong-950)">Settings</div>
                    <div className="mt-1 text-paragraph-sm text-(--text-sub-600)">Choose between categories.</div>
                </div>

                <Divider.Root />

                <TabMenuVertical.Root
                    defaultValue={url}
                    onValueChange={(v) =>
                        router.push({
                            url: v,
                        })
                    }
                >
                    <TabMenuVertical.List>
                        {links.map(({ label, icon: Icon, href }) => (
                            <TabMenuVertical.Trigger asChild key={label} value={href}>
                                <Link href={href}>
                                    <TabMenuVertical.Icon as={Icon} />
                                    {label}
                                    <TabMenuVertical.ArrowIcon as={ArrowRightSIcon} />
                                </Link>
                            </TabMenuVertical.Trigger>
                        ))}
                    </TabMenuVertical.List>
                </TabMenuVertical.Root>
            </div>
        </>
    );
}
