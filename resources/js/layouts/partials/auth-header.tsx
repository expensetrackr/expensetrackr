import { Link, usePage } from "@inertiajs/react";

import * as LinkButton from "#/components/ui/link-button.tsx";
import { useTranslation } from "#/hooks/use-translation.ts";

export function AuthHeader() {
    const pathname = usePage().url;
    const { t } = useTranslation();

    const actions = {
        "/login": {
            text: t("auth.actions.dont_have_account"),
            link: {
                label: t("auth.actions.register"),
                href: "/register",
            },
        },
        "/register": {
            text: t("auth.actions.already_have_account"),
            link: {
                label: t("auth.actions.login"),
                href: "/login",
            },
        },
        "/reset-password": {
            text: t("auth.actions.changed_mind"),
            link: {
                label: t("common.actions.go_back"),
                href: "/login",
            },
        },
        "/verification": {
            text: t("auth.actions.changed_mind"),
            link: {
                label: t("common.actions.go_back"),
                href: "/login",
            },
        },
    };
    const action = actions[pathname as keyof typeof actions];

    if (!action) return null;

    return (
        <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between p-6">
            <img alt="ExpenseTrackr" className="size-10 shrink-0 dark:hidden" src="/img/isotype-light.svg" />
            <img alt="ExpenseTrackr" className="hidden size-10 shrink-0 dark:block" src="/img/isotype-dark.svg" />

            <div className="flex items-center gap-1.5">
                <div className="text-paragraph-sm text-(--text-sub-600)">{action.text}</div>
                <LinkButton.Root $size="md" $style="primary" $underline asChild>
                    <Link href={action.link.href}>{action.link.label}</Link>
                </LinkButton.Root>
            </div>
        </div>
    );
}
