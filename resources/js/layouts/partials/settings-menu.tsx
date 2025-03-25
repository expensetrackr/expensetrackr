import { router } from "@inertiajs/react";
import ArrowRight01Icon from "virtual:icons/hugeicons/arrow-right-01";
import BlockedIcon from "virtual:icons/hugeicons/blocked";
import GeometricShapes01Icon from "virtual:icons/hugeicons/geometric-shapes-01";
import Link04Icon from "virtual:icons/hugeicons/link-04";
import UserCircle02Icon from "virtual:icons/hugeicons/user-circle-02";
import UserMultiple02Icon from "virtual:icons/hugeicons/user-multiple-02";

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
            icon: UserCircle02Icon,
            href: "/settings",
        },
        {
            label: "Workspace",
            icon: UserMultiple02Icon,
            href: `/workspaces/${currentWorkspace.id}`,
        },
        {
            label: "Categories",
            icon: GeometricShapes01Icon,
            href: "/settings/categories",
        },
        {
            label: "Privacy & Security",
            icon: BlockedIcon,
            href: "/settings/privacy-and-security",
        },
        {
            label: "Connected Accounts",
            icon: Link04Icon,
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
                                    <TabMenuVertical.ArrowIcon as={ArrowRight01Icon} />
                                </Link>
                            </TabMenuVertical.Trigger>
                        ))}
                    </TabMenuVertical.List>
                </TabMenuVertical.Root>
            </div>
        </>
    );
}
