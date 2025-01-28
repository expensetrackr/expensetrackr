import { Head } from "@inertiajs/react";
import { Image } from "@unpic/react";
import IsotypeDark from "#/assets/isotype-dark.svg";
import IsotypeLight from "#/assets/isotype-light.svg";

import { Link } from "#/components/link.tsx";
import * as Button from "#/components/ui/button.tsx";
import { type PageProps } from "#/types/index.ts";

export default function WelcomePage(props: PageProps<{ laravelVersion: string; phpVersion: string }>) {
    console.info(props);

    return (
        <>
            <Head title="Welcome" />

            <div className="relative py-14">
                {/* Header */}
                <div className="container">
                    <div className="relative z-50 flex items-center justify-between rounded-12 border bg-(--bg-white-0)/25 px-6 py-2 backdrop-blur-xs">
                        <div className="flex items-center gap-1">
                            <Image alt="" className="hidden dark:block" height={40} src={IsotypeDark} width={64} />
                            <Image alt="" className="block dark:hidden" height={40} src={IsotypeLight} width={64} />

                            <span className="text-h5 font-light">
                                Expense<span className="font-bold">Trackr</span>
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button.Root $style="ghost" $type="neutral" asChild className="min-w-24">
                                <Link href={route("login")}>Log in</Link>
                            </Button.Root>

                            <Button.Root asChild className="min-w-24">
                                <Link href={route("register")}>Get started</Link>
                            </Button.Root>
                        </div>
                    </div>
                </div>

                {/* Hero */}
                <div className="container">
                    <div className="absolute inset-0">
                        <Image
                            alt=""
                            cdn="bunny"
                            className="absolute inset-0 size-full object-cover object-center"
                            layout="fullWidth"
                            priority
                            role="presentation"
                            src="https://public-assets.expensetrackr.app/hero-image.jpeg"
                        />
                        <div className="absolute inset-0 bg-(--bg-white-0) mix-blend-color" />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-(--bg-white-0)" />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-(--bg-white-0)" />
                    </div>

                    <div className="relative my-24 flex flex-col gap-8">
                        <div className="mx-auto flex max-w-[640px] flex-col gap-5">
                            <h1 className="text-center text-h2">
                                The best financial <span className="font-bold">management app</span>
                            </h1>

                            <p className="text-center text-paragraph-md">
                                Manage your finances with confidence. Track your expenses, budgets, investments, and
                                assets.
                            </p>
                        </div>

                        <div className="flex flex-col items-center justify-center gap-4 lg:flex-row lg:gap-6">
                            <Button.Root $style="stroke" className="w-full lg:w-auto lg:min-w-36">
                                Contact us
                            </Button.Root>
                            <Button.Root asChild className="w-full lg:w-auto lg:min-w-36">
                                <Link href={route("register")}>Get started</Link>
                            </Button.Root>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
