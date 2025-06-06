import { useActionsParams } from "#/hooks/use-actions-params.ts";
import { AccountBox } from "./account-box.tsx";

export function AccountsList({ accounts }: { accounts: Array<Resources.Account> }) {
    const actions = useActionsParams();

    return (
        <div className="mx-auto grid w-full items-start gap-6 md:mx-0 md:max-w-full md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {accounts.map((account) => (
                <button
                    className="group/account-link h-full rounded-16 text-left transition duration-700 [transition-timing-function:cubic-bezier(0.4,0.2,0.2,1)] [backface-visibility:hidden] [transform-style:preserve-3d] focus:shadow-button-important-focus focus:outline-none"
                    key={account.id}
                    onClick={() => actions.setParams({ action: "read", resource: "accounts", resourceId: account.id })}
                    type="button"
                >
                    <AccountBox account={account} />
                </button>
            ))}
        </div>
    );
}
