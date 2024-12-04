import { Head, useForm } from "@inertiajs/react";
import { route } from "ziggy-js";

import { Button } from "#/components/button.tsx";
import { Field, Hint, Label } from "#/components/form/fieldset.tsx";
import { Input } from "#/components/form/input.tsx";
import { AuthLayout } from "#/layouts/auth-layout.tsx";

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: "",
    });

    const submit: React.FormEventHandler = (e) => {
        e.preventDefault();

        post(route("password.confirm"), {
            onSuccess() {
                reset("password");
            },
        });
    };

    return (
        <AuthLayout description="This is a secure area of the application. Please confirm your password before continuing.">
            <Head title="Confirm Password" />

            <form className="flex flex-col gap-3" onSubmit={submit}>
                <Field>
                    <Label>Password</Label>
                    <Input
                        autoComplete="current-password"
                        autoFocus
                        invalid={!!errors.password}
                        name="password"
                        onChange={(e) => setData("password", e.target.value)}
                        placeholder="Enter your password"
                        type="password"
                        value={data.password}
                    />
                    {errors.password && <Hint invalid>{errors.password}</Hint>}
                </Field>

                <Button disabled={processing} type="submit">
                    Confirm
                </Button>
            </form>
        </AuthLayout>
    );
}
