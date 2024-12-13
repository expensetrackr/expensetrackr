import { Head, useForm } from "@inertiajs/react";
import { route } from "ziggy-js";

import { TextField } from "#/components/form/text-field.tsx";
import * as FancyButton from "#/components/ui/fancy-button.tsx";
import { AuthLayout } from "#/layouts/auth-layout.tsx";

export default function ResetPassword({ token, email }: { token: string; email: string }) {
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
        <AuthLayout>
            <Head title="Reset Password" />

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

                <FancyButton.Root disabled={processing} type="submit">
                    Reset password
                </FancyButton.Root>
            </form>
        </AuthLayout>
    );
}
