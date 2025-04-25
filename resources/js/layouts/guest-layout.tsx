import * as React from "react";
import { toast } from "sonner";

import { Header } from "#/components/header.tsx";
import { Toaster } from "#/components/toaster.tsx";
import { type PageProps } from "#/types/globals.js";

export function GuestLayout({
    children,
    ...props
}: PageProps<{
    children: React.ReactNode;
}>) {
    React.useEffect(() => {
        if (props.toast?.type) {
            toast[props.toast.type](props.toast.title, {
                description: props.toast.description,
                duration: props.toast.duration ?? 5000,
                className: "filled",
            });
        }
    }, [props.toast]);

    return (
        <>
            <div className="flex min-h-screen flex-col">
                <div className="mx-auto w-full border-x border-(--stroke-soft-200) bg-[repeating-linear-gradient(125deg,transparent,transparent_6px,var(--stroke-soft-200)_6px,var(--stroke-soft-200)_7px)] px-2 md:px-0 lg:overflow-hidden">
                    <Header />

                    <main className="grow">{children}</main>
                </div>
            </div>

            <Toaster position="top-center" />
        </>
    );
}
