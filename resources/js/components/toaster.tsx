import { Toaster as Sonner, type ToasterProps as SonnerProps } from "sonner";
import Alert01SolidIcon from "virtual:icons/hugeicons/alert-01-solid";
import CancelCircleSolidIcon from "virtual:icons/hugeicons/cancel-circle-solid";
import CheckmarkCircle02SolidIcon from "virtual:icons/hugeicons/checkmark-circle-02-solid";
import InformationCircleSolidIcon from "virtual:icons/hugeicons/information-circle-solid";

import { cn } from "#/utils/cn.ts";

export function Toaster(props: SonnerProps) {
    return (
        <Sonner
            className="toaster group [--width:390px]"
            icons={{
                error: (
                    <CancelCircleSolidIcon className="size-4 text-state-error-base group-[.filled]/toast:text-white lg:size-5" />
                ),
                warning: (
                    <Alert01SolidIcon className="size-4 text-state-warning-base group-[.filled]/toast:text-white lg:size-5" />
                ),
                success: (
                    <CheckmarkCircle02SolidIcon className="size-4 text-state-success-base group-[.filled]/toast:text-white lg:size-5" />
                ),
                info: (
                    <InformationCircleSolidIcon className="size-4 text-state-information-base group-[.filled]/toast:text-white lg:size-5" />
                ),
            }}
            toastOptions={{
                unstyled: true,
                classNames: {
                    toast: cn(
                        "group/toast toast flex w-(--width) items-center",

                        //#region filled
                        "[.filled]:bg-state-faded-base [.filled]:text-white [.filled]:data-[type=error]:bg-state-error-base [.filled]:data-[type=info]:bg-state-information-base [.filled]:data-[type=success]:bg-state-success-base [.filled]:data-[type=warning]:bg-state-warning-base",
                        //#endregion filled

                        //#region stroke
                        "[.stroke]:bg-(--bg-white-0) [.stroke]:shadow-md [.stroke]:ring-1 [.stroke]:ring-(--stroke-soft-200) [.stroke]:ring-inset",
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
