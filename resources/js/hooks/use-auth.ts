import { type PageProps } from "#/types/globals";
import { usePageProps } from "./use-page-props.ts";

export function useAuth() {
    const { auth } = usePageProps<PageProps>().props;

    return auth as unknown as App.Data.Auth.InertiaAuthData;
}
