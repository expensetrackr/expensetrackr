import * as React from "react";
import { toast } from "sonner";

import { AppCommandMenu } from "#/components/commands/app-command-menu.tsx";
import { CreateAccountDrawer } from "#/components/drawers/create-account-drawer.tsx";
import { CreateTransactionDrawer } from "#/components/drawers/create-transaction-drawer.tsx";
import { HeaderMobile } from "#/components/header-mobile.tsx";
import { Sidebar } from "#/components/sidebar.tsx";
import { Toaster } from "#/components/toaster.tsx";
import { type PageProps } from "#/types/globals.js";
import { cn } from "#/utils/cn.ts";

type AppLayoutProps = PageProps<{
    children: React.ReactNode;
    defaultCollapsed?: boolean;
    childrenWrapperClassName?: string;
}>;

export function AppLayout({ children, defaultCollapsed = false, childrenWrapperClassName, ...props }: AppLayoutProps) {
    React.useEffect(() => {
        if (props.toast?.type) {
            toast[props.toast.type](props.toast.title, {
                description: props.toast.description,
                duration: props.toast.duration ?? 5000,
            });
        }
    }, [props.toast]);

    return (
        <>
            <div className="flex min-h-screen flex-col items-start lg:grid lg:grid-cols-[auto_minmax(0,1fr)]">
                <Sidebar defaultCollapsed={defaultCollapsed} />
                <HeaderMobile />
                <div
                    className={cn(
                        "mx-auto flex w-full max-w-[1360px] flex-1 flex-col self-stretch pb-16 lg:pb-0",
                        childrenWrapperClassName,
                    )}
                >
                    {children}
                </div>
            </div>

            <Toaster position="top-center" />
            <AppCommandMenu />
            {props.permissions.canCreateAccounts && <CreateAccountDrawer />}
            {props.permissions.canCreateTransactions && <CreateTransactionDrawer />}
        </>
    );
}
