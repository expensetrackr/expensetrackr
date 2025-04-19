import { getFormProps, getInputProps, getTextareaProps, useForm, useInputControl } from "@conform-to/react";
import { getValibotConstraint, parseWithValibot } from "@conform-to/valibot";
import { useForm as useInertiaForm } from "@inertiajs/react";
import { resolveCurrencyFormat } from "@sumup/intl";
import { type NumberFormat } from "@sumup/intl/dist/es/types/index";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns/format";
import Decimal from "decimal.js";
import { CurrencyInput } from "headless-currency-input";
import * as React from "react";
import { type NumberFormatValues } from "react-number-format";
import { toast } from "sonner";
import type * as v from "valibot";

import { useActionsParams } from "#/hooks/use-actions-params.ts";
import { useTranslation } from "#/hooks/use-translation.ts";
import { routes } from "#/routes.ts";
import { AccountTypeEnum, SubtypeOptions } from "#/schemas/account.ts";
import { type BalanceSchema, CreateAccountSchema, InterestRateTypeEnum } from "#/utils/steppers/create-account.step.ts";
import * as Button from "../ui/button.tsx";
import * as DatepickerPrimivites from "../ui/datepicker.tsx";
import * as Divider from "../ui/divider.tsx";
import * as Drawer from "../ui/drawer.tsx";
import { SelectField } from "../ui/form/select-field.tsx";
import { TextField } from "../ui/form/text-field.tsx";
import { Textarea } from "../ui/form/textarea.tsx";
import * as Hint from "../ui/hint.tsx";
import * as Input from "../ui/input.tsx";
import * as Label from "../ui/label.tsx";
import * as Popover from "../ui/popover.tsx";
import * as Select from "../ui/select.tsx";

export function CreateAccountDrawer() {
    const actions = useActionsParams();
    const isOpen = actions.action === "create" && actions.resource === "accounts";
    const { transform, post } = useInertiaForm();
    const [form, fields] = useForm({
        id: `create-${actions.accountType}-account-form`,
        shouldValidate: "onSubmit",
        shouldRevalidate: "onInput",
        constraint: getValibotConstraint(CreateAccountSchema),
        defaultValue: {
            type: actions.accountType,
            currency_code: "USD",
            initial_balance: "0.00",
        },
        onValidate({ formData }) {
            return parseWithValibot(formData, { schema: CreateAccountSchema });
        },
        onSubmit(event, { submission }) {
            event.preventDefault();

            if (submission && "value" in submission) {
                transform((data) => ({
                    ...data,
                    ...submission.value,
                    ...("initial_balance" in submission.value && {
                        current_balance: submission.value.initial_balance.replace(/,/g, ""),
                    }),
                }));

                post(routes.accounts.store.url(), {
                    onError() {
                        toast.error("Failed to create account");
                    },
                });
            }
        },
    });
    const { language } = useTranslation();
    const typeControl = useInputControl(fields.type);
    const subtypeControl = useInputControl(fields.subtype);
    const currencyCodeControl = useInputControl(fields.currency_code);
    const currencyFormat = resolveCurrencyFormat(language, currencyCodeControl.value || "USD");
    const initialBalanceControl = useInputControl(fields.initial_balance);

    const handleOpenChange = async (open: boolean) => {
        if (!open) {
            await actions.resetParams();
            return;
        }
    };

    const handleMoneyChange = (value: NumberFormatValues) => {
        const decimalValue = new Decimal(value.value).toDecimalPlaces(currencyFormat?.minimumFractionDigits);

        return decimalValue.toFixed(currencyFormat?.minimumFractionDigits);
    };

    return (
        <Drawer.Root onOpenChange={handleOpenChange} open={isOpen}>
            <Drawer.Content className="absolute inset-y-0 mx-2 my-2 max-h-[calc(100%-16px)] w-[min(400px,calc(100%-16px))] rounded-20 bg-(--bg-white-0) shadow-md">
                <div className="flex h-full flex-col">
                    <Drawer.Header>
                        <Drawer.Title className="text-label-lg text-(--text-strong-950)">Create Account</Drawer.Title>
                    </Drawer.Header>

                    <Divider.Root $type="solid-text">Information</Divider.Root>

                    <Drawer.Body className="flex-1 overflow-y-auto">
                        <form {...getFormProps(form)}>
                            <input {...getInputProps(fields.initial_balance, { type: "hidden" })} />
                            <input {...getInputProps(fields.currency_code, { type: "hidden" })} />

                            <div className="space-y-3 p-5">
                                <TextField
                                    {...getInputProps(fields.name, { type: "text" })}
                                    autoFocus
                                    error={fields.name.errors}
                                    label="Name"
                                    placeholder="e.g. Personal savings"
                                />

                                <Textarea
                                    {...getTextareaProps(fields.description)}
                                    charCounterCurrent={fields.description.value?.length || 0}
                                    charCounterMax={200}
                                    error={fields.description.errors}
                                    hint={"This will only be visible to you."}
                                    label="Description"
                                    labelSub="(Optional)"
                                    placeholder="e.g. Savings account for personal expenses"
                                ></Textarea>
                            </div>

                            <Divider.Root $type="solid-text">Details</Divider.Root>

                            <div className="space-y-3 p-5">
                                <SelectField
                                    defaultValue={fields.type.initialValue}
                                    error={fields.type.errors}
                                    id={fields.type.id}
                                    label="Type"
                                    name={fields.type.name}
                                    onOpenChange={(open) => {
                                        if (!open) {
                                            typeControl.blur();
                                        }
                                    }}
                                    onValueChange={typeControl.change}
                                    options={AccountTypeEnum.options.map((type) => ({
                                        label: type,
                                        value: type,
                                    }))}
                                    placeholder="Select a type"
                                    position="item-aligned"
                                    value={typeControl.value}
                                />

                                {typeControl.value &&
                                SubtypeOptions[typeControl.value as keyof typeof SubtypeOptions] ? (
                                    <SelectField
                                        defaultValue={fields.subtype.initialValue}
                                        error={fields.subtype.errors}
                                        id={fields.subtype.id}
                                        label="Subtype"
                                        labelSub="(Optional)"
                                        name={fields.subtype.name}
                                        onOpenChange={(open) => {
                                            if (!open) {
                                                subtypeControl.blur();
                                            }
                                        }}
                                        onValueChange={subtypeControl.change}
                                        options={SubtypeOptions[typeControl.value as keyof typeof SubtypeOptions].map(
                                            (subtype) => ({
                                                label: subtype,
                                                value: subtype,
                                            }),
                                        )}
                                        placeholder="Select a subtype"
                                        position="item-aligned"
                                        value={subtypeControl.value}
                                        wrapperClassName="duration-300 animate-in fade-in-0"
                                    />
                                ) : null}
                            </div>

                            <Divider.Root $type="solid-text">Balance</Divider.Root>

                            <div className="space-y-3 p-5">
                                <CurrencyInput
                                    currency={currencyFormat?.currency || "USD"}
                                    customInput={TextField}
                                    error={fields.initial_balance.errors}
                                    inlineLeadingNode={
                                        <Input.InlineAffix>{currencyFormat?.currencySymbol}</Input.InlineAffix>
                                    }
                                    label="Initial balance"
                                    name="initial_balance_currency_input"
                                    onValueChange={(values) => initialBalanceControl.change(handleMoneyChange(values))}
                                    placeholder="e.g. 1.00"
                                    trailingNode={
                                        <SelectCurrencies
                                            onValueChange={currencyCodeControl.change}
                                            value={currencyCodeControl.value}
                                        />
                                    }
                                    value={initialBalanceControl.value}
                                    withCurrencySymbol={false}
                                />

                                {(fields.type.value === "credit_card" || fields.type.value === "loan") && (
                                    <Divider.Root className="py-1.5 duration-300 animate-in fade-in-0" />
                                )}

                                {fields.type.value === "credit_card" && (
                                    <CreditCardFields
                                        currencyFormat={currencyFormat}
                                        fields={fields}
                                        handleMoneyChange={handleMoneyChange}
                                    />
                                )}

                                {fields.type.value === "loan" && <LoanFields fields={fields} />}
                            </div>
                        </form>
                    </Drawer.Body>

                    <Drawer.Footer className="flex justify-between gap-3 border-t border-(--stroke-soft-200) p-5">
                        <Button.Root
                            $size="md"
                            $style="stroke"
                            $type="neutral"
                            className="flex-1"
                            onClick={() => actions.resetParams({ shallow: false })}
                        >
                            Discard
                        </Button.Root>
                        <Button.Root $size="md" $type="primary" className="flex-1" form={form.id} type="submit">
                            Create account
                        </Button.Root>
                    </Drawer.Footer>
                </div>
            </Drawer.Content>
        </Drawer.Root>
    );
}

function SelectCurrencies(props: React.CustomComponentPropsWithRef<typeof Select.Root>) {
    const query = useQuery<string[]>({
        queryKey: ["currencies"],
        queryFn: async () => {
            const res = await fetch(routes.api.finance.currencies.index.url());
            return (await res.json()) as string[];
        },
    });

    return (
        <Select.Root $variant="compactForInput" defaultValue="USD" {...props}>
            <Select.Trigger>
                <Select.Value>
                    <span className="flex flex-1 items-center gap-2">
                        <svg
                            aria-label={`${props.value || "USD"} flag`}
                            className="size-5 rounded-full"
                            preserveAspectRatio="xMidYMid meet"
                            role="img"
                        >
                            <use href={`/img/flags.svg#${props.value || "USD"}`} />
                        </svg>
                        <span>{props.value || "USD"}</span>
                    </span>
                </Select.Value>
            </Select.Trigger>
            <Select.Content>
                {query.data?.map((item) => (
                    <Select.Item key={item} value={item}>
                        <Select.ItemIcon
                            aria-label={`${item} flag`}
                            as="svg"
                            className="size-5 rounded-full"
                            preserveAspectRatio="xMidYMid meet"
                            role="img"
                        >
                            <use href={`/img/flags.svg#${item}`} />
                        </Select.ItemIcon>
                        {item}
                    </Select.Item>
                ))}
            </Select.Content>
        </Select.Root>
    );
}

type CreditCardFieldsProps = {
    fields: ReturnType<typeof useForm<v.InferOutput<typeof BalanceSchema>>>[1];
    currencyFormat: NumberFormat | null;
    handleMoneyChange(value: NumberFormatValues): string;
};

function CreditCardFields({ fields, currencyFormat, handleMoneyChange }: CreditCardFieldsProps) {
    const availableBalanceControl = useInputControl(fields.available_balance);
    const minimumPaymentControl = useInputControl(fields.minimum_payment);
    const expiresAtControl = useInputControl(fields.expires_at);
    const annualFeeControl = useInputControl(fields.annual_fee);
    const { t } = useTranslation();

    return (
        <>
            <input {...getInputProps(fields.available_balance, { type: "hidden" })} />
            <input {...getInputProps(fields.minimum_payment, { type: "hidden" })} />
            <input {...getInputProps(fields.expires_at, { type: "hidden" })} />
            <input {...getInputProps(fields.annual_fee, { type: "hidden" })} />

            <CurrencyInput
                currency={currencyFormat?.currency || "USD"}
                customInput={TextField}
                error={fields.available_balance.errors}
                inlineLeadingNode={<Input.InlineAffix>{currencyFormat?.currencySymbol}</Input.InlineAffix>}
                label={t("form.fields.available_balance.label")}
                name="available_balance_currency_input"
                onValueChange={(values) => availableBalanceControl.change(handleMoneyChange(values))}
                placeholder={t("form.fields.available_balance.placeholder")}
                value={availableBalanceControl.value}
                withCurrencySymbol={false}
            />

            <div className="grid grid-cols-2 gap-3">
                <CurrencyInput
                    currency={currencyFormat?.currency || "USD"}
                    customInput={TextField}
                    error={fields.minimum_payment.errors}
                    inlineLeadingNode={<Input.InlineAffix>{currencyFormat?.currencySymbol}</Input.InlineAffix>}
                    label={t("form.fields.minimum_payment.label")}
                    name="minimum_payment_currency_input"
                    onValueChange={(values) => minimumPaymentControl.change(handleMoneyChange(values))}
                    placeholder={t("form.fields.minimum_payment.placeholder")}
                    value={minimumPaymentControl.value}
                    withCurrencySymbol={false}
                />

                <TextField
                    error={fields.apr.errors}
                    inlineTrailingNode={<Input.InlineAffix>%</Input.InlineAffix>}
                    label={t("form.fields.apr.label")}
                    placeholder={t("form.fields.apr.placeholder")}
                    {...getInputProps(fields.apr, {
                        type: "number",
                    })}
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                    <Label.Root htmlFor={fields.expires_at.id}>{t("form.fields.expires_at.label")}</Label.Root>

                    <Popover.Root>
                        <Popover.Trigger asChild>
                            <Button.Root $style="stroke" $type="neutral" id={fields.expires_at.id}>
                                {expiresAtControl.value
                                    ? format(expiresAtControl.value, "LLL dd, y")
                                    : t("form.fields.expires_at.placeholder")}
                            </Button.Root>
                        </Popover.Trigger>
                        <Popover.Content className="p-0" showArrow={false}>
                            <DatepickerPrimivites.Calendar
                                mode="single"
                                onSelect={(date) => expiresAtControl.change(date?.toISOString())}
                                selected={expiresAtControl.value ? new Date(expiresAtControl.value) : undefined}
                            />
                            <div className="flex items-center justify-between gap-4 border-t border-(--stroke-soft-200) p-4 py-5">
                                <Popover.Close asChild unstyled>
                                    <Button.Root
                                        $size="sm"
                                        $style="stroke"
                                        $type="neutral"
                                        className="w-full"
                                        //onClick={handleCancel}
                                    >
                                        {t("common.cancel")}
                                    </Button.Root>
                                </Popover.Close>
                                <Popover.Close asChild unstyled>
                                    <Button.Root
                                        $size="sm"
                                        $style="filled"
                                        $type="primary"
                                        className="w-full"
                                        //onClick={handleApply}
                                    >
                                        {t("common.apply")}
                                    </Button.Root>
                                </Popover.Close>
                            </div>
                        </Popover.Content>
                    </Popover.Root>

                    {fields.expires_at.errors ? (
                        <Hint.Root $error aria-describedby={`${fields.expires_at.id}-error`}>
                            <Hint.Icon />
                            {fields.expires_at.errors}
                        </Hint.Root>
                    ) : null}
                </div>

                <CurrencyInput
                    currency={currencyFormat?.currency || "USD"}
                    customInput={TextField}
                    error={fields.annual_fee.errors}
                    inlineLeadingNode={<Input.InlineAffix>{currencyFormat?.currencySymbol}</Input.InlineAffix>}
                    label={t("form.fields.annual_fee.label")}
                    name="annual_fee_currency_input"
                    onValueChange={(values) => annualFeeControl.change(handleMoneyChange(values))}
                    placeholder={t("form.fields.annual_fee.placeholder")}
                    value={annualFeeControl.value}
                    withCurrencySymbol={false}
                />
            </div>
        </>
    );
}

type LoanFieldsProps = {
    fields: ReturnType<typeof useForm<v.InferOutput<typeof BalanceSchema>>>[1];
};

function LoanFields({ fields }: LoanFieldsProps) {
    const interestRateTypeControl = useInputControl(fields.interest_rate_type);
    const { t } = useTranslation();

    return (
        <>
            <input {...getInputProps(fields.interest_rate, { type: "hidden" })} />

            <div className="grid grid-cols-2 gap-4">
                <TextField
                    error={fields.interest_rate.errors}
                    inlineTrailingNode={<Input.InlineAffix>%</Input.InlineAffix>}
                    label={t("form.fields.interest_rate.label")}
                    placeholder={t("form.fields.interest_rate.placeholder")}
                    {...getInputProps(fields.interest_rate, {
                        type: "number",
                    })}
                />

                <SelectField
                    defaultValue={fields.interest_rate_type.initialValue}
                    error={fields.interest_rate_type.errors}
                    id={fields.interest_rate_type.id}
                    label={t("form.fields.interest_rate_type.label")}
                    name={fields.interest_rate_type.name}
                    onValueChange={interestRateTypeControl.change}
                    options={InterestRateTypeEnum.options.map((option) => ({
                        label: option,
                        value: option,
                    }))}
                    placeholder={t("form.fields.interest_rate_type.placeholder")}
                    position="item-aligned"
                    value={interestRateTypeControl.value}
                />
            </div>

            <TextField
                error={fields.term_months.errors}
                label={t("form.fields.term_months.label")}
                placeholder={t("form.fields.term_months.placeholder")}
                {...getInputProps(fields.term_months, {
                    type: "number",
                })}
            />
        </>
    );
}
