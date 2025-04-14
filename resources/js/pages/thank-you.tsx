import { Link } from "@inertiajs/react";
import Home01Icon from "virtual:icons/hugeicons/home-01";
import Invoice02Icon from "virtual:icons/hugeicons/invoice-02";
import NewTwitterIcon from "virtual:icons/hugeicons/new-twitter";

import * as Badge from "#/components/ui/badge.tsx";
import * as Button from "#/components/ui/button.tsx";
import { AuthLayout } from "#/layouts/auth-layout.tsx";
import { routes } from "#/routes.ts";
import { type PageProps } from "#/types/globals.js";

export default function ThankYou(props: PageProps) {
    return (
        <AuthLayout {...props}>
            <div className="flex min-h-[75vh] flex-col items-center justify-center px-4 text-center">
                <div className="space-y-6">
                    {/* Success Badge */}
                    <Badge.Root $color="green" $size="md" className="mx-auto">
                        <Badge.Icon as={Invoice02Icon} />
                        <span>Payment Successful</span>
                    </Badge.Root>

                    {/* Main Content */}
                    <div className="space-y-4">
                        <h1 className="sm:text-5xl text-h1 font-bold tracking-tight dark:text-white">
                            Thank You for Being a Premium Member!
                        </h1>
                        <p className="text-paragraph-lg text-(--text-sub-600)">
                            We're thrilled to have you as one of our first premium members.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                        <Button.Root $style="stroke" asChild>
                            <Link href={routes.dashboard.url()}>
                                <Button.Icon as={Home01Icon} />
                                Go to Dashboard
                            </Link>
                        </Button.Root>
                        <Button.Root asChild>
                            <a
                                href="https://x.com/intent/tweet?text=I%20just%20joined%20ExpenseTrackr%20as%20a%20premium%20member!%20Can%27t%20wait%20to%20start%20managing%20my%20finances%20better%20%F0%9F%9A%80"
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                <Button.Icon as={NewTwitterIcon} />
                                Share on X
                            </a>
                        </Button.Root>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}
