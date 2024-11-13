import { Head, useForm } from "@inertiajs/react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useState } from "react";
import { route } from "ziggy-js";

import { Button } from "#/components/button.tsx";
import { ErrorMessage, Field, Label } from "#/components/form/fieldset.tsx";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "#/components/form/input-otp.tsx";
import { Input } from "#/components/form/input.tsx";
import { StyledLink } from "#/components/link.tsx";
import { AuthLayout } from "#/layouts/auth-layout.tsx";

export default function TwoFactorChallenge() {
    const [recovery, setRecovery] = useState(false);
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
        <AuthLayout
            description={
                recovery
                    ? "Please confirm access to your account by entering one of your emergency recovery codes."
                    : "Please confirm access to your account by entering the authentication code provided by your authenticator application."
            }
            title="Two-Factor Confirmation"
        >
            <Head title="Two-Factor Confirmation" />

            <form className="flex flex-col gap-3" onSubmit={submit}>
                {recovery ? (
                    <Field>
                        <Label>Recovery code</Label>
                        <Input
                            autoComplete="name"
                            autoFocus
                            invalid={!!errors.recovery_code}
                            name="name"
                            onChange={(e) => setData("recovery_code", e.target.value)}
                            value={data.recovery_code}
                        />
                        {errors.recovery_code && <ErrorMessage>{errors.recovery_code}</ErrorMessage>}
                    </Field>
                ) : (
                    <Field>
                        <Label htmlFor="code">Code</Label>
                        <InputOTP
                            autoComplete="one-time-code"
                            autoFocus
                            id="code"
                            maxLength={6}
                            onChange={(value) => setData("code", value)}
                            pattern={REGEXP_ONLY_DIGITS}
                            value={data.code}
                        >
                            <InputOTPGroup className="w-full gap-1">
                                <InputOTPSlot
                                    className="rounded-10 border after:rounded-[9px]"
                                    index={0}
                                    invalid={!!errors.code}
                                />
                                <InputOTPSlot
                                    className="rounded-10 border after:rounded-[9px]"
                                    index={1}
                                    invalid={!!errors.code}
                                />
                                <InputOTPSlot
                                    className="rounded-10 border after:rounded-[9px]"
                                    index={2}
                                    invalid={!!errors.code}
                                />
                                <InputOTPSlot
                                    className="rounded-10 border after:rounded-[9px]"
                                    index={3}
                                    invalid={!!errors.code}
                                />
                                <InputOTPSlot
                                    className="rounded-10 border after:rounded-[9px]"
                                    index={4}
                                    invalid={!!errors.code}
                                />
                                <InputOTPSlot
                                    className="rounded-10 border after:rounded-[9px]"
                                    index={5}
                                    invalid={!!errors.code}
                                />
                            </InputOTPGroup>
                        </InputOTP>
                        {errors.code && <ErrorMessage>{errors.code}</ErrorMessage>}
                    </Field>
                )}

                <div className="flex items-center justify-end gap-3 py-2">
                    <StyledLink as="button" href={route("two-factor.login")} onClick={toggleRecovery}>
                        {recovery ? "Use an authentication code" : "Use a recovery code"}
                    </StyledLink>
                </div>

                <Button disabled={processing} type="submit">
                    Log in
                </Button>
            </form>
        </AuthLayout>
    );
}
