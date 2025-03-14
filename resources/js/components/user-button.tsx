import { Link } from "@inertiajs/react";
import ArrowDownSIcon from "virtual:icons/ri/arrow-down-s-line";
import ArrowRightSIcon from "virtual:icons/ri/arrow-right-s-line";
import LightbulbIcon from "virtual:icons/ri/lightbulb-fill";
import LogoutBoxRIcon from "virtual:icons/ri/logout-box-r-line";
import Settings2Icon from "virtual:icons/ri/settings-2-line";
import ShieldCheckIcon from "virtual:icons/ri/shield-check-fill";
import UserSettingsIcon from "virtual:icons/ri/user-settings-line";

import { useUser } from "#/hooks/use-user.ts";
import { cn, cnMerge } from "#/utils/cn.ts";
import * as Avatar from "./ui/avatar.tsx";
import * as Divider from "./ui/divider.tsx";
import * as Dropdown from "./ui/dropdown.tsx";

export function UserButton({ className }: { className?: string }) {
    const user = useUser();

    return (
        <Dropdown.Root>
            <Dropdown.Trigger
                className={cnMerge(
                    "flex w-full items-center gap-3 rounded-10 p-3 text-left whitespace-nowrap outline-none hover:bg-(--bg-weak-50) focus:outline-none",
                    className,
                )}
            >
                <Avatar.Root $color="blue" $size="40">
                    <Avatar.Image alt={user?.name} src={user?.profilePhotoUrl ?? undefined} />
                </Avatar.Root>

                <div className="flex w-[172px] shrink-0 items-center gap-3" data-hide-collapsed>
                    <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-0.5 text-label-sm">{user?.name}</div>
                        <div className="text-paragraph-xs text-(--text-sub-600)">{user?.email}</div>
                    </div>

                    <div className="flex size-6 items-center justify-center rounded-6">
                        <ArrowRightSIcon className="size-5 text-(--text-sub-600)" />
                    </div>
                </div>
            </Dropdown.Trigger>

            <Dropdown.Content align="end" side="right" sideOffset={24}>
                <Divider.Root $type="line-spacing" />

                <Dropdown.Group>
                    <Dropdown.Item asChild>
                        <Link href={route("settings.show")}>
                            <Dropdown.ItemIcon as={UserSettingsIcon} />
                            My profile
                        </Link>
                    </Dropdown.Item>
                    <Dropdown.Item asChild>
                        <Link href={route("settings.show")}>
                            <Dropdown.ItemIcon as={Settings2Icon} />
                            Settings
                        </Link>
                    </Dropdown.Item>
                    <Dropdown.Item asChild>
                        <Link href={route("policy.show")}>
                            <Dropdown.ItemIcon as={ShieldCheckIcon} />
                            Privacy policy
                        </Link>
                    </Dropdown.Item>
                    <Dropdown.Item asChild>
                        <Link href="/share-feedback">
                            <Dropdown.ItemIcon as={LightbulbIcon} />
                            Share feedback
                        </Link>
                    </Dropdown.Item>
                </Dropdown.Group>

                <Divider.Root $type="line-spacing" />

                <Dropdown.Group>
                    <Dropdown.Item asChild>
                        <Link as="button" href={route("logout")} method="post">
                            <Dropdown.ItemIcon as={LogoutBoxRIcon} />
                            Logout
                        </Link>
                    </Dropdown.Item>
                </Dropdown.Group>
            </Dropdown.Content>
        </Dropdown.Root>
    );
}

export function UserButtonMobile({ className }: { className?: string }) {
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
                    <Avatar.Image alt={user?.name} src={user?.profilePhotoUrl ?? undefined} />
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
                    <ArrowDownSIcon className="size-5 group-data-[state=open]:-rotate-180" />
                </div>
            </Dropdown.Trigger>

            <Dropdown.Content align="end" side="top">
                <Divider.Root $type="line-spacing" />

                <Dropdown.Group>
                    <Dropdown.Item asChild>
                        <Link href={route("settings.show")}>
                            <Dropdown.ItemIcon as={UserSettingsIcon} />
                            My profile
                        </Link>
                    </Dropdown.Item>
                    <Dropdown.Item asChild>
                        <Link href={route("settings.show")}>
                            <Dropdown.ItemIcon as={Settings2Icon} />
                            Settings
                        </Link>
                    </Dropdown.Item>
                    <Dropdown.Item asChild>
                        <Link href={route("policy.show")}>
                            <Dropdown.ItemIcon as={ShieldCheckIcon} />
                            Privacy policy
                        </Link>
                    </Dropdown.Item>
                    <Dropdown.Item asChild>
                        <Link href="/share-feedback">
                            <Dropdown.ItemIcon as={LightbulbIcon} />
                            Share feedback
                        </Link>
                    </Dropdown.Item>
                </Dropdown.Group>

                <Divider.Root $type="line-spacing" />

                <Dropdown.Group>
                    <Dropdown.Item asChild>
                        <Link as="button" href={route("logout")} method="post">
                            <Dropdown.ItemIcon as={LogoutBoxRIcon} />
                            Logout
                        </Link>
                    </Dropdown.Item>
                </Dropdown.Group>
            </Dropdown.Content>
        </Dropdown.Root>
    );
}
