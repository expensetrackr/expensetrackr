import * as React from "react";
import { toast } from "sonner";

import { HeaderMobile } from "#/components/header-mobile.tsx";
import { Sidebar } from "#/components/sidebar.tsx";
import { type InertiaSharedProps } from "#/types/index.ts";
import { SettingsVerticalMenu } from "./partials/settings-menu.tsx";

export function SettingsLayout({
    children,
    ...props
}: InertiaSharedProps<{
    children: React.ReactNode;
}>) {
    React.useEffect(() => {
        if (props.toast?.type) {
            toast[props.toast.type](props.toast.message);
        }
    }, [props.toast]);

    return (
        <div className="flex min-h-screen flex-col items-start lg:grid lg:grid-cols-[auto_minmax(0,1fr)]">
            <Sidebar defaultCollapsed />
            <HeaderMobile />

            <div className="w-full flex-1 self-stretch lg:grid lg:grid-cols-[auto_minmax(0,1fr)]">
                <SettingsVerticalMenu />
                <div className="mx-auto flex w-full max-w-[1360px] flex-col">{children}</div>
            </div>
        </div>
    );
}
