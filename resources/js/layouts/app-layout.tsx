import { router } from "@inertiajs/react";
import { useEffect } from "react";
import { toast } from "sonner";

import { SidebarLayout } from "#/components/sidebar-layout.tsx";
import { Toaster } from "#/components/toaster.tsx";
import { type InertiaSharedProps } from "#/types/index.ts";
import { MainNavbar } from "./partials/main-navbar.tsx";
import { MainSidebar } from "./partials/main-sidebar.tsx";

export function AppLayout({
    children,
    subSidebar,
    ...props
}: InertiaSharedProps<{
    children: React.ReactNode;
    subSidebar?: React.ReactNode;
}>) {
    const user = props.auth.user;
    const workspaces = props.workspaces;

    useEffect(() => {
        if (props.toast?.type) {
            toast[props.toast.type](props.toast.message);
        }
    }, [props.toast]);

    function logout(e: React.FormEvent) {
        e.preventDefault();
        router.post(route("logout"));
    }

    return (
        <SidebarLayout
            navbar={<MainNavbar logout={logout} user={user} />}
            sidebar={<MainSidebar logout={logout} user={user} workspaces={workspaces} />}
            subSidebar={subSidebar}
        >
            {children}

            <Toaster position="top-center" />
        </SidebarLayout>
    );
}
