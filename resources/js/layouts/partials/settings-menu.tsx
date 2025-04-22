import { router } from "@inertiajs/react";
import ArrowRight01Icon from "virtual:icons/hugeicons/arrow-right-01";
import CreditCardIcon from "virtual:icons/hugeicons/credit-card";
import CreditCardSolidIcon from "virtual:icons/hugeicons/credit-card-solid";
import GeometricShapes01Icon from "virtual:icons/hugeicons/geometric-shapes-01";
import GeometricShapes01SolidIcon from "virtual:icons/hugeicons/geometric-shapes-01-solid";
import SecurityLockIcon from "virtual:icons/hugeicons/security-lock";
import SecurityLockSolidIcon from "virtual:icons/hugeicons/security-lock-solid";
import Share08Icon from "virtual:icons/hugeicons/share-08";
import Share08SolidIcon from "virtual:icons/hugeicons/share-08-solid";
import UserCircleIcon from "virtual:icons/hugeicons/user-circle";
import UserCircleSolidIcon from "virtual:icons/hugeicons/user-circle-solid";
import UserGroupIcon from "virtual:icons/hugeicons/user-group";
import UserGroupSolidIcon from "virtual:icons/hugeicons/user-group-solid";

import { Link } from "#/components/link.tsx";
import * as Divider from "#/components/ui/divider.tsx";
import * as TabMenuHorizontal from "#/components/ui/tab-menu-horizontal.tsx";
import * as TabMenuVertical from "#/components/ui/tab-menu-vertical.tsx";
import { useAuth } from "#/hooks/use-auth.ts";
import { usePageProps } from "#/hooks/use-page-props.ts";

export function SettingsVerticalMenu() {
    const { url } = usePageProps();
    const currentWorkspace = useAuth().currentWorkspace;

    const links = [
        {
            label: "Profile",
            icon: UserCircleIcon,
            iconActive: UserCircleSolidIcon,
            href: "/settings",
        },
        {
            label: "Billing",
            icon: CreditCardIcon,
            iconActive: CreditCardSolidIcon,
            href: "/settings/billing",
        },
        {
            label: "Workspace",
            icon: UserGroupIcon,
            iconActive: UserGroupSolidIcon,
            href: `/workspaces/${currentWorkspace.id}`,
        },
        {
            label: "Categories",
            icon: GeometricShapes01Icon,
            iconActive: GeometricShapes01SolidIcon,
            href: "/settings/categories",
        },
        {
            label: "Privacy & Security",
            icon: SecurityLockIcon,
            iconActive: SecurityLockSolidIcon,
            href: "/settings/privacy-and-security",
        },
        {
            label: "Connected Accounts",
            icon: Share08Icon,
            iconActive: Share08SolidIcon,
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
                        {links.map(({ label, icon: Icon, iconActive: IconActive, href }) => (
                            <TabMenuVertical.Trigger asChild key={label} value={href}>
                                <Link href={href}>
                                    <TabMenuVertical.Icon as={href === url ? IconActive : Icon} />
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
