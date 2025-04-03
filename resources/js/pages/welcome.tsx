import { getFormProps, useForm } from "@conform-to/react";
import NumberFlow, { type Format } from "@number-flow/react";
import { resolveCurrencyFormat } from "@sumup/intl";
import { getValibotConstraint, parseWithValibot } from "conform-to-valibot";
import * as React from "react";
import Alert01Icon from "virtual:icons/hugeicons/alert-01";
import Coupon01Icon from "virtual:icons/hugeicons/coupon-01";
import Mail01Icon from "virtual:icons/hugeicons/mail-01";
import CheckboxCircleFillIcon from "virtual:icons/ri/checkbox-circle-fill";
import MoneyDollarCircleFillIcon from "virtual:icons/ri/money-dollar-circle-fill";

import { BentoAccountsTransfers } from "#/components/bento/accounts-transfers.tsx";
import { BentoHistoricalGraphics } from "#/components/bento/graphics.tsx";
import { BentoLogoCluster } from "#/components/bento/logo-cluster.tsx";
import { MultiCurrency } from "#/components/bento/multi-currency.tsx";
import { BentoNotifications } from "#/components/bento/notifications.tsx";
import { BentoRecentTransactions } from "#/components/bento/recent-transactions.tsx";
import { BentoSubscriptions } from "#/components/bento/subscriptions.tsx";
import { BentoWorkspaces } from "#/components/bento/workspaces.tsx";
import { BentoCard } from "#/components/bento-card.tsx";
import { BalanceStep } from "#/components/create-account/balance-step.tsx";
import { Card } from "#/components/create-account/card.tsx";
import * as Glow from "#/components/glow.tsx";
import { Image } from "#/components/image.tsx";
import { Link } from "#/components/link.tsx";
import { Source } from "#/components/source.tsx";
import * as Alert from "#/components/ui/alert.tsx";
import * as Button from "#/components/ui/button.tsx";
import * as Divider from "#/components/ui/divider.tsx";
import * as LinkButton from "#/components/ui/link-button.tsx";
import * as SegmentedControl from "#/components/ui/segmented-control.tsx";
import { useTranslation } from "#/hooks/use-translation.ts";
import { cn } from "#/utils/cn.ts";
import { plans } from "#/utils/plans.ts";
import { BalanceSchema } from "#/utils/steppers/create-account.step.ts";

export default function WelcomePage() {
    return (
        <>
            <div className="relative pb-26">
                <div aria-hidden="true" className="pointer-events-none absolute h-[80dvh] w-full">
                    <Image
                        alt=""
                        className="absolute inset-0 size-full object-cover object-center hue-rotate-90 invert dark:invert-0"
                        layout="fullWidth"
                        priority
                        src="/img/hero.jpg"
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
                                <picture>
                                    <Source
                                        height={40}
                                        media="(prefers-color-scheme: light)"
                                        priority
                                        src="/img/isotype.png"
                                        width={64}
                                    />
                                    <Source
                                        height={40}
                                        media="(prefers-color-scheme: dark)"
                                        priority
                                        src="/img/isotype-dark.png"
                                        width={64}
                                    />
                                    <Image alt="ExpenseTrackr" height={40} priority src="/img/isotype.png" width={64} />
                                </picture>

                                <span className="text-h5 font-light">
                                    Expense<span className="font-bold">Trackr</span>
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                {/* <Button.Root $style="ghost" $type="neutral" asChild className="min-w-24">
                                    <Link href={route("login")}>Log in</Link>
                                </Button.Root> */}

                                <Button.Root asChild className="min-w-24">
                                    <a href="#pricing">Be the first</a>
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

                <CallToAction />

                <Footer />

                <Alert.Root
                    $size="lg"
                    $status="information"
                    $variant="filled"
                    className="fixed right-0 bottom-0 left-0 z-50 rounded-none"
                >
                    <Alert.Icon as={Coupon01Icon} />
                    <div className="space-y-2.5">
                        <div className="space-y-1">
                            <div className="text-label-sm">We are running a limited time offer!</div>
                            <div>Get any plan or lifetime access for an special price before launch on April 14th.</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <LinkButton.Root $size="md" $style="modifiable" $underline asChild>
                                <a href="#pricing">Get Offer</a>
                            </LinkButton.Root>
                        </div>
                    </div>
                </Alert.Root>
            </div>
        </>
    );
}

function HeroSection() {
    const { t } = useTranslation();

    return (
        <section className="relative z-10 container py-56 pb-12" id="hero">
            <div className="relative flex flex-col gap-8">
                <div className="mx-auto flex max-w-[640px] flex-col gap-5">
                    <h1
                        className="text-center text-h2"
                        dangerouslySetInnerHTML={{ __html: t("home.sections.hero.title") }}
                    />

                    <p className="text-center text-paragraph-md">{t("home.sections.hero.description")}</p>
                </div>

                <div className="flex flex-col items-center justify-center gap-4 lg:flex-row lg:gap-6">
                    <Button.Root $style="stroke" asChild className="w-full lg:w-auto lg:min-w-36">
                        <a href="mailto:support@expensetrackr.com" rel="noopener noreferrer" target="_blank">
                            {t("home.sections.hero.contact_us")}
                        </a>
                    </Button.Root>
                    <Button.Root asChild className="w-full lg:w-auto lg:min-w-36">
                        <a href="#pricing">
                            {/* {t("home.sections.hero.get_started")} */}
                            Start your financial journey
                        </a>
                    </Button.Root>
                </div>
            </div>
        </section>
    );
}

function BentoSection() {
    return (
        <section className="relative container py-12" id="bento">
            <div className="flex flex-col gap-24">
                <div className="flex flex-col gap-2">
                    <h2 className="text-center text-h4">The best experience in its class</h2>
                    <p className="text-center text-paragraph-md">Features designed to simplify your day to day</p>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-12">
                    <BentoCard
                        className="bg-gradient-to-tr lg:col-span-4"
                        eyebrow="multi-currency"
                        graphic={(isHovered) => <MultiCurrency className="mx-auto max-w-40" isHovered={isHovered} />}
                        title="Your money, in all languages"
                    />
                    <BentoCard
                        className="bg-gradient-to-bl lg:col-span-5"
                        eyebrow="subscriptions"
                        graphic={(isHovered) => (
                            <BentoSubscriptions className="mx-auto max-w-96" isHovered={isHovered} />
                        )}
                        title="Your subscriptions, under control."
                    />
                    <BentoCard
                        className="bg-gradient-to-tl lg:col-span-3"
                        eyebrow="notifications"
                        graphic={<BentoNotifications />}
                        title="Do not miss any expense."
                    />
                    <BentoCard
                        className="bg-radial lg:col-span-4"
                        eyebrow="account transfers"
                        graphic={<BentoAccountsTransfers className="mx-auto max-w-96" />}
                        title="Transfer your money without dramas"
                    />
                    <BentoCard
                        className="bg-gradient-to-bl lg:col-span-4"
                        eyebrow="categories"
                        graphic={<BentoRecentTransactions className="mx-auto max-w-96" />}
                        title="Discover where your money goes"
                    />
                    <BentoCard
                        className="bg-gradient-to-br lg:col-span-4"
                        eyebrow="workspaces"
                        graphic={<BentoWorkspaces className="mx-auto max-w-96" />}
                        title="Work in team, level professional"
                    />
                    <BentoCard
                        className="bg-gradient-to-tr lg:col-span-7"
                        eyebrow="historical graphics"
                        graphic={<BentoHistoricalGraphics />}
                        title="Your financial past in a glance"
                    />
                    <BentoCard
                        className="bg-gradient-to-tr pb-0 lg:col-span-5"
                        eyebrow="bank synchronization"
                        graphic={<BentoLogoCluster className="-mx-6 h-80 md:h-full" />}
                        title="Connect your bank, save time"
                    />
                </div>
            </div>
        </section>
    );
}

function ImageAndTextSection() {
    const { t } = useTranslation();
    const [form, fields] = useForm({
        id: "create-account-example",
        shouldValidate: "onSubmit",
        shouldRevalidate: "onInput",
        constraint: getValibotConstraint(BalanceSchema),
        defaultValue: {
            type: "credit_card",
            initial_balance: "0.00",
        },
        onValidate({ formData }) {
            return parseWithValibot(formData, { schema: BalanceSchema });
        },
        onSubmit(event, { submission }) {
            event.preventDefault();

            console.info("submission:", submission);
        },
    });

    return (
        <section className="container py-12" id="image-and-text">
            <div className="grid grid-cols-12 gap-5">
                <div className="col-span-12 lg:col-span-6">
                    <h2 className="max-w-md text-h4">{t("home.sections.image_and_text.title")}</h2>

                    <div className="relative flex flex-col gap-8 py-14 pl-12">
                        {/* Line that connects the steps */}
                        <div className="absolute top-3 left-4 h-[calc(100%-24px)] w-px">
                            <div className="absolute inset-0 bg-linear-to-b from-(--bg-white-0) to-30%" />
                            <div className="h-full border-l border-dashed border-l-(--text-sub-600)" />
                            <div className="absolute inset-0 bg-linear-to-t from-(--bg-white-0) to-30%" />
                        </div>

                        {Array.from({ length: 5 }).map((_, index) => (
                            <div className="relative" key={index}>
                                <div className="absolute -left-10.5 flex size-5 items-center justify-center rounded-full border bg-(--bg-white-0) text-[10px]/[16px] font-medium">
                                    {index + 1}
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-label-lg">
                                        {t(`home.sections.image_and_text.steps.${index + 1}.title`)}
                                    </h3>
                                    <p className="text-paragraph-md text-(--text-sub-600)">
                                        {t(`home.sections.image_and_text.steps.${index + 1}.description`)}
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
                            src="/img/steps-pattern.png"
                            width={921}
                        />
                        <Source
                            height={752.27}
                            media="(prefers-color-scheme: dark)"
                            src="/img/steps-pattern-dark.png"
                            width={921}
                        />
                        <Image
                            alt=""
                            className="pointer-events-none absolute bottom-8 h-auto !w-230"
                            height={752.27}
                            objectFit="contain"
                            src="/img/steps-pattern.png"
                            width={921}
                        />
                    </picture>

                    <form method="post" {...getFormProps(form)} className="relative flex w-full justify-center">
                        <Card
                            description={t("home.sections.image_and_text.balance_step.description")}
                            icon={MoneyDollarCircleFillIcon}
                            title={t("home.sections.image_and_text.balance_step.title")}
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
        </section>
    );
}

function FeatureSection() {
    const { t } = useTranslation();

    return (
        <section className="container py-12" id="feature">
            <div className="flex flex-col gap-5.5">
                <div className="mx-auto flex max-w-160 flex-col">
                    <h2 className="text-center text-h4">{t("home.sections.feature.title")}</h2>
                    <p className="text-center text-paragraph-md">{t("home.sections.feature.description")}</p>
                </div>

                <div className="grid grid-cols-12">
                    <div className="col-span-12 lg:col-span-10 lg:col-start-2">
                        <picture>
                            <Source layout="fullWidth" media="(prefers-color-scheme: light)" src="/img/dashboard.png" />
                            <Source
                                layout="fullWidth"
                                media="(prefers-color-scheme: dark)"
                                src="/img/dashboard-dark.png"
                            />
                            <Image
                                alt=""
                                className="rounded-16 mask-b-to-100"
                                layout="fullWidth"
                                src="/img/dashboard.png"
                            />
                        </picture>
                    </div>
                </div>
            </div>
        </section>
    );
}

function PricingSection() {
    const [interval, setInterval] = React.useState("monthly");
    const { language, t } = useTranslation();
    const currencyFormat = resolveCurrencyFormat(language, "USD");

    // Add countdown timer state
    const [timeLeft, setTimeLeft] = React.useState("");

    React.useEffect(() => {
        const endDate = new Date("2025-04-14T23:59:59");

        const updateTimer = () => {
            const now = new Date();
            const diff = endDate.getTime() - now.getTime();

            if (diff <= 0) {
                setTimeLeft("Offer ended");
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

            setTimeLeft(`${days}d ${hours}h ${minutes}m`);
        };

        updateTimer();
        const intervalId = window.setInterval(updateTimer, 60000); // Update every minute

        return () => window.clearInterval(intervalId);
    }, []);

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
        <Glow.Area className="container scroll-mt-20 py-12" id="pricing">
            <div className="flex flex-col gap-8">
                <div className="mx-auto flex max-w-160 flex-col">
                    <h2 className="text-center text-h4">{t("home.sections.pricing.title")}</h2>
                    <p className="text-center text-paragraph-md">{t("home.sections.pricing.description")}</p>
                    <Alert.Root $size="sm" $status="information" $variant="lighter" className="mx-auto mt-4 w-fit">
                        <Alert.Icon as={Alert01Icon} />
                        Limited time offer will end in <span className="font-medium">{timeLeft}</span>
                    </Alert.Root>
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

                                    return (
                                        <Glow.Root
                                            className="col-span-12 rounded-20 lg:col-span-4"
                                            color={plan.glowColor}
                                            key={plan.code}
                                        >
                                            <div
                                                className={cn(
                                                    "flex flex-col gap-6 px-5 py-12",
                                                    plan.featured
                                                        ? "relative z-10 rounded-20 border bg-linear-41 from-(--bg-white-0) from-1% to-(--bg-weak-50) to-178% shadow-(color:--bg-weak-50)"
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
                                                            className={cn(
                                                                "flex size-10 items-center justify-center rounded-full",
                                                                plan.iconBg,
                                                            )}
                                                        >
                                                            <plan.icon className="size-5 text-white" />
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col gap-1">
                                                        <h2 className="text-h2">
                                                            {plan.code === "free" ? (
                                                                <></>
                                                            ) : (
                                                                <>
                                                                    <div className="flex flex-col -space-y-3">
                                                                        <NumberFlow
                                                                            className="[--number-flow-char-height:0.85em] [&::part(suffix)]:text-h5 [&::part(suffix)]:text-(--text-soft-400) [&::part(suffix)]:line-through"
                                                                            format={format}
                                                                            locales={language}
                                                                            suffix={
                                                                                plan.price?.[
                                                                                    interval as keyof typeof plan.price
                                                                                ] && ` / ${interval}`
                                                                            }
                                                                            value={
                                                                                plan.price?.[
                                                                                    interval as keyof typeof plan.price
                                                                                ]?.price ??
                                                                                plan.price?.onetime?.price ??
                                                                                0
                                                                            }
                                                                            willChange
                                                                        />
                                                                        <div className="relative flex w-fit">
                                                                            <NumberFlow
                                                                                className="text-h6 text-(--text-soft-400) [--number-flow-char-height:0.85em] [&::part(suffix)]:text-h6 [&::part(suffix)]:text-(--text-soft-400)"
                                                                                format={format}
                                                                                locales={language}
                                                                                value={
                                                                                    plan.price?.[
                                                                                        interval as keyof typeof plan.price
                                                                                    ]?.previous ??
                                                                                    plan.price?.onetime?.previous ??
                                                                                    0
                                                                                }
                                                                                willChange
                                                                            />
                                                                            <hr className="absolute top-3.5 h-0.5 w-full border-0 bg-(--text-soft-400)" />
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </h2>
                                                    </div>
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

                                                {plan.buyNow && (
                                                    <Button.Root $style="filled" $type="neutral" asChild>
                                                        <a
                                                            href={
                                                                typeof plan.buyNow === "string"
                                                                    ? plan.buyNow
                                                                    : plan.buyNow?.[
                                                                          interval as keyof typeof plan.buyNow
                                                                      ] || ""
                                                            }
                                                        >
                                                            {t(`home.sections.pricing.plans.${plan.code}.button_label`)}
                                                        </a>
                                                    </Button.Root>
                                                )}
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

function CallToAction() {
    const { t } = useTranslation();

    return (
        <section className="w-full py-5" id="call-to-action">
            <div className="container">
                <div className="grid grid-cols-12">
                    <div className="col-span-12 bg-radial-[50%_50%_at_50%_50%] from-(--bg-soft-200) to-(--bg-white-0) py-21 backdrop-blur-2xl lg:col-span-10 lg:col-start-2">
                        <div className="flex flex-col items-center gap-2">
                            <h2 className="text-h4">{t("home.sections.call_to_action.title")}</h2>
                            <p className="text-paragraph-md text-(--text-sub-600)">
                                {t("home.sections.call_to_action.description")}
                            </p>
                            <Button.Root asChild>
                                <Link href="/#pricing">
                                    {/* {t("home.sections.call_to_action.button_label")} */}
                                    Be the first to try
                                </Link>
                            </Button.Root>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function Footer() {
    return (
        <footer className="border-t-[0.2px] py-8">
            <div className="container">
                <div className="flex items-center justify-between">
                    <Link href={route("home")}>
                        <picture>
                            <Source
                                height={40}
                                media="(prefers-color-scheme: light)"
                                priority
                                src="/img/isotype.png"
                                width={64}
                            />
                            <Source
                                height={40}
                                media="(prefers-color-scheme: dark)"
                                priority
                                src="/img/isotype-dark.png"
                                width={64}
                            />
                            <Image alt="ExpenseTrackr" height={40} priority src="/img/isotype.png" width={64} />
                        </picture>
                    </Link>

                    <ul className="flex items-center gap-5">
                        {/* <li>
                            <a
                                href="https://github.com/expensetrackr/expensetrackr.app"
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                <GithubIcon className="size-6" />
                            </a>
                        </li> */}
                        <li>
                            <a href="mailto:support@expensetrackr.app" rel="noopener noreferrer" target="_blank">
                                <Mail01Icon className="size-6" />
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
    );
}
