import { Link, useForm } from "@inertiajs/react";
import NumberFlow from "@number-flow/react";
import { resolveCurrencyFormat } from "@sumup/intl";
import { CurrencyInput } from "headless-currency-input";
import BankIcon from "virtual:icons/hugeicons/bank";
import Cancel01Icon from "virtual:icons/hugeicons/cancel-01";
import GeometricShapes01Icon from "virtual:icons/hugeicons/geometric-shapes-01";
import HeadsetIcon from "virtual:icons/hugeicons/headset";
import RepeatIcon from "virtual:icons/hugeicons/repeat";
import TransactionIcon from "virtual:icons/hugeicons/transaction";

import { CurrencySelect } from "#/components/currency-select.tsx";
import { SelectField } from "#/components/form/select-field.tsx";
import { TextField } from "#/components/form/text-field.tsx";
import { Textarea } from "#/components/form/textarea.tsx";
import * as Avatar from "#/components/ui/avatar.tsx";
import * as Button from "#/components/ui/button.tsx";
import * as Divider from "#/components/ui/divider.tsx";
import * as Input from "#/components/ui/input.tsx";
import * as Label from "#/components/ui/label.tsx";
import * as Switch from "#/components/ui/switch.tsx";
import { useTranslation } from "#/hooks/use-translation.ts";
import { routes } from "#/routes.ts";
import { TransactionRecurringInterval, TransactionType } from "#/schemas/enums.ts";
import { cn } from "#/utils/cn.ts";
import { decimalFlowFormatter } from "#/utils/currency-formatter.ts";
import { decimalFormatter } from "#/utils/number-formatter.ts";

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

type CreateTransactionPageProps = {
    accounts: Array<Resources.Account>;
    currencies: Array<string>;
    categories: Array<Resources.Category>;
};

export default function CreateTransactionPage({ accounts, currencies, categories }: CreateTransactionPageProps) {
    const form = useForm<FormData>({
        accountId: accounts[0]?.id ?? "",
        name: "",
        note: null,
        type: "expense",
        amount: "0.00",
        currency: accounts[0]?.currencyCode ?? "USD",
        isRecurring: false,
        recurringInterval: null,
        categoryId: "",
    });
    const { language } = useTranslation();
    const currencyFormat = resolveCurrencyFormat(language, form.data.currency || "USD");

    const selectedAccount = accounts.find((account) => account.id === form.data.accountId);
    const currentBalance = decimalFlowFormatter({
        amount: selectedAccount?.currentBalance ?? 0,
        currency: selectedAccount?.currencyCode,
        language,
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        form.post(routes.transactions.store.url());
    };

    return (
        <div className="flex min-h-screen flex-col lg:items-start">
            <div className="relative isolate mx-auto flex w-full max-w-[1392px] flex-1 flex-col">
                <img
                    alt=""
                    className="pointer-events-none absolute top-0 left-1/2 -z-10 hidden -translate-x-1/2 lg:block"
                    height={456}
                    src="/img/onboarding-pattern.svg"
                    width={964}
                />

                <Button.Root
                    $size="xs"
                    $style="ghost"
                    $type="neutral"
                    asChild
                    className="fixed top-6 right-8 hidden lg:flex"
                >
                    <Link href={routes.transactions.index.url()}>
                        <Button.Icon as={Cancel01Icon} />
                    </Link>
                </Button.Root>

                <div className="flex w-full justify-center py-12">
                    <div className="flex w-full max-w-[572px] shrink-0 flex-col items-center gap-6 px-4">
                        <div className="flex w-full flex-col items-center gap-2">
                            {/* icon */}
                            <div
                                className={cn(
                                    "relative flex size-[68px] shrink-0 items-center justify-center rounded-full backdrop-blur-xl lg:size-24",
                                    // bg
                                    "before:absolute before:inset-0 before:rounded-full",
                                    "before:bg-gradient-to-b before:from-neutral-500 before:to-transparent before:opacity-10",
                                )}
                            >
                                <div className="relative z-10 flex size-12 items-center justify-center rounded-full bg-(--bg-white-0) shadow-xs ring-1 ring-(--stroke-soft-200) ring-inset lg:size-16">
                                    <TransactionIcon className="size-6 text-(--text-sub-600) lg:size-8" />
                                </div>
                            </div>

                            <div className="space-y-1 text-center">
                                <div className="text-h6 lg:text-h5">Create Transaction</div>
                                <div className="text-paragraph-sm text-(--text-sub-600) lg:text-paragraph-md">
                                    Add a new transaction to track your income or expenses.
                                </div>
                            </div>
                        </div>

                        <form
                            {...routes.transactions.store.form()}
                            className="w-full shrink-0 rounded-20 bg-(--bg-white-0) shadow-xs ring-1 ring-(--stroke-soft-200) ring-inset min-[420px]:w-[400px]"
                            id="create-transaction-form"
                            onSubmit={handleSubmit}
                        >
                            <div className="p-4">
                                <SelectField
                                    id="accountId"
                                    label="Account"
                                    labelClassName="sr-only"
                                    name="accountId"
                                    onValueChange={(value) => form.setData("accountId", value)}
                                    options={accounts?.map((account) => ({
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
                                                        <NumberFlow
                                                            animated={false}
                                                            format={currentBalance.format}
                                                            value={currentBalance.value}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ),
                                        value: account.id,
                                    }))}
                                    placeholder="Select an account"
                                    position="item-aligned"
                                    triggerClassName="py-2 px-3 h-auto min-h-auto"
                                    value={form.data.accountId}
                                />
                            </div>

                            <Divider.Root $type="solid-text">Details</Divider.Root>

                            <div className="flex flex-col gap-3 p-4">
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
                                            currencies={currencies}
                                            onValueChange={(value) => form.setData("currency", value)}
                                            value={form.data.currency}
                                        />
                                    }
                                    value={form.data.amount}
                                    withCurrencySymbol={false}
                                />

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

                            <Divider.Root $type="solid-text">Classification</Divider.Root>

                            <div className="flex flex-col gap-3 p-4">
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
                                    options={categories.map((category) => ({
                                        label: category.name,
                                        value: category.id,
                                    }))}
                                    placeholder="Select a category"
                                    triggerIcon={GeometricShapes01Icon}
                                    value={form.data.categoryId}
                                />
                            </div>

                            <Divider.Root />

                            <div className="flex flex-col gap-3 p-4">
                                <div className="flex items-center gap-2 px-px">
                                    <Switch.Root
                                        checked={form.data.isRecurring}
                                        id="isRecurring"
                                        name="isRecurring"
                                        onCheckedChange={(checked) => {
                                            form.setData("isRecurring", checked);
                                            if (!checked) {
                                                form.setData("recurringInterval", null);
                                            }
                                        }}
                                    />
                                    <Label.Root htmlFor="isRecurring">Is recurring?</Label.Root>
                                </div>

                                {form.data.isRecurring && (
                                    <div className="flex flex-col gap-3">
                                        <SelectField
                                            error={form.errors.recurringInterval}
                                            hint="In what interval do you want to repeat your transaction (subscription, etc.)?"
                                            label="Recurring interval"
                                            name="recurringInterval"
                                            onValueChange={(value) =>
                                                form.setData(
                                                    "recurringInterval",
                                                    value as App.Enums.Finance.TransactionRecurringInterval,
                                                )
                                            }
                                            options={TransactionRecurringInterval.options.map((interval) => ({
                                                label: interval,
                                                value: interval,
                                            }))}
                                            placeholder="Choose an interval"
                                            triggerIcon={RepeatIcon}
                                            value={form.data.recurringInterval ?? undefined}
                                        />
                                    </div>
                                )}
                            </div>

                            <Divider.Root />

                            <div className="grid grid-cols-2 gap-4 px-5 py-4">
                                <Button.Root $size="sm" $style="stroke" $type="neutral" asChild>
                                    <Link href={routes.transactions.index.url()}>Back</Link>
                                </Button.Root>
                                <Button.Root
                                    $size="sm"
                                    $style="filled"
                                    $type="primary"
                                    disabled={form.processing}
                                    form="create-transaction-form"
                                    type="submit"
                                >
                                    {form.processing ? "Creating..." : "Create"}
                                </Button.Root>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="mx-auto flex w-full max-w-md flex-col gap-3 p-4">
                    <div className="flex flex-col gap-4 text-center">
                        <div className="text-paragraph-sm text-(--text-sub-600)">
                            Having trouble with transaction creation?
                        </div>
                        <Button.Root $style="stroke" $type="neutral" asChild>
                            <a href="mailto:support@expensetrackr.app" rel="noopener noreferrer" target="_blank">
                                <Button.Icon as={HeadsetIcon} />
                                Contact
                            </a>
                        </Button.Root>
                    </div>

                    <div className="text-center text-paragraph-xs text-(--text-soft-400)">
                        © {new Date().getFullYear()} {import.meta.env.VITE_APP_NAME}
                    </div>
                </div>
            </div>
        </div>
    );
}
