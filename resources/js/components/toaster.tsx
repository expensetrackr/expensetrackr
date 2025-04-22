import { Toaster as Sonner, type ToasterProps as SonnerProps } from "sonner";
import Alert01SolidIcon from "virtual:icons/hugeicons/alert-01-solid";
import CancelCircleSolidIcon from "virtual:icons/hugeicons/cancel-circle-solid";
import CheckmarkCircle02SolidIcon from "virtual:icons/hugeicons/checkmark-circle-02-solid";
import InformationSquareSolidIcon from "virtual:icons/hugeicons/information-square-solid";

import { cn } from "#/utils/cn.ts";

export function Toaster(props: SonnerProps) {
    return (
        <Sonner
            className="toaster group"
            icons={{
                error: <CancelCircleSolidIcon className="size-5 text-white" />,
                warning: <Alert01SolidIcon className="size-5 text-white" />,
                success: <CheckmarkCircle02SolidIcon className="size-5 text-white" />,
                info: <InformationSquareSolidIcon className="size-5 text-white" />,
            }}
            style={{
                "--width": "390px",
            }}
            toastOptions={{
                unstyled: true,
                classNames: {
                    toast: cn(
                        "group toast flex w-(--width) items-start",
                        "backdrop-blur-2xl group-[.toaster]:bg-state-faded-base group-[.toaster]:text-white group-[.toaster]:data-[type=error]:bg-state-error-base group-[.toaster]:data-[type=info]:bg-state-information-base group-[.toaster]:data-[type=success]:bg-state-success-base group-[.toaster]:data-[type=warning]:bg-state-warning-base",
                        "gap-3 rounded-12 p-3.5 [&_[data-content]]:flex [&_[data-content]]:flex-1 [&_[data-content]]:flex-col [&_[data-content]]:gap-1",
                    ),
                    icon: "!size-5 !m-0 mt-0.5",
                    title: "text-label-sm h-5",
                    description: "text-paragraph-sm",
                    actionButton: "",
                    cancelButton: "",
                },
            }}
            {...props}
        />
    );
}
