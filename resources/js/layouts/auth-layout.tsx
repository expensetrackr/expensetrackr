import { AuthFooter } from "./partials/auth-footer.tsx";
import { AuthHeader } from "./partials/auth-header.tsx";

export function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="items-cente flex min-h-screen flex-col">
            <AuthHeader />

            <div className="relative isolate flex w-full flex-1 flex-col items-center justify-center">
                <img
                    alt=""
                    className="pointer-events-none absolute top-1/2 left-1/2 -z-10 w-full max-w-[1140px] -translate-x-1/2 -translate-y-1/2 object-contain"
                    height="318"
                    src="/img/auth-pattern.svg"
                    width="824"
                />
                {children}
            </div>

            <AuthFooter />
        </div>
    );
}
