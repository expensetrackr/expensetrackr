import { Head, Link } from "@inertiajs/react";
import Add01Icon from "virtual:icons/hugeicons/add-01";
import Wallet05Icon from "virtual:icons/hugeicons/wallet-05";

import { AccountsList } from "#/components/accounts/accounts-lists.tsx";
import { AccountDetailsDrawer } from "#/components/accounts/details-drawer.tsx";
import { AccountsFilters } from "#/components/accounts/filters.tsx";
import { IllustrationEmptyAccounts } from "#/components/empty-illustrations/accounts.tsx";
import { Header } from "#/components/header.tsx";
import * as Button from "#/components/ui/button.tsx";
import * as Divider from "#/components/ui/divider.tsx";
import { useActionsParams } from "#/hooks/use-actions-params.ts";
import { useTranslation } from "#/hooks/use-translation.ts";
import { AppLayout } from "#/layouts/app-layout.tsx";
import { routes } from "#/routes.ts";
import { type PageProps } from "#/types/globals.js";

type AccountsPageProps = {
    accounts: Laravel.PaginatedResponse<Resources.Account>;
    account?: Resources.Account | null;
};

export default function AccountsPage({ accounts, account, permissions }: PageProps<AccountsPageProps>) {
    const { setParams } = useActionsParams();
    const { t } = useTranslation();

    return (
        <>
            <Header
                contentClassName="hidden lg:flex"
                description={t("pages.accounts.description")}
                icon={
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-(--bg-white-0) shadow-xs ring-1 ring-(--stroke-soft-200) ring-inset">
                        <Wallet05Icon className="size-6 text-(--text-sub-600)" />
                    </div>
                }
                title={t("pages.accounts.title")}
            >
                {permissions.canCreateAccounts && (
                    <Button.Root
                        className="w-full md:w-auto"
                        onClick={() => setParams({ action: "create", resource: "accounts" })}
                    >
                        <Button.Icon as={Add01Icon} className="size-4" />
                        {t("pages.accounts.actions.createAccount")}
                    </Button.Root>
                )}
            </Header>

            <div className="lg:px-8">
                <Divider.Root />
            </div>

            <div className="flex flex-col gap-6 px-4 py-6 lg:px-8">
                <AccountsFilters />
                <AccountsList accounts={accounts.data} />

                {accounts.data.length === 0 && (
                    <div className="flex flex-1 flex-col justify-center pt-4">
                        <div className="flex flex-col items-center gap-5 p-5">
                            <IllustrationEmptyAccounts className="size-[108px]" />
                            <div className="text-center text-paragraph-sm text-(--text-soft-400)">
                                <span>{t("pages.accounts.noAccounts.title")}</span>
                                <br />
                                {permissions.canCreateAccounts && (
                                    <span>{t("pages.accounts.noAccounts.description")}</span>
                                )}
                            </div>
                            {permissions.canCreateAccounts && (
                                <Button.Root $size="xs" $style="stroke" asChild>
                                    <Link href={routes.accounts.create.url()}>
                                        <Button.Icon as={Add01Icon} className="size-4" />
                                        {t("pages.accounts.actions.createAccount")}
                                    </Link>
                                </Button.Root>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <AccountDetailsDrawer account={account} />
        </>
    );
}

AccountsPage.layout = (page: React.ReactNode & { props: PageProps }) => (
    <AppLayout {...page.props}>
        <Head title={page.props.translations["pages.accounts.title"]} />

        {page}
    </AppLayout>
);
