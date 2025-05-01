import NumberFlow, { type Format } from "@number-flow/react";
import { resolveCurrencyFormat } from "@sumup/intl";
import * as React from "react";

import { useTranslation } from "#/hooks/use-translation.ts";
import { useUser } from "#/hooks/use-user.ts";
import { routes } from "#/routes.ts";
import { cn } from "#/utils/cn.ts";
import { type Plan, planFeatures, plans } from "#/utils/plans.ts";
import { Link } from "./link.tsx";
import * as Button from "./ui/button.tsx";
import * as SegmentedControl from "./ui/segmented-control.tsx";

export function PricingTable() {
    const [interval, setInterval] = React.useState("yearly");
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
        <div className="flex flex-col items-center gap-12">
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

            <div className="w-full overflow-x-auto">
                <table className="mx-auto w-full text-center">
                    <thead>
                        <tr className="text-left align-top">
                            <th className="w-1/5 px-2"></th>
                            {plans.map((plan) => (
                                <th className="w-1/5 px-2" key={plan.code}>
                                    <div className="block flex-shrink-0">
                                        <div className="flex items-center">
                                            <div
                                                className="flex size-12 shrink-0 items-center justify-center rounded-full bg-(--color-plan-color)/20 shadow-xs ring-(--stroke-soft-200)"
                                                style={{
                                                    "--color-plan-color": plan.iconColor,
                                                }}
                                            >
                                                <plan.icon
                                                    aria-hidden="true"
                                                    className="size-6 text-(--color-plan-color)"
                                                    focusable="false"
                                                />
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-paragraph-xs font-medium text-(--text-sub-600)">
                                                    {t(`pricing.${plan.code}.target_audience`)}
                                                </p>
                                                <p className="font-medium">{t(`pricing.${plan.code}.title`)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <p className="h-15 font-semibold tracking-tight">
                                            {plan.code === "enterprise" ? (
                                                <span className="text-h5 font-semibold lg:text-h4">Custom</span>
                                            ) : (
                                                <NumberFlow
                                                    className="text-h5 font-semibold lg:text-h4 [&::part(suffix)]:text-paragraph-xs [&::part(suffix)]:font-normal [&::part(suffix)]:text-(--text-sub-600)"
                                                    format={format}
                                                    suffix={
                                                        !plan.price.onetime
                                                            ? interval === "yearly"
                                                                ? "/billed yearly"
                                                                : "/monthly"
                                                            : undefined
                                                    }
                                                    value={
                                                        plan.price[interval as keyof typeof plan.price] ||
                                                        plan.price.onetime ||
                                                        0
                                                    }
                                                />
                                            )}
                                        </p>
                                    </div>
                                </th>
                            ))}
                        </tr>

                        <tr className="text-left align-top">
                            <td className="w-1/5 px-2"></td>
                            {plans.map((plan) => (
                                <th className="w-1/5 px-2" key={plan.code}>
                                    <div className="mt-4 mb-4 w-full py-2">
                                        <PlanButton interval={interval} plan={plan} />
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="divide-y">
                        {planFeatures.map((category) => (
                            <React.Fragment key={category.id}>
                                <tr>
                                    <th
                                        className="py-3 text-left text-paragraph-sm font-medium"
                                        colSpan={5}
                                        scope="colgroup"
                                    >
                                        {t(`pricing.categories.${category.id}.title`)}
                                    </th>
                                </tr>

                                {category.features.map((feature) => (
                                    <tr key={feature.id}>
                                        <th className="py-3 text-left text-paragraph-xs font-normal text-(--text-sub-600)">
                                            {t(`pricing.categories.${category.id}.features.${feature.id}`)}
                                            <p className="inline"></p>
                                        </th>

                                        <td className="px-2 text-paragraph-sm font-normal">{feature.personal}</td>
                                        <td className="px-2 text-paragraph-sm font-normal">{feature.business}</td>
                                        <td className="px-2 text-paragraph-sm font-normal">{feature.enterprise}</td>
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))}

                        <tr className="text-left align-top">
                            <td className="w-1/5 px-2"></td>
                            {plans.map((plan) => (
                                <th className="w-1/5 px-2" key={plan.code}>
                                    <div className="mt-4 mb-4 w-full py-2">
                                        <PlanButton interval={interval} plan={plan} />
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function PlanButton({ interval, plan }: { interval: string; plan: Plan }) {
    const { t } = useTranslation();
    const user = useUser();

    return (
        <Button.Root
            $style={plan.buttonStyle}
            $type={plan.buttonType}
            asChild
            className={cn("w-full", plan.isFeatured && "bg-primary text-white hover:bg-brand-primary-600")}
        >
            {plan.code === "enterprise" || user ? (
                <a
                    href={
                        plan.code === "enterprise"
                            ? "mailto:sales@expensetrackr.app"
                            : routes.subscribe.url({
                                  query: {
                                      product_id:
                                          plan.productPriceId.onetime ||
                                          plan.productPriceId[interval as keyof typeof plan.productPriceId],
                                      code: plan.code,
                                  },
                              })
                    }
                >
                    {t(`pricing.${plan.code}.button_label`)}
                </a>
            ) : (
                <Link href={routes.register.url()}>{t(`pricing.${plan.code}.button_label`)}</Link>
            )}
        </Button.Root>
    );
}
