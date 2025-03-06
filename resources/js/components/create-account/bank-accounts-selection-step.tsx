import { useForm as useInertiaForm } from "@inertiajs/react";
import NumberFlow, { type Format } from "@number-flow/react";
import * as LabelPrimitives from "@radix-ui/react-label";
import { resolveCurrencyFormat } from "@sumup/intl";
import { useForm } from "@tanstack/react-form";
import { Image } from "@unpic/react";
import * as React from "react";
import * as v from "valibot";

import * as Switch from "#/components/ui/switch.tsx";
import { useConnectParams } from "#/hooks/use-connect-params.ts";
import { useTranslation } from "#/hooks/use-translation.ts";
import { AccountSubtypeSchema, AccountTypeSchema } from "#/schemas/account.ts";
import { BankConnectionProviderSchema } from "#/schemas/bank-connection.ts";
import { decimalFormatter } from "#/utils/number-formatter.ts";
import * as Avatar from "../ui/avatar.tsx";

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
            type: AccountTypeSchema,
            subtype: AccountSubtypeSchema,
            token_expires_at: v.nullable(v.string()),
        }),
    ),
});

type BankAccountsSelectionStepProps = {
    bankAccounts: Array<App.Data.AccountData>;
};

export function BankAccountsSelectionStep({ bankAccounts }: BankAccountsSelectionStepProps) {
    const { enrollment_id: enrollmentId, provider, token } = useConnectParams();
    const { language } = useTranslation();
    const { transform, post } = useInertiaForm();
    const form = useForm({
        defaultValues: {
            provider_connection_id: enrollmentId,
            provider_type: provider,
            access_token: token,
            accounts: bankAccounts.map((account) => ({
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
        validators: {
            onSubmit: FormSchema,
        },
        async onSubmit({ value }) {
            transform((data) => ({ ...data, ...value }));

            post(route("accounts.bank-connections.store"));
        },
    });

    return (
        <form
            className="flex shrink-0 flex-col gap-3"
            id="bank-accounts-selection"
            onSubmit={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                await form.handleSubmit();
            }}
        >
            {bankAccounts.map((account, index) => (
                <BankAccount account={account} key={account.id}>
                    <form.Field name={`accounts[${index}].enabled`}>
                        {(field) => (
                            <Switch.Root
                                checked={field.state.value}
                                onBlur={field.handleBlur}
                                onCheckedChange={(checked) => field.handleChange(checked)}
                                value={String(field.state.value)}
                            />
                        )}
                    </form.Field>
                </BankAccount>
            ))}
        </form>
    );
}

type BankAccountProps = {
    account: App.Data.AccountData;
    children: React.ReactNode;
};

function BankAccount({ account, children }: BankAccountProps) {
    const { language } = useTranslation();
    const currencyFormat = resolveCurrencyFormat(language, account.currency);

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
        <LabelPrimitives.Root className="flex cursor-pointer items-center gap-3.5 rounded-12 bg-(--bg-white-0) px-4 py-2.5 shadow-xs ring-1 ring-(--stroke-soft-200) ring-inset">
            <Avatar.Root $size="40" className="shadow-xs ring-1 ring-(--stroke-soft-200)">
                <Avatar.Image $color="gray" asChild className="size-10">
                    <Image
                        alt={account.name}
                        height={40}
                        src={`${ENV.PUBLIC_ASSETS_URL}/banks/${account.institution.id}`}
                        width={40}
                    />
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

            {children}
        </LabelPrimitives.Root>
    );
}
