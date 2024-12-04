import { Head, useForm } from "@inertiajs/react";
import { useEffect } from "react";
import { toast } from "sonner";

import { Button } from "#/components/button.tsx";
import { Field, Hint, Label } from "#/components/form/fieldset.tsx";
import { Input } from "#/components/form/input.tsx";
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

                <Button disabled={processing} type="submit">
                    Email password reset link
                </Button>
            </form>
        </AuthLayout>
    );
}
