import * as ScrollArea from "@radix-ui/react-scroll-area";
import * as React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import Cancel01Icon from "virtual:icons/hugeicons/cancel-01";
import Search01Icon from "virtual:icons/hugeicons/search-01";
import SparklesIcon from "virtual:icons/hugeicons/sparkles";

import * as CommandMenu from "#/components/ui/command-menu.tsx";
import * as CompactButton from "#/components/ui/compact-button.tsx";
import { AccountTypeEnum } from "#/schemas/account.ts";
import { cn } from "#/utils/cn.ts";
import { accountTypeColors, AccountTypeIcon } from "../account-type-icon.tsx";

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

    return (
        <CommandMenu.Dialog onOpenChange={setOpen} open={open}>
            {/* Input wrapper */}
            <div className="group/cmd-input flex h-12 w-full items-center gap-2 bg-(--bg-white-0) px-5">
                <Search01Icon
                    className={cn(
                        "size-5 shrink-0 text-(--text-soft-400)",
                        "transition duration-200 ease-out",
                        // focus within
                        "group-focus-within/cmd-input:text-primary",
                    )}
                />
                <CommandMenu.Input placeholder="Search or jump to" />
                <CompactButton.Root $size="md" $style="ghost" onClick={() => setOpen(false)}>
                    <CompactButton.Icon as={Cancel01Icon} />
                </CompactButton.Root>
            </div>

            {/* Smart Prompt Examples */}
            <CommandMenu.List>
                <CommandMenu.Group heading="Quick Actions">
                    <CommandMenu.Item>
                        <CommandMenu.ItemIcon as={SparklesIcon} />
                        Connect your bank account
                    </CommandMenu.Item>
                    <CommandMenu.Item>
                        <CommandMenu.ItemIcon as={SparklesIcon} />
                        Create a transaction
                    </CommandMenu.Item>
                </CommandMenu.Group>

                <CommandMenu.Group heading="Manually create an account">
                    {AccountTypeEnum.options.map((option) => (
                        <CommandMenu.Item key={option}>
                            <CommandMenu.ItemIcon
                                accountType={option}
                                as={AccountTypeIcon}
                                className="text-(--color-account-type)"
                                style={{ "--color-account-type": accountTypeColors[option] }}
                            />
                            {option}
                        </CommandMenu.Item>
                    ))}
                </CommandMenu.Group>
            </CommandMenu.List>
        </CommandMenu.Dialog>
    );
}
