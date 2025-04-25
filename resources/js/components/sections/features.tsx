import Analytics01Icon from "virtual:icons/hugeicons/analytics-01";
import ArrowRight01Icon from "virtual:icons/hugeicons/arrow-right-01";
import BalanceScaleIcon from "virtual:icons/hugeicons/balance-scale";
import Diamond02Icon from "virtual:icons/hugeicons/diamond-02";
import File01Icon from "virtual:icons/hugeicons/file-01";
import Invoice01Icon from "virtual:icons/hugeicons/invoice-01";
import RepeatIcon from "virtual:icons/hugeicons/repeat";
import Tag01Icon from "virtual:icons/hugeicons/tag-01";
import ToolsIcon from "virtual:icons/hugeicons/tools";
import WaterfallUp01Icon from "virtual:icons/hugeicons/waterfall-up-01";

import { routes } from "#/routes.ts";
import { Link } from "../link.tsx";
import * as Button from "../ui/button.tsx";

const features = [
    {
        icon: File01Icon,
        id: "expenses",
        title: "Expenses",
        description: "Log, categorize, and track all your spending effortlessly in real-time.",
    },
    {
        icon: BalanceScaleIcon,
        id: "budgets",
        title: "Budgets",
        description: "Create detailed budgets for different categories and monitor your progress to stay on track.",
    },
    {
        icon: WaterfallUp01Icon,
        id: "investments",
        title: "Investments",
        description: "Monitor your investment portfolio's performance and track changes in value over time.",
    },
    {
        icon: Diamond02Icon,
        id: "assets",
        title: "Assets",
        description: "Keep a clear overview of your valuable assets and manage their details and estimated worth.",
    },
    {
        icon: Tag01Icon,
        id: "categories-tags",
        title: "Categories & Tags",
        description:
            "Organize transactions with smart category suggestions, custom categories, and flexible tags for detailed filtering.",
    },
    {
        icon: Analytics01Icon,
        id: "analytics-reports",
        title: "Analytics & Reports",
        description:
            "Gain deep insights into your financial habits with visual reports, spending breakdowns, and trend analysis.",
    },
    {
        icon: Invoice01Icon,
        id: "receipt-management",
        title: "Receipt Management",
        description: "Digitally capture and securely store images of your receipts linked to transactions.",
    },
    {
        icon: RepeatIcon,
        id: "recurring-transactions",
        title: "Recurring Transactions",
        description: "Easily manage regular income and expenses by setting up automated recurring entries.",
    },
];

export function FeaturesSection() {
    return (
        <section id="features">
            <div className="container border-x bg-(--bg-white-0) py-12">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-end">
                    <div className="lg:col-span-2">
                        <p className="flex items-center gap-2">
                            <ToolsIcon className="size-5 text-yellow-600" />
                            <span className="text-paragraph-sm font-medium text-(--text-sub-600) uppercase">
                                YOUR PERSONAL FINANCE POWERHOUSE
                            </span>
                        </p>

                        <h2 className="mt-8 text-h4 font-semibold tracking-tight">Your finances, clearly managed</h2>
                        <p className="mt-2 text-paragraph-lg text-(--text-sub-600)">
                            Track every expense, manage budgets, monitor investments, and oversee assets with our
                            intuitive, all-in-one platform—no more financial guesswork or scattered spreadsheets.
                        </p>

                        <div className="mt-8 flex items-center gap-2">
                            <Button.Root asChild className="gap-2">
                                <Link href={routes.register.url()}>
                                    Get started now
                                    <Button.Icon
                                        as={ArrowRight01Icon}
                                        className="easy-out-in duration-300 group-hover:translate-x-1"
                                    />
                                </Link>
                            </Button.Root>
                            <Button.Root $style="lighter" asChild className="gap-2">
                                <Link href="/">
                                    Contact sales{" "}
                                    <Button.Icon
                                        as={ArrowRight01Icon}
                                        className="easy-out-in duration-300 group-hover:translate-x-1"
                                    />
                                </Link>
                            </Button.Root>
                        </div>
                    </div>
                </div>

                <dl className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature) => (
                        <div key={feature.id}>
                            <dt className="flex items-center gap-2">
                                <feature.icon className="size-6 text-(--text-sub-600)" />
                                <h3 className="text-paragraph-sm font-medium">{feature.title}</h3>
                            </dt>
                            <dd>
                                <p className="mt-2 text-paragraph-sm text-(--text-sub-600)">{feature.description}</p>
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>
        </section>
    );
}
