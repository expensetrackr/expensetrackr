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
        files: ["**/*.tsx", "**/*.jsx"],
        plugins: {
            react: (await import("eslint-plugin-react")).default,
        },
        languageOptions: {
            parser: (await import("typescript-eslint")).parser,
            parserOptions: {
                jsx: true,
            },
        },
        rules: {
            "import/extensions": ["warn", "ignorePackages"],
            "react/jsx-sort-props": "warn",
        },
    },
    {
        ignores: ["vite.config.ts", "resources/js/actions", "resources/js/routes", "resources/js/wayfinder"],
    },
];
