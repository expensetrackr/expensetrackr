import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, type Variants } from "motion/react";
import Clock04Icon from "virtual:icons/hugeicons/clock-04";
import Delete02Icon from "virtual:icons/hugeicons/delete-02";

import { Link } from "#/components/link.tsx";
import { TransactionItem } from "#/components/transaction-item.tsx";
import * as Button from "#/components/ui/button.tsx";
import * as Divider from "#/components/ui/divider.tsx";
import * as Drawer from "#/components/ui/drawer.tsx";
import { useActionsParams } from "#/hooks/use-actions-params.ts";
import { useTranslation } from "#/hooks/use-translation.ts";
import { routes } from "#/routes.ts";
import { Skeleton } from "../ui/skeleton.tsx";
import { AccountBox } from "./account-box.tsx";
import { DeleteAccountModal } from "./delete-account-modal.tsx";

const MLink = motion.create(Link);

const recentTransactionItemVariants = (i: number) =>
    ({
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
    }) as Variants;

export function AccountDetailsDrawer() {
    const actions = useActionsParams();
    const { t } = useTranslation();
    const isOpen = actions.action === "read" && actions.resource === "accounts" && !!actions.resourceId;
    const { data: account, isLoading } = useQuery({
        queryKey: ["accounts", actions.resourceId],
        queryFn: async () => {
            const res = await fetch(routes.api.accounts.show.url({ public_id: actions.resourceId ?? "" }), {
                credentials: "include",
            });
            return (await res.json()) as Resources.Account;
        },
        enabled: isOpen,
    });

    return (
        <>
            <Drawer.Root onOpenChange={() => actions.resetParams()} open={isOpen}>
                <Drawer.Content>
                    <Drawer.Header>
                        <Drawer.Title>{t("pages.accounts.detailsDrawer.title")}</Drawer.Title>
                    </Drawer.Header>

                    <Drawer.Body>
                        <Divider.Root />

                        <div className="flex flex-col gap-4 p-5">
                            {isLoading ? (
                                <Skeleton className="aspect-video rounded-16" />
                            ) : account ? (
                                <AccountBox account={account} />
                            ) : null}
                        </div>

                        <Divider.Root $type="solid-text">Recent Transactions</Divider.Root>

                        <div className="flex flex-col gap-2 px-5 py-3">
                            <AnimatePresence mode="wait">
                                {isLoading
                                    ? Array.from({ length: 3 }).map((_, i) => (
                                          <Skeleton className="h-14 rounded-12" key={i} />
                                      ))
                                    : account?.transactions?.map((trx, i) => (
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
                            onClick={() => actions.setParams({ action: "delete" })}
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
