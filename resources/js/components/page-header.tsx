import Search01Icon from "virtual:icons/hugeicons/search-01";

import { useCommandMenuStore } from "#/store/command-menu.ts";
import { cn } from "#/utils/cn.ts";
import * as TopbarItemButton from "./topbar-item-button.tsx";

export function Header({
    children,
    className,
    icon,
    title,
    description,
    contentClassName,
    ...rest
}: React.HTMLAttributes<HTMLDivElement> & {
    icon?: React.ReactNode;
    title?: string;
    description?: string;
    contentClassName?: string;
}) {
    const { toggleOpen } = useCommandMenuStore();

    return (
        <header
            className={cn(
                "flex min-h-[88px] flex-col gap-4 px-4 py-5 md:flex-row md:items-center md:justify-between md:gap-3 lg:px-8",
                className,
            )}
            {...rest}
        >
            <div className="flex flex-1 gap-4 lg:gap-3.5">
                {icon}
                <div className="space-y-1">
                    <div className="text-label-md lg:text-label-lg">{title}</div>
                    <div className="text-paragraph-sm text-(--text-sub-600)">{description}</div>
                </div>
            </div>
            <div className={cn("flex items-center gap-3", contentClassName)}>
                <TopbarItemButton.Root className="hidden lg:flex" onClick={() => toggleOpen()}>
                    <TopbarItemButton.Icon as={Search01Icon} />
                </TopbarItemButton.Root>

                {children}
            </div>
        </header>
    );
}
