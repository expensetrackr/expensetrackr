import "../css/tailwind.css";
import "../css/app.css";

import { createInertiaApp } from "@inertiajs/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { domAnimation, LazyMotion } from "motion/react";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/react";
import { Tooltip } from "radix-ui";
import { createRoot, hydrateRoot } from "react-dom/client";

import { queryClient } from "./utils/query-client.ts";

const appName = import.meta.env.VITE_APP_NAME || "ExpenseTrackr";

void createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : `${appName} - Manage your expenses effortlessly`),
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob("./pages/**/*.tsx")),
    setup({ el, App, props }) {
        const AppWithProviders = () => {
            return (
                <QueryClientProvider client={queryClient}>
                    <NuqsAdapter>
                        <Tooltip.Provider>
                            <ThemeProvider
                                attribute={["class", "data-theme"]}
                                defaultTheme="system"
                                disableTransitionOnChange
                                enableSystem
                            >
                                <LazyMotion features={domAnimation}>
                                    <App {...props} />
                                </LazyMotion>
                            </ThemeProvider>
                        </Tooltip.Provider>
                    </NuqsAdapter>
                </QueryClientProvider>
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
