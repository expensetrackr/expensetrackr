import { Head } from "@inertiajs/react";
import { Image } from "@unpic/react";

import IsotypeDark from "#/assets/isotype-dark.svg";
import IsotypeLight from "#/assets/isotype-light.svg";
import { BentoAccountsTransfers } from "#/components/bento/accounts-transfers.tsx";
import { BentoHistoricalGraphics } from "#/components/bento/graphics.tsx";
import { MultiCurrency } from "#/components/bento/multi-currency.tsx";
import { BentoNotifications } from "#/components/bento/notifications.tsx";
import { BentoRecentTransactions } from "#/components/bento/recent-transactions.tsx";
import { BentoSubscriptions } from "#/components/bento/subscriptions.tsx";
import { BentoWorkspaces } from "#/components/bento/workspaces.tsx";
import { BentoCard } from "#/components/bento-card.tsx";
import { Link } from "#/components/link.tsx";
import * as Button from "#/components/ui/button.tsx";
import { type PageProps } from "#/types/index.ts";

export default function WelcomePage(_props: PageProps<{ laravelVersion: string; phpVersion: string }>) {
    return (
        <>
            <Head title="Welcome" />

            <div className="relative">
                {/* Hero */}
                <div className="relative w-full py-14">
                    {/* Header */}
                    <div className="container">
                        <div className="relative z-50 flex items-center justify-between rounded-12 border bg-linear-270 from-(--bg-white-0)/40 from-[3.14%] to-(--bg-white-0)/40 to-[101.19%] px-6 py-2 backdrop-blur-[2px]">
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

                    <div className="absolute inset-0">
                        <Image
                            alt=""
                            className="absolute inset-0 size-full object-cover object-center"
                            layout="fullWidth"
                            priority
                            role="presentation"
                            src="https://res.cloudinary.com/expensetrackr/image/upload/hero.jpg"
                        />
                        <div className="absolute inset-0 bg-(--bg-white-0) mix-blend-color" />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-(--bg-white-0)" />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-(--bg-white-0)" />
                    </div>

                    <div className="relative z-10 container py-28">
                        <div className="relative flex flex-col gap-8">
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

                    <div className="absolute inset-0 bg-linear-to-t from-(--bg-white-0) to-50%" />
                </div>

                {/* Bento */}
                <div className="container">
                    <div className="flex flex-col gap-24">
                        <div className="flex flex-col gap-2">
                            <h2 className="text-center text-h4">La mejor experiencia en su clase</h2>
                            <p className="text-center text-paragraph-md">
                                Funcionalidades diseñadas para simplificar tu día a día
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-12">
                            <BentoCard
                                className="bg-gradient-to-tr lg:col-span-4"
                                eyebrow="multi-currency"
                                graphic={(isHovered) => (
                                    <MultiCurrency className="mx-auto max-w-40" isHovered={isHovered} />
                                )}
                                title="Tu dinero, en todos los idiomas"
                            />
                            <BentoCard
                                className="bg-gradient-to-bl lg:col-span-5"
                                eyebrow="suscripciones"
                                graphic={(isHovered) => (
                                    <BentoSubscriptions className="mx-auto max-w-96" isHovered={isHovered} />
                                )}
                                title="Tus subscripciones, bajo control"
                            />
                            <BentoCard
                                className="bg-gradient-to-tl lg:col-span-3"
                                eyebrow="notificaciones"
                                fade={["bottom"]}
                                graphic={<BentoNotifications />}
                                title="No te pierdas ningún gasto"
                            />
                            <BentoCard
                                className="bg-radial lg:col-span-4"
                                eyebrow="transferencias entre cuentas"
                                graphic={<BentoAccountsTransfers className="mx-auto max-w-96" />}
                                title="Pasa tu dinero sin dramas"
                            />
                            <BentoCard
                                className="bg-gradient-to-bl lg:col-span-4"
                                eyebrow="categorías"
                                graphic={<BentoRecentTransactions className="mx-auto max-w-96" />}
                                title="Descubre a donde se va tu dinero"
                            />
                            <BentoCard
                                className="bg-gradient-to-br lg:col-span-4"
                                eyebrow="workspaces"
                                graphic={<BentoWorkspaces className="mx-auto max-w-96" />}
                                title="Trabajo en equipo, nivel pro"
                            />
                            <BentoCard
                                className="bg-gradient-to-tr lg:col-span-8"
                                eyebrow="gráficas"
                                graphic={<BentoHistoricalGraphics />}
                                title="Tu pasado financiero en un vistazo"
                            />
                            <BentoCard
                                className="bg-gradient-to-tr lg:col-span-4"
                                eyebrow="sincronización con tu banco (en desarrollo)"
                                title="Conecta tu banco, ahorra tiempo"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
