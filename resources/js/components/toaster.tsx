import { Toaster as Sonner, type ToasterProps as SonnerProps } from "sonner";
import Alert01SolidIcon from "virtual:icons/hugeicons/alert-01-solid";
import CancelCircleSolidIcon from "virtual:icons/hugeicons/cancel-circle-solid";
import CheckmarkCircle02SolidIcon from "virtual:icons/hugeicons/checkmark-circle-02-solid";
import InformationCircleSolidIcon from "virtual:icons/hugeicons/information-circle-solid";

import { cn } from "#/utils/cn.ts";

/**
 * Renders a customized toast notification system using the Sonner component with tailored icons and styles for different toast types.
 *
 * @remarks
 * Applies conditional styling based on the `richColors` mode and toast type using data attributes, enabling distinct visual themes for error, warning, success, and info toasts.
 */
export function Toaster(props: SonnerProps) {
    return (
        <Sonner
            className="toaster group [--width:390px]"
            icons={{
                error: (
                    <CancelCircleSolidIcon className="size-4 text-state-error-base group-data-[rich-colors=true]/toast:text-white lg:size-5" />
                ),
                warning: (
                    <Alert01SolidIcon className="size-4 text-state-warning-base group-data-[rich-colors=true]/toast:text-white lg:size-5" />
                ),
                success: (
                    <CheckmarkCircle02SolidIcon className="size-4 text-state-success-base group-data-[rich-colors=true]/toast:text-white lg:size-5" />
                ),
                info: (
                    <InformationCircleSolidIcon className="size-4 text-state-information-base group-data-[rich-colors=true]/toast:text-white lg:size-5" />
                ),
            }}
            richColors
            toastOptions={{
                unstyled: true,
                classNames: {
                    toast: cn(
                        "group/toast toast flex w-(--width) items-center",

                        //#region filled
                        "data-[rich-colors=true]:bg-state-faded-base data-[rich-colors=true]:text-white data-[rich-colors=true]:data-[type=error]:[--error-bg:var(--color-state-error-base)] data-[rich-colors=true]:data-[type=error]:[--error-text:var(--color-white)] data-[rich-colors=true]:data-[type=info]:[--info-bg:var(--color-state-information-base)] data-[rich-colors=true]:data-[type=info]:[--info-text:var(--color-white)] data-[rich-colors=true]:data-[type=success]:[--success-bg:var(--color-state-success-base)] data-[rich-colors=true]:data-[type=success]:[--success-text:var(--color-white)] data-[rich-colors=true]:data-[type=warning]:[--warning-bg:var(--color-state-warning-base)] data-[rich-colors=true]:data-[type=warning]:[--warning-text:var(--color-white)]",
                        //#endregion filled

                        //#region stroke
                        "data-[rich-colors=false]:bg-(--bg-white-0) data-[rich-colors=false]:shadow-md data-[rich-colors=false]:ring-1 data-[rich-colors=false]:ring-(--stroke-soft-200) data-[rich-colors=false]:ring-inset",
                        //#endregion stroke

                        "gap-2 rounded-8 px-2.5 py-2 lg:gap-3 lg:rounded-16 lg:p-3.5 lg:pb-4 [&_[data-content]]:flex [&_[data-content]]:flex-1 [&_[data-content]]:flex-col [&_[data-content]]:gap-1",
                    ),
                    icon: "",
                    title: "text-paragraph-xs lg:text-paragraph-sm",
                    description: "text-paragraph-xs lg:text-paragraph-sm",
                    actionButton: "",
                    cancelButton: "",
                },
            }}
            {...props}
        />
    );
}
