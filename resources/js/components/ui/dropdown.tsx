import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import ArrowRightSIcon from "virtual:icons/ri/arrow-right-s-line";

import { cnMerge } from "#/utils/cn.ts";
import { type PolymorphicComponentProps } from "#/utils/polymorphic.ts";

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
const DropdownMenuSub = DropdownMenuPrimitive.Sub;
const DropdownMenuCheckboxItem = DropdownMenuPrimitive.CheckboxItem;
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;
const DropdownMenuRadioItem = DropdownMenuPrimitive.RadioItem;
const DropdownMenuSeparator = DropdownMenuPrimitive.Separator;
const DropdownMenuArrow = DropdownMenuPrimitive.Arrow;

function DropdownMenuContent({
    className,
    sideOffset = 8,
    ...rest
}: React.CustomComponentPropsWithRef<typeof DropdownMenuPrimitive.Content>) {
    return (
        <DropdownMenuPrimitive.Portal>
            <DropdownMenuPrimitive.Content
                className={cnMerge(
                    "z-50 w-[300px] overflow-hidden rounded-16 bg-(--bg-white-0) p-2 ring-1 shadow-md ring-(--stroke-soft-200) ring-inset",
                    "flex flex-col gap-1",
                    // origin
                    "data-[side=bottom]:origin-top data-[side=left]:origin-right data-[side=right]:origin-left data-[side=top]:origin-bottom",
                    // animation
                    "data-[state=open]:animate-in data-[state=open]:fade-in-0",
                    "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
                    "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                    "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                    className,
                )}
                sideOffset={sideOffset}
                {...rest}
            />
        </DropdownMenuPrimitive.Portal>
    );
}

function DropdownMenuItem({
    className,
    inset,
    ...rest
}: React.CustomComponentPropsWithRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
}) {
    return (
        <DropdownMenuPrimitive.Item
            className={cnMerge(
                // base
                "group/item relative cursor-pointer rounded-8 p-2 text-paragraph-sm text-(--text-strong-950) outline-none select-none",
                "flex items-center gap-2",
                "transition duration-200 ease-out",
                // hover
                "data-[highlighted]:bg-(--bg-weak-50)",
                // focus
                "focus:outline-none",
                // disabled
                "data-[disabled]:text-(--text-disabled-300)",
                inset && "pl-9",
                className,
            )}
            {...rest}
        />
    );
}

function DropdownItemIcon<T extends React.ElementType>({ className, as, ...rest }: PolymorphicComponentProps<T>) {
    const Component = as || "div";

    return (
        <Component
            className={cnMerge(
                // base
                "size-5 text-(--text-sub-600)",
                // disabled
                "group-has-[[data-disabled]]:text-(--text-disabled-300)",
                className,
            )}
            {...rest}
        />
    );
}

function DropdownMenuGroup({
    className,
    ...rest
}: React.CustomComponentPropsWithRef<typeof DropdownMenuPrimitive.Group>) {
    return <DropdownMenuPrimitive.Group className={cnMerge("flex flex-col gap-1", className)} {...rest} />;
}

function DropdownMenuLabel({
    className,
    ...rest
}: React.CustomComponentPropsWithRef<typeof DropdownMenuPrimitive.Label>) {
    return (
        <DropdownMenuPrimitive.Label
            className={cnMerge("px-2 py-1 text-subheading-xs text-(--text-soft-400) uppercase", className)}
            {...rest}
        />
    );
}

function DropdownMenuSubTrigger({
    className,
    inset,
    children,
    ...rest
}: React.CustomComponentPropsWithRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
}) {
    return (
        <DropdownMenuPrimitive.SubTrigger
            className={cnMerge(
                // base
                "group/item relative cursor-pointer rounded-8 p-2 text-paragraph-sm text-(--text-strong-950) outline-0 select-none",
                "flex items-center gap-2",
                "transition duration-200 ease-out",
                // hover
                "data-[highlighted]:bg-(--bg-weak-50)",
                // disabled
                "data-[disabled]:text-(--text-disabled-300)",
                inset && "pl-9",
                className,
            )}
            {...rest}
        >
            {children}
            <span className="flex-1" />
            <DropdownItemIcon as={ArrowRightSIcon} />
        </DropdownMenuPrimitive.SubTrigger>
    );
}

function DropdownMenuSubContent({
    className,
    ...rest
}: React.CustomComponentPropsWithRef<typeof DropdownMenuPrimitive.SubContent>) {
    return (
        <DropdownMenuPrimitive.SubContent
            className={cnMerge(
                "z-50 w-max overflow-hidden rounded-16 bg-(--bg-white-0) p-2 ring-1 shadow-md ring-(--stroke-soft-200) ring-inset",
                "flex flex-col gap-1",
                // animation
                "data-[state=open]:animate-in data-[state=open]:fade-in-0",
                "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
                "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                className,
            )}
            {...rest}
        />
    );
}

export {
    DropdownMenu as Root,
    DropdownMenuPortal as Portal,
    DropdownMenuTrigger as Trigger,
    DropdownMenuContent as Content,
    DropdownMenuItem as Item,
    DropdownItemIcon as ItemIcon,
    DropdownMenuGroup as Group,
    DropdownMenuLabel as Label,
    DropdownMenuSub as MenuSub,
    DropdownMenuSubTrigger as MenuSubTrigger,
    DropdownMenuSubContent as MenuSubContent,
    DropdownMenuCheckboxItem as CheckboxItem,
    DropdownMenuRadioGroup as RadioGroup,
    DropdownMenuRadioItem as RadioItem,
    DropdownMenuSeparator as Separator,
    DropdownMenuArrow as Arrow,
};
