import { createInertiaApp } from "@inertiajs/react";
import createServer from "@inertiajs/react/server";
import { QueryClientProvider } from "@tanstack/react-query";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/react";
import ReactDOMServer from "react-dom/server";

import { queryClient } from "./utils/query-client.ts";

const appName = import.meta.env.VITE_APP_NAME || "ExpenseTrackr";

type ENV = {
    APP_NAME: string;
    APP_URL: string;
    IMAGE_URL: string;
    TELLER_APP_ID: string;
    TELLER_ENVIRONMENT: "sandbox" | "development" | "production";
};

declare global {
    var ENV: ENV;
    interface Window {
        ENV: ENV;
    }
}

global.ENV = {
    APP_NAME: process.env.VITE_APP_NAME || "",
    APP_URL: process.env.VITE_APP_URL || "",
    IMAGE_URL: process.env.VITE_IMAGE_URL || "",
    TELLER_APP_ID: process.env.VITE_TELLER_APP_ID || "",
    TELLER_ENVIRONMENT: (process.env.VITE_TELLER_ENVIRONMENT as "sandbox" | "development" | "production") || "sandbox",
};

createServer(
    (page) =>
        createInertiaApp({
            page,
            render: ReactDOMServer.renderToString,
            title: (title) => (title ? `${title} - ${appName}` : `${appName} - Manage your expenses effortlessly`),
            resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob("./pages/**/*.tsx")),
            setup: ({ App, props }) => {
                return (
                    <QueryClientProvider client={queryClient}>
                        <NuqsAdapter>
                            <ThemeProvider
                                attribute={["class", "data-theme"]}
                                defaultTheme="system"
                                disableTransitionOnChange
                                enableSystem
                            >
                                <App {...props} />
                            </ThemeProvider>
                        </NuqsAdapter>
                    </QueryClientProvider>
                );
            },
        }),
    {
        cluster: true,
    },
);
