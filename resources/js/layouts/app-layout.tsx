import { router, usePage } from "@inertiajs/react";

import { SidebarLayout } from "#/components/sidebar-layout.tsx";
import { Toaster } from "#/components/toaster.tsx";
import { type InertiaSharedProps } from "#/types/index.ts";
import { MainNavbar } from "./partials/main-navbar.tsx";
import { MainSidebar } from "./partials/main-sidebar.tsx";

export function AppLayout({ children, subSidebar }: { children: React.ReactNode; subSidebar?: React.ReactNode }) {
    const page = usePage<InertiaSharedProps>();
    const user = page.props.auth.user;
    const workspaces = page.props.workspaces;

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

            <Toaster position="bottom-center" />
        </SidebarLayout>
    );
}
