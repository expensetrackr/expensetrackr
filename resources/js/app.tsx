import "./bootstrap";
import "./theme";
import "../css/tailwind.css";
import "../css/app.css";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot, hydrateRoot } from "react-dom/client";

const appName = import.meta.env.VITE_APP_NAME || "ExpenseTrackr";

createInertiaApp({
	title: (title) => `${title} - ${appName}`,
	resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob("./pages/**/*.tsx")),
	setup({ el, App, props }) {
		if (import.meta.env.DEV) {
			createRoot(el).render(<App {...props} />);
			return;
		}

		hydrateRoot(el, <App {...props} />);
	},
	progress: {
		color: "#335CFF",
	},
});
