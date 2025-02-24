import path from "node:path";
import react from "@vitejs/plugin-react";
import laravel from "laravel-vite-plugin";
import Icons from "unplugin-icons/vite";
import { defineConfig } from "vite";

export default defineConfig({
    server: {
        cors: true,
    },
    esbuild: {
        jsx: "automatic",
    },
    build: {
        cssMinify: process.env.NODE_ENV === "production",
        sourcemap: true,
    },
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
            input: ["resources/js/app.tsx", "resources/js/ssr.tsx"],
            ssr: "resources/js/ssr.tsx",
            refresh: true,
        }),
        react({
            babel: {
                plugins: [["babel-plugin-react-compiler", {}]],
            },
        }),
    ],
    resolve: {
        alias: {
            "ziggy-js": path.resolve("vendor/tightenco/ziggy"),
        },
    },
});
