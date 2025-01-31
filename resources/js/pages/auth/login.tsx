import { Head, Link, useForm } from "@inertiajs/react";
import * as React from "react";
import { toast } from "sonner";
import LockLineIcon from "virtual:icons/ri/lock-line";
import MailLineIcon from "virtual:icons/ri/mail-line";
import UserIcon from "virtual:icons/ri/user-fill";
import { route } from "ziggy-js";

import { Checkbox } from "#/components/form/checkbox.tsx";
import { Field } from "#/components/form/field.tsx";
import { PasswordInput } from "#/components/form/password-input.tsx";
import { TextField } from "#/components/form/text-field.tsx";
import { Socialstream } from "#/components/socialstream.tsx";
import * as FancyButton from "#/components/ui/fancy-button.tsx";
import * as LinkButton from "#/components/ui/link-button.tsx";
import { AuthLayout } from "#/layouts/auth-layout.tsx";
import { AuthCard } from "#/layouts/partials/auth-card.tsx";
import { type InertiaSharedProps } from "#/types/index.ts";

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

export default function LoginPage({
    status,
    canResetPassword,
    socialstream,
}: InertiaSharedProps<{ status?: string; canResetPassword: boolean }>) {
    const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
        email: "",
        password: "",
        remember: false,
    });

    React.useEffect(() => {
        if (status) {
            toast.info(status);
        }
    }, [status]);

    const handleSubmit: React.FormEventHandler = (e) => {
        e.preventDefault();

        post(route("login"), {
            onSuccess() {
                reset("password");
            },
        });
    };

    return (
        <AuthCard
            cardIcon={UserIcon}
            description="Welcome back! Please enter your details"
            title="Login to your account"
        >
            <Head title="Log in" />

            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                <TextField
                    $error={!!errors.email}
                    autoComplete="username"
                    autoFocus
                    hint={errors.email}
                    inputMode="email"
                    label="Email"
                    leadingIcon={MailLineIcon}
                    name="email"
                    onChange={(e) => setData("email", e.target.value)}
                    placeholder="e.g. john@example.com"
                    type="email"
                    value={data.email}
                />

                <Field error={errors.password} id="password" label="Password">
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
                        label="Remember me"
                        name="remember"
                        onCheckedChange={(checked) => setData("remember", !!checked)}
                    />

                    {canResetPassword && (
                        <LinkButton.Root $underline asChild>
                            <Link href={route("password.request")}>Forgot your password?</Link>
                        </LinkButton.Root>
                    )}
                </div>

                <FancyButton.Root $type="primary" disabled={processing} type="submit">
                    Log in
                </FancyButton.Root>
            </form>

            {socialstream.show ? <Socialstream /> : null}
        </AuthCard>
    );
}

LoginPage.layout = (page: React.ReactNode & { props: InertiaSharedProps }) => (
    <AuthLayout {...page.props}>
        <Head title="Accounts" />

        {page}
    </AuthLayout>
);
