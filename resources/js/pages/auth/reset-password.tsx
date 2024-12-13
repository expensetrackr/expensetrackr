import { Head, useForm } from "@inertiajs/react";
import { route } from "ziggy-js";

import { Field, Hint, Label } from "#/components/form/fieldset.tsx";
import { Input } from "#/components/form/old-input.tsx";
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
                <Field>
                    <Label>Email</Label>
                    <Input
                        autoComplete="username"
                        autoFocus
                        invalid={!!errors.email}
                        name="email"
                        onChange={(e) => setData("email", e.target.value)}
                        placeholder="e.g. john@example.com"
                        type="email"
                        value={data.email}
                    />
                    {errors.email && <Hint invalid>{errors.email}</Hint>}
                </Field>

                <Field>
                    <Label>Password</Label>
                    <Input
                        autoComplete="new-password"
                        invalid={!!errors.password}
                        name="password"
                        onChange={(e) => setData("password", e.target.value)}
                        placeholder="8+ characters long, 1 capital letter"
                        type="password"
                        value={data.password}
                    />
                    <Hint invalid={!!errors.password}>{errors.password ?? "Must be at least 8 characters long"}</Hint>
                </Field>

                <Field>
                    <Label>Confirm password</Label>
                    <Input
                        autoComplete="new-password"
                        invalid={!!errors.password_confirmation}
                        name="password_confirmation"
                        onChange={(e) => setData("password_confirmation", e.target.value)}
                        placeholder="Confirm your password"
                        type="password"
                        value={data.password_confirmation}
                    />
                    {errors.password_confirmation && <Hint invalid>{errors.password_confirmation}</Hint>}
                </Field>

                <FancyButton.Root disabled={processing} type="submit">
                    Reset password
                </FancyButton.Root>
            </form>
        </AuthLayout>
    );
}
