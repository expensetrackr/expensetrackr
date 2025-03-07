<!DOCTYPE html>
<html
    class="h-full bg-(--bg-white-0) antialiased transition duration-500"
    lang="{{ str_replace('_', '-', app()->getLocale()) }}"
>
    <head>
        <meta charset="utf-8" />
        <meta content="width=device-width, initial-scale=1, viewport-fit=cover" name="viewport" />

        <title inertia>{{ config('app.name') }} - Manage your expenses effortlessly</title>

        <link href="{{ url()->current() }}" rel="canonical" />

        <!-- Primary Meta Tags -->
        <meta content="@yield('title', 'Dashboard') - ExpenseTrackr" name="title" />
        <meta
            content="Manage your expenses effortlessly with ExpenseTrackr, the all-in-one web app designed for both personal and business finance tracking. Organize accounts, categorize transactions, and collaborate with workspaces to gain insightful graphics and reports on your financial activities. Stay in control of your finances with ExpenseTrackr's intuitive features and user-friendly interface."
            name="description"
        />

        <!-- Open Graph / Facebook -->
        <meta content="website" property="og:type" />
        <meta content="{{ url()->current() }}" property="og:url" />
        <meta content="@yield('title', 'Dashboard') - ExpenseTrackr" property="og:title" />
        <meta
            content="Manage your expenses effortlessly with ExpenseTrackr, the all-in-one web app designed for both personal and business finance tracking. Organize accounts, categorize transactions, and collaborate with workspaces to gain insightful graphics and reports on your financial activities. Stay in control of your finances with ExpenseTrackr's intuitive features and user-friendly interface."
            property="og:description"
        />
        <meta content="https://expensetrackr.app/img/logo.png" property="og:image" />

        <!-- Twitter -->
        <meta content="summary_large_image" property="twitter:card" />
        <meta content="{{ url()->current() }}" property="twitter:url" />
        <meta content="@yield('title', 'Dashboard') - ExpenseTrackr" property="twitter:title" />
        <meta
            content="Manage your expenses effortlessly with ExpenseTrackr, the all-in-one web app designed for both personal and business finance tracking. Organize accounts, categorize transactions, and collaborate with workspaces to gain insightful graphics and reports on your financial activities. Stay in control of your finances with ExpenseTrackr's intuitive features and user-friendly interface."
            property="twitter:description"
        />
        <meta content="https://expensetrackr.app/img/logo.png" property="twitter:image" />

        <!-- Favicon -->
        <link href="/favicons/apple-touch-icon.png" rel="apple-touch-icon" sizes="180x180" />
        <link href="/favicons/favicon-32x32.png" rel="icon" sizes="32x32" type="image/png" />
        <link href="/favicons/favicon-16x16.png" rel="icon" sizes="16x16" type="image/png" />
        <link href="/favicons/site.webmanifest" rel="manifest" />
        <link color="#ff2d20" href="/favicons/safari-pinned-tab.svg" rel="mask-icon" />
        <link class="js-site-favicon" href="/img/favicon-light.png" rel="alternate icon" type="image/png" />
        <link class="js-site-favicon" href="/img/favicon-light.svg" rel="icon" type="image/svg+xml" />
        <meta content="#335CFF" name="msapplication-TileColor" />
        <meta content="/favicons/browserconfig.xml" name="msapplication-config" />
        <meta content="#ffffff" name="theme-color" />
        <meta content="light" name="color-scheme" />

        <!-- Fonts -->
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead
        @include('partials.theme')
        @polarEmbedScript
    </head>

    <body class="h-full bg-(--bg-white-0) text-(--text-strong-950)">
        @inertia

        <script>
            window.ENV = {
                PUBLIC_ASSETS_URL: '{{ config('services.public_assets.url') }}',
                TELLER_APP_ID: '{{ config('teller.APP_ID') }}',
                TELLER_ENVIRONMENT: '{{ config('teller.ENVIRONMENT') }}',
                OPENPANEL_CLIENT_ID: '{{ config('openpanel.client_id') }}',
            };
        </script>
        <script>
            window.op =
                window.op ||
                function (...args) {
                    (window.op.q = window.op.q || []).push(args);
                };
            window.op('init', {
                clientId: '{{ config('openpanel.client_id') }}',
                trackScreenViews: true,
                trackOutgoingLinks: true,
                trackAttributes: true,
            });
        </script>
        <script src="https://openpanel.dev/op1.js" defer async></script>
    </body>
</html>
