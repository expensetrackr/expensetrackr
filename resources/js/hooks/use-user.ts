import { type PageProps } from "#/types/globals";
import { usePageProps } from "./use-page-props.ts";

export function useUser() {
    const { auth } = usePageProps<PageProps>().props;

    return auth?.user as unknown as App.Data.Auth.UserData;
}
