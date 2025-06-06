import { getFormProps, getInputProps, getTextareaProps, useForm, useInputControl } from "@conform-to/react";
import { getValibotConstraint, parseWithValibot } from "@conform-to/valibot";
import { useForm as useInertiaForm } from "@inertiajs/react";
import { resolveCurrencyFormat } from "@sumup/intl";
import { type NumberFormat } from "@sumup/intl/dist/es/types/index";
import { useQuery } from "@tanstack/react-query";
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
import { SubmitButton } from "../submit-button.tsx";
import * as Button from "../ui/button.tsx";
import * as Divider from "../ui/divider.tsx";
import * as Drawer from "../ui/drawer.tsx";
import { DatePicker } from "../ui/form/date-picker.tsx";
import { SelectField } from "../ui/form/select-field.tsx";
import { TextField } from "../ui/form/text-field.tsx";
import { Textarea } from "../ui/form/textarea.tsx";
import * as Input from "../ui/input.tsx";
import * as Select from "../ui/select.tsx";

export function CreateAccountDrawer() {
    const actions = useActionsParams();
    const isOpen = actions.action === "create" && actions.resource === "accounts";
    const { transform, post, processing: isSubmitting } = useInertiaForm();
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
                    onSuccess: async () => {
                        await actions.resetParams();

                        form.reset();
                    },
                    onError() {
                        toast.error("Failed to create account");
                    },
                });
            }
        },
    });
    const { language, t } = useTranslation();
    const typeControl = useInputControl(fields.type);
    const subtypeControl = useInputControl(fields.subtype);
    const currencyCodeControl = useInputControl(fields.currency_code);
    const currencyFormat = resolveCurrencyFormat(language, currencyCodeControl.value || "USD");
    const initialBalanceControl = useInputControl(fields.initial_balance);

    const handleOpenChange = async (open: boolean) => {
        if (!open) {
            await actions.resetParams();
            form.reset();

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
                        <Drawer.Title className="text-label-lg text-(--text-strong-950)">
                            {t("accounts.create.title")}
                        </Drawer.Title>
                    </Drawer.Header>

                    <Divider.Root $type="solid-text">{t("accounts.create.information")}</Divider.Root>

                    <Drawer.Body className="flex-1 overflow-y-auto">
                        <form {...getFormProps(form)}>
                            <input {...getInputProps(fields.initial_balance, { type: "hidden" })} />

                            <div className="space-y-3 p-5">
                                <TextField
                                    {...getInputProps(fields.name, { type: "text" })}
                                    autoFocus
                                    error={fields.name.errors}
                                    label={t("accounts.form.name.label")}
                                    placeholder={t("accounts.form.name.placeholder")}
                                />

                                <Textarea
                                    {...getTextareaProps(fields.description)}
                                    charCounterCurrent={fields.description.value?.length || 0}
                                    charCounterMax={200}
                                    error={fields.description.errors}
                                    hint={t("accounts.form.description.hint")}
                                    label={t("accounts.form.description.label")}
                                    labelSub={t("accounts.form.description.labelSub")}
                                    placeholder={t("accounts.form.description.placeholder")}
                                ></Textarea>
                            </div>

                            <Divider.Root $type="solid-text">{t("accounts.create.details")}</Divider.Root>

                            <div className="space-y-3 p-5">
                                <SelectField
                                    defaultValue={fields.type.initialValue}
                                    error={fields.type.errors}
                                    id={fields.type.id}
                                    label={t("accounts.form.type.label")}
                                    name={fields.type.name}
                                    onOpenChange={(open) => {
                                        if (!open) {
                                            typeControl.blur();
                                        }
                                    }}
                                    onValueChange={typeControl.change}
                                    options={AccountTypeEnum.options.map((type) => ({
                                        label: t(`accounts.type.${type}`),
                                        value: type,
                                    }))}
                                    placeholder={t("accounts.form.type.placeholder")}
                                    value={typeControl.value}
                                />

                                {typeControl.value &&
                                SubtypeOptions[typeControl.value as keyof typeof SubtypeOptions] ? (
                                    <SelectField
                                        defaultValue={fields.subtype.initialValue}
                                        error={fields.subtype.errors}
                                        id={fields.subtype.id}
                                        label={t("accounts.form.subtype.label")}
                                        labelSub={t("accounts.form.subtype.labelSub")}
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
                                        placeholder={t("accounts.form.subtype.placeholder")}
                                        position="item-aligned"
                                        value={subtypeControl.value}
                                        wrapperClassName="duration-300 animate-in fade-in-0"
                                    />
                                ) : null}
                            </div>

                            <Divider.Root $type="solid-text">{t("accounts.create.balance")}</Divider.Root>

                            <div className="space-y-3 p-5">
                                <CurrencyInput
                                    currency={currencyFormat?.currency || "USD"}
                                    customInput={TextField}
                                    error={fields.initial_balance.errors}
                                    label={t("accounts.form.initial_balance.label")}
                                    leadingNode={
                                        <SelectCurrencies
                                            onValueChange={currencyCodeControl.change}
                                            value={currencyCodeControl.value}
                                        />
                                    }
                                    name="initial_balance_currency_input"
                                    onValueChange={(values) => initialBalanceControl.change(handleMoneyChange(values))}
                                    placeholder={t("accounts.form.initial_balance.placeholder")}
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
                            {t("accounts.create.discard")}
                        </Button.Root>
                        <SubmitButton
                            $size="md"
                            $type="primary"
                            className="flex-1"
                            form={form.id}
                            isSubmitting={isSubmitting}
                        >
                            {isSubmitting ? t("accounts.create.submit_loading") : t("accounts.create.submit")}
                        </SubmitButton>
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
                label={t("accounts.form.available_balance.label")}
                name="available_balance_currency_input"
                onValueChange={(values) => availableBalanceControl.change(handleMoneyChange(values))}
                placeholder={t("accounts.form.available_balance.placeholder")}
                value={availableBalanceControl.value}
                withCurrencySymbol={false}
            />

            <div className="grid grid-cols-2 gap-3">
                <CurrencyInput
                    currency={currencyFormat?.currency || "USD"}
                    customInput={TextField}
                    error={fields.minimum_payment.errors}
                    inlineLeadingNode={<Input.InlineAffix>{currencyFormat?.currencySymbol}</Input.InlineAffix>}
                    label={t("accounts.form.minimum_payment.label")}
                    name="minimum_payment_currency_input"
                    onValueChange={(values) => minimumPaymentControl.change(handleMoneyChange(values))}
                    placeholder={t("accounts.form.minimum_payment.placeholder")}
                    value={minimumPaymentControl.value}
                    withCurrencySymbol={false}
                />

                <TextField
                    error={fields.apr.errors}
                    inlineTrailingNode={<Input.InlineAffix>%</Input.InlineAffix>}
                    label={t("accounts.form.apr.label")}
                    placeholder={t("accounts.form.apr.placeholder")}
                    {...getInputProps(fields.apr, {
                        type: "number",
                    })}
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <DatePicker
                    error={fields.expires_at.errors}
                    id={fields.expires_at.id}
                    label={t("accounts.form.expires_at.label")}
                    labelSub={t("accounts.form.expires_at.labelSub")}
                    mode="single"
                    onSelect={(date) => expiresAtControl.change(date?.toISOString())}
                    placeholder={t("accounts.form.expires_at.placeholder")}
                    selected={expiresAtControl.value ? new Date(expiresAtControl.value) : undefined}
                    value={expiresAtControl.value}
                />

                <CurrencyInput
                    currency={currencyFormat?.currency || "USD"}
                    customInput={TextField}
                    error={fields.annual_fee.errors}
                    inlineLeadingNode={<Input.InlineAffix>{currencyFormat?.currencySymbol}</Input.InlineAffix>}
                    label={t("accounts.form.annual_fee.label")}
                    name="annual_fee_currency_input"
                    onValueChange={(values) => annualFeeControl.change(handleMoneyChange(values))}
                    placeholder={t("accounts.form.annual_fee.placeholder")}
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
                    label={t("accounts.form.interest_rate.label")}
                    placeholder={t("accounts.form.interest_rate.placeholder")}
                    {...getInputProps(fields.interest_rate, {
                        type: "number",
                    })}
                />

                <SelectField
                    defaultValue={fields.interest_rate_type.initialValue}
                    error={fields.interest_rate_type.errors}
                    id={fields.interest_rate_type.id}
                    label={t("accounts.form.interest_rate_type.label")}
                    name={fields.interest_rate_type.name}
                    onValueChange={interestRateTypeControl.change}
                    options={InterestRateTypeEnum.options.map((option) => ({
                        label: option,
                        value: option,
                    }))}
                    placeholder={t("accounts.form.interest_rate_type.placeholder")}
                    position="item-aligned"
                    value={interestRateTypeControl.value}
                />
            </div>

            <TextField
                error={fields.term_months.errors}
                label={t("accounts.form.term_months.label")}
                placeholder={t("accounts.form.term_months.placeholder")}
                {...getInputProps(fields.term_months, {
                    type: "number",
                })}
            />
        </>
    );
}
