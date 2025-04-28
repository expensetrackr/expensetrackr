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
        <meta
            name="title"
            content="{{ config('app.name') }} - Manage your expenses effortlessly"
            head-key="title"
            inertia="title"
        />
        <meta
            name="description"
            content="Manage your expenses effortlessly with ExpenseTrackr, the all-in-one web app designed for both personal and business finance tracking. Organize accounts, categorize transactions, and collaborate with workspaces to gain insightful graphics and reports on your financial activities. Stay in control of your finances with ExpenseTrackr's intuitive features and user-friendly interface."
            head-key="description"
            inertia="description"
        />

        <!-- Open Graph / Facebook -->
        <meta content="website" property="og:type" />
        <meta content="{{ url()->current() }}" property="og:url" />
        <meta
            property="og:title"
            content="{{ config('app.name') }} - Manage your expenses effortlessly"
            head-key="og:title"
            inertia="og:title"
        />
        <meta
            property="og:description"
            content="Manage your expenses effortlessly with ExpenseTrackr, the all-in-one web app designed for both personal and business finance tracking. Organize accounts, categorize transactions, and collaborate with workspaces to gain insightful graphics and reports on your financial activities. Stay in control of your finances with ExpenseTrackr's intuitive features and user-friendly interface."
            head-key="og:description"
            inertia="og:description"
        />
        <meta content="https://expensetrackr.app/og.png" property="og:image" />

        <!-- Twitter -->
        <meta content="summary_large_image" property="twitter:card" />
        <meta content="{{ url()->current() }}" property="twitter:url" />
        <meta
            property="twitter:title"
            content="{{ config('app.name') }} - Manage your expenses effortlessly"
            head-key="twitter:title"
            inertia="twitter:title"
        />
        <meta
            property="twitter:description"
            content="Manage your expenses effortlessly with ExpenseTrackr, the all-in-one web app designed for both personal and business finance tracking. Organize accounts, categorize transactions, and collaborate with workspaces to gain insightful graphics and reports on your financial activities. Stay in control of your finances with ExpenseTrackr's intuitive features and user-friendly interface."
            head-key="twitter:description"
            inertia="twitter:description"
        />
        <meta content="https://expensetrackr.app/og.png" property="twitter:image" />

        <!-- Favicon -->
        <link href="/favicons/apple-touch-icon.png" rel="apple-touch-icon" sizes="180x180" />
        <link href="/favicons/favicon-32x32.png" rel="icon" sizes="32x32" type="image/png" />
        <link href="/favicons/favicon-16x16.png" rel="icon" sizes="16x16" type="image/png" />
        <link href="/site.webmanifest" rel="manifest" />
        <link color="#ff2d20" href="/favicons/safari-pinned-tab.svg" rel="mask-icon" />
        <link class="js-site-favicon" href="/img/favicon-light.png" rel="alternate icon" type="image/png" />
        <link class="js-site-favicon" href="/img/favicon-light.svg" rel="icon" type="image/svg+xml" />
        <meta content="#335CFF" name="msapplication-TileColor" />
        <meta content="/browserconfig.xml" name="msapplication-config" />
        <meta content="#ffffff" name="theme-color" />
        <meta content="light" name="color-scheme" />

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead
        @include('partials.theme')
        @include('partials.auto-submit-form')

        <script type="application/ld+json">
            {
                "@context": "https://schema.org",
                "@type": "Organization",
                "@id": "{{ config('app.url') }}",
                "name": "ExpenseTrackr",
                "url": "{{ config('app.url') }}",
                "logo": "{{ config('app.url') }}/favicons/android-chrome-512x512.png",
                "sameAs": ["https://x.com/expensetrackapp", "https://github.com/expensetrackr"]
            }
        </script>
    </head>

    <body class="h-full bg-(--bg-white-0) text-(--text-strong-950)">
        @inertia

        <script>
            window.ENV = {
                APP_URL: '{{ config('app.url') }}',
                IMAGE_URL: 'https://image.danestves.com',
                TELLER_APP_ID: '{{ config('services.teller.app_id') }}',
                TELLER_ENVIRONMENT: '{{ config('services.teller.environment') }}',
            };
        </script>
        <script
            defer
            src="https://events.danestves.com/script.js"
            data-website-id="cede84d1-d5d3-4195-be43-8041e8eb0547"
            data-exclude-search="true"
            data-do-not-track="true"
        ></script>
    </body>
</html>
