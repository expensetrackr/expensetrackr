import { Link } from "@inertiajs/react";
import { AnimatePresence, motion } from "motion/react";

import { AccountBox } from "./account-box.tsx";

const MotionLink = motion.create(Link);

export function AccountsList({ accounts }: { accounts: Array<Resources.Account> }) {
    return (
        <div className="-mx-3 md:mx-0">
            <div className="mx-auto grid w-full max-w-[352px] items-start gap-6 md:mx-0 md:max-w-full md:grid-cols-2 lg:grid-cols-4">
                <AnimatePresence mode="popLayout">
                    {accounts.map((account) => (
                        <MotionLink
                            animate={{ opacity: 1, scale: 1 }}
                            className="group/account-link rounded-16 transition duration-700 [transition-timing-function:cubic-bezier(0.4,0.2,0.2,1)] [backface-visibility:hidden] [transform-style:preserve-3d] focus:shadow-button-important-focus focus:outline-none"
                            exit={{ opacity: 0, scale: 0.9 }}
                            href={route("accounts.index", {
                                account_id: account.id,
                            })}
                            initial={{ opacity: 0, scale: 0.9 }}
                            key={account.id}
                            layout="position"
                            transition={{ duration: 0.25, ease: [0.165, 0.84, 0.44, 1] }}
                        >
                            <AccountBox account={account} />
                        </MotionLink>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
