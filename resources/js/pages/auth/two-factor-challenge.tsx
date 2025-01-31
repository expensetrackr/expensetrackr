import { Head, useForm } from "@inertiajs/react";
import * as React from "react";
import { route } from "ziggy-js";

import { TextField } from "#/components/form/text-field.tsx";
import { Link } from "#/components/link.tsx";
import * as DigitInput from "#/components/ui/digit-input.tsx";
import * as FancyButton from "#/components/ui/fancy-button.tsx";
import * as Hint from "#/components/ui/hint.tsx";
import * as Label from "#/components/ui/label.tsx";
import * as LinkButton from "#/components/ui/link-button.tsx";
import { AuthLayout } from "#/layouts/auth-layout.tsx";
import { AuthCard } from "#/layouts/partials/auth-card.tsx";
import { type InertiaSharedProps } from "#/types/index.ts";

export default function TwoFactorChallengePage() {
    const [recovery, setRecovery] = React.useState(false);
    const { data, setData, post, errors, processing } = useForm({
        code: "",
        recovery_code: "",
    });

    const toggleRecovery = (e: React.FormEvent) => {
        e.preventDefault();
        const isRecovery = !recovery;
        setRecovery(isRecovery);

        setTimeout(() => {
            if (isRecovery) {
                setData("code", "");
            } else {
                setData("recovery_code", "");
            }
        }, 100);
    };

    const submit: React.FormEventHandler = (e) => {
        e.preventDefault();

        post(route("two-factor.login"));
    };

    return (
        <AuthCard
            description={
                recovery
                    ? "Please confirm access to your account by entering one of your emergency recovery codes."
                    : "Please confirm access to your account by entering the authentication code provided by your authenticator application."
            }
            title="Two-Factor Confirmation"
        >
            <form className="flex flex-col gap-3" onSubmit={submit}>
                {recovery ? (
                    <TextField
                        $error={!!errors.recovery_code}
                        autoFocus
                        hint={errors.recovery_code}
                        label="Recovery code"
                        name="recovery_code"
                        onChange={(e) => setData("recovery_code", e.target.value)}
                        value={data.recovery_code}
                    />
                ) : (
                    <div className="flex flex-col gap-1">
                        <Label.Root htmlFor="code">Code</Label.Root>
                        <DigitInput.Root
                            $error={!!errors.code}
                            numInputs={6}
                            onChange={(value) => setData("code", value)}
                            shouldAutoFocus
                            value={data.code}
                        />
                        {errors.code && (
                            <Hint.Root $error>
                                <Hint.Icon />
                                {errors.code}
                            </Hint.Root>
                        )}
                    </div>
                )}

                <div className="flex items-center justify-end gap-3 py-2">
                    <LinkButton.Root $style="black" onClick={toggleRecovery}>
                        <Link href={route("two-factor.login")}>
                            {recovery ? "Use an authentication code" : "Use a recovery code"}
                        </Link>
                    </LinkButton.Root>
                </div>

                <FancyButton.Root $type="primary" disabled={processing} type="submit">
                    Log in
                </FancyButton.Root>
            </form>
        </AuthCard>
    );
}

TwoFactorChallengePage.layout = (page: React.ReactNode & { props: InertiaSharedProps }) => (
    <AuthLayout {...page.props}>
        <Head title="Two-Factor Confirmation" />

        {page}
    </AuthLayout>
);
