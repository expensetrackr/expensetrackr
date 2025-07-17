import { useForm } from "@inertiajs/react";
import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import GeometricShapes01Icon from "virtual:icons/hugeicons/geometric-shapes-01";

import { Button } from "#/components/button.tsx";
import { classificationIcons } from "#/components/category-classification-icon.tsx";
import { categoryIcons } from "#/components/category-icon.tsx";
import { ColorField, colorSwatches } from "#/components/ui/form/color.tsx";
import { SelectField } from "#/components/ui/form/select-field.tsx";
import { TextField } from "#/components/ui/form/text-field.tsx";
import { Textarea } from "#/components/ui/form/textarea.tsx";
import * as Modal from "#/components/ui/modal.tsx";
import { useActionsParams } from "#/hooks/use-actions-params.ts";
import { routes } from "#/routes.ts";
import { type PaginatedResponse } from "#/types/pagination.ts";
import { SubmitButton } from "../submit-button.tsx";

export function CreateCategoryModal() {
    const actions = useActionsParams();
    const isOpen = actions.action === "create" && actions.resource === "categories";
    const { data: categories } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const res = await fetch(routes.api.categories.index.url({ query: { per_page: 1000 } }));

            if (!res.ok) {
                throw new Error(`Failed to fetch categories: ${res.status}`);
            }

            return (await res.json()) as PaginatedResponse<Resources.Category>;
        },
        enabled: isOpen,
    });
    const form = useForm({
        name: "",
        description: "",
        color: colorSwatches[Math.floor(Math.random() * colorSwatches.length)],
        classification: "expense" as App.Enums.Finance.CategoryClassification,
        parentId: "",
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        form.post(routes.categories.store.url(), {
            errorBag: "createCategory",
            preserveScroll: true,
            async onSuccess() {
                await actions.resetParams();
            },
            onError() {
                form.reset();
            },
        });
    };

    const groupedCategories = React.useMemo(() => {
        return categories?.data?.reduce(
            (acc, category) => {
                const classification = category.classification as App.Enums.Finance.CategoryClassification;
                if (!acc[classification]) {
                    acc[classification] = [];
                }
                acc[classification].push(category);
                return acc;
            },
            {} as Record<App.Enums.Finance.CategoryClassification, Resources.Category[]>,
        );
    }, [categories]);

    return (
        <Modal.Root onOpenChange={() => actions.resetParams()} open={isOpen}>
            <Modal.Content className="max-w-lg">
                <Modal.Header
                    description="Create a new category to organize your transactions."
                    icon={GeometricShapes01Icon}
                    title="Create Category"
                />

                <Modal.Body>
                    <form
                        action={routes.categories.store.url()}
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
                            <SelectField
                                error={form.errors.classification}
                                id="classification"
                                label="Classification"
                                name="classification"
                                onValueChange={(value) => {
                                    form.setData("classification", value as App.Enums.Finance.CategoryClassification);
                                    form.reset("parentId");
                                }}
                                options={["income", "expense", "transfer", "savings", "other"].map(
                                    (classification) => ({
                                        value: classification,
                                        label: classification,
                                        icon: classificationIcons[
                                            classification as App.Enums.Finance.CategoryClassification
                                        ],
                                    }),
                                )}
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
                                    groupedCategories?.[form.data.classification]
                                        ?.filter((category) => !category.children?.length)
                                        ?.map((category) => ({
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
                        <Button
                            $size="sm"
                            $style="stroke"
                            $type="neutral"
                            className="w-full"
                            disabled={form.processing}
                            onClick={() => actions.resetParams()}
                        >
                            Cancel
                        </Button>
                    </Modal.Close>
                    <SubmitButton
                        $size="sm"
                        className="w-full"
                        form="create-category-form"
                        isSubmitting={form.processing}
                    >
                        {form.processing ? "Creating..." : "Create"}
                    </SubmitButton>
                </Modal.Footer>
            </Modal.Content>
        </Modal.Root>
    );
}
