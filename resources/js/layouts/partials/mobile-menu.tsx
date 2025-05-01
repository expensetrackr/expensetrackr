import { usePage } from "@inertiajs/react";
import { Dialog as DialogPrimitives } from "radix-ui";
import * as React from "react";
import Add01Icon from "virtual:icons/hugeicons/add-01";
import ArrowRight01Icon from "virtual:icons/hugeicons/arrow-right-01";
import Cancel01Icon from "virtual:icons/hugeicons/cancel-01";
import HeadsetIcon from "virtual:icons/hugeicons/headset";
import Menu11Icon from "virtual:icons/hugeicons/menu-11";
import Search01Icon from "virtual:icons/hugeicons/search-01";
import Settings02Icon from "virtual:icons/hugeicons/settings-02";

import { Link } from "#/components/link.tsx";
import { navigationLinks } from "#/components/sidebar.tsx";
import * as TopbarItemButton from "#/components/topbar-item-button.tsx";
import * as Button from "#/components/ui/button.tsx";
import { UserButtonMobile } from "#/components/user-button.tsx";
import { useActionsParams } from "#/hooks/use-actions-params.ts";
import useBreakpoint from "#/hooks/use-breakpoint.ts";
import { useTranslation } from "#/hooks/use-translation.ts";
import { routes } from "#/routes.ts";
import { cn } from "#/utils/cn.ts";

export function MobileMenu() {
    const { lg } = useBreakpoint();
    const [open, setOpen] = React.useState(false);
    const pathname = usePage().url;
    const { t } = useTranslation();
    const actions = useActionsParams();

    React.useEffect(() => {
        setOpen(false);
    }, [pathname]);

    React.useEffect(() => {
        if (lg) setOpen(false);
    }, [lg]);

    return (
        <DialogPrimitives.Root onOpenChange={setOpen} open={open}>
            <DialogPrimitives.Trigger asChild>
                <TopbarItemButton.Root>
                    <TopbarItemButton.Icon as={Menu11Icon} />
                </TopbarItemButton.Root>
            </DialogPrimitives.Trigger>
            <DialogPrimitives.Portal>
                <DialogPrimitives.Overlay
                    className={cn(
                        "fixed inset-0 z-50 origin-top-right lg:hidden",
                        // animation
                        "data-[state=closed]:duration-200 data-[state=closed]:animate-out",
                    )}
                >
                    <DialogPrimitives.Content
                        className={cn(
                            "flex size-full origin-top-right flex-col overflow-auto bg-(--bg-white-0) focus:outline-none",
                            // animation
                            "data-[state=closed]:animate-out data-[state=open]:animate-in",
                            "data-[state=closed]:ease-out data-[state=open]:ease-out",
                            "data-[state=closed]:duration-200 data-[state=open]:duration-200",
                            "data-[state=closed]:slide-out-to-left-full data-[state=open]:slide-in-from-left-full",
                            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                        )}
                    >
                        <DialogPrimitives.Title className="sr-only">Mobile Menu</DialogPrimitives.Title>
                        <DialogPrimitives.Description className="sr-only">
                            This menu provides mobile navigation options, including access to main navigation links,
                            favorite projects, search, and user settings.
                        </DialogPrimitives.Description>

                        <div className="flex h-[60px] w-full shrink-0 items-center border-b border-(--stroke-soft-200) px-4">
                            <div className="relative flex-1">
                                <Search01Icon className="absolute top-1/2 left-0 size-6 -translate-y-1/2 text-(--text-soft-400)" />
                                <input
                                    className="h-6 w-full pl-9 text-paragraph-md outline-none placeholder:text-(--text-sub-600) focus:outline-none"
                                    placeholder="Search..."
                                    type="text"
                                />
                            </div>
                            <div className="flex gap-3">
                                <div className="flex gap-1">
                                    <TopbarItemButton.Root asChild>
                                        <Link
                                            href="mailto:support@expensetrackr.com"
                                            rel="noopener noreferrer"
                                            target="_blank"
                                        >
                                            <TopbarItemButton.Icon as={HeadsetIcon} />
                                        </Link>
                                    </TopbarItemButton.Root>
                                    <TopbarItemButton.Root asChild>
                                        <Link href={routes.settings.show.url()}>
                                            <TopbarItemButton.Icon as={Settings02Icon} />
                                        </Link>
                                    </TopbarItemButton.Root>
                                </div>
                                <div className="flex w-1 shrink-0 items-center before:h-full before:w-px before:bg-(--stroke-soft-200)" />
                                <DialogPrimitives.Close asChild>
                                    <TopbarItemButton.Root>
                                        <TopbarItemButton.Icon as={Cancel01Icon} />
                                    </TopbarItemButton.Root>
                                </DialogPrimitives.Close>
                            </div>
                        </div>
                        {/* <CompanySwitchMobile /> */}

                        <div className="flex flex-1 flex-col gap-5 py-6">
                            {navigationLinks.map(({ icon: Icon, label, href }, i) => (
                                <Link
                                    className={cn(
                                        "group relative flex w-full items-center gap-2.5 px-5 whitespace-nowrap text-(--text-sub-600)",
                                    )}
                                    href={href}
                                    key={i}
                                >
                                    <Icon
                                        className={cn(
                                            "size-[22px] shrink-0 text-(--text-sub-600) transition",
                                            "group-aria-[current=page]:text-primary",
                                        )}
                                    />
                                    <div className="flex-1 text-label-md">{label}</div>
                                    <div
                                        className={cn(
                                            "absolute top-1/2 left-0 h-5 w-1 origin-left -translate-y-1/2 rounded-r-full bg-primary transition",
                                            {
                                                "scale-0": pathname !== href,
                                            },
                                        )}
                                    />
                                    <ArrowRight01Icon className="size-6 text-(--text-sub-600)" />
                                </Link>
                            ))}
                        </div>

                        <div className="grid border-y border-(--stroke-soft-200) p-4">
                            <Button.Root
                                onClick={() => actions.setParams({ action: "create", resource: "transactions" })}
                            >
                                <Button.Icon as={Add01Icon} className="size-4" />
                                {t("dashboard.actions.createTransaction")}
                            </Button.Root>
                        </div>

                        <div className="p-2">
                            <UserButtonMobile />
                        </div>
                    </DialogPrimitives.Content>
                </DialogPrimitives.Overlay>
            </DialogPrimitives.Portal>
        </DialogPrimitives.Root>
    );
}
