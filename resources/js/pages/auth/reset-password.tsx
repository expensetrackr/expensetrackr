import { Head, useForm } from "@inertiajs/react";
import DoorLockIcon from "virtual:icons/ri/door-lock-fill";
import { route } from "ziggy-js";

import { TextField } from "#/components/form/text-field.tsx";
import * as FancyButton from "#/components/ui/fancy-button.tsx";
import { AuthLayout } from "#/layouts/auth-layout.tsx";
import { AuthCard } from "#/layouts/partials/auth-card.tsx";
import { type InertiaSharedProps } from "#/types/index.ts";

export default function ResetPasswordPage({ token, email }: { token: string; email: string }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token,
        email,
        password: "",
        password_confirmation: "",
    });

    const submit: React.FormEventHandler = (e) => {
        e.preventDefault();

        post(route("password.update"), {
            onSuccess() {
                reset("password", "password_confirmation");
            },
        });
    };

    return (
        <AuthCard cardIcon={DoorLockIcon} description="Enter your new password and confirm it." title="Reset Password">
            <form className="flex flex-col gap-3" onSubmit={submit}>
                <TextField
                    $error={!!errors.email}
                    autoComplete="username"
                    autoFocus
                    hint={errors.email}
                    label="Email"
                    name="email"
                    onChange={(e) => setData("email", e.target.value)}
                    placeholder="e.g. john@example.com"
                    type="email"
                    value={data.email}
                />

                <TextField
                    $error={!!errors.password}
                    autoComplete="new-password"
                    hint={errors.password || "Must be at least 8 characters long"}
                    label="Password"
                    name="password"
                    onChange={(e) => setData("password", e.target.value)}
                    placeholder="8+ characters long, 1 capital letter"
                    type="password"
                    value={data.password}
                />

                <TextField
                    $error={!!errors.password_confirmation}
                    autoComplete="new-password"
                    hint={errors.password_confirmation}
                    label="Confirm password"
                    name="password_confirmation"
                    onChange={(e) => setData("password_confirmation", e.target.value)}
                    placeholder="Confirm your password"
                    type="password"
                    value={data.password_confirmation}
                />

                <FancyButton.Root $type="primary" disabled={processing} type="submit">
                    Reset password
                </FancyButton.Root>
            </form>
        </AuthCard>
    );
}

ResetPasswordPage.layout = (page: React.ReactNode & { props: InertiaSharedProps }) => (
    <AuthLayout {...page.props}>
        <Head title="Reset Password" />

        {page}
    </AuthLayout>
);
