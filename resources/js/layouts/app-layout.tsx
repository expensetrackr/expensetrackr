import { router, usePage } from "@inertiajs/react";

import { SidebarLayout } from "#/components/sidebar-layout";
import type { InertiaSharedProps } from "#/types";
import { MainNavbar } from "./partials/main-navbar";
import { MainSidebar } from "./partials/main-sidebar";

export function AppLayout({
	children,
	subSidebar,
}: {
	children: React.ReactNode;
	subSidebar?: React.ReactNode;
}) {
	const page = usePage<InertiaSharedProps>();
	const user = page.props.auth.user;
	const workspaces = page.props.workspaces;

	function logout(e: React.FormEvent) {
		e.preventDefault();
		router.post(route("logout"));
	}

	return (
		<SidebarLayout
			navbar={<MainNavbar user={user} logout={logout} />}
			sidebar={<MainSidebar user={user} workspaces={workspaces} logout={logout} />}
			subSidebar={subSidebar}
		>
			{children}
		</SidebarLayout>
	);
}
