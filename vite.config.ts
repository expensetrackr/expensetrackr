import react from "@vitejs/plugin-react";
import laravel from "laravel-vite-plugin";
import Icons from "unplugin-icons/vite";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { run } from "vite-plugin-run";
import path from "node:path";
import { FileSystemIconLoader } from "unplugin-icons/loaders";
import { wayfinder } from "@laravel/vite-plugin-wayfinder";

export default defineConfig({
    plugins: [
        wayfinder({
            formVariants: true,
        }),
        Icons({
            compiler: "jsx",
            jsx: "react",
            autoInstall: true,
            customCollections: {
                untitled: FileSystemIconLoader("./public/untitled"),
                hugeicons: FileSystemIconLoader("./public/icons/hugeicons"),
            },
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
