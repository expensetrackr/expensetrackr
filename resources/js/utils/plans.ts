import { type ButtonRootProps } from "#/components/ui/button.tsx";

type PlanCode = "free" | "personal" | "lifetime" | "enterprise";

export type Plan = {
    code: PlanCode;
    img: string;
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
        img: "/img/personal-plan.png",
        price: {
            monthly: 29.99,
            yearly: 249.99 / 12,
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
        code: "lifetime",
        img: "/img/lifetime-plan.png",
        isFeatured: true,
        price: {
            monthly: null,
            yearly: null,
            onetime: 629.99,
        },
        productPriceId: {
            monthly: null,
            yearly: null,
            onetime: "c969cccd-95cc-4c0c-b7a4-721a61d63e4b",
        },
        buttonStyle: "filled",
        buttonType: "neutral",
    },
    {
        code: "enterprise",
        img: "/img/enterprise-plan.png",
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
                id: "bank-account-connections",
                free: "—",
                personal: "✓",
                lifetime: "✓",
                enterprise: "✓",
            },
            {
                id: "automated-receipt-data-extraction",
                free: "—",
                personal: "✓",
                lifetime: "✓",
                enterprise: "✓",
            },
            {
                id: "developer-api-access",
                free: "—",
                personal: "✓",
                lifetime: "✓",
                enterprise: "✓",
            },
        ],
    },
    {
        id: "comprehensive-tracking-management",
        features: [
            {
                id: "unlimited-expense-income-entries",
                free: "50/month",
                personal: "✓",
                lifetime: "✓",
                enterprise: "✓",
            },
            {
                id: "robust-budget-creation-tracking",
                free: "—",
                personal: "✓",
                lifetime: "✓",
                enterprise: "✓",
            },
            {
                id: "effortless-investment-monitoring",
                free: "—",
                personal: "✓",
                lifetime: "✓",
                enterprise: "✓",
            },
            {
                id: "complete-asset-management",
                free: "—",
                personal: "✓",
                lifetime: "✓",
                enterprise: "✓",
            },
            {
                id: "smart-categorization-flexible-tagging",
                free: "Default Categories",
                personal: "✓",
                lifetime: "✓",
                enterprise: "✓",
            },
            {
                id: "automated-recurring-transactions",
                free: "—",
                personal: "✓",
                lifetime: "✓",
                enterprise: "✓",
            },
            {
                id: "multiple-currency-support",
                free: "—",
                personal: "✓", // Assuming this is a core feature for paid plans
                lifetime: "✓",
                enterprise: "✓",
            },
        ],
    },
    {
        id: "data-insights",
        features: [
            {
                id: "interactive-analytics-dashboards",
                free: "—",
                personal: "✓",
                lifetime: "✓",
                enterprise: "✓",
            },
            {
                id: "advanced-financial-reporting",
                free: "—",
                personal: "✓",
                lifetime: "✓",
                enterprise: "✓",
            },
            {
                id: "custom-report-generation",
                free: "—",
                personal: "—",
                lifetime: "—",
                enterprise: "✓",
            },
        ],
    },
    {
        id: "organization-accessibility",
        features: [
            {
                id: "manage-unlimited-financial-accounts",
                free: "1",
                personal: "✓",
                lifetime: "✓",
                enterprise: "✓",
            },
            {
                id: "powerful-search-filtering-custom-views",
                free: "—",
                personal: "✓",
                lifetime: "✓",
                enterprise: "✓",
            },
            {
                id: "secure-cross-device-sync",
                free: "✓",
                personal: "✓",
                lifetime: "✓",
                enterprise: "✓",
            },
            {
                id: "receipt-document-storage",
                free: "100 MB",
                personal: "5 GB Included", // Example limit
                lifetime: "Unlimited",
                enterprise: "Unlimited",
            },
        ],
    },
    {
        id: "team-collaboration",
        features: [
            {
                id: "dedicated-collaborative-workspaces",
                free: "—",
                personal: "—",
                lifetime: "—",
                enterprise: "✓",
            },
            {
                id: "included-user-seats",
                free: "—",
                personal: "1",
                lifetime: "1", // Lifetime typically single-user
                enterprise: "20 (Scalable)",
            },
        ],
    },
    {
        id: "security-enterprise-features",
        features: [
            {
                id: "robust-security-features",
                free: "✓",
                personal: "✓",
                lifetime: "✓",
                enterprise: "✓",
            },
            {
                id: "sso-authentication-support",
                free: "—",
                personal: "—",
                lifetime: "—",
                enterprise: "✓",
            },
            {
                id: "sla",
                free: "—",
                personal: "—",
                lifetime: "—",
                enterprise: "✓",
            },
        ],
    },
    {
        id: "support-service",
        features: [
            {
                id: "comprehensive-help-center-community-access",
                free: "Community Access",
                personal: "✓",
                lifetime: "✓",
                enterprise: "✓",
            },
            {
                id: "dedicated-email-support",
                free: "Standard Response",
                personal: "Standard Response",
                lifetime: "Standard Response",
                enterprise: "Priority Response",
            },
            {
                id: "dedicated-account-manager",
                free: "—",
                personal: "—",
                lifetime: "—",
                enterprise: "✓", // Often an Enterprise-only feature
            },
        ],
    },
    {
        id: "billing-options",
        features: [
            {
                id: "monthly-billing",
                free: "—",
                personal: "✓",
                lifetime: "—",
                enterprise: "✓",
            },
            {
                id: "annual-billing-discount",
                free: "—",
                personal: "✓",
                lifetime: "—",
                enterprise: "✓",
            },
            {
                id: "one-time-purchase-option",
                free: "—",
                personal: "—",
                lifetime: "✓",
                enterprise: "—",
            },
            {
                id: "credit-card-payment",
                free: "—",
                personal: "✓",
                lifetime: "✓",
                enterprise: "✓",
            },
            {
                id: "bank-transfer-payment-option",
                free: "—",
                personal: "—",
                lifetime: "—",
                enterprise: "✓",
            },
        ],
    },
];
