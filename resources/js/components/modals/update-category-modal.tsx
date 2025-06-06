import { useForm } from "@inertiajs/react";
import { useQueries } from "@tanstack/react-query";
import * as React from "react";

import { classificationIcons } from "#/components/category-classification-icon.tsx";
import { categoryIcons } from "#/components/category-icon.tsx";
import * as Button from "#/components/ui/button.tsx";
import { ColorField } from "#/components/ui/form/color.tsx";
import { SelectField } from "#/components/ui/form/select-field.tsx";
import { TextField } from "#/components/ui/form/text-field.tsx";
import { Textarea } from "#/components/ui/form/textarea.tsx";
import * as Modal from "#/components/ui/modal.tsx";
import { useActionsParams } from "#/hooks/use-actions-params.ts";
import { routes } from "#/routes.ts";
import { type PaginatedResponse } from "#/types/pagination.ts";

export function UpdateCategoryModal() {
    const actions = useActionsParams();
    const isOpen = actions.action === "update" && actions.resource === "categories" && !!actions.resourceId;
    const [{ data: category }, { data: categories }] = useQueries({
        queries: [
            {
                queryKey: ["category"],
                queryFn: async () => {
                    const res = await fetch(routes.api.categories.show.url({ category: actions.resourceId ?? "" }));

                    if (!res.ok) {
                        throw new Error(`Failed to fetch category: ${res.statusText}`);
                    }

                    return (await res.json()) as Resources.Category;
                },
                enabled: isOpen,
            },
            {
                queryKey: ["categories"],
                queryFn: async () => {
                    const res = await fetch(routes.api.categories.index.url({ query: { per_page: 100 } }));
                    return (await res.json()) as PaginatedResponse<Resources.Category>;
                },
                enabled: isOpen,
            },
        ],
    });
    const form = useForm({
        name: category?.name,
        color: category?.color,
        description: category?.description || "",
        classification: category?.classification as App.Enums.Finance.CategoryClassification,
        parentId: category?.parentId,
    });

    const { setData, reset } = form;

    React.useEffect(() => {
        if (category) {
            setData({
                name: category.name,
                color: category.color,
                description: category.description || "",
                classification: category.classification as App.Enums.Finance.CategoryClassification,
                parentId: category.parentId,
            });
        }

        return () => {
            reset();
        };
    }, [category, setData, reset]);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!category?.id) {
            return;
        }

        form.put(
            routes.categories.update.url({
                category: category?.id,
            }),
            {
                errorBag: "updateCategory",
                preserveScroll: true,
                async onSuccess() {
                    await actions.resetParams();
                },
                onError() {
                    form.reset();
                },
            },
        );
    };

    const handleClose = async () => {
        await actions.resetParams();
    };

    const groupedCategories = React.useMemo(() => {
        return categories?.data?.reduce(
            (acc, category) => {
                if (!category || typeof category !== "object") {
                    console.warn("Skipping malformed category entry:", category);
                    return acc;
                }

                if (!category.classification || typeof category.classification !== "string") {
                    console.warn("Skipping category with invalid classification:", category);
                    return acc;
                }

                const validClassifications = ["income", "expense", "transfer", "other"];
                if (!validClassifications.includes(category.classification)) {
                    console.warn("Skipping category with unknown classification:", category.classification);
                    return acc;
                }

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
        <Modal.Root key={category?.id || "update-category-modal"} onOpenChange={handleClose} open={isOpen}>
            <Modal.Content aria-describedby={undefined} className="max-w-[440px]">
                <Modal.Body className="flex items-start gap-4">
                    <form
                        {...(category?.id
                            ? routes.categories.update.form({
                                  category: category?.id ?? "",
                              })
                            : {})}
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
                                    form.setData("classification", value as App.Enums.Finance.CategoryClassification);
                                    form.setData("parentId", "");
                                }}
                                options={["income", "expense", "transfer", "other"].map((classification) => ({
                                    value: classification,
                                    label: classification,
                                    icon: classificationIcons[
                                        classification as App.Enums.Finance.CategoryClassification
                                    ],
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
                                    groupedCategories?.[form.data.classification]?.map(
                                        (category: Resources.Category) => ({
                                            value: category.id,
                                            label: category.name,
                                            icon: categoryIcons[category.slug as keyof typeof categoryIcons],
                                        }),
                                    ) ?? []
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
                            onClick={handleClose}
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
