import * as ScrollArea from "@radix-ui/react-scroll-area";
import * as React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import ArrowLeftRightIcon from "virtual:icons/hugeicons/arrow-left-right";
import ArrowRight01Icon from "virtual:icons/hugeicons/arrow-right-01";
import BankIcon from "virtual:icons/hugeicons/bank";
import Chart03Icon from "virtual:icons/hugeicons/chart-03";
import Clock03Icon from "virtual:icons/hugeicons/clock-03";
import Database01Icon from "virtual:icons/hugeicons/database-01";
import DatabaseSyncIcon from "virtual:icons/hugeicons/database-sync";
import Search01Icon from "virtual:icons/hugeicons/search-01";
import Target02Icon from "virtual:icons/hugeicons/target-02";
import TransactionIcon from "virtual:icons/hugeicons/transaction";
import UserMultiple02Icon from "virtual:icons/hugeicons/user-multiple-02";

import * as Badge from "#/components/ui/badge.tsx";
import * as CommandMenu from "#/components/ui/command-menu.tsx";
import * as CompactButton from "#/components/ui/compact-button.tsx";
import * as Kbd from "#/components/ui/kbd.tsx";
import { cn } from "#/utils/cn.ts";

const ScrollbarVertical = React.forwardRef<
    React.ComponentRef<typeof ScrollArea.ScrollAreaScrollbar>,
    React.ComponentPropsWithoutRef<typeof ScrollArea.ScrollAreaScrollbar>
>(({ className, ...rest }, ref) => {
    return (
        <ScrollArea.Scrollbar
            className={cn(
                "relative z-30 flex w-5 touch-none justify-center border-l border-(--stroke-soft-200) bg-(--bg-white-0) py-1.5 select-none",
                className,
            )}
            orientation="vertical"
            ref={ref}
            {...rest}
        >
            <ScrollArea.Thumb className="!w-1 shrink-0 rounded-full bg-(--stroke-soft-200)" />
        </ScrollArea.Scrollbar>
    );
});
ScrollbarVertical.displayName = "ScrollbarVertical";

export function AppCommandMenu() {
    const [open, setOpen] = React.useState(false);

    useHotkeys("meta+k", () => setOpen(true));

    const quickActions: {
        title: string;
        description: string;
        icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
        iconBgColor: string;
        iconColor: string;
    }[] = [
        {
            title: "Connect bank account",
            description: "Securely connect your bank account",
            icon: DatabaseSyncIcon,
            iconBgColor: "bg-state-information-lighter",
            iconColor: "text-state-information-base",
        },
        {
            title: "Create account",
            description: "Create your account manually",
            icon: Database01Icon,
            iconBgColor: "bg-state-feature-lighter",
            iconColor: "text-state-feature-base",
        },
        {
            title: "Create transaction",
            description: "Track your transactions easily",
            icon: TransactionIcon,
            iconBgColor: "bg-state-success-lighter",
            iconColor: "text-state-success-base",
        },
    ];

    const recentActivity: {
        title: string;
        amount: string;
        amountColor: "red" | "green" | "gray" | "blue" | "orange" | "yellow" | "purple" | "sky" | "pink" | "teal";
        time: string;
        icon: string | React.ComponentType<any>;
    }[] = [
        {
            title: "Netflix Subscription",
            amount: "$15.99",
            amountColor: "red",
            time: "2 hours ago",
            icon: "https://alignui.com/images/major-brands/netflix.svg",
        },
        {
            title: "Salary Deposit",
            amount: "$3,450.00",
            amountColor: "green",
            time: "1 day ago",
            icon: "https://alignui.com/images/major-brands/spotify.svg",
        },
        {
            title: "Investment Transfer",
            amount: "$500.00",
            amountColor: "gray",
            time: "2 days ago",
            icon: Chart03Icon,
        },
    ];

    const financialServices: {
        title: string;
        description: string;
        badge?: string;
        badgeColor?: "red" | "green" | "gray" | "blue" | "orange" | "yellow" | "purple" | "sky" | "pink" | "teal";
        icon: React.ComponentType<any>;
    }[] = [
        {
            title: "Wealth Management",
            description: "Investment portfolios & advisory",
            badge: "Premium",
            badgeColor: "purple",
            icon: BankIcon,
        },
        {
            title: "Savings Goals",
            description: "Set & track financial goals",
            icon: Target02Icon,
        },
        {
            title: "Cash Flow",
            description: "Income & expense analysis",
            icon: ArrowLeftRightIcon,
        },
        {
            title: "Joint Accounts",
            description: "Family & business accounts",
            icon: UserMultiple02Icon,
        },
        {
            title: "Loans",
            description: "Personal & business loans",
            icon: BankIcon,
        },
        {
            title: "Payroll",
            description: "Employee payroll & benefits",
            icon: BankIcon,
        },
    ];

    return (
        <CommandMenu.Dialog className="h-full max-h-[702px] w-full max-w-[632px]" onOpenChange={setOpen} open={open}>
            <CommandMenu.List className="rounded-12 bg-(--bg-white-0) shadow-lg">
                {/* Search Input */}
                <div className="group/cmd-input flex h-14 items-center gap-2 border-b border-(--stroke-soft-200) px-5">
                    <Search01Icon
                        className={cn(
                            "size-5 shrink-0 text-(--text-soft-400)",
                            "transition duration-200 ease-out",
                            // focus within
                            "group-focus-within/cmd-input:text-primary",
                        )}
                    />
                    <CommandMenu.Input placeholder="Search transactions, payments, or type a command..." />
                    <Kbd.Root className="hidden items-center justify-center text-(--text-soft-400) md:flex">
                        ⌘K
                    </Kbd.Root>
                </div>

                {/* Quick Actions */}
                <CommandMenu.Group className="border-b-0 p-0">
                    <div className="grid grid-cols-3 border-b border-(--stroke-soft-200)">
                        {quickActions.map((action, index) => (
                            <CommandMenu.Item
                                className={cn(
                                    "flex cursor-pointer flex-col items-center gap-3 rounded-none p-4 hover:bg-(--bg-weak-50) focus:bg-(--bg-weak-50)",
                                    index < quickActions.length - 1 && "border-r border-(--stroke-soft-200)",
                                )}
                                key={action.title}
                            >
                                <div
                                    className={cn(
                                        "flex size-8 items-center justify-center rounded-full p-1.5",
                                        action.iconBgColor,
                                    )}
                                >
                                    <action.icon className={cn("size-5", action.iconColor)} />
                                </div>
                                <div className="flex flex-col items-center gap-0.5 text-center">
                                    <div className="text-label-sm text-(--text-strong-950)">{action.title}</div>
                                    <div className="text-paragraph-xs text-(--text-sub-600)">{action.description}</div>
                                </div>
                            </CommandMenu.Item>
                        ))}
                    </div>
                </CommandMenu.Group>

                {/* Main Content */}
                <ScrollArea.Root className="h-[532px] pr-[20px]">
                    <ScrollArea.Viewport className="h-full w-full">
                        <>
                            {/* Recent Activity */}
                            <CommandMenu.Group
                                className="p-2.5 [&>[cmdk-group-heading]]:mb-0 [&>[cmdk-group-heading]]:p-0 [&>[cmdk-group-heading]]:px-2.5 [&>[cmdk-group-heading]]:py-2"
                                heading={
                                    <div className="flex items-center gap-1.5">
                                        <Clock03Icon className="size-5 text-(--text-soft-400)" />
                                        <span className="text-label-sm text-(--text-soft-400)">Recent activity</span>
                                    </div>
                                }
                            >
                                {recentActivity.map((item) => (
                                    <CommandMenu.Item
                                        className="group/cmd-item flex items-center gap-3 p-2.5 hover:bg-(--bg-weak-50)"
                                        key={item.title}
                                    >
                                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-(--bg-white-0) shadow-xs ring-1 ring-(--stroke-soft-200) ring-inset">
                                            {typeof item.icon === "string" ? (
                                                <img alt="" className="size-6" src={item.icon} />
                                            ) : (
                                                <item.icon className="size-5 text-(--text-sub-600)" />
                                            )}
                                        </div>
                                        <div className="flex flex-1 flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <div className="text-label-sm text-(--text-strong-950)">
                                                    {item.title}
                                                </div>
                                                <Badge.Root
                                                    $color={item.amountColor}
                                                    $size="md"
                                                    $style="lighter"
                                                    className="text-label-xs"
                                                >
                                                    {item.amount}
                                                </Badge.Root>
                                            </div>
                                            <div className="text-paragraph-xs text-(--text-sub-600)">{item.time}</div>
                                        </div>
                                        <CompactButton.Root
                                            $size="md"
                                            $style="white"
                                            className={cn(
                                                "opacity-0",
                                                "group-hover/cmd-item:opacity-100",
                                                "group-data-[highlighted=true]/cmd-item:opacity-100",
                                                "group-data-[selected=true]/cmd-item:opacity-100",
                                                "transition-opacity duration-200 ease-out",
                                            )}
                                        >
                                            <ArrowRight01Icon className="size-5 text-(--text-sub-600)" />
                                        </CompactButton.Root>
                                    </CommandMenu.Item>
                                ))}
                            </CommandMenu.Group>

                            {/* Financial Services */}
                            <CommandMenu.Group
                                className="p-2.5 [&>[cmdk-group-heading]]:mb-0 [&>[cmdk-group-heading]]:p-0 [&>[cmdk-group-heading]]:px-2.5 [&>[cmdk-group-heading]]:py-2"
                                heading={
                                    <div className="flex items-center gap-1.5">
                                        <BankIcon className="size-5 text-(--text-soft-400)" />
                                        <span className="text-label-sm text-(--text-soft-400)">Financial services</span>
                                    </div>
                                }
                            >
                                {financialServices.map((service) => (
                                    <CommandMenu.Item
                                        className="group/cmd-item flex items-center gap-3 p-2.5 hover:bg-(--bg-weak-50)"
                                        key={service.title}
                                    >
                                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-(--bg-white-0) shadow-xs ring-1 ring-(--stroke-soft-200) ring-inset">
                                            <service.icon className="size-5 text-(--text-sub-600)" />
                                        </div>
                                        <div className="flex flex-1 flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <div className="text-label-sm text-(--text-strong-950)">
                                                    {service.title}
                                                </div>
                                                {service.badge && (
                                                    <Badge.Root
                                                        $color={service.badgeColor}
                                                        $size="md"
                                                        $style="lighter"
                                                        className="text-label-xs"
                                                    >
                                                        {service.badge}
                                                    </Badge.Root>
                                                )}
                                            </div>
                                            <div className="text-paragraph-xs text-(--text-sub-600)">
                                                {service.description}
                                            </div>
                                        </div>
                                        <CompactButton.Root
                                            $size="md"
                                            $style="white"
                                            className={cn(
                                                "opacity-0",
                                                "group-hover/cmd-item:opacity-100",
                                                "group-data-[highlighted=true]/cmd-item:opacity-100",
                                                "group-data-[selected=true]/cmd-item:opacity-100",
                                                "transition-opacity duration-200 ease-out",
                                            )}
                                        >
                                            <ArrowRight01Icon className="size-5 text-(--text-sub-600)" />
                                        </CompactButton.Root>
                                    </CommandMenu.Item>
                                ))}
                            </CommandMenu.Group>
                        </>
                    </ScrollArea.Viewport>
                    <ScrollbarVertical />
                </ScrollArea.Root>
            </CommandMenu.List>
        </CommandMenu.Dialog>
    );
}
