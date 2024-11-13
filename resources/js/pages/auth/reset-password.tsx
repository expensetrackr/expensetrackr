import { Head, useForm } from "@inertiajs/react";
import { route } from "ziggy-js";

import { Button } from "#/components/button.tsx";
import { Description, ErrorMessage, Field, Label } from "#/components/form/fieldset.tsx";
import { Input } from "#/components/form/input.tsx";
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
                    {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
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
                    {errors.password ? (
                        <ErrorMessage>{errors.password}</ErrorMessage>
                    ) : (
                        <Description>Must be at least 8 characters long</Description>
                    )}
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
                    {errors.password_confirmation && <ErrorMessage>{errors.password_confirmation}</ErrorMessage>}
                </Field>

                <Button disabled={processing} type="submit">
                    Reset password
                </Button>
            </form>
        </AuthLayout>
    );
}
