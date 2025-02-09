import { getFormProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { Head } from "@inertiajs/react";
import NumberFlow, { type Format } from "@number-flow/react";
import { resolveCurrencyFormat } from "@sumup/intl";
import { Image, Source } from "@unpic/react";
import * as React from "react";
import CheckboxCircleFillIcon from "virtual:icons/ri/checkbox-circle-fill";
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
import * as Glow from "#/components/glow.tsx";
import { Link } from "#/components/link.tsx";
import * as Button from "#/components/ui/button.tsx";
import * as Divider from "#/components/ui/divider.tsx";
import * as SegmentedControl from "#/components/ui/segmented-control.tsx";
import { useTranslation } from "#/hooks/use-translation.ts";
import { useCreateAccountWizardStore } from "#/store/create-account-wizard.ts";
import { type PageProps } from "#/types/index.ts";
import { cx } from "#/utils/cva.ts";
import { plans } from "#/utils/plans.ts";
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

                <FeatureSection />

                <PricingSection />
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
                <div className="relative col-span-12 overflow-hidden lg:col-span-5 lg:col-start-8">
                    <picture>
                        <Source
                            height={752.27}
                            media="(prefers-color-scheme: light)"
                            src={`${import.meta.env.VITE_PUBLIC_ASSETS_URL}/steps-pattern`}
                            width={921}
                        />
                        <Source
                            height={752.27}
                            media="(prefers-color-scheme: dark)"
                            src={`${import.meta.env.VITE_PUBLIC_ASSETS_URL}/steps-pattern-dark`}
                            width={921}
                        />
                        <Image
                            alt=""
                            className="pointer-events-none absolute bottom-8 h-auto !w-230"
                            height={752.27}
                            objectFit="contain"
                            src={`${import.meta.env.VITE_PUBLIC_ASSETS_URL}/steps-pattern`}
                            width={921}
                        />
                    </picture>

                    <form method="post" {...getFormProps(form)} className="relative flex w-full justify-center">
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

function FeatureSection() {
    return (
        <div className="container py-12">
            <div className="flex flex-col gap-5.5">
                <div className="mx-auto flex max-w-160 flex-col">
                    <h2 className="text-center text-h4">Controla tus finanzas, seas quien seas</h2>
                    <p className="text-center text-paragraph-md">
                        Si quieres dominar tus finanzas sin complicaciones, somos el "boring expense tracker" que hace
                        el trabajo pesado por ti
                    </p>
                </div>

                <div className="grid grid-cols-12">
                    <div className="relative col-span-12 lg:col-span-10 lg:col-start-2">
                        <picture>
                            <Source
                                layout="fullWidth"
                                media="(prefers-color-scheme: light)"
                                src={`${import.meta.env.VITE_PUBLIC_ASSETS_URL}/ui`}
                            />
                            <Source
                                layout="fullWidth"
                                media="(prefers-color-scheme: dark)"
                                src={`${import.meta.env.VITE_PUBLIC_ASSETS_URL}/ui-dark`}
                            />
                            <Image
                                alt=""
                                className="rounded-16"
                                layout="fullWidth"
                                src={`${import.meta.env.VITE_PUBLIC_ASSETS_URL}/ui`}
                            />
                        </picture>
                        <div className="absolute inset-0 rounded-12 bg-linear-to-t from-(--bg-white-0) to-90%" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function PricingSection() {
    const [interval, setInterval] = React.useState("monthly");
    const { language, t } = useTranslation();
    const currencyFormat = resolveCurrencyFormat(language, "USD");

    const format: Format = React.useMemo(
        () => ({
            style: "currency",
            currency: "USD",
            minimumFractionDigits: currencyFormat?.minimumFractionDigits,
            maximumFractionDigits: currencyFormat?.maximumFractionDigits,
        }),
        [currencyFormat?.maximumFractionDigits, currencyFormat?.minimumFractionDigits],
    );

    return (
        <Glow.Area className="container py-12">
            <div className="flex flex-col gap-8">
                <div className="mx-auto flex max-w-160 flex-col">
                    <h2 className="text-center text-h4">{t("home.sections.pricing.title")}</h2>
                    <p className="text-center text-paragraph-md">{t("home.sections.pricing.description")}</p>
                </div>

                <div className="flex flex-col items-center gap-8">
                    <SegmentedControl.Root defaultValue={interval} onValueChange={setInterval}>
                        <SegmentedControl.List
                            className="w-fit gap-2 rounded-full"
                            floatingBgClassName="rounded-full bg-primary"
                        >
                            <SegmentedControl.Trigger
                                className="px-3 text-(--text-strong-950) data-[state=active]:text-white"
                                value="monthly"
                            >
                                {t("common.monthly")}
                            </SegmentedControl.Trigger>
                            <SegmentedControl.Trigger
                                className="px-3 text-(--text-strong-950) data-[state=active]:text-white"
                                value="yearly"
                            >
                                {t("common.yearly")}
                            </SegmentedControl.Trigger>
                        </SegmentedControl.List>
                    </SegmentedControl.Root>

                    <div className="grid grid-cols-12">
                        <div className="col-span-12 lg:col-span-10 lg:col-start-2">
                            <div className="grid grid-cols-12 items-center">
                                {plans.map((plan) => {
                                    const features = t(`home.sections.pricing.plans.${plan.code}.features`)?.split(",");
                                    const comingSoon = t(`home.sections.pricing.plans.${plan.code}.coming_soon`)?.split(
                                        ",",
                                    );

                                    return (
                                        <Glow.Root
                                            className="col-span-12 rounded-20 lg:col-span-4"
                                            color={plan.glowColor}
                                            key={plan.code}
                                        >
                                            <div
                                                className={cx(
                                                    "flex flex-col gap-6 px-5 py-12",
                                                    plan.featured
                                                        ? "z-10 rounded-20 border bg-linear-41 from-(--bg-white-0) from-1% to-(--bg-weak-50) to-178% shadow-(color:--bg-weak-50)"
                                                        : "rounded-[18px] border-[0.3px] bg-(--bg-white-0)",
                                                )}
                                                style={{
                                                    ...(plan.featured && {
                                                        boxShadow:
                                                            "0px 0px 56.962px 0px var(--tw-shadow-color), 0px 0px 16.275px 0px var(--tw-shadow-color), 0px 0px 8.137px 0px var(--tw-shadow-color)",
                                                    }),
                                                }}
                                            >
                                                <div className="flex flex-col gap-5">
                                                    <div className="flex gap-2">
                                                        <div className="flex flex-1 flex-col gap-0.5">
                                                            <h5 className="text-h5">
                                                                {t(`home.sections.pricing.plans.${plan.code}.title`)}
                                                            </h5>
                                                            <p className="text-paragraph-sm text-(--text-sub-600)">
                                                                {t(
                                                                    `home.sections.pricing.plans.${plan.code}.description`,
                                                                )}
                                                            </p>
                                                        </div>

                                                        <div
                                                            className={cx(
                                                                "flex size-10 items-center justify-center rounded-full",
                                                                plan.iconBg,
                                                            )}
                                                        >
                                                            <plan.icon className="size-5 text-white" />
                                                        </div>
                                                    </div>

                                                    <h2 className="text-h2">
                                                        {plan.code === "free" ? (
                                                            <></>
                                                        ) : (
                                                            <>
                                                                <NumberFlow
                                                                    className="[--number-flow-char-height:0.85em]"
                                                                    format={format}
                                                                    locales={language}
                                                                    value={
                                                                        plan.price?.[
                                                                            interval as keyof typeof plan.price
                                                                        ] ??
                                                                        plan.price?.onetime ??
                                                                        0
                                                                    }
                                                                    willChange
                                                                />

                                                                {plan.price?.[interval as keyof typeof plan.price] && (
                                                                    <span
                                                                        className="ml-3 text-h6 text-(--text-soft-400) animate-in fade-in"
                                                                        key={interval}
                                                                    >
                                                                        / {interval}
                                                                    </span>
                                                                )}
                                                            </>
                                                        )}
                                                    </h2>
                                                </div>

                                                <Divider.Root />

                                                <ul className="flex flex-col gap-3">
                                                    {features?.map((feature, idx) => (
                                                        <li
                                                            className="inline-flex items-center gap-1 text-paragraph-sm"
                                                            key={idx}
                                                        >
                                                            <CheckboxCircleFillIcon className="size-6" />
                                                            <span dangerouslySetInnerHTML={{ __html: feature }} />
                                                        </li>
                                                    ))}
                                                </ul>

                                                {comingSoon?.length && (
                                                    <div className="flex flex-col gap-2">
                                                        <p className="text-paragraph-sm text-(--text-soft-400)">
                                                            {t("home.sections.pricing.coming_soon")}
                                                        </p>

                                                        {comingSoon.map((feature, idx) => (
                                                            <li
                                                                className="inline-flex items-center gap-1 text-paragraph-sm"
                                                                key={idx}
                                                            >
                                                                <CheckboxCircleFillIcon className="size-6" />
                                                                <span dangerouslySetInnerHTML={{ __html: feature }} />
                                                            </li>
                                                        ))}
                                                    </div>
                                                )}

                                                <Button.Root $style="filled" $type="neutral">
                                                    {t(`home.sections.pricing.plans.${plan.code}.button_label`)}
                                                </Button.Root>
                                            </div>
                                        </Glow.Root>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Glow.Area>
    );
}
