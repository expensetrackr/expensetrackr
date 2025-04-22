import Notification3Icon from "virtual:icons/hugeicons/notification-03";

import { cn } from "#/utils/cn.ts";
import * as TopbarItemButton from "../topbar-item-button.tsx";
import * as Divider from "../ui/divider.tsx";
import * as LinkButton from "../ui/link-button.tsx";
import * as Popover from "../ui/popover.tsx";

export function BentoNotifications({ className, ...props }: React.ComponentPropsWithRef<"div">) {
    return (
        <div className={cn("flex size-full flex-col items-center justify-center gap-1", className)} {...props}>
            <div className="mb-5 flex size-full flex-col items-center justify-center gap-2">
                <Popover.Root>
                    <Popover.Trigger asChild>
                        <TopbarItemButton.Root className="size-12" hasNotification>
                            <TopbarItemButton.Icon as={Notification3Icon} className="size-6" />
                        </TopbarItemButton.Root>
                    </Popover.Trigger>

                    <Popover.Content
                        className="pointer-events-none w-screen max-w-2xs rounded-20 p-0 shadow-none"
                        showArrow={false}
                    >
                        <div className="flex h-14 items-center justify-between px-5">
                            <span className="text-label-sm text-(--text-strong-950)">Notifications</span>
                            <LinkButton.Root $size="sm" $style="primary">
                                Mark all as read
                            </LinkButton.Root>
                        </div>

                        <Divider.Root />

                        <div className="flex flex-col gap-5 p-5">
                            <p className="text-center text-label-sm text-(--text-sub-600)">I was wrong 😝</p>
                        </div>
                    </Popover.Content>
                </Popover.Root>

                <p className="text-center text-label-sm text-(--text-sub-600)">I think you have 10 notifications</p>
                <p className="text-center text-label-xs text-(--text-soft-400)">
                    Try to click the bell icon to see notifications
                </p>
            </div>
        </div>
    );
}
