import * as React from "react";

import { type PageProps } from "#/types/globals.js";
import { AppLayout } from "./app-layout.tsx";
import { SettingsVerticalMenu } from "./partials/settings-menu.tsx";

export function SettingsLayout({
    children,
    ...props
}: PageProps<{
    children: React.ReactNode;
}>) {
    return (
        <AppLayout
            childrenWrapperClassName="flex-1 max-w-full self-stretch lg:grid lg:grid-cols-[auto_minmax(0,1fr)]"
            defaultCollapsed
            {...props}
        >
            <SettingsVerticalMenu />
            <div className="mx-auto flex w-full max-w-[1360px] flex-col">{children}</div>
        </AppLayout>
    );
}
