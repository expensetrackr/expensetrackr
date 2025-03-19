import { AnimatePresence, motion } from "motion/react";

import { useAccountsParams } from "#/hooks/use-accounts-params.ts";
import { AccountBox } from "./account-box.tsx";

export function AccountsList({ accounts }: { accounts: Array<Resources.Account> }) {
    const { setParams } = useAccountsParams();

    return (
        <div className="-mx-3 md:mx-0">
            <div className="mx-auto grid w-full max-w-[352px] items-start gap-6 md:mx-0 md:max-w-full md:grid-cols-2 lg:grid-cols-4">
                <AnimatePresence mode="popLayout">
                    {accounts.map((account) => (
                        <motion.button
                            animate={{ opacity: 1, scale: 1 }}
                            className="group/account-link rounded-16 text-left transition duration-700 [transition-timing-function:cubic-bezier(0.4,0.2,0.2,1)] [backface-visibility:hidden] [transform-style:preserve-3d] focus:shadow-button-important-focus focus:outline-none"
                            exit={{ opacity: 0, scale: 0.9 }}
                            initial={{ opacity: 0, scale: 0.9 }}
                            key={account.id}
                            layout="position"
                            onClick={() => setParams({ accountId: account.id })}
                            transition={{ duration: 0.25, ease: [0.165, 0.84, 0.44, 1] }}
                            type="button"
                        >
                            <AccountBox account={account} />
                        </motion.button>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
