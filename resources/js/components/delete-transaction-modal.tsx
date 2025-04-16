import { useForm } from "@inertiajs/react";
import Delete02Icon from "virtual:icons/hugeicons/delete-02";

import * as Button from "#/components/ui/button.tsx";
import * as Modal from "#/components/ui/modal.tsx";
import { useTransactionsParams } from "#/hooks/use-transactions-params.ts";
import { routes } from "#/routes.ts";

type DeleteTransactionModalProps = {
    transaction: Resources.Transaction;
};

export function DeleteTransactionModal({ transaction }: DeleteTransactionModalProps) {
    const { setParams, ...params } = useTransactionsParams();
    const form = useForm();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!params.transactionId) {
            return;
        }

        form.delete(routes.transactions.destroy.url({ transaction: transaction.id }), {
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
            onOpenChange={() => setParams({ action: null, transactionId: null })}
            open={params.action === "delete" && transaction.id === params.transactionId}
        >
            <Modal.Content className="max-w-lg">
                <Modal.Header
                    description="This action cannot be undone."
                    icon={Delete02Icon}
                    title="Are you sure you want to delete this transaction?"
                />

                <Modal.Body className="p-0">
                    <form
                        {...routes.transactions.destroy.form({ transaction: transaction.id })}
                        id="delete-transaction-form"
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
                        form="delete-transaction-form"
                        type="submit"
                    >
                        {form.processing ? "Deleting..." : "Yes, delete"}
                    </Button.Root>
                </Modal.Footer>
            </Modal.Content>
        </Modal.Root>
    );
}
