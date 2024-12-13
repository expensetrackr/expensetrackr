import { Head, useForm } from "@inertiajs/react";
import { useEffect } from "react";
import { toast } from "sonner";

import { TextField } from "#/components/form/text-field.tsx";
import * as FancyButton from "#/components/ui/fancy-button.tsx";
import { AuthLayout } from "#/layouts/auth-layout.tsx";

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    useEffect(() => {
        if (status) {
            toast.info(status);
        }
    }, [status]);

    const submit: React.FormEventHandler = (e) => {
        e.preventDefault();

        post(route("password.email"));
    };

    return (
        <AuthLayout
            description="No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one."
            title="Forgot your password?"
        >
            <Head title="Forgot Password" />

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

                <FancyButton.Root disabled={processing} type="submit">
                    Email password reset link
                </FancyButton.Root>
            </form>
        </AuthLayout>
    );
}
