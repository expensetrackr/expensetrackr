import { getFormProps, getInputProps, useForm, useInputControl } from "@conform-to/react";
import { getValibotConstraint, parseWithValibot } from "@conform-to/valibot";
import { Deferred, useForm as useInertiaForm } from "@inertiajs/react";
import NumberFlow, { type Format } from "@number-flow/react";
import { resolveCurrencyFormat } from "@sumup/intl";
import { Label as LabelPrimitives } from "radix-ui";
import * as React from "react";
import * as v from "valibot";
import Cancel01Icon from "virtual:icons/hugeicons/cancel-01";
import CustomizeIcon from "virtual:icons/hugeicons/customize";

import { FlowCard } from "#/components/flow-card.tsx";
import { Image } from "#/components/image.tsx";
import { Link } from "#/components/link.tsx";
import * as Avatar from "#/components/ui/avatar.tsx";
import * as Button from "#/components/ui/button.tsx";
import * as Switch from "#/components/ui/switch.tsx";
import { useTranslation } from "#/hooks/use-translation.ts";
import { routes } from "#/routes.ts";
import { AccountSubtypeEnum, AccountTypeEnum } from "#/schemas/account.ts";
import { BankConnectionProviderSchema } from "#/schemas/bank-connection.ts";
import { decimalFormatter } from "#/utils/number-formatter.ts";

type BankAccountsConnectPageProps = {
    enrollmentId: string;
    provider: string;
    token: string;
    bankAccounts: Array<App.Data.Finance.BankAccountData>;
};

export default function BankAccountsConnectPage({
    enrollmentId,
    provider,
    token,
    bankAccounts,
}: BankAccountsConnectPageProps) {
    return (
        <div className="flex min-h-screen flex-col lg:grid lg:items-start">
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
                    <Link href={routes.accounts.index.url()}>
                        <Button.Icon as={Cancel01Icon} />
                    </Link>
                </Button.Root>

                <div className="flex w-full justify-center py-12">
                    <FlowCard
                        actions={
                            <Button.Root $size="sm" className="w-full" form="create-bank-connection-form" type="submit">
                                Connect
                            </Button.Root>
                        }
                        description="Choose the bank accounts that you want to sync with our app."
                        icon={CustomizeIcon}
                        title="Bank accounts selection"
                    >
                        <Deferred
                            data="bankAccounts"
                            fallback={
                                <div className="flex shrink-0 flex-col gap-3">
                                    {Array.from({ length: 3 }).map((_, index) => (
                                        <div
                                            className="h-18 w-full animate-pulse rounded-12 bg-(--bg-sub-300)"
                                            key={index}
                                        />
                                    ))}
                                </div>
                            }
                        >
                            <CreateBankConnectionForm
                                bankAccounts={bankAccounts}
                                enrollmentId={enrollmentId}
                                provider={provider}
                                token={token}
                            />
                        </Deferred>
                    </FlowCard>
                </div>
            </div>
        </div>
    );
}

const FormSchema = v.object({
    provider_connection_id: v.nullable(v.string()),
    provider_type: BankConnectionProviderSchema,
    access_token: v.string(),
    accounts: v.array(
        v.object({
            institution_id: v.string(),
            institution_logo_url: v.nullable(v.string()),
            institution_name: v.string(),
            name: v.string(),
            account_id: v.string(),
            currency: v.string(),
            balance: v.pipe(v.string(), v.decimal("The decimal is badly formatted.")),
            enabled: v.boolean(),
            type: AccountTypeEnum,
            subtype: AccountSubtypeEnum,
            token_expires_at: v.union([v.string(), v.null(), v.undefined()]),
        }),
    ),
});

type CreateBankConnectionFormProps = {
    enrollmentId: string;
    provider: string;
    token: string;
    bankAccounts: Array<App.Data.Finance.BankAccountData>;
};

export function CreateBankConnectionForm({
    enrollmentId,
    provider,
    token,
    bankAccounts,
}: CreateBankConnectionFormProps) {
    const { language } = useTranslation();
    const { transform, post } = useInertiaForm();
    const [form, fields] = useForm({
        id: "create-bank-connection-form",
        shouldValidate: "onSubmit",
        shouldRevalidate: "onInput",
        constraint: getValibotConstraint(FormSchema),
        defaultValue: {
            provider_connection_id: enrollmentId,
            provider_type: provider,
            access_token: token,
            accounts: bankAccounts?.map((account) => ({
                institution_id: account.institution.id,
                institution_logo_url: account.institution.logo,
                institution_name: account.name,
                name: account.name,
                account_id: account.id,
                currency: account.currency,
                balance: decimalFormatter(String(account.balance.amount), language, account.currency),
                enabled: true,
                type: account.type,
                subtype: account.subtype,
                token_expires_at: account.expiresAt ?? null,
            })),
        },
        onValidate({ formData }) {
            return parseWithValibot(formData, { schema: FormSchema });
        },
        onSubmit(event, { submission }) {
            event.preventDefault();

            // check if value key is present on submission object
            if (submission && "value" in submission) {
                transform((data) => ({ ...data, ...submission.value }));

                post(routes.bankConnections.store.url());
            }
        },
    });
    const accounts = fields.accounts.getFieldList();

    console.info(form.allErrors);

    return (
        <form {...getFormProps(form)} className="flex shrink-0 flex-col gap-3">
            <input {...getInputProps(fields.provider_connection_id, { type: "hidden" })} />
            <input {...getInputProps(fields.provider_type, { type: "hidden" })} />
            <input {...getInputProps(fields.access_token, { type: "hidden" })} />

            {accounts?.map((account, index) => {
                const fields = account.getFieldset();

                return (
                    <BankAccount
                        account={bankAccounts[index] as App.Data.Finance.BankAccountData}
                        fields={fields}
                        key={account.id}
                    >
                        <input {...getInputProps(fields.institution_id, { type: "hidden" })} />
                        <input {...getInputProps(fields.institution_logo_url, { type: "hidden" })} />
                        <input {...getInputProps(fields.institution_name, { type: "hidden" })} />
                        <input {...getInputProps(fields.name, { type: "hidden" })} />
                        <input {...getInputProps(fields.account_id, { type: "hidden" })} />
                        <input {...getInputProps(fields.currency, { type: "hidden" })} />
                        <input {...getInputProps(fields.balance, { type: "hidden" })} />
                        <input {...getInputProps(fields.enabled, { type: "hidden" })} />
                        <input {...getInputProps(fields.type, { type: "hidden" })} />
                        <input {...getInputProps(fields.subtype, { type: "hidden" })} />
                        <input {...getInputProps(fields.token_expires_at, { type: "hidden" })} />
                    </BankAccount>
                );
            })}
        </form>
    );
}

type BankAccountProps = {
    account: App.Data.Finance.BankAccountData;
    fields: ReturnType<
        ReturnType<
            ReturnType<typeof useForm<v.InferOutput<typeof FormSchema>>>[1]["accounts"]["getFieldList"]
        >[number]["getFieldset"]
    >;
    children: React.ReactNode;
};

function BankAccount({ account, fields, children }: BankAccountProps) {
    const { language } = useTranslation();
    const currencyFormat = resolveCurrencyFormat(language, account.currency);
    const enabledControl = useInputControl(fields.enabled);

    const format: Format = React.useMemo(
        () => ({
            style: "currency",
            currency: account.currency,
            minimumFractionDigits: currencyFormat?.minimumFractionDigits,
            maximumFractionDigits: currencyFormat?.maximumFractionDigits,
        }),
        [account.currency, currencyFormat?.maximumFractionDigits, currencyFormat?.minimumFractionDigits],
    );

    return (
        <>
            {children}

            <LabelPrimitives.Root className="flex cursor-pointer items-center gap-3.5 rounded-12 bg-(--bg-white-0) px-4 py-2.5 shadow-xs ring-1 ring-(--stroke-soft-200) ring-inset">
                <Avatar.Root $size="40" className="shadow-xs ring-1 ring-(--stroke-soft-200)">
                    <Avatar.Image $color="gray" asChild className="size-10">
                        {account.institution.logo ? (
                            <Image alt={account.name} height={40} src={account.institution.logo} width={40} />
                        ) : (
                            account.institution.name.charAt(0)
                        )}
                    </Avatar.Image>
                </Avatar.Root>

                <div className="flex-1">
                    <div className="text-label-sm text-(--text-strong-950)">{account.name}</div>
                    <div className="text-paragraph-xs text-(--text-sub-600)">
                        <span>{account.type}</span>
                    </div>
                    <div className="text-paragraph-xs text-(--text-sub-600)">
                        <NumberFlow
                            className="[--number-flow-char-height:0.6375em]"
                            format={format}
                            locales={language}
                            value={account.balance.amount}
                            willChange
                        />
                    </div>
                </div>

                <Switch.Root
                    checked={enabledControl.value === "on"}
                    onBlur={enabledControl.blur}
                    onCheckedChange={(checked) => enabledControl.change(checked ? "on" : "off")}
                    onFocus={enabledControl.focus}
                    value={String(enabledControl.value)}
                />
            </LabelPrimitives.Root>
        </>
    );
}
