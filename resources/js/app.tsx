import "../css/tailwind.css";
import "../css/app.css";

import { createInertiaApp } from "@inertiajs/react";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { ThemeProvider } from "next-themes";
import { createRoot, hydrateRoot } from "react-dom/client";

import { NuqsAdapter } from "#/utils/nuqs-adapter.ts";

const appName = import.meta.env.VITE_APP_NAME || "ExpenseTrackr";

void createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : `${appName} - Manage your expenses effortlessly`),
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob("./pages/**/*.tsx")),
    setup({ el, App, props }) {
        const AppWithProviders = () => {
            return (
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
                </NuqsAdapter>
            );
        };

        if (import.meta.env.DEV) {
            createRoot(el, {
                onCaughtError: (error, errorInfo) => {
                    console.error("Caught error", error, errorInfo.componentStack);
                },
            }).render(<AppWithProviders />);
            return;
        }

        hydrateRoot(el, <AppWithProviders />);
    },
    progress: {
        color: "#335CFF",
    },
});
