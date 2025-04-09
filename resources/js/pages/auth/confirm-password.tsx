import { Head, useForm } from "@inertiajs/react";

import { TextField } from "#/components/form/text-field.tsx";
import * as FancyButton from "#/components/ui/fancy-button.tsx";
import { useTranslation } from "#/hooks/use-translation.ts";
import { AuthLayout } from "#/layouts/auth-layout.tsx";
import { AuthCard } from "#/layouts/partials/auth-card.tsx";
import { routes } from "#/routes.ts";
import { type PageProps } from "#/types/globals.js";

export default function ConfirmPasswordPage() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: "",
    });
    const { t } = useTranslation();

    const submit: React.FormEventHandler = (e) => {
        e.preventDefault();

        post(routes.password.confirm.url(), {
            onSuccess() {
                reset("password");
            },
        });
    };

    return (
        <AuthCard description={t("auth.confirm_password.description")} title={t("auth.confirm_password.title")}>
            <form className="flex flex-col gap-3" onSubmit={submit}>
                <TextField
                    $error={!!errors.password}
                    autoComplete="current-password"
                    autoFocus
                    hint={errors.password}
                    label={t("form.fields.password.label")}
                    name="password"
                    onChange={(e) => setData("password", e.target.value)}
                    placeholder={t("form.fields.password.placeholder")}
                    type="password"
                    value={data.password}
                />

                <FancyButton.Root $type="primary" disabled={processing} type="submit">
                    {t("auth.confirm_password.actions.submit.label")}
                </FancyButton.Root>
            </form>
        </AuthCard>
    );
}

ConfirmPasswordPage.layout = (page: React.ReactNode & { props: PageProps }) => (
    <AuthLayout {...page.props}>
        <Head title="Confirm Password" />

        {page}
    </AuthLayout>
);
