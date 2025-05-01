import Briefcase01SolidIcon from "virtual:icons/hugeicons/briefcase-01-solid";
import Building04SolidIcon from "virtual:icons/hugeicons/building-04-solid";
import UserSolidIcon from "virtual:icons/hugeicons/user-solid";
import { type ButtonRootProps } from "#/components/ui/button.tsx";

type PlanCode = "personal" | "business" | "enterprise";

export type Plan = {
    code: PlanCode;
    icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
    iconColor: string;
    isFeatured?: boolean;
    price: {
        monthly: number | null;
        yearly: number | null;
        onetime: number | null;
    };
    productPriceId: {
        monthly: string | null;
        yearly: string | null;
        onetime: string | null;
    };
    buttonStyle: ButtonRootProps["$style"];
    buttonType: ButtonRootProps["$type"];
};

type FeaturedCategory = {
    id: string;
    features: Array<{ id: string } & { [key in PlanCode]: string }>;
};

export const plans: Array<Plan> = [
    {
        code: "personal",
        icon: UserSolidIcon,
        iconColor: "var(--state-information-base)",
        price: {
            monthly: 9.99,
            yearly: 8,
            onetime: null,
        },
        productPriceId: {
            monthly: "42d54e49-6f94-4e90-a137-e850d38ee5c7",
            yearly: "88978e70-3cae-479f-a6f9-d6864205b020",
            onetime: null,
        },
        buttonStyle: "stroke",
        buttonType: "primary",
    },
    {
        code: "business",
        isFeatured: true,
        icon: Briefcase01SolidIcon,
        iconColor: "var(--state-feature-base)",
        price: {
            monthly: 29.99,
            yearly: 24,
            onetime: null,
        },
        productPriceId: {
            monthly: "07a13366-e96b-468f-aef7-b087d036f55c",
            yearly: "05a42537-f417-4aaf-80fe-57f87df6dcf0",
            onetime: null,
        },
        buttonStyle: "filled",
        buttonType: "primary",
    },
    {
        code: "enterprise",
        icon: Building04SolidIcon,
        iconColor: "var(--state-stable-base)",
        price: {
            monthly: null,
            yearly: null,
            onetime: null,
        },
        productPriceId: {
            monthly: null,
            yearly: null,
            onetime: null,
        },
        buttonStyle: "lighter",
        buttonType: "primary",
    },
];

export const planFeatures: Array<FeaturedCategory> = [
    {
        id: "connectivity-integrations",
        features: [
            {
                id: "accounts",
                personal: "3",
                business: "Unlimited",
                enterprise: "Unlimited",
            },
            {
                id: "bank-account-connections",
                personal: "1",
                business: "Unlimited",
                enterprise: "Unlimited",
            },
            {
                id: "automated-receipt-data-extraction",
                personal: "—",
                business: "✓",
                enterprise: "✓",
            },
            {
                id: "developer-api-access",
                personal: "—",
                business: "✓",
                enterprise: "✓",
            },
        ],
    },
    {
        id: "comprehensive-tracking-management",
        features: [
            {
                id: "unlimited-expense-income-entries",
                personal: "✓",
                business: "✓",
                enterprise: "✓",
            },
            {
                id: "robust-budget-creation-tracking",
                personal: "1",
                business: "Unlimited",
                enterprise: "Unlimited",
            },
            {
                id: "effortless-investment-monitoring",
                personal: "—",
                business: "✓",
                enterprise: "✓",
            },
            {
                id: "complete-asset-management",
                personal: "✓",
                business: "✓",
                enterprise: "✓",
            },
            {
                id: "smart-categorization-flexible-tagging",
                personal: "—",
                business: "✓",
                enterprise: "✓",
            },
            {
                id: "automated-recurring-transactions",
                personal: "✓",
                business: "✓",
                enterprise: "✓",
            },
            {
                id: "multiple-currency-support",
                personal: "✓",
                business: "✓",
                enterprise: "✓",
            },
        ],
    },
    {
        id: "data-insights",
        features: [
            {
                id: "interactive-analytics-dashboards",
                personal: "✓",
                business: "✓",
                enterprise: "✓",
            },
            {
                id: "advanced-financial-reporting",
                personal: "—",
                business: "✓",
                enterprise: "✓",
            },
            {
                id: "custom-report-generation",
                personal: "—",
                business: "✓",
                enterprise: "✓",
            },
        ],
    },
    {
        id: "organization-accessibility",
        features: [
            {
                id: "manage-unlimited-financial-accounts",
                personal: "1",
                business: "Unlimited",
                enterprise: "Unlimited",
            },
            {
                id: "powerful-search-filtering-custom-views",
                personal: "✓",
                business: "✓",
                enterprise: "✓",
            },
            {
                id: "secure-cross-device-sync",
                personal: "✓",
                business: "✓",
                enterprise: "✓",
            },
            {
                id: "receipt-document-storage",
                personal: "5 GB Included",
                business: "Unlimited",
                enterprise: "Unlimited",
            },
        ],
    },
    {
        id: "team-collaboration",
        features: [
            {
                id: "dedicated-collaborative-workspaces",
                personal: "—",
                business: "3",
                enterprise: "✓",
            },
            {
                id: "included-user-seats",
                personal: "1",
                business: "5",
                enterprise: "25 (Scalable)",
            },
        ],
    },
    {
        id: "security-enterprise-features",
        features: [
            {
                id: "robust-security-features",
                personal: "✓",
                business: "✓",
                enterprise: "✓",
            },
            {
                id: "sso-authentication-support",
                personal: "—",
                business: "—",
                enterprise: "✓",
            },
            {
                id: "sla",
                personal: "—",
                business: "—",
                enterprise: "✓",
            },
        ],
    },
    {
        id: "support-service",
        features: [
            {
                id: "comprehensive-help-center-community-access",
                personal: "✓",
                business: "✓",
                enterprise: "✓",
            },
            {
                id: "dedicated-email-support",
                personal: "Standard Response",
                business: "Standard Response",
                enterprise: "Priority Response",
            },
            {
                id: "dedicated-account-manager",
                personal: "—",
                business: "—",
                enterprise: "✓",
            },
        ],
    },
    {
        id: "billing-options",
        features: [
            {
                id: "monthly-billing",
                personal: "✓",
                business: "✓",
                enterprise: "✓",
            },
            {
                id: "annual-billing-discount",
                personal: "✓",
                business: "✓",
                enterprise: "✓",
            },
            {
                id: "credit-card-payment",
                personal: "✓",
                business: "✓",
                enterprise: "✓",
            },
            {
                id: "bank-transfer-payment-option",
                personal: "—",
                business: "—",
                enterprise: "✓",
            },
        ],
    },
];
