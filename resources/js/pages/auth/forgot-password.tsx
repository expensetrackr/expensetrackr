import { Head, useForm } from "@inertiajs/react";
import * as React from "react";
import { toast } from "sonner";
import ForgotPasswordSolidIcon from "virtual:icons/hugeicons/forgot-password-solid";

import * as FancyButton from "#/components/ui/fancy-button.tsx";
import { TextField } from "#/components/ui/form/text-field.tsx";
import { useTranslation } from "#/hooks/use-translation.ts";
import { AuthLayout } from "#/layouts/auth-layout.tsx";
import { AuthCard } from "#/layouts/partials/auth-card.tsx";
import { routes } from "#/routes.ts";
import { type PageProps } from "#/types/globals.js";

export default function ForgotPasswordPage({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });
    const { t } = useTranslation();

    React.useEffect(() => {
        if (status) {
            toast.info(status);
        }
    }, [status]);

    const submit: React.FormEventHandler = (e) => {
        e.preventDefault();

        post(routes.password.email.url());
    };

    return (
        <AuthCard
            cardIcon={ForgotPasswordSolidIcon}
            description={t("auth.forgot_password.description")}
            title={t("auth.forgot_password.title")}
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

                <FancyButton.Root $type="primary" disabled={processing} type="submit">
                    {t("auth.forgot_password.actions.submit.label")}
                </FancyButton.Root>
            </form>
        </AuthCard>
    );
}

ForgotPasswordPage.layout = (page: React.ReactNode & { props: PageProps }) => (
    <AuthLayout {...page.props}>
        <Head title="Forgot Password" />

        {page}
    </AuthLayout>
);
