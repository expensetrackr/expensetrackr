import { useQueryState } from "nuqs";
import WalletIcon from "virtual:icons/ri/wallet-line";

import { Dialog, DialogDescription, DialogHeader, DialogIcon, DialogTitle } from "#/components/dialog";

export function CreateAccountForm() {
    const [action, setAction] = useQueryState("action");

    return (
        <Dialog open={action === "accounts:store"} onClose={() => setAction(null)}>
            <DialogHeader>
                <DialogIcon>
                    <WalletIcon className="size-6 text-[var(--icon-sub-600)]" />
                </DialogIcon>

                <div className="flex flex-1 flex-col gap-1">
                    <DialogTitle>Create financial account</DialogTitle>
                    <DialogDescription>
                        Enter the details of your new account to start tracking your finances. You can always edit or
                        delete the account later.
                    </DialogDescription>
                </div>
            </DialogHeader>
        </Dialog>
    );
}
