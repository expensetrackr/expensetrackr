import path from "node:path";
import react from "@vitejs/plugin-react";
import laravel from "laravel-vite-plugin";
import Icons from "unplugin-icons/vite";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { run } from "vite-plugin-run";

export default defineConfig({
    plugins: [
        Icons({
            // experimental
            autoInstall: true,
            compiler: "jsx",
            jsx: "react",
            iconCustomizer(_collection, _icon, props) {
                props.width = "1em";
                props.height = "1em";
                props["data-slot"] = "icon";
            },
        }),
        laravel({
            input: ["resources/js/app.tsx"],
            ssr: "resources/js/ssr.tsx",
            refresh: true,
        }),
        react({
            babel: {
                plugins: [["babel-plugin-react-compiler", {}]],
            },
        }),
        tailwindcss(),
        run([
            {
                name: "wayfinder",
                run: ["php", "artisan", "wayfinder:generate"],
                pattern: ["routes/*.php", "app/**/Http/**/*.php"],
            },
        ]),
    ],
    esbuild: {
        jsx: "automatic",
    },
    build: {
        rollupOptions: {
            external: [/^#\/(routes|actions)\/.*/],
        },
    },
    resolve: {
        alias: {
            "ziggy-js": path.resolve("vendor/tightenco/ziggy"),
        },
    },
});
