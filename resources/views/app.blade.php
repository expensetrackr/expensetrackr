<!DOCTYPE html>
<html class="h-full antialiased transition duration-500 bg-[var(--bg-white-0)]"
      lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta content="width=device-width, initial-scale=1, viewport-fit=cover" name="viewport"/>

    <title inertia>{{ config('app.name', 'ExpenseTrackr') }}</title>

    <link href="{{ url()->current() }}" rel="canonical"/>

    <!-- Primary Meta Tags -->
    <meta content="@yield('title', 'Dashboard') - ExpenseTrackr" name="title">
    <meta
        content="Manage your expenses effortlessly with ExpenseTrackr, the all-in-one web app designed for both personal and business finance tracking. Organize accounts, categorize transactions, and collaborate with workspaces to gain insightful graphics and reports on your financial activities. Stay in control of your finances with ExpenseTrackr's intuitive features and user-friendly interface."
        name="description"
    >

    <!-- Open Graph / Facebook -->
    <meta content="website" property="og:type">
    <meta content="{{ url()->current() }}" property="og:url">
    <meta content="@yield('title', 'Dashboard') - ExpenseTrackr" property="og:title">
    <meta
        content="Manage your expenses effortlessly with ExpenseTrackr, the all-in-one web app designed for both personal and business finance tracking. Organize accounts, categorize transactions, and collaborate with workspaces to gain insightful graphics and reports on your financial activities. Stay in control of your finances with ExpenseTrackr's intuitive features and user-friendly interface."
        property="og:description"
    >
    <meta content="https://expensetrackr.app/img/logo.png" property="og:image">

    <!-- Twitter -->
    <meta content="summary_large_image" property="twitter:card">
    <meta content="{{ url()->current() }}" property="twitter:url">
    <meta content="@yield('title', 'Dashboard') - ExpenseTrackr" property="twitter:title">
    <meta
        content="Manage your expenses effortlessly with ExpenseTrackr, the all-in-one web app designed for both personal and business finance tracking. Organize accounts, categorize transactions, and collaborate with workspaces to gain insightful graphics and reports on your financial activities. Stay in control of your finances with ExpenseTrackr's intuitive features and user-friendly interface."
        property="twitter:description"
    >
    <meta content="https://expensetrackr.app/img/logo.png" property="twitter:image">

    <!-- Favicon -->
    <link
        href="/img/favicon/apple-touch-icon.png"
        rel="apple-touch-icon"
        sizes="180x180"
    >
    <link
        href="/img/favicon/favicon-32x32.png"
        rel="icon"
        sizes="32x32"
        type="image/png"
    >
    <link
        href="/img/favicon/favicon-16x16.png"
        rel="icon"
        sizes="16x16"
        type="image/png"
    >
    <link href="/img/favicon/site.webmanifest" rel="manifest">
    <link
        color="#ff2d20"
        href="/img/favicon/safari-pinned-tab.svg"
        rel="mask-icon"
    >
    <link
        class="js-site-favicon"
        href="/img/favicon-light.png"
        rel="alternate icon"
        type="image/png"
    >
    <link
        class="js-site-favicon"
        href="/img/favicon-light.svg"
        rel="icon"
        type="image/svg+xml"
    >
    <meta content="#335CFF" name="msapplication-TileColor">
    <meta content="/img/favicon/browserconfig.xml" name="msapplication-config">
    <meta content="#ffffff" name="theme-color">
    <meta content="light" name="color-scheme">

    <!-- Fonts -->
    <link rel="preconnect" href="https://rsms.me/"/>
    <link rel="stylesheet" href="https://rsms.me/inter/inter.css"/>

    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    @inertiaHead
    @include('partials.theme')
</head>
<body class="h-full bg-[var(--bg-white-0)] text-[var(--text-strong-950)]">
@inertia
</body>
</html>
