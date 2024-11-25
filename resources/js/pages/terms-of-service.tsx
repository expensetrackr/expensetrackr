import { Head } from "@inertiajs/react";
import * as React from "react";

import AuthenticationCardLogo from "#/components/authentication-card-logo.tsx";

interface Props {
    terms: string;
}

export default function TermsOfService({ terms }: Props) {
    return (
        <div className="text-gray-900 font-sans antialiased">
            <Head title="Terms of Service" />

            <div className="bg-gray-100 pt-4">
                <div className="flex min-h-screen flex-col items-center pt-6 sm:pt-0">
                    <div>
                        <AuthenticationCardLogo />
                    </div>

                    <div
                        className="prose sm:rounded-lg mt-6 w-full overflow-hidden bg-white p-6 shadow-md sm:max-w-2xl"
                        // biome-ignore lint/security/noDangerouslySetInnerHtml: we are the ones who set the content
                        dangerouslySetInnerHTML={{ __html: terms }}
                    />
                </div>
            </div>
        </div>
    );
}
