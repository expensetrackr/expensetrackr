import { Head, Link, useForm } from "@inertiajs/react";
import * as React from "react";
import { toast } from "sonner";

import * as Button from "#/components/ui/button.tsx";
import { useTranslation } from "#/hooks/use-translation.ts";
import { AuthLayout } from "#/layouts/auth-layout.tsx";
import { AuthCard } from "#/layouts/partials/auth-card.tsx";
import { routes } from "#/routes.ts";
import { type PageProps } from "#/types/globals.js";

export default function VerifyEmailPage({ status }: { status?: string }) {
    const { post, processing } = useForm({});
    const { t } = useTranslation();

    React.useEffect(() => {
        if (status) {
            toast.info(status);
        }
    }, [status]);

    const submit: React.FormEventHandler = (e) => {
        e.preventDefault();

        post(routes.verification.send.url());
    };

    return (
        <AuthCard description={t("auth.verify_email.description")}>
            <form className="flex flex-col gap-3" onSubmit={submit}>
                <Button.Root disabled={processing} type="submit">
                    {t("auth.verify_email.actions.submit.label")}
                </Button.Root>

                <Button.Root $style="stroke" $type="neutral" asChild>
                    <Link as="button" href={routes.logout.url()} method="post">
                        {t("auth.verify_email.actions.logout.label")}
                    </Link>
                </Button.Root>
            </form>
        </AuthCard>
    );
}

VerifyEmailPage.layout = (page: React.ReactNode & { props: PageProps }) => (
    <AuthLayout {...page.props}>
        <Head title="Email Verification" />

        {page}
    </AuthLayout>
);
