import { Link, useForm } from "@inertiajs/react";
import { parseAsStringEnum, useQueryState } from "nuqs";
import ShareIcon from "virtual:icons/ri/share-line";

import { ActionSection } from "#/components/action-section.tsx";
import { ConnectedAccount } from "#/components/connected-account.tsx";
import * as Button from "#/components/ui/button.tsx";
import * as Modal from "#/components/ui/modal.tsx";
import { useSocialstream } from "#/hooks/use-socialstream.ts";
import { routes } from "#/routes.ts";
import { Action, getAction } from "#/utils/action.ts";

export default function ConnectedAccountsForm() {
    const [action, setAction] = useQueryState("action", parseAsStringEnum<Action>(Object.values(Action)));
    const form = useForm({
        _method: "DELETE",
        bag: "removeConnectedAccount",
    });
    const socialStream = useSocialstream();

    function onSubmit(e: React.FormEvent) {
        e.preventDefault();

        const id = action?.split("destroy:connected-accounts:")[1];
        if (!id) return;

        form.post(routes.connectedAccounts.destroy.url({ id }), {
            preserveScroll: true,
            async onSuccess() {
                await setAction(null);
            },
        });
    }

    function hasAccountForProvider(provider: string) {
        return socialStream.connectedAccounts.some((account) => account.provider === provider);
    }

    function getAccountForProvider(provider: string) {
        if (hasAccountForProvider(provider)) {
            return socialStream.connectedAccounts.find((account) => account.provider === provider);
        }
    }

    function onRemoveAccount(provider: string) {
        const account = getAccountForProvider(provider);

        if (account) {
            return setAction(getAction("ConnectedAccountsDestroy", account.id));
        }
    }
    return (
        <ActionSection>
            <div className="flex flex-col gap-5 divide-y divide-[--stroke-soft-200]">
                {socialStream.providers?.map((provider) => {
                    const connectedAccount = socialStream.connectedAccounts.find((account) => {
                        return account.provider === provider.id;
                    });

                    const canRemoveConnectedAccount =
                        socialStream.connectedAccounts.length > 1 || socialStream.hasPassword;

                    return (
                        <ConnectedAccount connectedAccount={connectedAccount} key={provider.id} provider={provider}>
                            {connectedAccount ? (
                                <>
                                    {canRemoveConnectedAccount ? (
                                        <Button.Root
                                            $size="sm"
                                            $style="stroke"
                                            $type="error"
                                            className="px-4"
                                            onClick={() => onRemoveAccount(provider.id)}
                                        >
                                            Remove account
                                        </Button.Root>
                                    ) : null}
                                </>
                            ) : (
                                <Button.Root $size="sm" $style="stroke" asChild className="px-4">
                                    <Link
                                        href={routes.oauth.redirect.url({
                                            provider: provider.id,
                                        })}
                                    >
                                        Connect account
                                    </Link>
                                </Button.Root>
                            )}

                            <Modal.Root
                                onOpenChange={(open) =>
                                    setAction(open ? getAction("ConnectedAccountsDestroy", provider.id) : null)
                                }
                                open={action === getAction("ConnectedAccountsDestroy", provider.id)}
                            >
                                <Modal.Content className="max-w-[440px]">
                                    <Modal.Header
                                        description="This will remove the account from your connected accounts list."
                                        icon={ShareIcon}
                                        title="Are you sure you want to remove this account?"
                                    />

                                    <Modal.Body>
                                        <form
                                            className="sr-only"
                                            id={`destroy-connected-accounts-${provider.id}-form`}
                                            onSubmit={onSubmit}
                                        />
                                    </Modal.Body>

                                    <Modal.Footer>
                                        <Modal.Close asChild>
                                            <Button.Root
                                                $size="sm"
                                                $style="stroke"
                                                $type="neutral"
                                                className="w-full"
                                                disabled={form.processing}
                                                onClick={() => setAction(null)}
                                            >
                                                Cancel
                                            </Button.Root>
                                        </Modal.Close>
                                        <Button.Root
                                            $size="sm"
                                            $type="error"
                                            className="w-full"
                                            disabled={form.processing}
                                            form={`destroy-connected-accounts-${provider.id}-form`}
                                            type="submit"
                                        >
                                            {form.processing ? "Removing..." : "Yes, remove it"}
                                        </Button.Root>
                                    </Modal.Footer>
                                </Modal.Content>
                            </Modal.Root>
                        </ConnectedAccount>
                    );
                })}
            </div>
        </ActionSection>
    );
}
