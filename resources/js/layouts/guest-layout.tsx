import { Link } from "@inertiajs/react";
import { type PropsWithChildren } from "react";

import ApplicationLogo from "#/components/application-logo.tsx";

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="bg-gray-100 flex min-h-screen flex-col items-center pt-6 sm:justify-center sm:pt-0">
            <div>
                <Link href="/">
                    <ApplicationLogo className="text-gray-500 h-20 w-20 fill-current" />
                </Link>
            </div>

            <div className="sm:rounded-lg mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md">
                {children}
            </div>
        </div>
    );
}
