import { usePage } from "@inertiajs/react";
import * as React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import ArrowRight01Icon from "virtual:icons/hugeicons/arrow-right-01";
import DashboardSquare02Icon from "virtual:icons/hugeicons/dashboard-square-02";
import DashboardSquare02SolidIcon from "virtual:icons/hugeicons/dashboard-square-02-solid";
import Settings02Icon from "virtual:icons/hugeicons/settings-02";
import Settings02SolidIcon from "virtual:icons/hugeicons/settings-02-solid";
import TransactionHistoryIcon from "virtual:icons/hugeicons/transaction-history";
import TransactionHistorySolidIcon from "virtual:icons/hugeicons/transaction-history-solid";
import Wallet05Icon from "virtual:icons/hugeicons/wallet-05";
import Wallet05SolidIcon from "virtual:icons/hugeicons/wallet-05-solid";

import { routes } from "#/routes.ts";
import { cn } from "#/utils/cn.ts";
import { Link } from "./link.tsx";
import * as Divider from "./ui/divider.tsx";
import { UserButton } from "./user-button.tsx";
import { WorkspaceSwitch } from "./workspace-switch.tsx";

type NavigationLink = {
    icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
    activeIcon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
    label: string;
    href: string;
    disabled?: boolean;
};

export const navigationLinks: Array<NavigationLink> = [
    {
        icon: DashboardSquare02Icon,
        activeIcon: DashboardSquare02SolidIcon,
        label: "Dashboard",
        href: routes.dashboard.url(),
    },
    {
        icon: Wallet05Icon,
        activeIcon: Wallet05SolidIcon,
        label: "Accounts",
        href: routes.accounts.index.url(),
    },
    {
        icon: TransactionHistoryIcon,
        activeIcon: TransactionHistorySolidIcon,
        label: "Transactions",
        href: routes.transactions.index.url(),
    },
];

function useCollapsedState({ defaultCollapsed = false }: { defaultCollapsed?: boolean }): {
    collapsed: boolean;
    sidebarRef: React.RefObject<HTMLDivElement | null>;
} {
    const [collapsed, setCollapsed] = React.useState(defaultCollapsed);
    const sidebarRef = React.useRef<HTMLDivElement>(null);

    useHotkeys(["ctrl+b", "meta+b"], () => setCollapsed((prev) => !prev), { preventDefault: true }, [collapsed]);

    React.useEffect(() => {
        if (!sidebarRef.current) return;

        const elementsToHide = sidebarRef.current.querySelectorAll("[data-hide-collapsed]");

        const listeners: { el: Element; listener: EventListener }[] = [];

        elementsToHide.forEach((el) => {
            const hideListener = () => {
                el.classList.add("hidden");
                el.classList.remove("transition", "duration-300");
            };

            const showListener = () => {
                el.classList.remove("transition", "duration-300");
            };

            if (collapsed) {
                el.classList.add("opacity-0", "transition", "duration-300");
                el.addEventListener("transitionend", hideListener, { once: true });
                listeners.push({ el, listener: hideListener });
            } else {
                el.classList.add("transition", "duration-300");
                el.classList.remove("hidden");
                setTimeout(() => {
                    el.classList.remove("opacity-0");
                }, 1);
                el.addEventListener("transitionend", showListener, { once: true });
                listeners.push({ el, listener: showListener });
            }
        });

        return () => {
            listeners.forEach(({ el, listener }) => {
                el.removeEventListener("transitionend", listener);
            });
        };
    }, [collapsed]);

    return { collapsed, sidebarRef };
}

export function SidebarHeader({ collapsed }: { collapsed?: boolean }) {
    return (
        <div
            className={cn("lg:p-3", {
                "lg:px-2": collapsed,
            })}
        >
            <WorkspaceSwitch
                className={cn("transition-all-default", {
                    "w-16": collapsed,
                })}
            />
        </div>
    );
}

function NavigationMenu({ collapsed }: { collapsed: boolean }) {
    const url = usePage().url;

    return (
        <div className="space-y-2">
            <div
                className={cn("p-1 text-subheading-xs text-(--text-soft-400) uppercase", {
                    "-mx-2.5 w-14 px-0 text-center": collapsed,
                })}
            >
                Main
            </div>
            <div className="space-y-1">
                {navigationLinks.map(({ icon: Icon, activeIcon: ActiveIcon, label, href, disabled }, i) => (
                    <Link
                        aria-disabled={disabled}
                        className={cn(
                            "group relative flex items-center gap-2 rounded-8 py-2 whitespace-nowrap text-(--text-sub-600) hover:bg-(--bg-weak-50)",
                            "transition",
                            "aria-[current=page]:bg-(--bg-weak-50)",
                            "aria-disabled:pointer-events-none aria-disabled:opacity-50",
                            {
                                "w-9 px-2": collapsed,
                                "w-full px-3": !collapsed,
                            },
                        )}
                        href={href}
                        key={i}
                        prefetch
                    >
                        <div
                            className={cn(
                                "absolute top-1/2 h-5 w-1 origin-left -translate-y-1/2 scale-0 rounded-r-full bg-primary transition group-aria-[current=page]:scale-100",
                                collapsed ? "-left-[22px]" : "-left-5",
                            )}
                        />
                        {url.includes(href) ? (
                            <ActiveIcon
                                className={cn(
                                    "hidden size-5 shrink-0 text-(--text-sub-600) transition group-aria-[current=page]:block",
                                    "group-aria-[current=page]:text-primary",
                                )}
                            />
                        ) : (
                            <Icon
                                className={cn(
                                    "block size-5 shrink-0 text-(--text-sub-600) transition group-aria-[current=page]:hidden",
                                    "group-aria-[current=page]:text-primary",
                                )}
                            />
                        )}

                        <div className="flex w-[180px] shrink-0 items-center gap-2" data-hide-collapsed>
                            <div className="flex-1 text-label-sm">{label}</div>
                            {url.includes(href) && <ArrowRight01Icon className="size-5 text-(--text-sub-600)" />}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

function SettingsAndSupport({ collapsed }: { collapsed: boolean }) {
    const url = usePage().url;

    const links = [
        {
            href: "/settings",
            icon: Settings02Icon,
            activeIcon: Settings02SolidIcon,
            label: "Settings",
        },
    ];

    return (
        <div className="space-y-2">
            <div
                className={cn("p-1 text-subheading-xs text-(--text-soft-400) uppercase", {
                    "-mx-2.5 w-14 px-0 text-center": collapsed,
                })}
            >
                Others
            </div>
            <div className="space-y-1">
                {links.map(({ icon: Icon, activeIcon: ActiveIcon, label, href }, i) => {
                    const isActivePage = url.includes(href) || url.includes("/workspaces/ws_");

                    return (
                        <Link
                            aria-current={isActivePage ? "page" : undefined}
                            className={cn(
                                "group relative flex items-center gap-2 rounded-8 py-2 whitespace-nowrap text-(--text-sub-600) hover:bg-(--bg-weak-50)",
                                "transition",
                                "aria-[current=page]:bg-(--bg-weak-50)",
                                "aria-disabled:pointer-events-none aria-disabled:opacity-50",
                                {
                                    "w-9 px-2": collapsed,
                                    "w-full px-3": !collapsed,
                                },
                            )}
                            href={href}
                            key={i}
                        >
                            <div
                                className={cn(
                                    "absolute top-1/2 h-5 w-1 origin-left -translate-y-1/2 rounded-r-full bg-primary transition",
                                    {
                                        "-left-[22px]": collapsed,
                                        "-left-5": !collapsed,
                                        "scale-100": isActivePage,
                                        "scale-0": !isActivePage,
                                    },
                                )}
                            />
                            {isActivePage ? (
                                <ActiveIcon
                                    className={cn(
                                        "size-5 shrink-0 text-(--text-sub-600) transition",
                                        "group-aria-[current=page]:text-primary",
                                    )}
                                />
                            ) : (
                                <Icon
                                    className={cn(
                                        "size-5 shrink-0 text-(--text-sub-600) transition",
                                        "group-aria-[current=page]:text-primary",
                                    )}
                                />
                            )}
                            <div className="flex w-[180px] shrink-0 items-center gap-2" data-hide-collapsed>
                                <div className="flex-1 text-label-sm">{label}</div>
                                {isActivePage && <ArrowRight01Icon className="size-5 text-(--text-sub-600)" />}
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

function UserProfile({ collapsed }: { collapsed: boolean }) {
    return (
        <div
            className={cn("p-3", {
                "px-2": collapsed,
            })}
        >
            <UserButton
                className={cn("transition-all", {
                    "w-auto": collapsed,
                })}
            />
        </div>
    );
}

function SidebarDivider({ collapsed }: { collapsed: boolean }) {
    return (
        <div className="px-5">
            <Divider.Root
                className={cn("transition-all", {
                    "w-10": collapsed,
                })}
            />
        </div>
    );
}

export function Sidebar({ defaultCollapsed = false }: { defaultCollapsed?: boolean }) {
    const { collapsed, sidebarRef } = useCollapsedState({ defaultCollapsed });

    return (
        <>
            <div
                className={cn(
                    "fixed top-0 left-0 z-40 hidden h-full overflow-hidden border-r border-(--stroke-soft-200) bg-(--bg-white-0) transition-all duration-300 lg:block",
                    {
                        "w-20": collapsed,
                        "w-[272px]": !collapsed,
                        "[&_[data-hide-collapsed]]:hidden": !collapsed ? false : defaultCollapsed,
                    },
                )}
            >
                <div className="flex h-full w-[272px] min-w-[272px] flex-col overflow-auto" ref={sidebarRef}>
                    <SidebarHeader collapsed={collapsed} />

                    <SidebarDivider collapsed={collapsed} />

                    <div
                        className={cn("flex flex-1 flex-col gap-5 pt-5 pb-4", {
                            "px-[22px]": collapsed,
                            "px-5": !collapsed,
                        })}
                    >
                        <NavigationMenu collapsed={collapsed} />
                        <SettingsAndSupport collapsed={collapsed} />
                    </div>

                    <SidebarDivider collapsed={collapsed} />

                    <UserProfile collapsed={collapsed} />
                </div>
            </div>

            {/* a necessary placeholder because of sidebar is fixed */}
            <div
                className={cn("shrink-0", {
                    "w-[272px]": !collapsed,
                    "w-20": collapsed,
                })}
            />
        </>
    );
}
