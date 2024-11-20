import "./bootstrap.ts";
import "../css/tailwind.css";
import "../css/app.css";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot, hydrateRoot } from "react-dom/client";
import { scan } from "react-scan";

import { NuqsAdapter } from "#/utils/nuqs-adapter.ts";

const appName = import.meta.env.VITE_APP_NAME || "ExpenseTrackr";

scan({
    enabled: import.meta.env.DEV && localStorage.getItem("react-scan") === "true",
    log: import.meta.env.DEV && localStorage.getItem("react-scan") === "true",
});

void createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob("./pages/**/*.tsx")),
    setup({ el, App, props }) {
        if (import.meta.env.DEV) {
            createRoot(el).render(
                <NuqsAdapter>
                    <App {...props} />
                </NuqsAdapter>,
            );
            return;
        }

        hydrateRoot(
            el,
            <NuqsAdapter>
                <App {...props} />
            </NuqsAdapter>,
        );
    },
    progress: {
        color: "#335CFF",
    },
});
