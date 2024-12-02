import * as Headless from "@headlessui/react";
import { type VariantProps } from "cva";
import { Fragment } from "react";
import ArrowDownSIcon from "virtual:icons/ri/arrow-down-s-line";
import CheckIcon from "virtual:icons/ri/check-line";

import { cva, cx } from "#/utils/cva.ts";

export const listboxVariants = cva({
    base: [
        // Basic layout
        "relative block w-full appearance-none transition",
        // Typography
        "text-left text-paragraph-sm forced-colors:text-[CanvasText]",
        // Border
        "border border-(--stroke-soft-200) group-data-active:border-(--stroke-strong-950) group-data-focus:border-(--stroke-strong-950) group-data-hover:border-(--bg-weak-50)",
        // Background color
        "bg-(--bg-white-0) group-data-hover:bg-(--bg-weak-50)",
        // Invalid state
        "group-data-invalid:border-state-error-base",
        // Disabled state
        "group-data-disabled:bg-(--bg-weak-50) group-data-disabled:text-(--text-disabled-300)",
    ],
    variants: {
        $size: {
            xs: "h-8 rounded-8 px-1.5 py-[calc(var(--spacing)*1.5-1px)]",
            sm: "h-9 rounded-8 px-2 py-[calc(var(--spacing)*2-1px)]",
            md: "h-10 rounded-10 px-2.5 py-[calc(var(--spacing)*2.5-1px)]",
        },
    },
    defaultVariants: {
        $size: "md",
    },
});

type ListboxProps<T> = {
    className?: string;
    placeholder?: React.ReactNode;
    autoFocus?: boolean;
    "aria-label"?: string;
    children?: React.ReactNode;
} & Omit<Headless.ListboxProps<typeof Fragment, T>, "as" | "multiple"> &
    VariantProps<typeof listboxVariants>;

export function Listbox<T>({
    $size = "md",
    className,
    placeholder,
    autoFocus,
    "aria-label": ariaLabel,
    children: options,
    ...props
}: ListboxProps<T>) {
    return (
        <Headless.Listbox {...props} multiple={false}>
            <Headless.ListboxButton
                aria-label={ariaLabel}
                autoFocus={autoFocus}
                className={cx([
                    // Basic layout
                    "group relative block w-full transition before:transition after:transition",
                    // Background color + shadow applied to inset pseudo element, so shadow blends with border in light mode
                    "before:absolute before:inset-px before:bg-(--bg-white-0) before:shadow",
                    ($size === "xs" || $size === "sm") && "before:rounded-[calc(var(--radius-8)-1px)]",
                    $size === "md" && "before:rounded-[calc(var(--radius-10)-1px)]",
                    // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
                    "dark:before:hidden",
                    // Hide default focus styles
                    "focus:outline-none",
                    // Focus ring
                    "after:pointer-events-none after:absolute after:inset-0 after:outline after:outline-transparent data-focus:after:outline-2 data-focus:after:outline-offset-2 data-focus:after:outline-neutral-alpha-16",
                    ($size === "xs" || $size === "sm") && "after:rounded-8",
                    $size === "md" && "after:rounded-10",
                    // Disabled state
                    "data-disabled:opacity-50 data-disabled:before:bg-(--bg-weak-50) data-disabled:before:shadow-none",
                    // Invalid state
                    "data-invalid:before:border-state-error-base",
                    className,
                ])}
                data-slot="control"
            >
                <Headless.ListboxSelectedOption
                    as="span"
                    className={listboxVariants({ $size })}
                    options={options}
                    placeholder={
                        placeholder && (
                            <span className="block truncate text-(--text-soft-400) transition-colors group-data-focus:text-(--text-strong-950) group-data-hover:text-(--text-sub-600)">
                                {placeholder}
                            </span>
                        )
                    }
                />

                <span
                    className={cx(
                        "pointer-events-none absolute inset-y-0 right-0 flex items-center",
                        $size === "xs" && "pr-1.5",
                        $size === "sm" && "pr-2",
                        $size === "md" && "pr-2.5",
                    )}
                >
                    <ArrowDownSIcon className="size-5 text-paragraph-sm text-(--icon-sub-600) forced-colors:stroke-[CanvasText]" />
                </span>
            </Headless.ListboxButton>

            <Headless.ListboxOptions
                anchor="selection start"
                className={cx(
                    // Anchor positioning
                    "[--anchor-offset:0rem] [--anchor-padding:0]",
                    // Base styles
                    "isolate w-max min-w-[calc(var(--button-width))] scroll-py-1 p-1 select-none",
                    ($size === "xs" || $size === "sm") && "rounded-8",
                    $size === "md" && "rounded-10",
                    // Invisible border that is only visible in `forced-colors` mode for accessibility purposes
                    "outline outline-transparent focus:outline-none",
                    // Handle scrolling when menu won't fit in viewport
                    "overflow-y-scroll overscroll-contain",
                    // Popover background
                    "bg-(--bg-white-0)/85 backdrop-blur-lg",
                    // Shadows
                    "ring-1 shadow-md ring-(--stroke-soft-200)",
                    // Transitions
                    "transition-opacity duration-100 ease-in data-closed:data-leave:opacity-0 data-transition:pointer-events-none",
                )}
                transition
            >
                {options}
            </Headless.ListboxOptions>
        </Headless.Listbox>
    );
}

export function ListboxOption<T>({
    children,
    className,
    ...props
}: { className?: string; children?: React.ReactNode } & Omit<
    Headless.ListboxOptionProps<"div", T>,
    "as" | "className"
>) {
    let sharedClasses = cx(
        // Base
        "flex min-w-0 items-center",
        // Icons
        "[&>[data-slot=icon]]:size-5 [&>[data-slot=icon]]:shrink-0 sm:[&>[data-slot=icon]]:size-4",
        "[&>[data-slot=icon]]:text-zinc-500 [&>[data-slot=icon]]:dark:text-zinc-400 [&>[data-slot=icon]]:group-data-focus/option:text-white",
        "forced-colors:[&>[data-slot=icon]]:text-[CanvasText] forced-colors:[&>[data-slot=icon]]:group-data-focus/option:text-[Canvas]",
        // Avatars
        "[&>[data-slot=avatar]]:-mx-0.5 [&>[data-slot=avatar]]:size-6 sm:[&>[data-slot=avatar]]:size-5",
    );

    return (
        <Headless.ListboxOption as={Fragment} {...props}>
            {({ selectedOption }) => {
                if (selectedOption) {
                    return <div className={cx(className, sharedClasses)}>{children}</div>;
                }

                return (
                    <div
                        className={cx(
                            // Basic layout
                            "group/option flex cursor-default items-baseline justify-between gap-x-2 rounded-8 p-2",
                            // Typography
                            "text-paragraph-sm forced-colors:text-[CanvasText]",
                            // Focus
                            "outline-none data-focus:bg-(--bg-weak-50)",
                            // Forced colors mode
                            "forced-color-adjust-none forced-colors:data-focus:bg-[Highlight] forced-colors:data-focus:text-[HighlightText]",
                            // Disabled
                            "data-disabled:opacity-50",
                        )}
                    >
                        <span className={cx(className, sharedClasses)}>{children}</span>
                        <CheckIcon className="relative hidden size-5 self-center text-(--icon-sub-600) group-data-selected/option:inline" />
                    </div>
                );
            }}
        </Headless.ListboxOption>
    );
}

export function ListboxLabel({ className, ...props }: React.ComponentPropsWithoutRef<"span">) {
    return <span {...props} className={cx(className, "ml-5 truncate text-paragraph-sm first:ml-0")} />;
}

export function ListboxDescription({ className, children, ...props }: React.ComponentPropsWithoutRef<"span">) {
    return (
        <span
            {...props}
            className={cx(
                className,
                "flex flex-1 overflow-hidden text-paragraph-xs text-(--text-soft-400) group-data-focus/option:text-(--text-strong-950) before:w-2 before:min-w-0 before:shrink",
            )}
        >
            <span className="flex-1 truncate">{children}</span>
        </span>
    );
}
