import { AnimatePresence, motion } from "motion/react";
import Clock04Icon from "virtual:icons/hugeicons/clock-04";
import Delete02Icon from "virtual:icons/hugeicons/delete-02";

import { Link } from "#/components/link.tsx";
import { TransactionItem } from "#/components/transaction-item.tsx";
import * as Button from "#/components/ui/button.tsx";
import * as Divider from "#/components/ui/divider.tsx";
import * as Drawer from "#/components/ui/drawer.tsx";
import { useAccountsParams } from "#/hooks/use-accounts-params.ts";
import { useTranslation } from "#/hooks/use-translation.ts";
import { routes } from "#/routes.ts";
import { AccountBox } from "./account-box.tsx";
import { DeleteAccountModal } from "./delete-account-modal.tsx";

const MLink = motion.create(Link);

const recentTransactionItemVariants = (i: number) => ({
    initial: {
        opacity: 0,
        translateY: 8,
        transition: { duration: 0.3, ease: "easeOut", delay: 0.08 * i + 0.1 },
    },
    animate: {
        opacity: 1,
        translateY: 0,
        transition: { duration: 0.3, ease: "easeOut", delay: 0.08 * i + 0.1 },
    },
});

type AccountDetailsDrawerProps = {
    account?: Resources.Account | null;
};

export function AccountDetailsDrawer({ account }: AccountDetailsDrawerProps) {
    const { setParams } = useAccountsParams();
    const { t } = useTranslation();

    return (
        <>
            <Drawer.Root onOpenChange={() => setParams({ accountId: null })} open={!!account}>
                <Drawer.Content>
                    <Drawer.Header>
                        <Drawer.Title>{t("pages.accounts.detailsDrawer.title")}</Drawer.Title>
                    </Drawer.Header>

                    <Drawer.Body>
                        <Divider.Root />

                        <div className="flex flex-col gap-4 p-5">
                            {account ? <AccountBox account={account} /> : null}
                        </div>

                        <Divider.Root $type="solid-text">Recent Transactions</Divider.Root>

                        <div className="flex flex-col gap-2 px-5 py-3">
                            <AnimatePresence mode="wait">
                                {account?.transactions?.map((trx, i) => (
                                    <MLink
                                        animate="animate"
                                        className="rounded-12 transition duration-200 focus:shadow-button-important-focus focus:outline-none"
                                        href={routes.transactions.index.url({
                                            query: {
                                                transaction_id: trx.id,
                                            },
                                        })}
                                        initial="initial"
                                        key={trx.id}
                                        variants={recentTransactionItemVariants(i)}
                                    >
                                        <TransactionItem transaction={trx} />
                                    </MLink>
                                ))}
                            </AnimatePresence>
                        </div>
                    </Drawer.Body>

                    <Drawer.Footer className="flex-col gap-2">
                        <Button.Root $size="md" $style="stroke" $type="neutral" asChild className="w-full">
                            <Link
                                href={routes.transactions.index.url({
                                    query: {
                                        "filter[account_id]": account?.id,
                                    },
                                })}
                            >
                                <Button.Icon as={Clock04Icon} />
                                {t("pages.accounts.detailsDrawer.actions.seeAllTransactions")}
                            </Link>
                        </Button.Root>

                        <Button.Root
                            $size="md"
                            $style="ghost"
                            $type="error"
                            className="w-full"
                            onClick={() => setParams({ action: "delete" })}
                        >
                            <Button.Icon as={Delete02Icon} />
                            {t("pages.accounts.detailsDrawer.actions.deleteAccount")}
                        </Button.Root>
                    </Drawer.Footer>
                </Drawer.Content>
            </Drawer.Root>

            {account && <DeleteAccountModal account={account} />}
        </>
    );
}
