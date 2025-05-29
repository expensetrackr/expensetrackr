import { useForm } from "@inertiajs/react";
import Delete02Icon from "virtual:icons/hugeicons/delete-02";

import * as Button from "#/components/ui/button.tsx";
import * as Modal from "#/components/ui/modal.tsx";
import { useActionsParams } from "#/hooks/use-actions-params.ts";
import { routes } from "#/routes.ts";

type DeleteAccountModalProps = {
    account: Resources.Account;
};

export function DeleteAccountModal({ account }: DeleteAccountModalProps) {
    const actions = useActionsParams();
    const form = useForm();
    const isOpen = actions.action === "delete" && actions.resource === "accounts" && account.id === actions.resourceId;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!actions.resourceId) {
            return;
        }

        form.delete(routes.accounts.destroy.url({ account: account.id }), {
            preserveScroll: true,
            async onSuccess() {
                await actions.resetParams();
            },
            onError() {
                form.reset();
            },
        });
    };

    return (
        <Modal.Root onOpenChange={() => actions.resetParams()} open={isOpen}>
            <Modal.Content className="max-w-lg">
                <Modal.Header
                    description="This action cannot be undone."
                    icon={Delete02Icon}
                    title="Are you sure you want to delete this account?"
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
                            onClick={() => actions.resetParams()}
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
