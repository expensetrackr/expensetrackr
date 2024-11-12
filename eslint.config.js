import { default as defaultConfig } from "@epic-web/config/eslint";
import reactCompiler from "eslint-plugin-react-compiler";

/** @type {import("eslint").Linter.Config} */
export default [
    ...defaultConfig,
    {
        plugins: {
            "react-compiler": reactCompiler,
        },
        rules: {
            "react-compiler/react-compiler": "error",
        },
    },
    {
        rules: {
            "import/extensions": ["warn", "ignorePackages"],
        },
    },
    {
        ignores: ["vite.config.ts"],
    },
];
