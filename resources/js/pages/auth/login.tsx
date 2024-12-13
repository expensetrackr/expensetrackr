import { Head, Link, useForm } from "@inertiajs/react";
import { useEffect } from "react";
import { toast } from "sonner";
import { route } from "ziggy-js";

import { Checkbox } from "#/components/form/checkbox.tsx";
import { TextField } from "#/components/form/text-field.tsx";
import { Socialstream } from "#/components/socialstream.tsx";
import * as FancyButton from "#/components/ui/fancy-button.tsx";
import * as LinkButton from "#/components/ui/link-button.tsx";
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
                    <span>Don&apos;t your have account?&nbsp;</span>
                    <LinkButton.Root $style="black" asChild>
                        <Link href={route("register")}>Sign up</Link>
                    </LinkButton.Root>
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

            {socialstream.show && <Socialstream />}
        </AuthLayout>
    );
}
