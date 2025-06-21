import { Head, useForm } from "@inertiajs/react";
import * as React from "react";

import { Link } from "#/components/link.tsx";
import * as DigitInput from "#/components/ui/digit-input.tsx";
import * as FancyButton from "#/components/ui/fancy-button.tsx";
import { Field } from "#/components/ui/form/field.tsx";
import { TextField } from "#/components/ui/form/text-field.tsx";
import * as LinkButton from "#/components/ui/link-button.tsx";
import { useTranslation } from "#/hooks/use-translation.ts";
import { AuthLayout } from "#/layouts/auth-layout.tsx";
import { AuthCard } from "#/layouts/partials/auth-card.tsx";
import { routes } from "#/routes.ts";
import { type PageProps } from "#/types/globals.js";

export default function TwoFactorChallengePage() {
    const [recovery, setRecovery] = React.useState(false);
    const { data, setData, post, errors, processing } = useForm({
        code: "",
        recovery_code: "",
    });
    const { t } = useTranslation();

    const toggleRecovery = (e: React.FormEvent) => {
        e.preventDefault();
        const isRecovery = !recovery;
        setRecovery(isRecovery);

        setTimeout(() => {
            if (isRecovery) {
                setData("code", "");
            } else {
                setData("recovery_code", "");
            }
        }, 100);
    };

    const submit: React.FormEventHandler = (e) => {
        e.preventDefault();

        post(routes.twoFactor.challenge.url());
    };

    return (
        <AuthCard
            description={
                recovery
                    ? t("auth.two_factor_challenge.description.recovery")
                    : t("auth.two_factor_challenge.description.code")
            }
            title={t("auth.two_factor_challenge.title")}
        >
            <form className="flex flex-col gap-3" onSubmit={submit}>
                {recovery ? (
                    <TextField
                        $error={!!errors.recovery_code}
                        autoFocus
                        hint={errors.recovery_code}
                        label={t("form.fields.recovery_code.label")}
                        name="recovery_code"
                        onChange={(e) => setData("recovery_code", e.target.value)}
                        value={data.recovery_code}
                    />
                ) : (
                    <Field error={errors.code} id="code" label={t("form.fields.code.label")}>
                        <DigitInput.Root
                            $error={!!errors.code}
                            name="code"
                            onValueChange={(value) => setData("code", value)}
                            value={data.code}
                        >
                            {Array.from({ length: 6 }).map((_, index) => (
                                <DigitInput.Input key={index} />
                            ))}
                            <DigitInput.HiddenInput />
                        </DigitInput.Root>
                    </Field>
                )}

                <div className="flex items-center justify-end gap-3 py-2">
                    <LinkButton.Root $style="black" onClick={toggleRecovery}>
                        <Link href={routes.twoFactor.challenge.url()}>
                            {recovery
                                ? t("auth.two_factor_challenge.actions.login.recovery")
                                : t("auth.two_factor_challenge.actions.login.code")}
                        </Link>
                    </LinkButton.Root>
                </div>

                <FancyButton.Root $type="primary" disabled={processing} type="submit">
                    {t("auth.two_factor_challenge.actions.submit.label")}
                </FancyButton.Root>
            </form>
        </AuthCard>
    );
}

TwoFactorChallengePage.layout = (page: React.ReactNode & { props: PageProps }) => (
    <AuthLayout {...page.props}>
        <Head title="Two-Factor Confirmation" />

        {page}
    </AuthLayout>
);
