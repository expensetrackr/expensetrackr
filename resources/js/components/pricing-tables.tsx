import { Link } from "@inertiajs/react";
import NumberFlow, { type Format } from "@number-flow/react";
import { resolveCurrencyFormat } from "@sumup/intl";
import * as React from "react";
import CheckboxCircleFillIcon from "virtual:icons/ri/checkbox-circle-fill";

import { useTranslation } from "#/hooks/use-translation.ts";
import { useUser } from "#/hooks/use-user.ts";
import { routes } from "#/routes.ts";
import { cn } from "#/utils/cn.ts";
import { plans } from "#/utils/plans.ts";
import * as Glow from "./glow.tsx";
import * as Button from "./ui/button.tsx";
import * as Divider from "./ui/divider.tsx";
import * as SegmentedControl from "./ui/segmented-control.tsx";

export function PricingTables() {
    const [interval, setInterval] = React.useState("yearly");
    const { language, t } = useTranslation();
    const currencyFormat = resolveCurrencyFormat(language, "USD");
    const user = useUser();

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

            <div className="grid scroll-mt-40 grid-cols-12" id="pricing-plans">
                <div className="col-span-12 lg:col-span-10 lg:col-start-2">
                    <div className="grid grid-cols-12">
                        {plans.map((plan, index) => {
                            const features = t(`home.sections.pricing.plans.${plan.code}.features`)?.split(",");

                            return (
                                <div
                                    className={cn(
                                        "col-span-12 lg:col-span-4",
                                        (index === 0 || index === 2) && "lg:mt-8",
                                    )}
                                    key={plan.code}
                                >
                                    <Glow.Root className="rounded-20" color={plan.glowColor}>
                                        <div
                                            className={cn(
                                                "flex flex-col gap-6 px-5 py-12",
                                                plan.isFeatured
                                                    ? "relative z-10 rounded-20 border bg-linear-41 from-(--bg-white-0) from-1% to-(--bg-weak-50) to-178% shadow-(color:--bg-weak-50)"
                                                    : "rounded-[18px] border-[0.3px] bg-(--bg-white-0)",
                                            )}
                                            style={{
                                                ...(plan.isFeatured && {
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
                                                            {t(`home.sections.pricing.plans.${plan.code}.description`)}
                                                        </p>
                                                    </div>

                                                    <div
                                                        className={cn(
                                                            "flex size-10 items-center justify-center rounded-full",
                                                            plan.iconBg,
                                                        )}
                                                    >
                                                        <plan.icon className="size-6 text-white" />
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-1">
                                                    <h2 className="text-h3">
                                                        {plan.code === "free" ? (
                                                            <span>Free</span>
                                                        ) : (
                                                            <>
                                                                <div className="flex flex-col -space-y-2">
                                                                    <div className="flex items-center gap-1">
                                                                        <div className="relative flex w-fit">
                                                                            <NumberFlow
                                                                                className="text-(--text-soft-400) [--number-flow-char-height:0.85em] [&::part(suffix)]:text-h6 [&::part(suffix)]:text-(--text-soft-400)"
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
                                                                            <hr className="absolute top-6.5 h-1 w-full border-0 bg-(--text-soft-400)" />
                                                                        </div>

                                                                        <NumberFlow
                                                                            className="[--number-flow-char-height:0.85em] [&::part(suffix)]:text-h5 [&::part(suffix)]:text-(--text-soft-400) [&::part(suffix)]:line-through"
                                                                            format={format}
                                                                            locales={language}
                                                                            value={
                                                                                plan.price?.[
                                                                                    interval as keyof typeof plan.price
                                                                                ]?.price ??
                                                                                plan.price?.onetime?.price ??
                                                                                0
                                                                            }
                                                                            willChange
                                                                        />
                                                                    </div>

                                                                    {plan.isSubscription && (
                                                                        <p
                                                                            className="text-paragraph-md text-(--text-soft-400) animate-in fade-in-0"
                                                                            key={interval}
                                                                        >
                                                                            /{" "}
                                                                            {interval === "yearly"
                                                                                ? "billed yearly"
                                                                                : interval}
                                                                        </p>
                                                                    )}
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

                                            {plan.code !== "free" && (
                                                <div className="flex flex-col gap-3">
                                                    <span className="text-paragraph-sm font-medium text-(--text-sub-600)">
                                                        Early bird features:
                                                    </span>

                                                    <ul className="flex flex-col gap-3">
                                                        <li className="inline-flex items-center gap-1 text-paragraph-sm">
                                                            <CheckboxCircleFillIcon className="size-6" />
                                                            <span>Early access to new features</span>
                                                        </li>
                                                        <li className="inline-flex items-center gap-1 text-paragraph-sm">
                                                            <CheckboxCircleFillIcon className="size-6" />
                                                            <span>Priority support</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            )}

                                            <Button.Root
                                                $style={
                                                    plan.code === "free"
                                                        ? "stroke"
                                                        : plan.isFeatured
                                                          ? "filled"
                                                          : "stroke"
                                                }
                                                asChild
                                            >
                                                <Link
                                                    href={
                                                        user
                                                            ? routes.subscribe.url({
                                                                  query: {
                                                                      product_id:
                                                                          typeof plan.productPriceId === "string"
                                                                              ? plan.productPriceId
                                                                              : plan.productPriceId?.[
                                                                                    interval as keyof typeof plan.productPriceId
                                                                                ],
                                                                      single_purchase:
                                                                          typeof plan.productPriceId === "string"
                                                                              ? "true"
                                                                              : undefined,
                                                                  },
                                                              })
                                                            : routes.settings.billing.show.url()
                                                    }
                                                >
                                                    {t(`home.sections.pricing.plans.${plan.code}.button_label`)}
                                                </Link>
                                            </Button.Root>
                                        </div>
                                    </Glow.Root>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
