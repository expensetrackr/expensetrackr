import * as React from "react";
import ArrowMoveDownRightIcon from "virtual:icons/hugeicons/arrow-move-down-right";
import Delete02Icon from "virtual:icons/hugeicons/delete-02";
import Edit02Icon from "virtual:icons/hugeicons/edit-02";
import InformationCircleIcon from "virtual:icons/hugeicons/information-circle";
import MoreVerticalIcon from "virtual:icons/hugeicons/more-vertical";

import { CategoryIcon } from "#/components/category-icon.tsx";
import * as Badge from "#/components/ui/badge.tsx";
import * as Button from "#/components/ui/button.tsx";
import * as Dropdown from "#/components/ui/dropdown.tsx";
import * as Tooltip from "#/components/ui/tooltip.tsx";
import { useActionsParams } from "#/hooks/use-actions-params.ts";
import { cn } from "#/utils/cn.ts";

type CategoryCardProps = {
    category: Resources.Category;
    categories: {
        [key in App.Enums.Finance.CategoryClassification]: Array<Resources.Category>;
    };
    isChild?: boolean;
};

export function CategoryCard({ category, categories, isChild = false }: CategoryCardProps) {
    const actions = useActionsParams();

    const handleUpdateClick = async () => {
        await actions.setParams({ action: "update", resource: "categories", resourceId: category.id });
    };

    const handleDeleteClick = async () => {
        await actions.setParams({ action: "delete", resource: "categories", resourceId: category.id });
    };

    return (
        <React.Fragment>
            <div
                className={cn(
                    "flex flex-col rounded-12 transition-colors duration-200",
                    category.children?.length && "group/details",
                    !isChild && "p-2",
                )}
            >
                <div className="flex items-center gap-3 outline-none">
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
                        <div className="flex items-center gap-1 truncate text-label-sm">
                            {category.name}
                            {category.description ? (
                                <Tooltip.Root>
                                    <Tooltip.Trigger>
                                        <InformationCircleIcon className="size-4 text-(--text-sub-600)" />
                                    </Tooltip.Trigger>
                                    <Tooltip.Content className="max-w-80">{category.description}</Tooltip.Content>
                                </Tooltip.Root>
                            ) : null}
                        </div>
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
                                {category.permissions?.canUpdate ? (
                                    <Dropdown.Item onClick={handleUpdateClick}>
                                        <Dropdown.ItemIcon as={Edit02Icon} />
                                        Edit
                                    </Dropdown.Item>
                                ) : null}
                                {category.permissions?.canDelete ? (
                                    <Dropdown.Item onClick={handleDeleteClick}>
                                        <Dropdown.ItemIcon as={Delete02Icon} />
                                        Delete
                                    </Dropdown.Item>
                                ) : null}
                            </Dropdown.Content>
                        </Dropdown.Root>
                    </div>
                </div>

                {category.children?.map((child, index, array) => (
                    <div className="relative flex items-center gap-2" key={child.id}>
                        <div className="flex size-10 shrink-0 items-center justify-center">
                            <ArrowMoveDownRightIcon className="size-5 text-(--text-sub-600)" />
                        </div>

                        <div
                            className={cn(
                                "relative flex-1",
                                // if is last only add pt-1
                                index === array.length - 1 ? "pt-1.5" : "py-1.5",
                            )}
                        >
                            <CategoryCard categories={categories} category={child} isChild />
                        </div>
                    </div>
                ))}
            </div>
        </React.Fragment>
    );
}
