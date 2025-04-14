import { Link } from "@inertiajs/react";
import { useTheme } from "next-themes";
import ArrowDown01Icon from "virtual:icons/hugeicons/arrow-down-01";
import ArrowRight01Icon from "virtual:icons/hugeicons/arrow-right-01";
import CustomerSupportIcon from "virtual:icons/hugeicons/customer-support";
import Logout04Icon from "virtual:icons/hugeicons/logout-04";
import Moon02Icon from "virtual:icons/hugeicons/moon-02";
import SecurityCheckIcon from "virtual:icons/hugeicons/security-check";
import Setting07Icon from "virtual:icons/hugeicons/setting-07";
import UserCircle02Icon from "virtual:icons/hugeicons/user-circle-02";

import * as Switch from "#/components/ui/switch.tsx";
import { useUser } from "#/hooks/use-user.ts";
import { routes } from "#/routes.ts";
import { cn, cnMerge } from "#/utils/cn.ts";
import * as Avatar from "./ui/avatar.tsx";
import * as Divider from "./ui/divider.tsx";
import * as Dropdown from "./ui/dropdown.tsx";

export function UserButton({ className }: { className?: string }) {
    const user = useUser();
    const { theme, setTheme } = useTheme();

    return (
        <Dropdown.Root>
            <Dropdown.Trigger
                className={cnMerge(
                    "flex w-full items-center gap-3 rounded-10 p-3 text-left whitespace-nowrap outline-none hover:bg-(--bg-weak-50) focus:outline-none",
                    className,
                )}
            >
                <Avatar.Root $color="blue" $size="40">
                    {user.profilePhotoUrl ? (
                        <Avatar.Image alt={user?.name} src={user?.profilePhotoUrl ?? undefined} />
                    ) : (
                        user?.name?.slice(0, 2)
                    )}
                </Avatar.Root>

                <div className="flex w-[172px] shrink-0 items-center gap-3" data-hide-collapsed>
                    <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-0.5 text-label-sm">{user?.name}</div>
                        <div className="text-paragraph-xs text-(--text-sub-600)">{user?.email}</div>
                    </div>

                    <div className="flex size-6 items-center justify-center rounded-6">
                        <ArrowRight01Icon className="size-5 text-(--text-sub-600)" />
                    </div>
                </div>
            </Dropdown.Trigger>

            <Dropdown.Content align="end" side="right" sideOffset={24}>
                <Dropdown.Item
                    onSelect={(e) => {
                        e.preventDefault();
                        setTheme(theme === "dark" ? "light" : "dark");
                    }}
                >
                    <Dropdown.ItemIcon as={Moon02Icon} />
                    Dark Mode
                    <span className="flex-1" />
                    <Switch.Root checked={theme === "dark"} />
                </Dropdown.Item>

                <Divider.Root $type="line-spacing" />

                <Dropdown.Group>
                    <Dropdown.Item asChild>
                        <Link href={routes.settings.show.url()}>
                            <Dropdown.ItemIcon as={UserCircle02Icon} />
                            My profile
                        </Link>
                    </Dropdown.Item>
                    <Dropdown.Item asChild>
                        <Link href={routes.settings.show.url()}>
                            <Dropdown.ItemIcon as={Setting07Icon} />
                            Settings
                        </Link>
                    </Dropdown.Item>
                </Dropdown.Group>

                <Divider.Root $type="line-spacing" />

                <Dropdown.Group>
                    <Dropdown.Item asChild>
                        <Link as="button" href={routes.logout.url()} method="post">
                            <Dropdown.ItemIcon as={Logout04Icon} />
                            Logout
                        </Link>
                    </Dropdown.Item>
                </Dropdown.Group>

                <div className="p-2 text-paragraph-sm text-(--text-soft-400)">
                    <span>v1.0.0 · </span>
                    <Link href={routes.terms.show.url()}>Terms & Conditions</Link>
                </div>
            </Dropdown.Content>
        </Dropdown.Root>
    );
}

export function UserButtonMobile({ className }: { className?: string }) {
    const { theme, setTheme } = useTheme();
    const user = useUser();

    return (
        <Dropdown.Root modal={false}>
            <Dropdown.Trigger
                className={cnMerge(
                    "group flex w-full items-center gap-3 rounded-10 p-3 text-left whitespace-nowrap outline-none hover:bg-(--bg-weak-50) focus:outline-none",
                    className,
                )}
            >
                <Avatar.Root $color="blue" $size="48">
                    {user.profilePhotoUrl ? (
                        <Avatar.Image alt={user?.name} src={user?.profilePhotoUrl ?? undefined} />
                    ) : (
                        user?.name?.slice(0, 2)
                    )}
                </Avatar.Root>
                <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-0.5 text-label-md">{user?.name}</div>
                    <div className="text-paragraph-sm text-(--text-sub-600)">{user?.email}</div>
                </div>
                <div
                    className={cn(
                        "flex size-6 items-center justify-center rounded-6 border border-(--stroke-soft-200) bg-(--bg-white-0) text-(--text-sub-600) shadow-xs",
                        // open
                        "group-data-[state=open]:bg-(--bg-strong-950) group-data-[state=open]:text-(--text-white-0) group-data-[state=open]:shadow-none",
                    )}
                >
                    <ArrowDown01Icon className="size-5 group-data-[state=open]:-rotate-180" />
                </div>
            </Dropdown.Trigger>

            <Dropdown.Content align="end" side="top">
                <Dropdown.Item
                    onSelect={(e) => {
                        e.preventDefault();
                        setTheme(theme === "dark" ? "light" : "dark");
                    }}
                >
                    <Dropdown.ItemIcon as={Moon02Icon} />
                    Dark Mode
                    <span className="flex-1" />
                    <Switch.Root checked={theme === "dark"} />
                </Dropdown.Item>

                <Divider.Root $type="line-spacing" />

                <Dropdown.Group>
                    <Dropdown.Item asChild>
                        <Link href={routes.settings.show.url()}>
                            <Dropdown.ItemIcon as={UserCircle02Icon} />
                            My profile
                        </Link>
                    </Dropdown.Item>
                    <Dropdown.Item asChild>
                        <Link href={routes.settings.show.url()}>
                            <Dropdown.ItemIcon as={Setting07Icon} />
                            Settings
                        </Link>
                    </Dropdown.Item>
                    <Dropdown.Item asChild>
                        <Link href={routes.policy.show.url()}>
                            <Dropdown.ItemIcon as={SecurityCheckIcon} />
                            Privacy policy
                        </Link>
                    </Dropdown.Item>
                    <Dropdown.Item asChild>
                        <a href="mailto:support@expensetrackr.app" rel="noopener noreferrer" target="_blank">
                            <Dropdown.ItemIcon as={CustomerSupportIcon} />
                            Support
                        </a>
                    </Dropdown.Item>
                </Dropdown.Group>

                <Divider.Root $type="line-spacing" />

                <Dropdown.Group>
                    <Dropdown.Item asChild>
                        <Link as="button" href={routes.logout.url()} method="post">
                            <Dropdown.ItemIcon as={Logout04Icon} />
                            Logout
                        </Link>
                    </Dropdown.Item>
                </Dropdown.Group>
            </Dropdown.Content>
        </Dropdown.Root>
    );
}
