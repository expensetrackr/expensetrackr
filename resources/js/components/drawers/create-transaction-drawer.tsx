import { useForm } from "@inertiajs/react";
import { useQueries } from "@tanstack/react-query";
import { CurrencyInput } from "headless-currency-input";
import * as React from "react";
import BankIcon from "virtual:icons/hugeicons/bank";
import GeometricShapes01Icon from "virtual:icons/hugeicons/geometric-shapes-01";
import RepeatIcon from "virtual:icons/hugeicons/repeat";
import TransactionIcon from "virtual:icons/hugeicons/transaction";

import { useActionsParams } from "#/hooks/use-actions-params.ts";
import { useTranslation } from "#/hooks/use-translation.ts";
import { routes } from "#/routes.ts";
import { TransactionRecurringInterval, TransactionType } from "#/schemas/enums.ts";
import { type PaginatedResponse } from "#/types/pagination.ts";
import { groupBy } from "#/utils/group.ts";
import { currencyFormatter, decimalFormatter } from "#/utils/number-formatter.ts";
import { Button } from "../button.tsx";
import { CurrencySelect } from "../currency-select.tsx";
import { SubmitButton } from "../submit-button.tsx";
import * as Avatar from "../ui/avatar.tsx";
import * as Badge from "../ui/badge.tsx";
import * as Divider from "../ui/divider.tsx";
import * as Drawer from "../ui/drawer.tsx";
import { DatePicker } from "../ui/form/date-picker.tsx";
import { SelectField } from "../ui/form/select-field.tsx";
import { TextField } from "../ui/form/text-field.tsx";
import { Textarea } from "../ui/form/textarea.tsx";
import * as Label from "../ui/label.tsx";
import * as Select from "../ui/select.tsx";
import * as Switch from "../ui/switch.tsx";

type CreateTransactionFormData = {
    name: string;
    note?: string | null;
    type: App.Enums.Finance.TransactionType;
    amount: string;
    currency: string;
    is_recurring: boolean;
    recurring_interval?: App.Enums.Finance.TransactionRecurringInterval | null;
    recurring_start_at?: string | null;
    account_id: string;
    category_id: string;
};

export function CreateTransactionDrawer() {
    const actions = useActionsParams();
    const isOpen = actions.action === "create" && actions.resource === "transactions";
    const [{ data: accounts }, { data: currencies }, { data: categories }] = useQueries({
        queries: [
            {
                queryKey: ["accounts"],
                queryFn: async () => {
                    const res = await fetch(routes.api.accounts.index.url({ query: { include: "bankConnection" } }));
                    return (await res.json()) as PaginatedResponse<Resources.Account>;
                },
                enabled: isOpen,
            },
            {
                queryKey: ["currencies"],
                queryFn: async () => {
                    const res = await fetch(routes.api.finance.currencies.index.url());
                    return (await res.json()) as Array<string>;
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
    const form = useForm<CreateTransactionFormData>({
        account_id: accounts?.data?.[0]?.id ?? "",
        name: "",
        note: null,
        type: "expense",
        amount: "0.00",
        currency: accounts?.data?.[0]?.currencyCode ?? "USD",
        is_recurring: false,
        recurring_interval: null,
        category_id: "",
    });
    const { t, language } = useTranslation();

    /**
     * This is a workaround to update the form data when the accounts are fetched.
     * The form is not updated automatically when the accounts are fetched.
     */
    const formRef = React.useRef(form);
    React.useEffect(() => {
        if (isOpen && accounts?.data?.length) {
            formRef.current.setData("account_id", accounts?.data?.[0]?.id ?? "");
        }
    }, [isOpen, accounts?.data]);

    React.useEffect(() => {
        if (form.data.is_recurring) {
            formRef.current.setData("recurring_start_at", new Date().toISOString());
        }
    }, [form.data.is_recurring]);

    // Compute grouped categories ordered so the classification matching the selected transaction type appears first
    const groupedCategoryEntries = React.useMemo(() => {
        const grouped = groupBy(categories?.data ?? [], "classification");
        const entries = Object.entries(grouped);

        if (form.data.type) {
            entries.sort(([a], [b]) => {
                if (a === form.data.type) return -1;
                if (b === form.data.type) return 1;
                return a.localeCompare(b);
            });
        } else {
            entries.sort(([a], [b]) => a.localeCompare(b));
        }

        return entries;
    }, [categories, form.data.type]);

    const handleOpenChange = async (open: boolean) => {
        if (!open) {
            await actions.resetParams();
            form.reset();
            return;
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        form.post(routes.transactions.store.url(), {
            onSuccess: async () => {
                await actions.resetParams();
                form.reset();
            },
        });
    };

    return (
        <Drawer.Root onOpenChange={handleOpenChange} open={isOpen}>
            <Drawer.Content className="absolute inset-y-0 mx-2 my-2 max-h-[calc(100%-16px)] w-[min(400px,calc(100%-16px))] rounded-20 bg-(--bg-white-0) shadow-md">
                <div className="flex h-full flex-col">
                    <Drawer.Header>
                        <Drawer.Title className="flex flex-col gap-1 font-normal">
                            <div className="text-label-lg text-(--text-strong-950)">Create Transaction</div>
                            <div className="text-paragraph-sm text-(--text-sub-600)">
                                Add your income or expense to your account.
                            </div>
                        </Drawer.Title>
                    </Drawer.Header>

                    <Drawer.Body className="flex-1 overflow-y-auto">
                        <form
                            {...routes.transactions.store.form()}
                            id="create-transaction-form"
                            onSubmit={handleSubmit}
                        >
                            <div className="px-5">
                                <SelectField
                                    error={form.errors.account_id}
                                    id="accountId"
                                    label="Account"
                                    labelClassName="sr-only"
                                    name="accountId"
                                    onValueChange={(value) => form.setData("account_id", value)}
                                    options={
                                        accounts?.data?.map((account) => ({
                                            label: (
                                                <div className="flex items-center gap-3.5">
                                                    {account?.connection?.institutionLogoUrl ? (
                                                        <Avatar.Root $size="40">
                                                            <Avatar.Image
                                                                alt={account?.connection?.institutionName ?? ""}
                                                                src={account?.connection?.institutionLogoUrl}
                                                            />
                                                        </Avatar.Root>
                                                    ) : (
                                                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-(--bg-white-0) shadow-xs ring-1 ring-(--stroke-soft-200) ring-inset">
                                                            <BankIcon className="size-5 text-(--text-sub-600)" />
                                                        </div>
                                                    )}

                                                    <div className="flex-1">
                                                        <div className="text-label-sm">{account?.name}</div>
                                                        <div className="mt-1 text-paragraph-xs text-(--text-sub-600)">
                                                            Available:{" "}
                                                            {currencyFormatter({
                                                                amount: account.currentBalance,
                                                                currency: account.currencyCode,
                                                                locale: language,
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            ),
                                            value: account.id,
                                        })) || []
                                    }
                                    placeholder="Select an account"
                                    triggerClassName="py-2 px-3 h-auto min-h-auto"
                                    value={form.data.account_id}
                                />
                            </div>

                            <div className="space-y-3 p-5">
                                <TextField
                                    error={form.errors.name}
                                    label="Name"
                                    name="name"
                                    onChange={(e) => form.setData("name", e.target.value)}
                                    placeholder="e.g. Amazon"
                                    value={form.data.name}
                                />

                                <CurrencyInput
                                    currency={form.data.currency}
                                    customInput={TextField}
                                    error={form.errors.amount}
                                    label="Amount"
                                    leadingNode={
                                        <CurrencySelect
                                            currencies={currencies ?? []}
                                            onValueChange={(value) => form.setData("currency", value)}
                                            value={form.data.currency}
                                        />
                                    }
                                    name="amount"
                                    onValueChange={(values) =>
                                        form.setData(
                                            "amount",
                                            decimalFormatter(values.value, language, form.data.currency),
                                        )
                                    }
                                    placeholder="e.g. 1.00"
                                    value={form.data.amount}
                                    withCurrencySymbol={false}
                                />

                                <SelectField
                                    error={form.errors.type}
                                    id="type"
                                    label="Type"
                                    name="type"
                                    onValueChange={(value) =>
                                        form.setData("type", value as App.Enums.Finance.TransactionType)
                                    }
                                    options={TransactionType.options.map((type) => ({
                                        label: type,
                                        value: type,
                                    }))}
                                    placeholder="Select a type"
                                    triggerIcon={TransactionIcon}
                                    value={form.data.type}
                                />

                                <SelectField
                                    error={form.errors.category_id}
                                    id="categoryId"
                                    label="Category"
                                    name="categoryId"
                                    onValueChange={(value) => form.setData("category_id", value)}
                                    placeholder="Select a category"
                                    triggerIcon={GeometricShapes01Icon}
                                    value={form.data.category_id}
                                >
                                    {groupedCategoryEntries.map(([classification, categories]) => (
                                        <Select.Group key={classification}>
                                            <Select.GroupLabel>
                                                {t(`enum.category.classification.${classification}`)}
                                            </Select.GroupLabel>

                                            {categories
                                                ?.sort((a, b) => a.name.localeCompare(b.name))
                                                .map((category) => (
                                                    <Select.Item key={category.id} value={category.id}>
                                                        <Badge.Root
                                                            className="size-2.5 bg-(--color-category-color) p-0"
                                                            style={
                                                                {
                                                                    "--color-category-color": category.color,
                                                                } as React.CSSProperties
                                                            }
                                                        />
                                                        {t(`categories.${category.slug}.name`, {}, category.name)}
                                                    </Select.Item>
                                                ))}
                                        </Select.Group>
                                    ))}
                                </SelectField>
                            </div>

                            <Divider.Root $type="solid-text">Details</Divider.Root>

                            <div className="space-y-3 p-5">
                                <Textarea
                                    charCounterCurrent={form.data.note?.length}
                                    charCounterMax={200}
                                    className="min-h-[66px]"
                                    id="note"
                                    label="Note"
                                    labelSub="(Optional)"
                                    name="note"
                                    onChange={(e) => form.setData("note", e.target.value)}
                                    placeholder="What is this payment for?"
                                    value={form.data.note ?? ""}
                                />
                            </div>

                            <Divider.Root $type="solid-text">Recurring</Divider.Root>

                            <div className="space-y-3 p-5">
                                <div className="flex items-center gap-2 px-px">
                                    <Switch.Root
                                        checked={form.data.is_recurring}
                                        id="isRecurring"
                                        name="isRecurring"
                                        onCheckedChange={(checked) => {
                                            form.setData("is_recurring", checked);
                                            if (!checked) {
                                                form.setData("recurring_interval", null);
                                                form.setData("recurring_start_at", null);
                                            }
                                        }}
                                    />
                                    <Label.Root htmlFor="isRecurring">Is recurring?</Label.Root>
                                </div>

                                {form.data.is_recurring && (
                                    <>
                                        <SelectField
                                            error={form.errors.recurring_interval}
                                            hint="In what interval do you want to repeat your transaction (subscription, etc.)?"
                                            label="Recurring interval"
                                            name="recurring_interval"
                                            onValueChange={(value) =>
                                                form.setData(
                                                    "recurring_interval",
                                                    value as App.Enums.Finance.TransactionRecurringInterval,
                                                )
                                            }
                                            options={TransactionRecurringInterval.options.map((interval) => ({
                                                label: interval,
                                                value: interval,
                                            }))}
                                            placeholder="Choose an interval"
                                            triggerIcon={RepeatIcon}
                                            value={form.data.recurring_interval ?? undefined}
                                        />

                                        <DatePicker
                                            error={form.errors.recurring_start_at}
                                            hint="When should the recurring transaction start?"
                                            id="recurring_start_at"
                                            label="Recurring start date"
                                            labelSub="(Optional)"
                                            mode="single"
                                            onSelect={(date) => form.setData("recurring_start_at", date?.toISOString())}
                                            placeholder={t("form.fields.expires_at.placeholder")}
                                            selected={
                                                form.data.recurring_start_at
                                                    ? new Date(form.data.recurring_start_at)
                                                    : undefined
                                            }
                                            value={form.data.recurring_start_at}
                                        />
                                    </>
                                )}
                            </div>
                        </form>
                    </Drawer.Body>

                    <Drawer.Footer className="flex justify-between gap-3 border-t border-(--stroke-soft-200) p-5">
                        <Button
                            $size="md"
                            $style="stroke"
                            $type="neutral"
                            className="flex-1"
                            onClick={() => actions.resetParams({ shallow: false })}
                        >
                            Discard
                        </Button>

                        <SubmitButton
                            $size="md"
                            $type="primary"
                            className="flex-1"
                            form="create-transaction-form"
                            isSubmitting={form.processing}
                            type="submit"
                        >
                            {form.processing ? "Creating..." : "Create transaction"}
                        </SubmitButton>
                    </Drawer.Footer>
                </div>
            </Drawer.Content>
        </Drawer.Root>
    );
}
