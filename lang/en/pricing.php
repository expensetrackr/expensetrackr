<?php

declare(strict_types=1);

return [
    'suffix' => [
        'monthly' => '/monthly',
        'yearly' => '/billed yearly',
    ],
    'free' => [
        'target_audience' => 'For Everyone',
        'title' => 'Free',
        'description' => 'Get started with our free plan and see how it works for you.',
        'features' => 'Single Financial Account, Up to 50 Transactions/Month, Personal Workspace, Basic Spending Overview, 100 MB Receipt Storage, Limited Budget Creation, Expense Categorization',
        'button_label' => 'Get started now',
    ],
    'personal' => [
        'target_audience' => 'For Individuals',
        'title' => 'Personal',
        'description' => 'Unlock full tracking, powerful budgeting, and insightful analytics for personal finance mastery.',
        'features' => 'Unlimited Expense Tracking, Comprehensive Budgeting Tools, Investment & Asset Management, Detailed Analytics, 5 GB Receipt Storage',
        'button_label' => 'Subscribe now',
    ],
    'lifetime' => [
        'target_audience' => 'Ultimate Value',
        'title' => 'Lifetime',
        'description' => 'Get unlimited, lifelong access to all Personal plan features with a single one-time payment.',
        'features' => 'Unlimited Expense Tracking, Comprehensive Budgeting Tools, Investment & Asset Management, Unlimited Receipt Storage, Detailed Analytics, One-Time Payment',
        'button_label' => 'Get lifetime access',
    ],
    'enterprise' => [
        'target_audience' => 'For Growing Businesses',
        'title' => 'Enterprise',
        'description' => 'Advanced features, collaboration tools, and dedicated support for teams.',
        'custom_price' => 'Custom',
        'features' => 'Unlimited Financial Management, Dedicated Workspaces, Multiple User Seats, Customizable Reporting, Priority Support, <strong>SSO/SAML Support</strong>, <strong>Custom SLA</strong>',
        'button_label' => 'Contact sales',
    ],
    'categories' => [
        'connectivity-integrations' => [
            'title' => 'Connectivity & Integrations',
            'features' => [
                'bank-account-connections' => 'Secure Bank Account Connections (via APIs)',
                'automated-receipt-data-extraction' => 'Automated Receipt Data Extraction',
                'developer-api-access' => 'Developer API Access',
            ],
        ],
        'comprehensive-tracking-management' => [
            'title' => 'Comprehensive Tracking & Management',
            'features' => [
                'unlimited-expense-income-entries' => 'Unlimited Expense & Income Entries',
                'robust-budget-creation-tracking' => 'Robust Budget Creation & Tracking',
                'effortless-investment-monitoring' => 'Effortless Investment Monitoring',
                'complete-asset-management' => 'Complete Asset Management',
                'smart-categorization-flexible-tagging' => 'Smart Categorization & Flexible Tagging',
                'automated-recurring-transactions' => 'Automated Recurring Transactions',
                'multiple-currency-support' => 'Multiple Currency Support',
            ],
        ],
        'data-insights' => [
            'title' => 'Data & Insights',
            'features' => [
                'interactive-analytics-dashboards' => 'Interactive Analytics Dashboards',
                'advanced-financial-reporting' => 'Advanced Financial Reporting',
                'custom-report-generation' => 'Custom Report Generation (PDF/CSV)',
            ],
        ],
        'organization-accessibility' => [
            'title' => 'Organization & Accessibility',
            'features' => [
                'manage-unlimited-financial-accounts' => 'Manage Unlimited Financial Accounts',
                'powerful-search-filtering-custom-views' => 'Powerful Search, Filtering & Custom Views',
                'secure-cross-device-sync' => 'Secure Cross-Device Sync (PWA)',
                'receipt-document-storage' => 'Receipt & Document Storage',
            ],
        ],
        'team-collaboration' => [
            'title' => 'Team Collaboration',
            'features' => [
                'dedicated-collaborative-workspaces' => 'Dedicated Collaborative Workspaces',
                'included-user-seats' => 'Included User Seats',
            ],
        ],
        'security-enterprise-features' => [
            'title' => 'Security & Enterprise Features',
            'features' => [
                'robust-security-features' => 'Robust Security Features (2FA, Encryption)',
                'sso-authentication-support' => 'SSO/SAML Authentication Support',
                'sla' => 'Custom Service Level Agreement (SLA)',
            ],
        ],
        'support-service' => [
            'title' => 'Support & Service',
            'features' => [
                'comprehensive-help-center-community-access' => 'Comprehensive Help Center & Community Access',
                'dedicated-email-support' => 'Dedicated Email Support',
                'dedicated-account-manager' => 'Dedicated Account Manager',
            ],
        ],
        'billing-options' => [
            'title' => 'Billing Options',
            'features' => [
                'monthly-billing' => 'Monthly Billing',
                'annual-billing-discount' => 'Annual Billing Discount',
                'one-time-purchase-option' => 'One-Time Purchase Option',
                'credit-card-payment' => 'Credit Card Payment',
                'bank-transfer-payment-option' => 'Bank Transfer Payment Option',
            ],
        ],
    ],
];
