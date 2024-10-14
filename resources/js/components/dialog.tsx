import * as Headless from "@headlessui/react";

import { cx } from "#/utils/cva";
import { twc } from "#/utils/twc";
import { Text } from "./text";

export function Dialog({
	className,
	children,
	...props
}: { className?: string; children: React.ReactNode } & Omit<Headless.DialogProps, "className">) {
	return (
		<Headless.Dialog {...props}>
			<Headless.DialogBackdrop
				transition
				className="fixed inset-0 flex w-screen justify-center overflow-y-auto bg-[#020D17]/25 px-2 py-2 backdrop-blur-[5px] transition duration-100 focus:outline-0 data-[closed]:opacity-0 data-[enter]:ease-out data-[leave]:ease-in sm:px-6 sm:py-8 lg:px-8 lg:py-16"
			/>

			<div className="fixed inset-0 w-screen overflow-y-auto pt-6 sm:pt-0">
				<div className="grid min-h-full grid-rows-[1fr_auto] justify-items-center sm:grid-rows-[1fr_auto_3fr] sm:p-4">
					<Headless.DialogPanel
						transition
						className={cx(
							"row-start-2 w-full min-w-0 rounded-t-20 bg-[var(--bg-white-0)] py-6 shadow-md ring-1 ring-[var(--stroke-soft-200)] sm:m-auto sm:mb-auto sm:max-w-md sm:rounded-20 forced-colors:outline",
							"transition duration-100 data-[closed]:translate-y-12 data-[closed]:opacity-0 data-[enter]:ease-out data-[leave]:ease-in sm:data-[closed]:data-[enter]:scale-95 sm:data-[closed]:translate-y-0",
							className,
						)}
					>
						<div className="flex flex-col gap-3">{children}</div>
					</Headless.DialogPanel>
				</div>
			</div>
		</Headless.Dialog>
	);
}

export const DialogHeader = twc.div`flex items-center gap-4 px-4`;

export const DialogIcon = twc.div`flex size-11 items-center text-[var(--icon-sub-600)] justify-center rounded-full border border-[var(--stroke-soft-200)] bg-[var(--bg-white-0)]`;

export const DialogTitle = twc(Headless.DialogTitle)`text-label-md`;

export const DialogDescription = twc(Headless.Description).attrs({
	as: Text,
})`text-[var(--text-sub-600)] text-paragraph-sm`;

export const DialogBody = twc.div`px-5`;

export const DialogActions = twc.div`flex items-center gap-3 px-5 pt-3`;
