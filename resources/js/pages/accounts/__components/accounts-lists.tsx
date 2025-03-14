import { AnimatePresence, motion } from "motion/react";
import { type AccountResourceType } from "#/types/runtype.js";
import { AccountBox } from "./account-box.tsx";

export function AccountsList({ accounts }: { accounts: AccountResourceType[] }) {
    return (
        <div className="-mx-3 md:mx-0">
            <div className="mx-auto grid w-full max-w-[352px] items-start gap-6 md:mx-0 md:max-w-full md:grid-cols-4">
                <AnimatePresence mode="popLayout">
                    {accounts.map((account) => (
                        <motion.div
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            initial={{ opacity: 0, scale: 0.9 }}
                            key={account.id}
                            layout="position"
                            transition={{ duration: 0.25, ease: [0.165, 0.84, 0.44, 1] }}
                        >
                            <AccountBox account={account} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
