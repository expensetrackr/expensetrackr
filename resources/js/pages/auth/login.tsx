import { Head, useForm } from "@inertiajs/react";
import { useEffect } from "react";
import { toast } from "sonner";
import { route } from "ziggy-js";

import { Button } from "#/components/button.tsx";
import { Checkbox } from "#/components/form/checkbox.tsx";
import { TextField } from "#/components/form/text-field.tsx";
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
                <TextField
                    $error={!!errors.email}
                    autoComplete="username"
                    autoFocus
                    hint={errors.email}
                    inputMode="email"
                    label="Email"
                    name="email"
                    onChange={(e) => setData("email", e.target.value)}
                    placeholder="e.g. john@example.com"
                    type="email"
                    value={data.email}
                />

                <TextField
                    $error={!!errors.password}
                    autoComplete="current-password"
                    hint={errors.password}
                    label="Password"
                    name="password"
                    onChange={(e) => setData("password", e.target.value)}
                    placeholder="Enter your password"
                    type="password"
                    value={data.password}
                />

                <div className="flex items-center justify-between gap-3 py-2">
                    <Checkbox
                        checked={data.remember}
                        label="Remember me"
                        name="remember"
                        onCheckedChange={(e) => setData("remember", !!e)}
                    />

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
