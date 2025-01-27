import { Head, Link, useForm } from "@inertiajs/react";
import UserAddLineIcon from "virtual:icons/ri/user-add-fill";
import { route } from "ziggy-js";

import { Checkbox } from "#/components/form/checkbox.tsx";
import { TextField } from "#/components/form/text-field.tsx";
import { Socialstream } from "#/components/socialstream.tsx";
import * as FancyButton from "#/components/ui/fancy-button.tsx";
import * as LinkButton from "#/components/ui/link-button.tsx";
import { AuthLayout } from "#/layouts/auth-layout.tsx";
import { AuthCard } from "#/layouts/partials/auth-card.tsx";
import { type InertiaSharedProps } from "#/types/index.ts";

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    terms: boolean;
    remember: boolean;
};

export default function RegisterPage({ socialstream }: InertiaSharedProps) {
    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        terms: false,
        remember: false,
    });

    const handleSubmit: React.FormEventHandler = (e) => {
        e.preventDefault();

        post(route("register"), {
            onSuccess() {
                reset("password", "password_confirmation");
            },
        });
    };

    return (
        <AuthCard
            cardIcon={UserAddLineIcon}
            description="Create an account to start tracking your expenses"
            title="Create a new account"
        >
            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
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
                                <LinkButton.Root $style="black" $underline asChild className="whitespace-normal">
                                    <Link href={route("terms.show")}>Terms of Service</Link>
                                </LinkButton.Root>
                                <span>&nbsp;and&nbsp;</span>
                                <LinkButton.Root $style="black" $underline asChild className="whitespace-normal">
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
                </div>

                <FancyButton.Root $type="primary" disabled={processing} type="submit">
                    Get started
                </FancyButton.Root>
            </form>

            {socialstream.show ? <Socialstream /> : null}
        </AuthCard>
    );
}

RegisterPage.layout = (page: React.ReactNode & { props: InertiaSharedProps }) => (
    <AuthLayout {...page.props}>
        <Head title="Register" />

        {page}
    </AuthLayout>
);
