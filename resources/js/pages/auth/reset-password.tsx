import { Head, useForm } from "@inertiajs/react";
import DoorLockIcon from "virtual:icons/ri/door-lock-fill";

import * as FancyButton from "#/components/ui/fancy-button.tsx";
import { TextField } from "#/components/ui/form/text-field.tsx";
import { useTranslation } from "#/hooks/use-translation.ts";
import { AuthLayout } from "#/layouts/auth-layout.tsx";
import { AuthCard } from "#/layouts/partials/auth-card.tsx";
import { routes } from "#/routes.ts";
import { type PageProps } from "#/types/globals.js";

export default function ResetPasswordPage({ token, email }: { token: string; email: string }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token,
        email,
        password: "",
        password_confirmation: "",
    });
    const { t } = useTranslation();

    const submit: React.FormEventHandler = (e) => {
        e.preventDefault();

        post(routes.password.update.url(), {
            onSuccess() {
                reset("password", "password_confirmation");
            },
        });
    };

    return (
        <AuthCard
            cardIcon={DoorLockIcon}
            description={t("auth.reset_password.description")}
            title={t("auth.reset_password.title")}
        >
            <form className="flex flex-col gap-3" onSubmit={submit}>
                <TextField
                    $error={!!errors.email}
                    autoComplete="username"
                    autoFocus
                    hint={errors.email}
                    label={t("form.fields.email.label")}
                    name="email"
                    onChange={(e) => setData("email", e.target.value)}
                    placeholder={t("form.fields.email.placeholder")}
                    type="email"
                    value={data.email}
                />

                <TextField
                    $error={!!errors.password}
                    autoComplete="new-password"
                    hint={errors.password || t("form.fields.new_password.placeholder")}
                    label={t("form.fields.password.label")}
                    name="password"
                    onChange={(e) => setData("password", e.target.value)}
                    placeholder={t("form.fields.new_password.placeholder")}
                    type="password"
                    value={data.password}
                />

                <TextField
                    $error={!!errors.password_confirmation}
                    autoComplete="new-password"
                    hint={errors.password_confirmation}
                    label={t("form.fields.password_confirmation.label")}
                    name="password_confirmation"
                    onChange={(e) => setData("password_confirmation", e.target.value)}
                    placeholder={t("form.fields.password_confirmation.placeholder")}
                    type="password"
                    value={data.password_confirmation}
                />

                <FancyButton.Root $type="primary" disabled={processing} type="submit">
                    {t("auth.reset_password.actions.submit.label")}
                </FancyButton.Root>
            </form>
        </AuthCard>
    );
}

ResetPasswordPage.layout = (page: React.ReactNode & { props: PageProps }) => (
    <AuthLayout {...page.props}>
        <Head title="Reset Password" />

        {page}
    </AuthLayout>
);
