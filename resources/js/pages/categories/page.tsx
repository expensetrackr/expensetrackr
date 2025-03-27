import { Head, Link } from "@inertiajs/react";
import * as React from "react";
import GeometricShapes01Icon from "virtual:icons/hugeicons/geometric-shapes-01";
import ResourcesAddIcon from "virtual:icons/hugeicons/resources-add";

import { Header } from "#/components/header.tsx";
import * as Button from "#/components/ui/button.tsx";
import * as Divider from "#/components/ui/divider.tsx";
import { SettingsLayout } from "#/layouts/settings-layout.tsx";
import { type PageProps } from "#/types/globals.ts";
import { CategoryCard } from "./__components/category-card.tsx";
import { CreateCategoryModal } from "./__components/create-category-modal.tsx";

type CategoriesPageProps = {
    categories: {
        [key in App.Enums.CategoryClassification]: Array<Resources.Category>;
    };
    category: Resources.Category | null;
};

export default function CategoriesPage({ permissions, ...pageProps }: PageProps<CategoriesPageProps>) {
    return (
        <div className="flex flex-col gap-6 px-4 py-6 lg:px-8">
            <div className="flex-1 columns-1 gap-5 space-y-5 sm:columns-2">
                {Object.entries(pageProps.categories)
                    .filter(([_, categories]) => categories.length > 0)
                    .map(([classification, categories]) => (
                        <div
                            className="flex break-inside-avoid flex-col gap-1 rounded-20 bg-(--bg-white-0) p-2 pt-3 shadow-xs ring-1 ring-(--stroke-soft-200) ring-inset"
                            key={classification}
                        >
                            <Divider.Root $type="text">{classification}</Divider.Root>

                            {categories
                                .filter((category) => !category.hasParent)
                                .map((category) => (
                                    <CategoryCard
                                        categories={pageProps.categories}
                                        category={category}
                                        key={category.id}
                                    />
                                ))}
                        </div>
                    ))}
            </div>

            {permissions.canCreateCategories && <CreateCategoryModal categories={pageProps.categories} />}
        </div>
    );
}

CategoriesPage.layout = (page: React.ReactNode & { props: PageProps<CategoriesPageProps> }) => (
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
        >
            {page.props.permissions.canCreateCategories && (
                <Button.Root asChild>
                    <Link href="?action=create">
                        <Button.Icon as={ResourcesAddIcon} />
                        Add category
                    </Link>
                </Button.Root>
            )}
        </Header>

        <div className="px-4 lg:px-8">
            <Divider.Root />
        </div>

        {page}
    </SettingsLayout>
);
