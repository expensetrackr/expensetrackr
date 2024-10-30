import * as Headless from "@headlessui/react";

import { cx } from "#/utils/cva.ts";
import { twc } from "#/utils/twc.ts";
import { Button } from "./button.tsx";
import { Link } from "./link.tsx";

export function Dropdown(props: Headless.MenuProps) {
    return <Headless.Menu {...props} />;
}

export function DropdownButton<T extends React.ElementType = typeof Button>({
    as = Button,
    ...props
}: { className?: string } & Omit<Headless.MenuButtonProps<T>, "className">) {
    return <Headless.MenuButton as={as} {...props} />;
}

export function DropdownMenu({
    anchor = "bottom",
    className,
    ...props
}: { className?: string } & Omit<Headless.MenuItemsProps, "className">) {
    return (
        <Headless.Transition leave="duration-100 ease-in" leaveTo="opacity-0">
            <Headless.MenuItems
                {...props}
                transition
                anchor={anchor}
                className={cx(
                    // Anchor positioning
                    "[--anchor-gap:var(--spacing-2)] [--anchor-padding:var(--spacing-1)] data-[anchor~=end]:[--anchor-offset:6px] data-[anchor~=start]:[--anchor-offset:-6px] sm:data-[anchor~=end]:[--anchor-offset:4px] sm:data-[anchor~=start]:[--anchor-offset:-4px]",
                    // Base styles
                    "rounded-16 isolate flex w-max flex-col gap-1 p-2",
                    // Invisible border that is only visible in `forced-colors` mode for accessibility purposes
                    "outline outline-transparent focus:outline-none",
                    // Handle scrolling when menu won't fit in viewport
                    "overflow-y-auto",
                    // Popover background
                    "backdrop-blur-xl",
                    // Shadows
                    "ring-1 shadow-md ring-[var(--stroke-soft-200)]",
                    // Define grid at the menu level if subgrid is supported
                    "supports-[grid-template-columns:subgrid]:grid supports-[grid-template-columns:subgrid]:grid-cols-[auto_1fr_1.5rem_0.5rem_auto]",
                    // Transitions
                    "transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0",
                    // Put className last to allow overriding
                    className,
                )}
            />
        </Headless.Transition>
    );
}

const dropdownItemClasses = cx(
    // Base styles
    "group cursor-default rounded-8 p-2 transition focus:outline-none",
    // Text styles
    "text-left text-paragraph-sm forced-colors:text-[CanvasText]",
    // Focus
    "data-focus:bg-[var(--bg-weak-50)]",
    // Disabled state
    "data-disabled:opacity-50",
    // Forced colors mode
    "forced-color-adjust-none forced-colors:data-focus:bg-[Highlight] forced-colors:data-focus:text-[HighlightText] forced-colors:[&>[data-slot=icon]]:data-focus:text-[HighlightText]",
    // Use subgrid when available but fallback to an explicit grid layout if not
    "col-span-full grid grid-cols-[auto_1fr_1.5rem_0.5rem_auto] items-center supports-[grid-template-columns:subgrid]:grid-cols-subgrid",
    // Icons
    "[&>[data-slot=icon]]:-ml-0.5 [&>[data-slot=icon]]:col-start-1 [&>[data-slot=icon]]:row-start-1 [&>[data-slot=icon]]:mr-2.5 [&>[data-slot=icon]]:size-5 sm:[&>[data-slot=icon]]:mr-2",
    "[&>[data-slot=icon]]:text-[var(--icon-sub-600)]",
    // Avatar
    "[&>[data-slot=avatar]]:-ml-1 [&>[data-slot=avatar]]:mr-2.5 [&>[data-slot=avatar]]:size-6 sm:[&>[data-slot=avatar]]:mr-2 sm:[&>[data-slot=avatar]]:size-5",
);

export function DropdownItem({
    className,
    ...props
}: { className?: string } & (
    | Omit<Headless.MenuItemProps<typeof Link>, "className">
    | Omit<Headless.MenuItemProps<"button">, "className">
)) {
    return "href" in props ? (
        <Headless.MenuItem as={Link} {...props} className={cx(dropdownItemClasses, "cursor-pointer", className)} />
    ) : (
        <Headless.MenuItem as="button" type="button" {...props} className={cx(dropdownItemClasses, className)} />
    );
}

export const DropdownHeader = twc.div`col-span-5 px-3.5 pt-2.5 pb-1 sm:px-3`;

export const DropdownSection = twc(
    Headless.MenuSection,
)`col-span-full supports-[grid-template-columns:subgrid]:grid supports-[grid-template-columns:subgrid]:grid-cols-[auto_1fr_1.5rem_0.5rem_auto]`;

export const DropdownHeading = twc(
    Headless.MenuHeading,
)`col-span-full grid grid-cols-[1fr,auto] gap-x-12 px-2 py-1 text-subheading-xs uppercase text-[var(--text-soft-400)]`;

export const DropdownDivider = twc(
    Headless.MenuSeparator,
)`col-span-full my-[1.5px] h-px border-0 bg-[var(--stroke-soft-200)] forced-colors:bg-[CanvasText]`;

export const DropdownLabel = twc(Headless.Label).attrs({
    "data-slot": "label",
})`col-start-2 row-start-1`;

export const DropdownDescription = twc(Headless.Description).attrs({
    "data-slot": "description",
})`col-span-2 col-start-2 row-start-2 text-sm/5 text-zinc-500 dark:text-zinc-400 forced-colors:group-data-focus:text-[HighlightText] group-data-focus:text-white sm:text-xs/5`;

export function DropdownShortcut({
    keys,
    className,
    ...props
}: { keys: string | string[]; className?: string } & Omit<Headless.DescriptionProps<"kbd">, "className">) {
    return (
        <Headless.Description
            as="kbd"
            {...props}
            className={cx(className, "col-start-5 row-start-1 flex justify-self-end")}
        >
            {(Array.isArray(keys) ? keys : keys.split("")).map((char, index) => (
                <kbd
                    // biome-ignore lint/suspicious/noArrayIndexKey: it's safe to use the index as a key here
                    key={index}
                    className={cx([
                        "min-w-[2ch] text-center font-sans text-zinc-400 capitalize group-data-focus:text-white forced-colors:group-data-focus:text-[HighlightText]",
                        // Make sure key names that are longer than one character (like "Tab") have extra space
                        index > 0 && char.length > 1 && "pl-1",
                    ])}
                >
                    {char}
                </kbd>
            ))}
        </Headless.Description>
    );
}
