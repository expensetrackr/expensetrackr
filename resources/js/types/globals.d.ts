import { type PageProps as InertiaPageProps } from "@inertiajs/core";

export type PageProps<T extends Record<string, unknown> | unknown[] = Record<string, unknown> | unknown[]> =
    App.Data.Shared.SharedInertiaData & T;

declare module "@inertiajs/core" {
    interface PageProps extends InertiaPageProps, AppPageProps {}
}
