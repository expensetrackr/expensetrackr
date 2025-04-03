import { createInertiaApp } from "@inertiajs/react";
import createServer from "@inertiajs/react/server";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { ThemeProvider } from "next-themes";
import ReactDOMServer from "react-dom/server";
import { type RouteName, route, type route as routeFn } from "ziggy-js";

import { NuqsAdapter } from "#/utils/nuqs-adapter.ts";

const appName = import.meta.env.VITE_APP_NAME || "ExpenseTrackr";

type ENV = {
    APP_URL: string;
    IMAGE_URL: string;
    TELLER_APP_ID: string;
    TELLER_ENVIRONMENT: "sandbox" | "development" | "production";
};

declare global {
    var route: typeof routeFn;
    var ENV: ENV;
    interface Window {
        ENV: ENV;
    }
}

global.ENV = {
    APP_URL: import.meta.env.APP_URL,
    IMAGE_URL: import.meta.env.IMAGE_URL,
    TELLER_APP_ID: import.meta.env.TELLER_APP_ID,
    TELLER_ENVIRONMENT: import.meta.env.TELLER_ENVIRONMENT,
};

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        title: (title) => (title ? `${title} - ${appName}` : `${appName} - Manage your expenses effortlessly`),
        resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob("./pages/**/*.tsx")),
        setup: ({ App, props }) => {
            (global as any).route = <T extends RouteName>(name: T, params?: any, absolute?: boolean) =>
                route(name, params, absolute, {
                    // @ts-expect-error
                    ...page.props.ziggy,
                    // @ts-expect-error
                    location: page.props.ziggy.location ? new URL(page.props.ziggy.location) : undefined,
                });

            return (
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
            );
        },
    }),
);
