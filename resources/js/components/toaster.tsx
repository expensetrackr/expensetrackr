import AlertFillIcon from "virtual:icons/ri/alert-fill";
import CheckboxCircleFillIcon from "virtual:icons/ri/checkbox-circle-fill";
import ErrorWarningFillIcon from "virtual:icons/ri/error-warning-fill";
import InformationFillIcon from "virtual:icons/ri/information-fill";
import { Toaster as Sonner, type ToasterProps as SonnerProps } from "sonner";

import { cx } from "#/utils/cva";

export function Toaster(props: SonnerProps) {
	return (
		<Sonner
			className="toaster group"
			toastOptions={{
				unstyled: true,
				classNames: {
					toast: cx(
						"group toast flex w-[var(--width)] items-start",
						"bg-state-faded-base data-[type=error]:bg-state-error-base data-[type=info]:bg-state-information-base data-[type=success]:bg-state-success-base data-[type=warning]:bg-state-warning-base",
						"gap-3 rounded-12 p-3.5",
					),
					icon: "size-5 m-0",
					title: "text-label-sm",
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
