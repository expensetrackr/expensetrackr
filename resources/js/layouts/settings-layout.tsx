import { router } from "@inertiajs/react";
import { useEffect } from "react";
import { toast } from "sonner";

import { PageHeader } from "#/components/page-header.tsx";
import { SidebarLayout } from "#/components/sidebar-layout.tsx";
import { type InertiaSharedProps } from "#/types/index.ts";
import { MainNavbar } from "./partials/main-navbar.tsx";
import { MainSidebar } from "./partials/main-sidebar.tsx";
import { SettingsSidebar } from "./partials/settings-sidebar.tsx";

type SettingsLayoutProps = {
    children: React.ReactNode;
    icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
    title: string;
    description: string;
};

export function SettingsLayout({
    children,
    icon,
    title,
    description,
    ...props
}: InertiaSharedProps<SettingsLayoutProps>) {
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

    const Icon = icon;

    return (
        <SidebarLayout
            navbar={<MainNavbar logout={logout} user={user} />}
            sidebar={<MainSidebar logout={logout} user={user} workspaces={workspaces} />}
            subSidebar={<SettingsSidebar />}
        >
            <div className="flex flex-col gap-5">
                <PageHeader className="-mb-5">
                    <PageHeader.Content>
                        <PageHeader.Icon>
                            <Icon className="size-6" />
                        </PageHeader.Icon>

                        <div className="flex flex-1 flex-col gap-1">
                            <PageHeader.Title className="motion-safe:origin-left motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95">
                                {title}
                            </PageHeader.Title>
                            <PageHeader.Description className="motion-safe:origin-left motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95">
                                {description}
                            </PageHeader.Description>
                        </div>
                    </PageHeader.Content>
                </PageHeader>

                {children}
            </div>
        </SidebarLayout>
    );
}
