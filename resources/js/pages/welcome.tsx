import { getFormProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { Head } from "@inertiajs/react";
import { Image } from "@unpic/react";
import * as React from "react";
import MoneyDollarCircleFillIcon from "virtual:icons/ri/money-dollar-circle-fill";

import IsotypeDark from "#/assets/isotype-dark.svg";
import IsotypeLight from "#/assets/isotype-light.svg";
import { BentoAccountsTransfers } from "#/components/bento/accounts-transfers.tsx";
import { BentoHistoricalGraphics } from "#/components/bento/graphics.tsx";
import { BentoLogoCluster } from "#/components/bento/logo-cluster.tsx";
import { MultiCurrency } from "#/components/bento/multi-currency.tsx";
import { BentoNotifications } from "#/components/bento/notifications.tsx";
import { BentoRecentTransactions } from "#/components/bento/recent-transactions.tsx";
import { BentoSubscriptions } from "#/components/bento/subscriptions.tsx";
import { BentoWorkspaces } from "#/components/bento/workspaces.tsx";
import { BentoCard } from "#/components/bento-card.tsx";
import { Link } from "#/components/link.tsx";
import * as Button from "#/components/ui/button.tsx";
import { useTranslation } from "#/hooks/use-translation.ts";
import { useCreateAccountWizardStore } from "#/store/create-account-wizard.ts";
import { type PageProps } from "#/types/index.ts";
import { BalanceStep } from "./accounts/create/partials/balance-step.tsx";
import { Card } from "./accounts/create/partials/card.tsx";
import { balanceSchema } from "./accounts/create/partials/stepper.ts";

export default function WelcomePage(_props: PageProps<{ laravelVersion: string; phpVersion: string }>) {
    return (
        <>
            <Head title="Welcome" />

            <div className="relative">
                <div aria-hidden="true" className="pointer-events-none absolute h-[80dvh] w-full">
                    <Image
                        alt=""
                        className="absolute inset-0 size-full object-cover object-center hue-rotate-90 invert dark:invert-0"
                        layout="fullWidth"
                        priority
                        role="presentation"
                        src={`${import.meta.env.VITE_PUBLIC_ASSETS_URL}/hero`}
                    />
                    <div className="absolute inset-0 bg-(--bg-white-0) mix-blend-color" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-(--bg-white-0)" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-(--bg-white-0)" />
                    <div className="absolute inset-0 bg-linear-to-t from-(--bg-white-0) to-50%" />
                </div>

                <div className="fixed top-14 z-50 w-full overscroll-contain">
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
                </div>

                <HeroSection />

                <BentoSection />

                <ImageAndTextSection />
            </div>
        </>
    );
}

function HeroSection() {
    return (
        <div className="relative z-10 container py-56 pb-12">
            <div className="relative flex flex-col gap-8">
                <div className="mx-auto flex max-w-[640px] flex-col gap-5">
                    <h1 className="text-center text-h2">
                        The best financial <span className="font-bold">management app</span>
                    </h1>

                    <p className="text-center text-paragraph-md">
                        Manage your finances with confidence. Track your expenses, budgets, investments, and assets.
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
    );
}

function BentoSection() {
    return (
        <div className="relative container py-12">
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
                        graphic={(isHovered) => <MultiCurrency className="mx-auto max-w-40" isHovered={isHovered} />}
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
                        className="bg-gradient-to-tr lg:col-span-7"
                        eyebrow="gráficas"
                        graphic={<BentoHistoricalGraphics />}
                        title="Tu pasado financiero en un vistazo"
                    />
                    <BentoCard
                        className="bg-gradient-to-tr pb-0 lg:col-span-5"
                        eyebrow="sincronización con tu banco (en desarrollo)"
                        graphic={<BentoLogoCluster className="-mx-6 h-80 md:h-full" />}
                        title="Conecta tu banco, ahorra tiempo"
                    />
                </div>
            </div>
        </div>
    );
}

function ImageAndTextSection() {
    const { t } = useTranslation();
    const { type, setType } = useCreateAccountWizardStore();
    const [form, fields] = useForm({
        id: "create-account-example",
        shouldValidate: "onSubmit",
        shouldRevalidate: "onInput",
        constraint: getZodConstraint(balanceSchema),
        defaultValue: {
            type,
            initial_balance: "0.00",
        },
        onValidate({ formData }) {
            return parseWithZod(formData, { schema: balanceSchema });
        },
        onSubmit(event, { submission }) {
            event.preventDefault();

            console.info("submission:", submission);
        },
    });

    React.useEffect(() => {
        setType("credit_card");
    }, [setType]);

    return (
        <div className="container py-12">
            <div className="grid grid-cols-12 gap-5">
                <div className="col-span-12 lg:col-span-6">
                    <h2 className="max-w-md text-h4">{t("home.image_and_text_section.title")}</h2>

                    <div className="relative flex flex-col gap-8 py-14 pl-12">
                        {/* Line that connects the steps */}
                        <div className="absolute top-3 left-4 h-[calc(100%-24px)] w-px">
                            <div className="absolute inset-0 bg-linear-to-b from-(--bg-white-0) to-30%" />
                            <div className="h-full border-l border-dashed border-l-(--text-sub-600)" />
                            <div className="absolute inset-0 bg-linear-to-t from-(--bg-white-0) to-30%" />
                        </div>

                        {Array.from({ length: 5 }).map((_, index) => (
                            <div className="relative" key={index}>
                                <div className="absolute -left-10.5 flex size-5 items-center justify-center rounded-full border bg-(--bg-white-0) font-display text-[10px]/[16px] font-medium">
                                    {index + 1}
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="font-display text-label-lg">
                                        {t(`home.image_and_text_section.steps.${index + 1}.title`)}
                                    </h3>
                                    <p className="text-paragraph-md text-(--text-sub-600)">
                                        {t(`home.image_and_text_section.steps.${index + 1}.description`)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col-span-12 lg:col-span-5 lg:col-start-8">
                    <form method="post" {...getFormProps(form)} className="flex w-full justify-center">
                        <Card
                            description="Enter your account's balance and currency. The available options are customized based on your selected account type."
                            icon={MoneyDollarCircleFillIcon}
                            title="Balance & Currency"
                        >
                            <BalanceStep
                                currencies={["USD", "CAD", "EUR", "GBP", "ARS", "VES"]}
                                // @ts-ignore
                                fields={fields}
                            />
                        </Card>
                    </form>
                </div>
            </div>
        </div>
    );
}
