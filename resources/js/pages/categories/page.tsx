import { Head } from "@inertiajs/react";
import * as React from "react";
import GeometricShapes01SolidIcon from "virtual:icons/hugeicons/geometric-shapes-01-solid";
import ResourcesAddIcon from "virtual:icons/hugeicons/resources-add";

import { Button } from "#/components/button.tsx";
import { Header } from "#/components/page-header.tsx";
import * as Divider from "#/components/ui/divider.tsx";
import { useActionsParams } from "#/hooks/use-actions-params.ts";
import { SettingsLayout } from "#/layouts/settings-layout.tsx";
import { type PageProps } from "#/types/globals.ts";
import { CategoryCard } from "./__components/category-card.tsx";

type CategoriesPageProps = {
    categories: {
        [key in App.Enums.Finance.CategoryClassification]: Array<Resources.Category>;
    };
    category: Resources.Category | null;
};

export default function CategoriesPage({ permissions, ...pageProps }: PageProps<CategoriesPageProps>) {
    const actions = useActionsParams();

    return (
        <>
            <Header
                contentClassName="hidden lg:flex"
                description="Manage your categories and add new ones."
                icon={
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-(--bg-white-0) shadow-xs ring-1 ring-(--stroke-soft-200) ring-inset">
                        <GeometricShapes01SolidIcon className="size-6 text-(--text-sub-600)" />
                    </div>
                }
                title="Categories"
            >
                {permissions.canCreateCategories && (
                    <Button
                        leadingIcon={ResourcesAddIcon}
                        onClick={() => actions.setParams({ action: "create", resource: "categories" })}
                    >
                        Add category
                    </Button>
                )}
            </Header>

            <div className="px-4 lg:px-8">
                <Divider.Root />
            </div>

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
            </div>
        </>
    );
}

CategoriesPage.layout = (page: React.ReactNode & { props: PageProps<CategoriesPageProps> }) => (
    <SettingsLayout {...page.props}>
        <Head title="Categories" />

        {page}
    </SettingsLayout>
);
