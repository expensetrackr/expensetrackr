import { useForm } from "@inertiajs/react";
import { useQueries } from "@tanstack/react-query";
import * as React from "react";
import { toast } from "sonner";
import Delete02Icon from "virtual:icons/hugeicons/delete-02";

import { CategoryIcon } from "#/components/category-icon.tsx";
import { Image } from "#/components/image.tsx";
import * as Avatar from "#/components/ui/avatar.tsx";
import * as Badge from "#/components/ui/badge.tsx";
import * as Divider from "#/components/ui/divider.tsx";
import * as Drawer from "#/components/ui/drawer.tsx";
import { SelectField } from "#/components/ui/form/select-field.tsx";
import { TextField } from "#/components/ui/form/text-field.tsx";
import { Textarea } from "#/components/ui/form/textarea.tsx";
import { useActionsParams } from "#/hooks/use-actions-params.ts";
import { useTranslation } from "#/hooks/use-translation.ts";
import { routes } from "#/routes.ts";
import { type PaginatedResponse } from "#/types/pagination.ts";
import { currencyFormatter } from "#/utils/number-formatter.ts";
import { Button } from "../button.tsx";
import { SubmitButton } from "../submit-button.tsx";
import { Skeleton } from "../ui/skeleton.tsx";

export function TransactionDetailsDrawer() {
    const actions = useActionsParams();
    const { language, t } = useTranslation();
    const form = useForm({
        name: "",
        note: "",
        type: "",
        categoryId: "",
    });
    const isOpen = actions.action === "read" && actions.resource === "transactions" && !!actions.resourceId;
    const [{ data: transaction, isLoading }, { data: categories }] = useQueries({
        queries: [
            {
                queryKey: ["transactions", actions.resourceId],
                queryFn: async () => {
                    const res = await fetch(routes.api.transactions.show.url({ public_id: actions.resourceId ?? "" }));
                    return (await res.json()) as Resources.Transaction;
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
        subscribed: true,
    });
    const { setData, reset } = form;

    React.useEffect(() => {
        if (transaction) {
            setData({
                name: transaction.name,
                note: transaction.note ?? "",
                type: transaction.type ?? "",
                categoryId: transaction.category?.id ?? "",
            });
        }

        return () => {
            reset();
        };
    }, [transaction, setData, reset]);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!transaction || isLoading) {
            return;
        }

        form.put(routes.transactions.update.url({ transaction: transaction?.id ?? "" }), {
            errorBag: "updateTransaction",
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Transaction updated.");
            },
            onError: () => {
                toast.error("Failed to update transaction.");
                form.reset();
            },
        });
    };

    return (
        <Drawer.Root onOpenChange={() => actions.resetParams()} open={isOpen}>
            <Drawer.Content>
                <Drawer.Header>
                    <Drawer.Title>Transaction Details</Drawer.Title>
                    <Drawer.Description className="sr-only">{t("transactions.details.description")}</Drawer.Description>
                </Drawer.Header>

                <Drawer.Body>
                    <Divider.Root $type="solid-text">amount & account</Divider.Root>

                    <div className="p-5">
                        <div className="text-h4">
                            {isLoading ? (
                                <Skeleton className="h-10 w-full" />
                            ) : (
                                transaction?.amount &&
                                currencyFormatter({
                                    currency: transaction?.currency,
                                    locale: language,
                                    amount: transaction?.amount,
                                })
                            )}
                        </div>
                        <div className="mt-1 text-paragraph-sm text-(--text-sub-600)">
                            {isLoading ? <Skeleton className="h-5 w-full" /> : transaction?.account?.name}
                        </div>
                    </div>

                    {transaction?.baseAmount && (
                        <>
                            <Divider.Root $type="solid-text">source amount</Divider.Root>

                            <div className="flex flex-col gap-3 p-5">
                                <div>
                                    <div className="text-subheading-xs text-(--text-soft-400) uppercase">
                                        Base amount
                                    </div>
                                    <div className="mt-1 text-label-sm">
                                        {currencyFormatter({
                                            currency: transaction?.baseCurrency,
                                            locale: language,
                                            amount: transaction?.baseAmount,
                                        })}
                                    </div>
                                </div>

                                {transaction?.baseCurrency && (
                                    <>
                                        <Divider.Root $type="line-spacing" />

                                        <div>
                                            <div className="text-subheading-xs text-(--text-soft-400) uppercase">
                                                Base currency
                                            </div>
                                            <div className="mt-1 text-label-sm">{transaction?.baseCurrency}</div>
                                        </div>
                                    </>
                                )}

                                {transaction?.currencyRate && (
                                    <>
                                        <Divider.Root $type="line-spacing" />

                                        <div>
                                            <div className="text-subheading-xs text-(--text-soft-400) uppercase">
                                                Currency rate
                                            </div>
                                            <div className="mt-1 text-label-sm">
                                                <span>
                                                    {currencyFormatter({
                                                        locale: language,
                                                        options: {
                                                            currencyDisplay: "code",
                                                        },
                                                        amount: 1,
                                                    })}
                                                </span>
                                                <span className="text-(--text-sub-600)">&nbsp;=&nbsp;</span>
                                                {currencyFormatter({
                                                    currency: transaction?.baseCurrency,
                                                    locale: language,
                                                    amount: transaction?.currencyRate,
                                                    options: {
                                                        maximumFractionDigits: 6,
                                                        currencyDisplay: "code",
                                                    },
                                                })}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </>
                    )}

                    {transaction?.merchant && (
                        <>
                            <Divider.Root $type="solid-text">Merchant</Divider.Root>

                            <div className="flex items-center gap-4 p-5">
                                {transaction?.merchant?.icon ? (
                                    <Avatar.Root $size="48" color="purple">
                                        <Avatar.Image asChild src={transaction?.merchant?.icon}>
                                            <Image
                                                alt={transaction?.merchant?.name}
                                                height={48}
                                                src={transaction?.merchant?.icon}
                                                width={48}
                                            />
                                        </Avatar.Image>
                                    </Avatar.Root>
                                ) : (
                                    <CategoryIcon category={transaction?.category?.slug} className="size-12" />
                                )}
                                <div>
                                    <div className="text-label-lg">{transaction?.merchant?.name}</div>
                                    {transaction?.merchant?.category && (
                                        <div className="mt-1 text-paragraph-sm text-(--text-sub-600)">
                                            {transaction?.merchant?.category}
                                        </div>
                                    )}
                                    {transaction?.merchant?.website && (
                                        <div className="mt-1 text-paragraph-sm text-(--text-sub-600)">
                                            <a
                                                className="rounded-4 hover:underline focus:underline focus:shadow-button-important-focus focus:outline-none"
                                                href={`https://${transaction?.merchant?.website}`}
                                                rel="noopener noreferrer"
                                                target="_blank"
                                            >
                                                {transaction?.merchant?.website}
                                            </a>
                                        </div>
                                    )}
                                    {transaction?.merchant?.address && (
                                        <div className="mt-1 text-paragraph-sm text-(--text-sub-600)">
                                            {[
                                                transaction.merchant.address.line1,
                                                transaction.merchant.address.city,
                                                transaction.merchant.address.state,
                                                transaction.merchant.address.postalCode,
                                                transaction.merchant.address.country,
                                            ]
                                                .filter(Boolean)
                                                .join(", ")}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    <Divider.Root $type="solid-text">Details</Divider.Root>

                    <form
                        {...routes.transactions.update.form({ transaction: transaction?.id ?? "" })}
                        className="flex flex-col gap-3 p-5"
                        id="update-transaction-form"
                        onSubmit={onSubmit}
                    >
                        <input name="_method" type="hidden" value="PUT" />
                        <input name="categoryId" type="hidden" value={form.data.categoryId} />

                        <TextField
                            disabled={form.processing || isLoading}
                            error={form.errors.name}
                            id="name"
                            label="Name"
                            labelClassName="text-subheading-xs text-(--text-soft-400) uppercase"
                            name="name"
                            onChange={(e) => form.setData("name", e.target.value)}
                            placeholder="Enter a name for this transaction"
                            readOnly={isLoading}
                            value={form.data.name}
                            wrapperClassName="mt-1"
                        />

                        <Divider.Root $type="line-spacing" />

                        <div>
                            <div className="text-subheading-xs text-(--text-soft-400) uppercase">Transaction Type</div>
                            <div className="mt-1 text-label-sm">{t(`enum.transaction.type.${transaction?.type}`)}</div>
                        </div>

                        <Divider.Root $type="line-spacing" />

                        <SelectField
                            disabled={form.processing || isLoading}
                            error={form.errors.categoryId}
                            id="categoryId"
                            label="Category"
                            labelClassName="text-subheading-xs text-(--text-soft-400) uppercase"
                            name="categoryId"
                            onValueChange={(value) => form.setData("categoryId", value)}
                            options={
                                categories?.data?.map((category) => ({
                                    value: category.id,
                                    label: (
                                        <div className="inline-flex items-center gap-1.5 text-paragraph-sm text-(--text-sub-600)">
                                            <Badge.Root
                                                className="size-2.5 bg-(--color-category-color) p-0"
                                                style={
                                                    {
                                                        "--color-category-color": category.color,
                                                    } as React.CSSProperties
                                                }
                                            ></Badge.Root>
                                            <span>{category.name}</span>
                                        </div>
                                    ),
                                })) ?? []
                            }
                            value={form.data.categoryId}
                        />

                        <Divider.Root $type="line-spacing" />

                        <Textarea
                            disabled={form.processing || isLoading}
                            error={form.errors.note}
                            id="note"
                            label="Notes"
                            labelClassName="text-subheading-xs text-(--text-soft-400) uppercase"
                            name="note"
                            onChange={(e) => form.setData("note", e.target.value)}
                            readOnly={isLoading}
                            value={form.data.note}
                            wrapperClassName="mt-1"
                        />
                    </form>
                </Drawer.Body>

                <Drawer.Footer className="grid gap-2">
                    <SubmitButton
                        $size="md"
                        $type="primary"
                        className="flex-1"
                        form="update-transaction-form"
                        isSubmitting={form.processing}
                        type="submit"
                    >
                        {form.processing ? "Updating..." : "Update transaction"}
                    </SubmitButton>

                    <Button
                        $size="md"
                        $style="ghost"
                        $type="error"
                        className="w-full"
                        leadingIcon={Delete02Icon}
                        onClick={() => actions.setParams({ action: "delete" })}
                    >
                        Delete Transaction
                    </Button>
                </Drawer.Footer>
            </Drawer.Content>
        </Drawer.Root>
    );
}
