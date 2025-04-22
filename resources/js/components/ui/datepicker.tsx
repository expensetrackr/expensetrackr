import { DayPicker } from "react-day-picker";
import ArrowLeft01Icon from "virtual:icons/hugeicons/arrow-left-01";
import ArrowRight01Icon from "virtual:icons/hugeicons/arrow-right-01";

import { cn } from "#/utils/cn.ts";
import { compactButtonVariants } from "./compact-button.tsx";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ classNames, showOutsideDays = true, ...rest }: CalendarProps) {
    return (
        <DayPicker
            classNames={{
                multiple_months: "",
                caption_start: "p-5",
                caption_end: "p-5",
                months: "flex divide-x divide-(--stroke-soft-200)",
                month: "space-y-2",
                caption: "flex justify-center items-center relative rounded-8 bg-(--bg-weak-50) h-9",
                caption_label: "text-label-sm text-(--text-sub-600) select-none",
                nav: "flex items-center",
                nav_button: compactButtonVariants({
                    $style: "white",
                    $size: "lg",
                }).root({ class: "absolute" }),
                nav_button_previous: "top-1/2 -translate-y-1/2 left-1.5",
                nav_button_next: "top-1/2 -translate-y-1/2 right-1.5",
                table: "w-full border-collapse",
                head_row: "flex gap-2",
                head_cell:
                    "text-(--text-soft-400) text-label-sm uppercase size-10 flex items-center justify-center text-center select-none",
                row: "grid grid-flow-col auto-cols-auto w-full mt-2 gap-2",
                cell: cn(
                    // base
                    "group/cell relative size-10 shrink-0 p-0 select-none",
                    // range
                    "[&:has(.day-range-middle)]:bg-brand-primary-alpha-10",
                    "first:[&:has([aria-selected])]:rounded-l-8 last:[&:has([aria-selected])]:rounded-r-8",
                    // first range el
                    "[&:not(:has(button))+:has(.day-range-middle)]:rounded-l-8",
                    // last range el
                    "[&:not(:has(+_*_button))]:rounded-r-8",
                    // hide before if next sibling not selected
                    "[&:nt(:has(+_*_[type=button]))]:before:hidden",
                    // merged bg
                    "before:absolute before:inset-y-0 before:-right-2 before:hidden before:w-2 before:bg-brand-primary-alpha-10",
                    "last:[&:has(.day-range-middle)]:before:hidden",
                    // middle
                    "[&:has(.day-range-middle)]:before:block",
                    // start
                    "[&:has(.day-range-start)]:before:block [&:has(.day-range-start)]:before:w-3",
                    // end
                    "[&:has(.day-range-end)]:before:right-auto [&:has(.day-range-end)]:before:left-0 [&:has(.day-range-end):not(:first-child)]:before:!block",
                ),
                day: cn(
                    // base
                    "flex size-10 shrink-0 items-center justify-center rounded-8 text-center text-label-sm text-(--text-sub-600) outline-none",
                    "transition duration-200 ease-out",
                    // hover
                    "hover:bg-(--bg-weak-50) hover:text-(--text-strong-950)",
                    // selected
                    "aria-[selected]:bg-primary aria-[selected]:text-white",
                    // focus visible
                    "focus:outline-none focus-visible:bg-(--bg-weak-50) focus-visible:text-(--text-strong-950)",
                ),
                day_range_start: "day-range-start",
                day_range_end: "day-range-end",
                day_selected: "day-selected",
                day_range_middle: "day-range-middle !text-primary !bg-transparent",
                day_today: "day-today",
                day_outside: "day-outside !text-(--text-disabled-300) aria-[selected]:!text-white",
                day_disabled: "day-disabled !text-(--text-disabled-300)",
                day_hidden: "invisible",
                ...classNames,
            }}
            components={{
                IconLeft: (props) => <ArrowLeft01Icon className="size-5" {...props} />,
                IconRight: (props) => <ArrowRight01Icon className="size-5" {...props} />,
            }}
            showOutsideDays={showOutsideDays}
            {...rest}
        />
    );
}

export { Calendar };
