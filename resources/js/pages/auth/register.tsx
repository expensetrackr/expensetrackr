import { Head, Link, useForm } from "@inertiajs/react";
import { route } from "ziggy-js";

import { Checkbox } from "#/components/checkbox.tsx";
import { Socialstream } from "#/components/socialstream.tsx";
import { TextField } from "#/components/text-field.tsx";
import * as FancyButton from "#/components/ui/fancy-button.tsx";
import * as LinkButton from "#/components/ui/link-button.tsx";
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
                    <span>Already have account?&nbsp;</span>
                    <LinkButton.Root $style="black" asChild>
                        <Link href={route("login")}>Log in</Link>
                    </LinkButton.Root>
                </>
            }
            title="Sign up"
        >
            <Head title="Register" />

            <form className="flex flex-col gap-3" onSubmit={submit}>
                <TextField
                    $error={!!errors.name}
                    autoComplete="name"
                    autoFocus
                    hint={errors.name}
                    label="Name"
                    name="name"
                    onChange={(e) => setData("name", e.target.value)}
                    placeholder="e.g. John Doe"
                    value={data.name}
                />

                <TextField
                    $error={!!errors.email}
                    autoComplete="email"
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
                    hint={errors.password ?? "Must be at least 8 characters long"}
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

                <div className="flex flex-col gap-3 py-2">
                    <Checkbox
                        $error={!!errors.terms}
                        checked={data.terms}
                        className="flex-wrap"
                        hint={errors.terms}
                        label={
                            <>
                                <span>I agree with the&nbsp;</span>
                                <LinkButton.Root $style="black" asChild className="whitespace-normal">
                                    <Link href={route("terms.show")}>Terms of Service</Link>
                                </LinkButton.Root>
                                <span>&nbsp;and&nbsp;</span>
                                <LinkButton.Root $style="black" asChild className="whitespace-normal">
                                    <Link href={route("policy.show")}>Privacy Policy</Link>
                                </LinkButton.Root>
                            </>
                        }
                        name="terms"
                        onCheckedChange={(checked) => setData("terms", !!checked)}
                    />

                    <Checkbox
                        checked={data.remember}
                        label="Remember me"
                        name="remember"
                        onCheckedChange={(checked) => setData("remember", !!checked)}
                    />
                    {/* <CheckboxField className="items-start">
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

                        {errors.terms && (
                            <Hint className="col-span-full" invalid>
                                {errors.terms}
                            </Hint>
                        )}
                    </CheckboxField>

                    <CheckboxField>
                        <Checkbox
                            checked={data.remember}
                            name="remember"
                            onChange={(checked) => setData("remember", checked)}
                        />
                        <Label className="text-paragraph-sm">Remember me</Label>
                    </CheckboxField> */}
                </div>

                <FancyButton.Root $type="primary" disabled={processing} type="submit">
                    Get started
                </FancyButton.Root>
            </form>

            {socialstream.show && <Socialstream />}
        </AuthLayout>
    );
}
