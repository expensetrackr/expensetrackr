import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import CancelCircleSolidIcon from "virtual:icons/hugeicons/cancel-circle-solid";
import CheckmarkCircle02SolidIcon from "virtual:icons/hugeicons/checkmark-circle-02-solid";
import Link06Icon from "virtual:icons/hugeicons/link-06";

const insights = [
    {
        id: "detailed-spending-analytics",
        feature: "Detailed Spending Analytics",
        description: "Visualize where your money goes with automatic categorization and reports.",
        expenseTrackr: true,
        manualMethods: false,
    },
    {
        id: "budget-performance",
        feature: "Budget Performance",
        description: "Track how well you're sticking to your budgets with real-time updates.",
        expenseTrackr: true,
        manualMethods: false,
    },
    {
        id: "investment-performance",
        feature: "Investment Performance",
        description: "Monitor the growth and value of your investments alongside your spending.",
        expenseTrackr: true,
        manualMethods: false,
    },
    {
        id: "asset-overview",
        feature: "Asset Overview",
        description: "Get a consolidated view of all your assets and their estimated value.",
        expenseTrackr: true,
        manualMethods: false,
    },
    {
        id: "customizable-reports",
        feature: "Customizable Reports",
        description: "Generate tailored financial reports for specific periods or categories.",
        expenseTrackr: true,
        manualMethods: false,
    },
    {
        id: "data-synchronization",
        feature: "Data Synchronization",
        description: "Access your up-to-date financial data across all your devices seamlessly.",
        expenseTrackr: true,
        manualMethods: false,
    },
];

export function InsightsSection() {
    const isReducedMotion = useReducedMotion();

    return (
        <section id="insights">
            <div className="container border-x border-t bg-(--bg-white-0) py-12 lg:px-12">
                <div className="lg:w-1/2">
                    <m.p
                        {...(!isReducedMotion && {
                            animate: { opacity: 1, y: 0 },
                            initial: { opacity: 0, y: -100 },
                            transition: { duration: 1 },
                        })}
                        className="flex items-center gap-2"
                    >
                        <Link06Icon className="size-4 text-primary" />
                        <span className="text-paragraph-sm font-medium text-(--text-sub-600) uppercase">
                            Straightforward
                        </span>
                    </m.p>

                    <m.h3
                        {...(!isReducedMotion && {
                            animate: { opacity: 1, y: 0 },
                            initial: { opacity: 0, y: 100 },
                            transition: { duration: 1 },
                        })}
                        className="mt-8 text-h4 font-semibold tracking-tight"
                    >
                        Unlock your financial data
                    </m.h3>
                    <m.p
                        {...(!isReducedMotion && {
                            animate: { opacity: 1, y: 0 },
                            initial: { opacity: 0, y: 100 },
                            transition: { duration: 1.5 },
                        })}
                        className="mt-2 text-paragraph-lg text-(--text-sub-600)"
                    >
                        Access all your financial data in one place for complete clarity and informed decisions.
                    </m.p>
                </div>

                <div className="mt-2 grid grid-cols-4 pb-8" role="rowgroup">
                    <div className="col-span-4 grid grid-cols-4" role="row">
                        <div className="col-span-2 lg:col-span-2" role="columnheader"></div>
                        <p
                            className="col-span-1 col-start-3 hidden text-center font-medium md:block lg:-ml-4"
                            role="columnheader"
                        >
                            ExpenseTrackr
                        </p>
                        <p className="col-span-1 hidden text-center font-medium md:block lg:-ml-8" role="columnheader">
                            Manual methods
                        </p>
                    </div>
                </div>

                <div className="divide-y divide-(--stroke-soft-200) overflow-hidden rounded-12 shadow-xl outline outline-(--stroke-soft-200)">
                    {insights.map((insight) => (
                        <div
                            className="grid grid-flow-row-dense grid-cols-4 items-start gap-4 px-8 py-6"
                            key={insight.id}
                        >
                            <h3 className="order-1 col-span-3 font-medium md:col-span-2 lg:col-span-1">
                                {insight.feature}
                            </h3>
                            <p className="order-4 col-span-3 text-paragraph-sm text-(--text-sub-600) md:col-span-2 lg:order-2 lg:col-span-1">
                                {insight.description}
                            </p>
                            <div className="order-2 justify-self-center lg:order-3">
                                <div className="flex items-center justify-center rounded-8 p-2">
                                    {insight.expenseTrackr ? (
                                        <CheckmarkCircle02SolidIcon className="size-5 text-state-success-base" />
                                    ) : (
                                        <CancelCircleSolidIcon className="size-5 text-state-error-base" />
                                    )}
                                </div>
                            </div>
                            <div className="order-3 hidden justify-self-center md:block lg:order-4">
                                <div className="flex items-center justify-center rounded-8 p-2">
                                    {insight.manualMethods ? (
                                        <CheckmarkCircle02SolidIcon className="size-5 text-state-success-base" />
                                    ) : (
                                        <CancelCircleSolidIcon className="size-5 text-state-error-base" />
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
