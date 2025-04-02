import * as React from "react";
import { toast } from "sonner";

import { Image } from "#/components/image.tsx";
import { type PageProps } from "#/types/globals.js";
import { AuthFooter } from "./partials/auth-footer.tsx";
import { AuthHeader } from "./partials/auth-header.tsx";

export function AuthLayout({
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
            });
        }
    }, [props.toast]);

    return (
        <div className="items-cente flex min-h-screen flex-col">
            <AuthHeader />

            <div className="relative isolate flex w-full flex-1 flex-col items-center justify-center">
                <Image
                    alt=""
                    className="pointer-events-none absolute top-1/2 left-1/2 -z-10 w-full max-w-[1140px] -translate-x-1/2 -translate-y-1/2 object-contain"
                    height={318}
                    src="/img/auth-pattern.svg"
                    width={824}
                />
                {children}
            </div>

            <AuthFooter />
        </div>
    );
}
