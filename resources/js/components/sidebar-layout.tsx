import CloseIcon from "virtual:icons/ri/close-line";
import MenuIcon from "virtual:icons/ri/menu-line";
import * as Headless from "@headlessui/react";
import * as React from "react";

import { cx } from "#/utils/cva.ts";
import { NavbarItem } from "./navbar.tsx";

function MobileSidebar({ open, close, children }: React.PropsWithChildren<{ open: boolean; close: () => void }>) {
	return (
		<Headless.Transition show={open}>
			<Headless.Dialog onClose={close} className="lg:hidden">
				<Headless.TransitionChild
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-[#020D17]/25 backdrop-blur-[5px]" />
				</Headless.TransitionChild>
				<Headless.TransitionChild
					enter="ease-in-out duration-300"
					enterFrom="-translate-x-full"
					enterTo="translate-x-0"
					leave="ease-in-out duration-300"
					leaveFrom="translate-x-0"
					leaveTo="-translate-x-full"
				>
					<Headless.DialogPanel className="fixed inset-y-0 w-full max-w-80 p-2 transition">
						<div className="flex h-full flex-col rounded-8 bg-[var(--bg-white-0)] shadow-sm ring-1 ring-[var(--stroke-soft-200)]">
							<div className="-mb-3 px-4 pt-3">
								<Headless.CloseButton as={NavbarItem} aria-label="Close navigation">
									<CloseIcon />
								</Headless.CloseButton>
							</div>
							{children}
						</div>
					</Headless.DialogPanel>
				</Headless.TransitionChild>
			</Headless.Dialog>
		</Headless.Transition>
	);
}

export function SidebarLayout({
	navbar,
	sidebar,
	subSidebar,
	children,
}: React.PropsWithChildren<{
	navbar: React.ReactNode;
	sidebar: React.ReactNode;
	subSidebar?: React.ReactNode;
}>) {
	const [showSidebar, setShowSidebar] = React.useState(false);

	return (
		<div className="relative isolate flex min-h-svh w-full bg-[var(--bg-white-0)] max-lg:flex-col">
			{/* Sidebar on desktop */}
			<div
				className={cx(
					"fixed inset-y-0 left-0 w-64 max-lg:hidden",
					subSidebar && "border-[var(--stroke-soft-200)] border-r",
				)}
			>
				{sidebar}
			</div>
			{subSidebar && <div className="fixed inset-y-0 left-64 w-64 max-lg:hidden">{subSidebar}</div>}

			{/* Sidebar on mobile */}
			<MobileSidebar open={showSidebar} close={() => setShowSidebar(false)}>
				{sidebar}
			</MobileSidebar>

			{/* Navbar on mobile */}
			<header className="flex items-center px-4 lg:hidden">
				<div className="py-2.5">
					<NavbarItem onClick={() => setShowSidebar(true)} aria-label="Open navigation">
						<MenuIcon />
					</NavbarItem>
				</div>
				<div className="min-w-0 flex-1">{navbar}</div>
			</header>

			{/* Content */}
			<main
				className={cx(
					"flex flex-1 flex-col pb-2 lg:min-w-0 lg:pt-2 lg:pr-2",
					subSidebar ? "lg:pl-[512px]" : "lg:pl-64",
				)}
			>
				<div className="grow px-4 pb-4 pb-5 lg:rounded-8 lg:bg-[var(--bg-white-0)] lg:px-8 lg:shadow-sm lg:ring-1 lg:ring-[var(--stroke-soft-200)]">
					{children}
				</div>
			</main>
		</div>
	);
}
