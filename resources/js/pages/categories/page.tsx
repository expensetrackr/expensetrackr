import { Head } from "@inertiajs/react";
import * as React from "react";
import Delete02Icon from "virtual:icons/hugeicons/delete-02";
import Edit02Icon from "virtual:icons/hugeicons/edit-02";
import GeometricShapes01Icon from "virtual:icons/hugeicons/geometric-shapes-01";
import MoreVerticalIcon from "virtual:icons/hugeicons/more-vertical";

import { CategoryIcon } from "#/components/category-icon.tsx";
import { Header } from "#/components/header.tsx";
import * as Badge from "#/components/ui/badge.tsx";
import * as Button from "#/components/ui/button.tsx";
import * as Divider from "#/components/ui/divider.tsx";
import * as Dropdown from "#/components/ui/dropdown.tsx";
import { useCategoriesParams } from "#/hooks/use-categories-params.ts";
import { SettingsLayout } from "#/layouts/settings-layout.tsx";
import { type PageProps } from "#/types/globals.ts";
import { DetailsModal } from "./__components/details-modal.tsx";

type CategoriesPageProps = {
    categories: {
        [key in App.Enums.CategoryClassification]: Array<Resources.Category>;
    };
    category: Resources.Category | null;
    permissions: {
        canCreateCategories: boolean;
    };
};

export default function CategoriesPage({ categories, category }: CategoriesPageProps) {
    const { setParams } = useCategoriesParams();

    return (
        <div className="flex flex-col gap-6 px-4 py-6 lg:px-8">
            <div className="flex-1 columns-1 gap-5 space-y-5 sm:columns-2">
                {Object.entries(categories).map(([classification, categories]) => (
                    <div
                        className="flex break-inside-avoid flex-col gap-1 rounded-20 bg-(--bg-white-0) p-2 pt-3 shadow-xs ring-1 ring-(--stroke-soft-200) ring-inset"
                        key={classification}
                    >
                        <Divider.Root $type="text">{classification}</Divider.Root>

                        {categories.map((category) => (
                            <React.Fragment key={category.id}>
                                <div className="flex items-center gap-3 p-2">
                                    <div
                                        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-(--color-category-color)/10 shadow-xs ring-(--stroke-soft-200)"
                                        style={
                                            {
                                                "--color-category-color": category?.color,
                                            } as React.CSSProperties
                                        }
                                    >
                                        <CategoryIcon
                                            category={category.slug}
                                            className="size-5 text-(--color-category-color)"
                                            style={
                                                {
                                                    "--color-category-color": category.color,
                                                } as React.CSSProperties
                                            }
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <div className="truncate text-label-sm">{category.name}</div>
                                        {/* <div className="mt-1 text-paragraph-xs text-(--text-sub-600)">{category.slug}</div> */}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {category.isSystem ? (
                                            <Badge.Root $color="gray" $size="md" $style="lighter">
                                                System
                                            </Badge.Root>
                                        ) : null}

                                        <Dropdown.Root>
                                            <Dropdown.Trigger asChild>
                                                <Button.Root $size="xs" $style="ghost" $type="neutral">
                                                    <Button.Icon as={MoreVerticalIcon} className="size-6" />
                                                </Button.Root>
                                            </Dropdown.Trigger>

                                            <Dropdown.Content align="end" className="w-40">
                                                {category.permissions.canUpdate ? (
                                                    <Dropdown.Item
                                                        onClick={() => setParams({ categoryId: category.id })}
                                                    >
                                                        <Dropdown.ItemIcon as={Edit02Icon} />
                                                        Edit
                                                    </Dropdown.Item>
                                                ) : null}
                                                {category.permissions.canDelete ? (
                                                    <Dropdown.Item>
                                                        <Dropdown.ItemIcon as={Delete02Icon} />
                                                        Delete
                                                    </Dropdown.Item>
                                                ) : null}
                                            </Dropdown.Content>
                                        </Dropdown.Root>
                                    </div>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                ))}
            </div>

            {category ? <DetailsModal category={category} /> : null}
        </div>
    );
}

CategoriesPage.layout = (page: React.ReactNode & { props: PageProps }) => (
    <SettingsLayout {...page.props}>
        <Head title="Categories" />

        <Header
            contentClassName="hidden lg:flex"
            description="Manage your categories and add new ones."
            icon={
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-(--bg-white-0) shadow-xs ring-1 ring-(--stroke-soft-200) ring-inset">
                    <GeometricShapes01Icon className="size-6 text-(--text-sub-600)" />
                </div>
            }
            title="Categories"
        />

        <div className="px-4 lg:px-8">
            <Divider.Root />
        </div>

        {page}
    </SettingsLayout>
);
