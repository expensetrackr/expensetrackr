import react from "@vitejs/plugin-react";
import laravel from "laravel-vite-plugin";
import Icons from "unplugin-icons/vite";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { run } from "vite-plugin-run";
import path from "node:path";

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
                run: ["php", "artisan", "wayfinder:generate", "--with-form"],
                pattern: ["routes/**/*.php", "app/**/Http/**/*.php"],
            },
            {
                name: "laravel-data-types",
                run: ["php", "artisan", "typescript:transform", "--format"],
                pattern: ["app/Data/**/*.php"],
            },
        ]),
    ],
    esbuild: {
        jsx: "automatic",
    },
    resolve: {
        alias: {
            "#/actions/": path.resolve("./resources/js/actions"),
            "#/routes/": path.resolve("./resources/js/routes"),
            "#/wayfinder/": path.resolve("./resources/js/wayfinder"),
        },
    },
});
