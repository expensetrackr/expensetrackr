import { useForm } from "@inertiajs/react";
import Delete02Icon from "virtual:icons/hugeicons/delete-02";

import * as Button from "#/components/ui/button.tsx";
import * as Modal from "#/components/ui/modal.tsx";
import { useCategoriesParams } from "#/hooks/use-categories-params.ts";

type DeleteCategoryModalProps = {
    category: Resources.Category;
};

export function DeleteCategoryModal({ category }: DeleteCategoryModalProps) {
    const { setParams, ...params } = useCategoriesParams();
    const form = useForm();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!params.categoryId) {
            return;
        }

        form.delete(route("categories.destroy", [category.id]), {
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
            onOpenChange={() => setParams({ action: null, categoryId: null })}
            open={params.action === "delete" && category.id === params.categoryId}
        >
            <Modal.Content className="max-w-lg">
                <Modal.Header
                    description="This action cannot be undone."
                    icon={Delete02Icon}
                    title="Are you sure you want to delete this category?"
                />

                <Modal.Body className="p-0">
                    <form
                        action={route("categories.destroy", [category.id])}
                        id="delete-category-form"
                        method="POST"
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
                        form="delete-category-form"
                        type="submit"
                    >
                        Yes, delete
                    </Button.Root>
                </Modal.Footer>
            </Modal.Content>
        </Modal.Root>
    );
}
