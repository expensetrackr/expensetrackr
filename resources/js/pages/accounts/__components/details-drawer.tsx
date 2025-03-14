import * as Divider from "#/components/ui/divider.tsx";
import * as Drawer from "#/components/ui/drawer.tsx";
import { useAccountParams } from "#/hooks/use-account-params.ts";
import { type AccountResourceType } from "#/types/runtype.js";
import { AccountBox } from "./account-box.tsx";

type AccountDetailsDrawerProps = {
    account?: AccountResourceType | null;
};

export function AccountDetailsDrawer({ account }: AccountDetailsDrawerProps) {
    const { setParams } = useAccountParams();

    console.info(account);

    return (
        <Drawer.Root onOpenChange={() => setParams({ account_id: null })} open={!!account}>
            <Drawer.Content>
                <Drawer.Header>
                    <Drawer.Title>Account Details</Drawer.Title>
                </Drawer.Header>

                <Drawer.Body>
                    <Divider.Root />

                    <div className="flex flex-col gap-4 p-5">{account ? <AccountBox account={account} /> : null}</div>
                </Drawer.Body>
            </Drawer.Content>
        </Drawer.Root>
    );
}
