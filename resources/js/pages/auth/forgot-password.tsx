import { Head, useForm } from "@inertiajs/react";
import * as React from "react";
import { toast } from "sonner";
import DoorLockIcon from "virtual:icons/ri/door-lock-fill";

import { TextField } from "#/components/form/text-field.tsx";
import * as FancyButton from "#/components/ui/fancy-button.tsx";
import { AuthLayout } from "#/layouts/auth-layout.tsx";
import { AuthCard } from "#/layouts/partials/auth-card.tsx";
import { type InertiaSharedProps } from "#/types/index.ts";

export default function ForgotPasswordPage({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    React.useEffect(() => {
        if (status) {
            toast.info(status);
        }
    }, [status]);

    const submit: React.FormEventHandler = (e) => {
        e.preventDefault();

        post(route("password.email"));
    };

    return (
        <AuthCard cardIcon={DoorLockIcon} description="Enter your email to reset your password." title="Reset Password">
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

                <FancyButton.Root $type="primary" disabled={processing} type="submit">
                    Email password reset link
                </FancyButton.Root>
            </form>
        </AuthCard>
    );
}

ForgotPasswordPage.layout = (page: React.ReactNode & { props: InertiaSharedProps }) => (
    <AuthLayout {...page.props}>
        <Head title="Forgot Password" />

        {page}
    </AuthLayout>
);
