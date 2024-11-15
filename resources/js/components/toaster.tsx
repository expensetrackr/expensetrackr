import { Toaster as Sonner, type ToasterProps as SonnerProps } from "sonner";
import AlertFillIcon from "virtual:icons/ri/alert-fill";
import CheckboxCircleFillIcon from "virtual:icons/ri/checkbox-circle-fill";
import ErrorWarningFillIcon from "virtual:icons/ri/error-warning-fill";
import InformationFillIcon from "virtual:icons/ri/information-fill";

import { cx } from "#/utils/cva.ts";

export function Toaster(props: SonnerProps) {
    return (
        <Sonner
            className="toaster group"
            icons={{
                error: <ErrorWarningFillIcon className="size-5 text-white" />,
                warning: <AlertFillIcon className="size-5 text-white" />,
                success: <CheckboxCircleFillIcon className="size-5 text-white" />,
                info: <InformationFillIcon className="size-5 text-white" />,
            }}
            style={{
                "--width": "390px",
            }}
            toastOptions={{
                unstyled: true,
                classNames: {
                    toast: cx(
                        "group toast flex w-[var(--width)] items-start",
                        "group-[.toaster]:bg-state-faded-base group-[.toaster]:data-[type=error]:bg-state-error-base group-[.toaster]:data-[type=info]:bg-state-information-base group-[.toaster]:data-[type=success]:bg-state-success-base group-[.toaster]:data-[type=warning]:bg-state-warning-base backdrop-blur-2xl group-[.toaster]:text-white",
                        "rounded-12 gap-3 p-3.5",
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
