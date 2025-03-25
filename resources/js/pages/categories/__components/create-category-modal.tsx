import { useForm } from "@inertiajs/react";
import GeometricShapes01Icon from "virtual:icons/hugeicons/geometric-shapes-01";

import { classificationIcons } from "#/components/category-classification-icon.tsx";
import { categoryIcons } from "#/components/category-icon.tsx";
import { ColorField, colorSwatches } from "#/components/form/color.tsx";
import { Select } from "#/components/form/select.tsx";
import { TextField } from "#/components/form/text-field.tsx";
import { Textarea } from "#/components/form/textarea.tsx";
import * as Button from "#/components/ui/button.tsx";
import * as Modal from "#/components/ui/modal.tsx";
import { useCategoriesParams } from "#/hooks/use-categories-params.ts";

type CreateCategoryModalProps = {
    categories: {
        [key in App.Enums.CategoryClassification]: Array<Resources.Category>;
    };
};

export function CreateCategoryModal({ categories }: CreateCategoryModalProps) {
    const { setParams, ...params } = useCategoriesParams();
    const form = useForm({
        name: "",
        description: "",
        color: colorSwatches[Math.floor(Math.random() * colorSwatches.length)],
        classification: "expense" as App.Enums.CategoryClassification,
        parentId: "",
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        form.post(route("categories.store"), {
            errorBag: "createCategory",
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
        <Modal.Root onOpenChange={() => setParams({ action: null })} open={params.action === "create"}>
            <Modal.Content className="max-w-lg">
                <Modal.Header
                    description="Create a new category to organize your transactions."
                    icon={GeometricShapes01Icon}
                    title="Create Category"
                />

                <Modal.Body>
                    <form
                        action={route("categories.store")}
                        className="flex w-full flex-col gap-3"
                        id="create-category-form"
                        method="POST"
                        onSubmit={onSubmit}
                    >
                        <input name="_method" type="hidden" value="POST" />

                        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
                            <TextField
                                autoComplete="off"
                                autoFocus
                                disabled={form.processing}
                                error={form.errors.name}
                                id="name"
                                label="Name"
                                name="name"
                                onChange={(e) => form.setData("name", e.target.value)}
                                placeholder="Groceries"
                                type="text"
                                value={form.data.name}
                                wrapperClassName="lg:col-span-2"
                            />

                            <ColorField
                                color={form.data.color}
                                error={form.errors.color}
                                label="Color"
                                name="color"
                                onColorChange={(value) => form.setData("color", value)}
                            />
                        </div>

                        <Textarea
                            disabled={form.processing}
                            error={form.errors.description}
                            id="description"
                            label="Description"
                            labelSub="(optional)"
                            name="description"
                            onChange={(e) => form.setData("description", e.target.value)}
                            placeholder="This category is for groceries"
                            value={form.data.description}
                        />

                        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                            <Select
                                error={form.errors.classification}
                                id="classification"
                                label="Classification"
                                name="classification"
                                onValueChange={(value) => {
                                    form.setData("classification", value as App.Enums.CategoryClassification);
                                    form.reset("parentId");
                                }}
                                options={["income", "expense", "transfer", "other"].map((classification) => ({
                                    value: classification,
                                    label: classification,
                                    icon: classificationIcons[classification as App.Enums.CategoryClassification],
                                }))}
                                value={form.data.classification}
                            />

                            <Select
                                error={form.errors.parentId}
                                id="parentId"
                                label="Parent category"
                                labelSub="(optional)"
                                name="parentId"
                                onValueChange={(value) => form.setData("parentId", value)}
                                options={categories[form.data.classification]
                                    .filter((category) => !category.hasChildren)
                                    .map((category) => ({
                                        value: category.id,
                                        label: category.name,
                                        icon: categoryIcons[category.slug as keyof typeof categoryIcons],
                                    }))}
                                value={form.data.parentId}
                            />
                        </div>
                    </form>
                </Modal.Body>

                <Modal.Footer>
                    <Modal.Close asChild>
                        <Button.Root
                            $size="sm"
                            $style="stroke"
                            $type="neutral"
                            className="w-full"
                            disabled={form.processing}
                            onClick={() => setParams({ action: null })}
                        >
                            Cancel
                        </Button.Root>
                    </Modal.Close>
                    <Button.Root
                        $size="sm"
                        className="w-full"
                        disabled={form.processing}
                        form="create-category-form"
                        type="submit"
                    >
                        {form.processing ? "Creating..." : "Create"}
                    </Button.Root>
                </Modal.Footer>
            </Modal.Content>
        </Modal.Root>
    );
}
