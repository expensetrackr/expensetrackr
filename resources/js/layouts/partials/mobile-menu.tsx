import { usePage } from "@inertiajs/react";
import * as DialogPrimitives from "@radix-ui/react-dialog";
import * as React from "react";
import ArrowRightSIcon from "virtual:icons/ri/arrow-right-s-line";
import CloseFillIcon from "virtual:icons/ri/close-fill";
import HeadphoneIcon from "virtual:icons/ri/headphone-line";
import Menu3FillIcon from "virtual:icons/ri/menu-3-line";
import Search2Icon from "virtual:icons/ri/search-2-line";
import Settings2Icon from "virtual:icons/ri/settings-2-line";

import { Link } from "#/components/link.tsx";
import { navigationLinks } from "#/components/sidebar.tsx";
import * as TopbarItemButton from "#/components/topbar-item-button.tsx";
import * as TabMenuHorizontal from "#/components/ui/tab-menu-horizontal.tsx";
import { UserButtonMobile } from "#/components/user-button.tsx";
import useBreakpoint from "#/hooks/use-breakpoint.ts";
import { cn } from "#/utils/cn.ts";

export function MobileMenu() {
    const { lg } = useBreakpoint();
    const [open, setOpen] = React.useState(false);
    const pathname = usePage().url;

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
                    <TopbarItemButton.Icon as={Menu3FillIcon} />
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
                                <Search2Icon className="absolute top-1/2 left-0 size-6 -translate-y-1/2 text-(--text-soft-400)" />
                                <input
                                    className="h-6 w-full pl-9 text-paragraph-md outline-none placeholder:text-(--text-sub-600) focus:outline-none"
                                    placeholder="Search..."
                                    type="text"
                                />
                            </div>
                            <div className="flex gap-3">
                                <div className="flex gap-1">
                                    <TopbarItemButton.Root>
                                        <TopbarItemButton.Icon as={HeadphoneIcon} />
                                    </TopbarItemButton.Root>
                                    <TopbarItemButton.Root>
                                        <TopbarItemButton.Icon as={Settings2Icon} />
                                    </TopbarItemButton.Root>
                                </div>
                                <div className="flex w-1 shrink-0 items-center before:h-full before:w-px before:bg-(--stroke-soft-200)" />
                                <DialogPrimitives.Close asChild>
                                    <TopbarItemButton.Root>
                                        <TopbarItemButton.Icon as={CloseFillIcon} />
                                    </TopbarItemButton.Root>
                                </DialogPrimitives.Close>
                            </div>
                        </div>
                        {/* <CompanySwitchMobile /> */}

                        <TabMenuHorizontal.Root className="flex flex-1 flex-col" defaultValue="main">
                            <TabMenuHorizontal.List className="gap-8 px-7">
                                <TabMenuHorizontal.Trigger className="flex-1 text-label-md" value="main">
                                    Main
                                </TabMenuHorizontal.Trigger>
                                <div className="flex h-6 w-1 shrink-0 items-center before:h-full before:w-px before:bg-(--stroke-soft-200)" />
                                <TabMenuHorizontal.Trigger className="flex-1 text-label-md" value="favorites">
                                    Favorites
                                </TabMenuHorizontal.Trigger>
                            </TabMenuHorizontal.List>

                            <div className="flex-1 py-6">
                                <TabMenuHorizontal.Content
                                    className="data-[state=active]:duration-300 data-[state=active]:animate-in data-[state=active]:fade-in-0"
                                    value="main"
                                >
                                    <div className="flex flex-col gap-5">
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
                                                <ArrowRightSIcon className="size-6 text-(--text-sub-600)" />
                                            </Link>
                                        ))}
                                    </div>
                                </TabMenuHorizontal.Content>
                                <TabMenuHorizontal.Content
                                    className="data-[state=active]:duration-300 data-[state=active]:animate-in data-[state=active]:fade-in-0"
                                    value="favorites"
                                >
                                    <div className="flex flex-col gap-5">
                                        {/* {favoriteLinks.map((project, i) => (
                        <Link
                          key={i}
                          href={project.href}
                          className={cn(
                            'group flex w-full items-center gap-2.5 whitespace-nowrap px-5 text-text-sub-600',
                          )}
                        >
                          <div className='flex size-[22px] shrink-0 items-center justify-center'>
                            <div className='size-3 scale-110 rounded-full border-2 border-stroke-white-0 shadow-regular-sm'>
                              <div
                                className={cn(
                                  'size-2 rounded-full',
                                  LABEL_COLORS[
                                    project.color as keyof typeof LABEL_COLORS
                                  ].bg,
                                )}
                              />
                            </div>
                          </div>
                          <div className='flex-1 text-label-md'>
                            {project.projectName}
                          </div>
                          <ArrowRightSIcon className='size-6 text-text-sub-600' />
                        </Link>
                      ))} */}
                                    </div>
                                </TabMenuHorizontal.Content>
                            </div>
                        </TabMenuHorizontal.Root>

                        <div className="grid border-y border-(--stroke-soft-200) p-4">{/* <MoveMoneyButton /> */}</div>

                        <div className="p-2">
                            <UserButtonMobile />
                        </div>
                    </DialogPrimitives.Content>
                </DialogPrimitives.Overlay>
            </DialogPrimitives.Portal>
        </DialogPrimitives.Root>
    );
}
