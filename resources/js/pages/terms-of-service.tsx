import { Head } from "@inertiajs/react";

import { Image } from "#/components/image.tsx";
import { Source } from "#/components/source.tsx";

interface Props {
    terms: string;
}

export default function TermsOfService({ terms }: Props) {
    return (
        <div className="font-sans antialiased">
            <Head title="Terms of Service" />

            <div className="py-4">
                <div className="flex min-h-screen flex-col items-center pt-6 sm:pt-0">
                    <picture>
                        <Source
                            height={64}
                            media="(prefers-color-scheme: dark)"
                            priority
                            src="/img/isotype-dark.svg"
                            width={64}
                        />
                        <Source
                            height={64}
                            media="(prefers-color-scheme: light)"
                            priority
                            src="/img/isotype-light.svg"
                            width={64}
                        />
                        <Image
                            alt="ExpenseTrackr"
                            className="size-16"
                            height={64}
                            objectFit="contain"
                            priority
                            src="/img/isotype-light.svg"
                            width={64}
                        />
                    </picture>

                    <div
                        className="prose mt-6 w-full overflow-hidden p-6 shadow-md sm:max-w-2xl sm:rounded-8 dark:prose-invert"
                        // biome-ignore lint/security/noDangerouslySetInnerHtml: we are the ones who set the content
                        dangerouslySetInnerHTML={{ __html: terms }}
                    />
                </div>
            </div>
        </div>
    );
}
