import { useForm } from "@inertiajs/react";
import { resolveCurrencyFormat } from "@sumup/intl";
import { useQueries } from "@tanstack/react-query";
import { CurrencyInput } from "headless-currency-input";
import * as React from "react";
import BankIcon from "virtual:icons/hugeicons/bank";
import GeometricShapes01Icon from "virtual:icons/hugeicons/geometric-shapes-01";
import TransactionIcon from "virtual:icons/hugeicons/transaction";

import { useActionsParams } from "#/hooks/use-actions-params.ts";
import { useTranslation } from "#/hooks/use-translation.ts";
import { routes } from "#/routes.ts";
import { TransactionType } from "#/schemas/enums.ts";
import { type PaginatedResponse } from "#/types/pagination.ts";
import { decimalFlowFormatter } from "#/utils/currency-formatter.ts";
import { currencyFormatter, decimalFormatter } from "#/utils/number-formatter.ts";
import { CurrencySelect } from "../currency-select.tsx";
import * as Avatar from "../ui/avatar.tsx";
import * as Divider from "../ui/divider.tsx";
import * as Drawer from "../ui/drawer.tsx";
import { SelectField } from "../ui/form/select-field.tsx";
import { TextField } from "../ui/form/text-field.tsx";
import { Textarea } from "../ui/form/textarea.tsx";
import * as Input from "../ui/input.tsx";

type FormData = {
    name: string;
    note?: string | null;
    type: App.Enums.Finance.TransactionType;
    amount: string;
    currency: string;
    isRecurring: boolean;
    recurringInterval?: App.Enums.Finance.TransactionRecurringInterval | null;
    accountId: string;
    categoryId: string;
};

export function CreateTransactionDrawer() {
    const actions = useActionsParams();
    const isOpen = actions.action === "create" && actions.resource === "transactions";
    const [{ data: accounts }, { data: currencies }] = useQueries({
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
        ],
    });
    const form = useForm<FormData>({
        accountId: accounts?.data[0]?.id ?? "",
        name: "",
        note: null,
        type: "expense",
        amount: "0.00",
        currency: accounts?.data[0]?.currencyCode ?? "USD",
        isRecurring: false,
        recurringInterval: null,
        categoryId: "",
    });
    const { language } = useTranslation();
    const currencyFormat = resolveCurrencyFormat(language, form.data.currency || "USD");
    const selectedAccount = accounts?.data.find((account) => account.id === form.data.accountId);
    const currentBalance = decimalFlowFormatter({
        amount: selectedAccount?.currentBalance ?? 0,
        currency: selectedAccount?.currencyCode,
        language,
    });

    React.useEffect(() => {
        if (isOpen && accounts?.data.length) {
            form.setData("accountId", accounts?.data[0]?.id ?? "");
        }
    }, [isOpen, accounts?.data]);

    const handleOpenChange = async (open: boolean) => {
        if (!open) {
            await actions.resetParams();
            return;
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        form.post(routes.transactions.store.url());
    };

    return (
        <Drawer.Root onOpenChange={handleOpenChange} open={isOpen}>
            <Drawer.Content className="absolute inset-y-0 mx-2 my-2 max-h-[calc(100%-16px)] w-[min(400px,calc(100%-16px))] rounded-20 bg-(--bg-white-0) shadow-md">
                <div className="flex h-full flex-col">
                    <Drawer.Header>
                        <Drawer.Title className="flex flex-col gap-1">
                            <div className="text-label-lg text-(--text-strong-950)">Create Transaction</div>
                            <div className="text-paragraph-sm text-(--text-sub-600)">
                                Add a new transaction to track your income or expenses.
                            </div>
                        </Drawer.Title>
                    </Drawer.Header>

                    <Divider.Root $type="solid-text">Account</Divider.Root>

                    <Drawer.Body className="flex-1 overflow-y-auto">
                        <form
                            {...routes.transactions.store.form()}
                            id="create-transaction-form"
                            onSubmit={handleSubmit}
                        >
                            <div className="p-5 pb-0">
                                <SelectField
                                    id="accountId"
                                    label="Account"
                                    labelClassName="sr-only"
                                    name="accountId"
                                    onValueChange={(value) => form.setData("accountId", value)}
                                    options={
                                        accounts?.data.map((account) => ({
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
                                    value={form.data.accountId}
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
                                    inlineLeadingNode={
                                        <Input.InlineAffix>{currencyFormat?.currencySymbol}</Input.InlineAffix>
                                    }
                                    label="Amount"
                                    name="amount"
                                    onValueChange={(values) =>
                                        form.setData(
                                            "amount",
                                            decimalFormatter(values.value, language, form.data.currency),
                                        )
                                    }
                                    placeholder="e.g. 1.00"
                                    trailingNode={
                                        <CurrencySelect
                                            currencies={currencies ?? []}
                                            onValueChange={(value) => form.setData("currency", value)}
                                            value={form.data.currency}
                                        />
                                    }
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
                                    error={form.errors.categoryId}
                                    id="categoryId"
                                    label="Category"
                                    name="categoryId"
                                    onValueChange={(value) => form.setData("categoryId", value)}
                                    options={[]}
                                    // options={categories.map((category) => ({
                                    //     label: category.name,
                                    //     value: category.id,
                                    // }))}
                                    placeholder="Select a category"
                                    triggerIcon={GeometricShapes01Icon}
                                    value={form.data.categoryId}
                                />
                            </div>

                            <Divider.Root $type="solid-text">Details</Divider.Root>

                            <div className="flex flex-col gap-3 p-4">
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
                        </form>
                    </Drawer.Body>
                </div>
            </Drawer.Content>
        </Drawer.Root>
    );
}
