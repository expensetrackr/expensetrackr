import * as Headless from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import CloseIcon from "virtual:icons/ri/close-line";
import MenuIcon from "virtual:icons/ri/menu-line";

import { cx } from "#/utils/cva.ts";
import { NavbarItem } from "./navbar.tsx";

function MobileSidebar({ open, close, children }: { open: boolean; close: () => void; children: React.ReactNode }) {
    return (
        <Headless.Transition show={open}>
            <Headless.Dialog className="lg:hidden" onClose={close}>
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
                        <div className="flex h-full flex-col rounded-8 bg-[var(--bg-white-0)] ring-1 shadow-sm ring-[var(--stroke-soft-200)]">
                            <div className="-mb-3 px-4 pt-3">
                                <Headless.CloseButton aria-label="Close navigation" as={NavbarItem}>
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
    sidebarClassName,
    contentClassName,
    contentChildrenClassName,
    children,
}: {
    children: React.ReactNode;
    navbar?: React.ReactNode;
    sidebar?: React.ReactNode;
    subSidebar?: React.ReactNode;
    sidebarClassName?: string;
    contentClassName?: string;
    contentChildrenClassName?: string;
}) {
    const [showSidebar, setShowSidebar] = useState(false);

    return (
        <div className="relative isolate flex min-h-svh w-full bg-[var(--bg-white-0)] max-lg:flex-col">
            {/* Sidebar on desktop */}
            {sidebar ? (
                <div
                    className={cx([
                        "fixed inset-y-0 left-0 z-50 w-64 motion-safe:animate-in motion-safe:fade-in max-lg:hidden",
                        subSidebar && "border-r border-[var(--stroke-soft-200)]",
                        sidebarClassName,
                    ])}
                >
                    {sidebar}
                </div>
            ) : null}
            {subSidebar && (
                <div className="fixed inset-y-0 left-64 w-64 motion-safe:animate-in motion-safe:fade-in max-lg:hidden">
                    {subSidebar}
                </div>
            )}

            {/* Sidebar on mobile */}
            {sidebar ? (
                <MobileSidebar close={() => setShowSidebar(false)} open={showSidebar}>
                    {sidebar}
                </MobileSidebar>
            ) : null}

            {/* Navbar on mobile */}
            <header className="flex items-center px-4 lg:hidden">
                <div className="py-2.5">
                    <NavbarItem aria-label="Open navigation" onClick={() => setShowSidebar(true)}>
                        <MenuIcon />
                    </NavbarItem>
                </div>

                {navbar ? <div className="min-w-0 flex-1">{navbar}</div> : null}
            </header>

            {/* Content */}
            <motion.main
                animate={{
                    paddingLeft: ["var(--sidebar-width)"],
                }}
                className={cx([
                    "flex flex-1 flex-col pb-2 lg:min-w-0 lg:pt-2 lg:pr-2",
                    subSidebar ? "lg:[--sidebar-width:512px]" : "lg:[--sidebar-width:256px]",
                    contentClassName,
                ])}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        animate={{ opacity: 1 }}
                        className={cx([
                            "grow px-4 pb-5 lg:rounded-8 lg:bg-[var(--bg-white-0)] lg:px-8 lg:ring-1 lg:shadow-sm lg:ring-[var(--stroke-soft-200)]",
                            contentChildrenClassName,
                        ])}
                        initial={{ opacity: 0 }}
                        key={window.location.pathname}
                        transition={{ duration: 0.2 }}
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </motion.main>
        </div>
    );
}
