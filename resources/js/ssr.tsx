import { createInertiaApp } from "@inertiajs/react";
import createServer from "@inertiajs/react/server";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { ThemeProvider } from "next-themes";
import ReactDOMServer from "react-dom/server";
import { type RouteName, route } from "ziggy-js";

import { NuqsAdapter } from "#/utils/nuqs-adapter.ts";

const appName = import.meta.env.VITE_APP_NAME || "ExpenseTrackr";

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
