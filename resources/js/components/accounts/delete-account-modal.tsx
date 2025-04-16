import { useForm } from "@inertiajs/react";
import Delete02Icon from "virtual:icons/hugeicons/delete-02";

import * as Button from "#/components/ui/button.tsx";
import * as Modal from "#/components/ui/modal.tsx";
import { useAccountsParams } from "#/hooks/use-accounts-params.ts";
import { routes } from "#/routes.ts";

type DeleteAccountModalProps = {
    account: Resources.Account;
};

export function DeleteAccountModal({ account }: DeleteAccountModalProps) {
    const { setParams, ...params } = useAccountsParams();
    const form = useForm();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!params.accountId) {
            return;
        }

        form.delete(routes.accounts.destroy.url({ account: account.id }), {
            preserveScroll: true,
            async onSuccess() {
                await setParams({ action: null });
            },
            onError() {
                form.reset();
            },
        });
    };

    return (
        <Modal.Root
            onOpenChange={() => setParams({ action: null, accountId: null })}
            open={params.action === "delete" && account.id === params.accountId}
        >
            <Modal.Content className="max-w-lg">
                <Modal.Header
                    description="This action cannot be undone."
                    icon={Delete02Icon}
                    title="Are you sure you want to delete this transaction?"
                />

                <Modal.Body className="p-0">
                    <form
                        {...routes.accounts.destroy.form({ account: account.id })}
                        id="delete-account-form"
                        onSubmit={handleSubmit}
                    >
                        <input name="_method" type="hidden" value="DELETE" />
                    </form>
                </Modal.Body>

                <Modal.Footer className="border-t-0">
                    <Modal.Close asChild>
                        <Button.Root
                            $size="sm"
                            $style="stroke"
                            $type="neutral"
                            className="w-full"
                            onClick={() => setParams({ action: null })}
                        >
                            Cancel
                        </Button.Root>
                    </Modal.Close>
                    <Button.Root
                        $size="sm"
                        $type="error"
                        className="w-full"
                        disabled={form.processing}
                        form="delete-account-form"
                        type="submit"
                    >
                        {form.processing ? "Deleting..." : "Yes, delete"}
                    </Button.Root>
                </Modal.Footer>
            </Modal.Content>
        </Modal.Root>
    );
}
