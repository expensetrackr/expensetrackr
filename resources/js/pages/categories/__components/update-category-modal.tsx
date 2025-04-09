import { useForm } from "@inertiajs/react";
import * as React from "react";

import { classificationIcons } from "#/components/category-classification-icon.tsx";
import { categoryIcons } from "#/components/category-icon.tsx";
import { ColorField } from "#/components/form/color.tsx";
import { SelectField } from "#/components/form/select-field.tsx";
import { TextField } from "#/components/form/text-field.tsx";
import { Textarea } from "#/components/form/textarea.tsx";
import * as Button from "#/components/ui/button.tsx";
import * as Modal from "#/components/ui/modal.tsx";
import { useCategoriesParams } from "#/hooks/use-categories-params.ts";
import { routes } from "#/routes.ts";

type UpdateCategoryModalProps = {
    categories: {
        [key in App.Enums.CategoryClassification]: Array<Resources.Category>;
    };
    category: Resources.Category;
};

export function UpdateCategoryModal({ categories, category }: UpdateCategoryModalProps) {
    const { setParams, ...params } = useCategoriesParams();
    const form = useForm({
        name: category.name,
        color: category.color,
        description: category.description || "",
        classification: category.classification,
        parentId: category.parentId,
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        form.put(
            routes.categories.update.url({
                category: category.id,
            }),
            {
                errorBag: "updateCategory",
                preserveScroll: true,
                async onSuccess() {
                    await setParams({ action: null, categoryId: null });
                },
                onError() {
                    form.reset();
                },
            },
        );
    };

    return (
        <Modal.Root
            key={category.id}
            onOpenChange={() => setParams({ action: null, categoryId: null })}
            open={params.action === "update" && category.id === params.categoryId}
        >
            <Modal.Content aria-describedby={undefined} className="max-w-[440px]">
                <Modal.Body className="flex items-start gap-4">
                    <form
                        {...routes.categories.update.form({
                            category: category.id,
                        })}
                        className="flex w-full flex-col gap-3"
                        id="update-category-form"
                        onSubmit={onSubmit}
                    >
                        <input name="_method" type="hidden" value="PUT" />

                        <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">
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
                                wrapperClassName="lg:col-span-3"
                            />

                            <ColorField
                                color={form.data.color}
                                error={form.errors.color}
                                label="Color"
                                name="color"
                                onColorChange={(value) => form.setData("color", value)}
                                wrapperClassName="lg:col-span-2"
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
                            <SelectField
                                error={form.errors.classification}
                                id="classification"
                                label="Classification"
                                name="classification"
                                onValueChange={(value) => {
                                    form.setData("classification", value as App.Enums.CategoryClassification);
                                    form.setData("parentId", "");
                                }}
                                options={["income", "expense", "transfer", "other"].map((classification) => ({
                                    value: classification,
                                    label: classification,
                                    icon: classificationIcons[classification as App.Enums.CategoryClassification],
                                }))}
                                value={form.data.classification}
                            />

                            <SelectField
                                error={form.errors.parentId}
                                id="parentId"
                                label="Parent category"
                                labelSub="(optional)"
                                name="parentId"
                                onValueChange={(value) => form.setData("parentId", value)}
                                options={
                                    categories[form.data.classification]?.map((category) => ({
                                        value: category.id,
                                        label: category.name,
                                        icon: categoryIcons[category.slug as keyof typeof categoryIcons],
                                    })) ?? []
                                }
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
                            onClick={() => setParams({ categoryId: null })}
                        >
                            Cancel
                        </Button.Root>
                    </Modal.Close>
                    <Button.Root
                        $size="sm"
                        className="w-full"
                        disabled={form.processing}
                        form="update-category-form"
                        type="submit"
                    >
                        {form.processing ? "Updating..." : "Update"}
                    </Button.Root>
                </Modal.Footer>
            </Modal.Content>
        </Modal.Root>
    );
}
