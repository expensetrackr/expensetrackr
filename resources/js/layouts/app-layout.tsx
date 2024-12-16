import { useEffect } from "react";
import { toast } from "sonner";

import { HeaderMobile } from "#/components/header-mobile.tsx";
import { Sidebar } from "#/components/sidebar.tsx";
import { Toaster } from "#/components/toaster.tsx";
import { type InertiaSharedProps } from "#/types/index.ts";

export function AppLayout({
    children,
    ...props
}: InertiaSharedProps<{
    children: React.ReactNode;
}>) {
    useEffect(() => {
        if (props.toast?.type) {
            toast[props.toast.type](props.toast.message);
        }
    }, [props.toast]);

    return (
        <>
            <div className="flex min-h-screen flex-col items-start lg:grid lg:grid-cols-[auto_minmax(0,1fr)]">
                <Sidebar />
                <HeaderMobile />
                <div className="mx-auto flex w-full max-w-[1360px] flex-1 flex-col self-stretch">{children}</div>
            </div>

            <Toaster position="top-center" />
        </>
    );
}
