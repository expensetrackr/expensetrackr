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
            toastOptions={{
                unstyled: true,
                classNames: {
                    toast: cx(
                        "group toast flex w-[var(--width)] items-start",
                        "bg-state-faded-light data-[type=error]:bg-state-error-light data-[type=info]:bg-state-information-light data-[type=success]:bg-state-success-light data-[type=warning]:bg-state-warning-light text-white backdrop-blur-2xl",
                        "rounded-12 gap-3 p-3.5",
                    ),
                    icon: "!size-5 !m-0 mt-0.5",
                    title: "text-label-sm h-5",
                    description: "text-paragraph-sm",
                    actionButton: "",
                    cancelButton: "",
                },
            }}
            icons={{
                error: <ErrorWarningFillIcon className="size-5" />,
                warning: <AlertFillIcon className="size-5" />,
                success: <CheckboxCircleFillIcon className="size-5" />,
                info: <InformationFillIcon className="size-5" />,
            }}
            style={{
                "--width": "390px",
            }}
            {...props}
        />
    );
}
