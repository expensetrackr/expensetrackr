import { Head, useForm } from "@inertiajs/react";
import { route } from "ziggy-js";

import { Button } from "#/components/button.tsx";
import { Checkbox, CheckboxField } from "#/components/checkbox.tsx";
import { Description, ErrorMessage, Field, Label } from "#/components/form/fieldset.tsx";
import { Input } from "#/components/form/input.tsx";
import { Link, StyledLink } from "#/components/link.tsx";
import { Socialstream } from "#/components/socialstream.tsx";
import { AuthLayout } from "#/layouts/auth-layout.tsx";
import { type InertiaSharedProps } from "#/types/index.ts";

export default function Register({ socialstream }: InertiaSharedProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        terms: false,
        remember: false,
    });

    const submit: React.FormEventHandler = (e) => {
        e.preventDefault();

        post(route("register"), {
            onSuccess() {
                reset("password", "password_confirmation");
            },
        });
    };

    return (
        <AuthLayout
            description="Create an account to start tracking your expenses"
            footer={
                <>
                    Already have account?{" "}
                    <StyledLink $color="black" className="font-bold" href={route("login")}>
                        Log in
                    </StyledLink>
                </>
            }
            title="Sign up"
        >
            <Head title="Register" />

            <form className="flex flex-col gap-3" onSubmit={submit}>
                <Field>
                    <Label>Name</Label>
                    <Input
                        autoComplete="name"
                        autoFocus
                        invalid={!!errors.name}
                        name="name"
                        onChange={(e) => setData("name", e.target.value)}
                        placeholder="e.g. John Doe"
                        value={data.name}
                    />
                    {errors.name ? <ErrorMessage>{errors.name}</ErrorMessage> : null}
                </Field>

                <Field>
                    <Label>Email</Label>
                    <Input
                        autoComplete="username"
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

                <div className="flex flex-col gap-3 py-2">
                    <CheckboxField className="items-start">
                        <Checkbox
                            checked={data.terms}
                            className="mt-px"
                            name="terms"
                            onChange={(checked) => setData("terms", checked)}
                        />
                        <Label className="text-paragraph-sm">
                            I agree with the{" "}
                            <Link className="font-bold" href={route("terms.show")}>
                                Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link className="font-bold" href={route("policy.show")}>
                                Privacy Policy
                            </Link>
                        </Label>

                        {errors.terms && <ErrorMessage className="col-span-full">{errors.terms}</ErrorMessage>}
                    </CheckboxField>

                    <CheckboxField>
                        <Checkbox
                            checked={data.remember}
                            name="remember"
                            onChange={(checked) => setData("remember", checked)}
                        />
                        <Label className="text-paragraph-sm">Remember me</Label>
                    </CheckboxField>
                </div>

                <Button disabled={processing} type="submit">
                    Get started
                </Button>
            </form>

            {socialstream.show && <Socialstream />}
        </AuthLayout>
    );
}
