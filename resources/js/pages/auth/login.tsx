import { Head, useForm } from "@inertiajs/react";
import { useEffect } from "react";
import { toast } from "sonner";
import { route } from "ziggy-js";

import { Button } from "#/components/button.tsx";
import { Checkbox, CheckboxField } from "#/components/checkbox.tsx";
import { ErrorMessage, Field, Label } from "#/components/form/fieldset.tsx";
import { Input } from "#/components/form/input.tsx";
import { StyledLink } from "#/components/link.tsx";
import { Socialstream } from "#/components/socialstream.tsx";
import { AuthLayout } from "#/layouts/auth-layout.tsx";
import { type InertiaSharedProps } from "#/types/index.ts";

export default function Login({
    status,
    canResetPassword,
    socialstream,
}: InertiaSharedProps<{ status?: string; canResetPassword: boolean }>) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    useEffect(() => {
        if (status) {
            toast.info(status);
        }
    }, [status]);

    const submit: React.FormEventHandler = (e) => {
        e.preventDefault();

        post(route("login"), {
            onSuccess() {
                reset("password");
            },
        });
    };

    return (
        <AuthLayout
            description="Welcome back! Please enter your details"
            footer={
                <>
                    Don’t your have account?{" "}
                    <StyledLink $color="black" className="font-bold" href={route("register")}>
                        Sign up
                    </StyledLink>
                </>
            }
            title="Log in to your account"
        >
            <Head title="Log in" />

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
                        autoComplete="current-password"
                        invalid={!!errors.password}
                        name="password"
                        onChange={(e) => setData("password", e.target.value)}
                        placeholder="Enter your password"
                        type="password"
                        value={data.password}
                    />
                    {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
                </Field>

                <div className="flex items-center justify-between gap-3 py-2">
                    <CheckboxField>
                        <Checkbox
                            checked={data.remember}
                            name="remember"
                            onChange={(checked) => setData("remember", checked)}
                        />
                        <Label className="text-paragraph-sm">Remember me</Label>
                    </CheckboxField>

                    {canResetPassword && (
                        <StyledLink href={route("password.request")}>Forgot your password?</StyledLink>
                    )}
                </div>

                <Button disabled={processing} type="submit">
                    Log in
                </Button>
            </form>

            {socialstream.show && <Socialstream />}
        </AuthLayout>
    );
}
