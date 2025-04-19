import { Head, Link, useForm } from "@inertiajs/react";
import UserAddLineIcon from "virtual:icons/ri/user-add-fill";

import { Socialstream } from "#/components/socialstream.tsx";
import * as FancyButton from "#/components/ui/fancy-button.tsx";
import { Checkbox } from "#/components/ui/form/checkbox.tsx";
import { TextField } from "#/components/ui/form/text-field.tsx";
import * as LinkButton from "#/components/ui/link-button.tsx";
import { useTranslation } from "#/hooks/use-translation.ts";
import { AuthLayout } from "#/layouts/auth-layout.tsx";
import { AuthCard } from "#/layouts/partials/auth-card.tsx";
import { routes } from "#/routes.ts";
import { type PageProps } from "#/types/globals.js";

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    terms: boolean;
    remember: boolean;
};

export default function RegisterPage({ socialstream }: PageProps) {
    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        terms: false,
        remember: false,
    });
    const { t } = useTranslation();

    const handleSubmit: React.FormEventHandler = (e) => {
        e.preventDefault();

        post(routes.register.url(), {
            onSuccess() {
                reset("password", "password_confirmation");
            },
        });
    };

    return (
        <AuthCard
            cardIcon={UserAddLineIcon}
            description={t("auth.register.description")}
            title={t("auth.register.title")}
        >
            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                <TextField
                    $error={!!errors.name}
                    autoComplete="name"
                    autoFocus
                    hint={errors.name}
                    label={t("form.fields.name.label")}
                    name="name"
                    onChange={(e) => setData("name", e.target.value)}
                    placeholder={t("form.fields.name.placeholder")}
                    value={data.name}
                />

                <TextField
                    $error={!!errors.email}
                    autoComplete="email"
                    hint={errors.email}
                    label={t("form.fields.email.label")}
                    name="email"
                    onChange={(e) => setData("email", e.target.value)}
                    placeholder={t("form.fields.email.placeholder")}
                    type="email"
                    value={data.email}
                />

                <TextField
                    autoComplete="new-password"
                    error={errors.password}
                    hint={errors.password ?? t("form.fields.new_password.hint")}
                    label={t("form.fields.password.label")}
                    name="password"
                    onChange={(e) => setData("password", e.target.value)}
                    placeholder={t("form.fields.new_password.placeholder")}
                    type="password"
                    value={data.password}
                />

                <TextField
                    autoComplete="new-password"
                    error={errors.password_confirmation}
                    hint={errors.password_confirmation}
                    label={t("form.fields.confirm_password.label")}
                    name="password_confirmation"
                    onChange={(e) => setData("password_confirmation", e.target.value)}
                    placeholder={t("form.fields.confirm_password.placeholder")}
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
                                <span dangerouslySetInnerHTML={{ __html: t("auth.register.terms.label") }} />
                                <LinkButton.Root $style="black" $underline asChild className="whitespace-normal">
                                    <Link href={routes.terms.show.url()}>{t("auth.register.terms.link.label")}</Link>
                                </LinkButton.Root>
                                <span dangerouslySetInnerHTML={{ __html: t("auth.register.terms.and") }} />
                                <LinkButton.Root $style="black" $underline asChild className="whitespace-normal">
                                    <Link href={routes.policy.show.url()}>{t("auth.register.terms.link2.label")}</Link>
                                </LinkButton.Root>
                            </>
                        }
                        name="terms"
                        onCheckedChange={(checked) => setData("terms", !!checked)}
                    />

                    <Checkbox
                        checked={data.remember}
                        label={t("form.fields.remember.label")}
                        name="remember"
                        onCheckedChange={(checked) => setData("remember", !!checked)}
                    />
                </div>

                <FancyButton.Root $type="primary" disabled={processing} type="submit">
                    {t("auth.register.actions.submit.label")}
                </FancyButton.Root>
            </form>

            {socialstream.show ? <Socialstream /> : null}
        </AuthCard>
    );
}

RegisterPage.layout = (page: React.ReactNode & { props: PageProps }) => (
    <AuthLayout {...page.props}>
        <Head title="Register" />

        {page}
    </AuthLayout>
);
