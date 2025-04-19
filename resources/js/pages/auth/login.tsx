import { Head, Link, useForm } from "@inertiajs/react";
import * as React from "react";
import { toast } from "sonner";
import LockLineIcon from "virtual:icons/ri/lock-line";
import MailLineIcon from "virtual:icons/ri/mail-line";
import UserIcon from "virtual:icons/ri/user-fill";

import { Socialstream } from "#/components/socialstream.tsx";
import * as FancyButton from "#/components/ui/fancy-button.tsx";
import { Checkbox } from "#/components/ui/form/checkbox.tsx";
import { Field } from "#/components/ui/form/field.tsx";
import { PasswordInput } from "#/components/ui/form/password-input.tsx";
import { TextField } from "#/components/ui/form/text-field.tsx";
import * as LinkButton from "#/components/ui/link-button.tsx";
import { useTranslation } from "#/hooks/use-translation.ts";
import { AuthLayout } from "#/layouts/auth-layout.tsx";
import { AuthCard } from "#/layouts/partials/auth-card.tsx";
import { routes } from "#/routes.ts";
import { type PageProps } from "#/types/globals.js";

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

export default function LoginPage({
    status,
    canResetPassword,
    socialstream,
}: PageProps<{ status?: string; canResetPassword: boolean }>) {
    const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
        email: "",
        password: "",
        remember: false,
    });
    const { t } = useTranslation();

    React.useEffect(() => {
        if (status) {
            toast.info(status);
        }
    }, [status]);

    const handleSubmit: React.FormEventHandler = (e) => {
        e.preventDefault();

        post(routes.login.url(), {
            onSuccess() {
                reset("password");
            },
        });
    };

    return (
        <AuthCard cardIcon={UserIcon} description={t("auth.login.description")} title={t("auth.login.title")}>
            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                <TextField
                    $error={!!errors.email}
                    autoComplete="username"
                    autoFocus
                    hint={errors.email}
                    inputMode="email"
                    label={t("form.fields.email.label")}
                    leadingIcon={MailLineIcon}
                    name="email"
                    onChange={(e) => setData("email", e.target.value)}
                    placeholder={t("form.fields.email.placeholder")}
                    type="email"
                    value={data.email}
                />

                <Field error={errors.password} id="password" label={t("form.fields.password.label")}>
                    <PasswordInput
                        $error={!!errors.password}
                        autoComplete="current-password"
                        disabled={processing}
                        id="password"
                        leadingIcon={LockLineIcon}
                        name="password"
                        onChange={(e) => setData("password", e.target.value)}
                        value={data.password}
                    />
                </Field>

                <div className="flex items-center justify-between gap-3 py-2">
                    <Checkbox
                        checked={data.remember}
                        label={t("form.fields.remember.label")}
                        name="remember"
                        onCheckedChange={(checked) => setData("remember", !!checked)}
                    />

                    {canResetPassword && (
                        <LinkButton.Root $underline asChild>
                            <Link href={routes.password.request.url()}>
                                {t("auth.login.actions.forgot_password.label")}
                            </Link>
                        </LinkButton.Root>
                    )}
                </div>

                <FancyButton.Root $type="primary" disabled={processing} type="submit">
                    {t("auth.login.actions.submit.label")}
                </FancyButton.Root>
            </form>

            {socialstream.show ? <Socialstream /> : null}
        </AuthCard>
    );
}

LoginPage.layout = (page: React.ReactNode & { props: PageProps }) => (
    <AuthLayout {...page.props}>
        <Head title="Log in" />

        {page}
    </AuthLayout>
);
