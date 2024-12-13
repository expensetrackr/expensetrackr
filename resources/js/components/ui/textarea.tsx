import * as React from "react";

import { cnMerge } from "#/utils/cn.ts";

const TEXTAREA_ROOT_NAME = "TextareaRoot";
const TEXTAREA_NAME = "Textarea";
const TEXTAREA_RESIZE_HANDLE_NAME = "TextareaResizeHandle";
const TEXTAREA_COUNTER_NAME = "TextareaCounter";

const Textarea = React.forwardRef<
    HTMLTextAreaElement,
    Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "children"> & {
        $error?: boolean;
        $simple?: boolean;
        children?: React.ReactNode;
    }
>(({ className, $error, $simple, disabled, ...rest }, forwardedRef) => {
    return (
        <textarea
            className={cnMerge(
                [
                    // base
                    "block w-full resize-none text-paragraph-sm text-(--text-strong-950) outline-none",
                    !$simple && ["pointer-events-auto h-full min-h-[82px] bg-transparent pt-2.5 pr-2.5 pl-3"],
                    $simple && [
                        "min-h-28 rounded-12 bg-(--bg-white-0) px-3 py-2.5 shadow-xs",
                        "ring-1 ring-(--stroke-soft-200) ring-inset",
                        "transition duration-200 ease-out",
                        // hover
                        "hover:[&:not(:focus)]:bg-(--bg-weak-50)",
                        !$error && [
                            // hover
                            "hover:[&:not(:focus)]:ring-transparent",
                            // focus
                            "focus:shadow-button-important-focus focus:ring-(--stroke-strong-950)",
                        ],
                        $error && [
                            // base
                            "ring-state-error-base",
                            // focus
                            "focus:shadow-button-error-focus focus:ring-state-error-base",
                        ],
                        disabled && ["bg-(--bg-weak-50) ring-transparent"],
                    ],
                    !disabled && [
                        // placeholder
                        "placeholder:text-(--text-soft-400) placeholder:transition placeholder:duration-200 placeholder:ease-out placeholder:select-none",
                        // hover placeholder
                        "group-hover/textarea:placeholder:text-(--text-sub-600)",
                        // focus
                        "focus:outline-none",
                        // focus placeholder
                        "focus:placeholder:text-(--text-sub-600)",
                    ],
                    disabled && [
                        // disabled
                        "text-(--text-disabled-300) placeholder:text-(--text-disabled-300)",
                    ],
                ],
                className,
            )}
            disabled={disabled}
            ref={forwardedRef}
            {...rest}
        />
    );
});
Textarea.displayName = TEXTAREA_NAME;

function ResizeHandle() {
    return (
        <div className="pointer-events-none size-3 cursor-s-resize">
            <svg fill="none" height="12" viewBox="0 0 12 12" width="12" xmlns="http://www.w3.org/2000/svg">
                <path className="stroke-(--text-soft-400)" d="M9.11111 2L2 9.11111M10 6.44444L6.44444 10" />
            </svg>
        </div>
    );
}
ResizeHandle.displayName = TEXTAREA_RESIZE_HANDLE_NAME;

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> &
    (
        | {
              $simple: true;
              children?: never;
              containerClassName?: never;
              $error?: boolean;
          }
        | {
              $simple?: false;
              children?: React.ReactNode;
              containerClassName?: string;
              $error?: boolean;
          }
    );

const TextareaRoot = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ containerClassName, children, $error, $simple, ...rest }, forwardedRef) => {
        if ($simple) {
            return <Textarea $error={$error} $simple ref={forwardedRef} {...rest} />;
        }

        return (
            <div
                className={cnMerge(
                    [
                        // base
                        "group/textarea relative flex w-full flex-col rounded-12 bg-(--bg-white-0) pb-2.5 shadow-xs",
                        "ring-1 ring-(--stroke-soft-200) ring-inset",
                        "transition duration-200 ease-out",
                        // hover
                        "hover:[&:not(:focus-within)]:bg-(--bg-weak-50)",
                        // disabled
                        "has-[[disabled]]:pointer-events-none has-[[disabled]]:bg-(--bg-weak-50) has-[[disabled]]:ring-transparent",
                    ],
                    !$error && [
                        // hover
                        "hover:[&:not(:focus-within)]:ring-transparent",
                        // focus
                        "focus-within:shadow-button-important-focus focus-within:ring-(--stroke-strong-950)",
                    ],
                    $error && [
                        // base
                        "ring-state-error-base",
                        // focus
                        "focus-within:shadow-button-error-focus focus-within:ring-state-error-base",
                    ],
                    containerClassName,
                )}
            >
                <div className="grid">
                    <div className="pointer-events-none relative z-10 flex flex-col gap-2 [grid-area:1/1]">
                        <Textarea $error={$error} ref={forwardedRef} {...rest} />
                        <div className="pointer-events-none flex items-center justify-end gap-1.5 pr-2.5 pl-3">
                            {children}
                            <ResizeHandle />
                        </div>
                    </div>
                    <div className="min-h-full resize-y overflow-hidden opacity-0 [grid-area:1/1]" />
                </div>
            </div>
        );
    },
);
TextareaRoot.displayName = TEXTAREA_ROOT_NAME;

function CharCounter({
    current,
    max,
    className,
}: {
    current?: number;
    max?: number;
} & React.HTMLAttributes<HTMLSpanElement>) {
    if (current === undefined || max === undefined) return null;

    const isError = current > max;

    return (
        <span
            className={cnMerge(
                "text-subheading-2xs text-(--text-soft-400)",
                // disabled
                "group-has-[[disabled]]/textarea:text-(--text-disabled-300)",
                {
                    "text-state-error-base": isError,
                },
                className,
            )}
        >
            {current}/{max}
        </span>
    );
}
CharCounter.displayName = TEXTAREA_COUNTER_NAME;

export { TextareaRoot as Root, CharCounter };
