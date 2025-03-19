import "../css/tailwind.css";
import "../css/app.css";

import { createInertiaApp } from "@inertiajs/react";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { ThemeProvider } from "next-themes";
import { createRoot, hydrateRoot } from "react-dom/client";
import { type route as routeFn } from "ziggy-js";

import { NuqsAdapter } from "#/utils/nuqs-adapter.ts";

declare global {
    const route: typeof routeFn;
    const ENV: {
        PUBLIC_ASSETS_URL: string;
        TELLER_APP_ID: string;
        TELLER_ENVIRONMENT: "sandbox" | "development" | "production";
    };
}

const appName = import.meta.env.VITE_APP_NAME || "ExpenseTrackr";

void createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : `${appName} - Manage your expenses effortlessly`),
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob("./pages/**/*.tsx")),
    setup({ el, App, props }) {
        if (import.meta.env.DEV) {
            createRoot(el, {
                onCaughtError: (error, errorInfo) => {
                    console.error("Caught error", error, errorInfo.componentStack);
                },
            }).render(
                <NuqsAdapter>
                    <TooltipProvider>
                        <ThemeProvider
                            attribute={["class", "data-theme"]}
                            defaultTheme="system"
                            disableTransitionOnChange
                            enableSystem
                        >
                            <App {...props} />
                        </ThemeProvider>
                    </TooltipProvider>
                </NuqsAdapter>,
            );
            return;
        }

        hydrateRoot(
            el,
            <NuqsAdapter>
                <TooltipProvider>
                    <ThemeProvider
                        attribute={["class", "data-theme"]}
                        defaultTheme="system"
                        disableTransitionOnChange
                        enableSystem
                    >
                        <App {...props} />
                    </ThemeProvider>
                </TooltipProvider>
            </NuqsAdapter>,
        );
    },
    progress: {
        color: "#335CFF",
    },
});
