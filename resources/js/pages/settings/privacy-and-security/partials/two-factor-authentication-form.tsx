import { router, useForm, usePage } from "@inertiajs/react";
import axios from "axios";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";

import { ActionSection } from "#/components/action-section.tsx";
import { Button } from "#/components/button.tsx";
import { ConfirmsPassword } from "#/components/confirms-password.tsx";
import { ErrorMessage, Field, Label } from "#/components/fieldset.tsx";
import { Input } from "#/components/input.tsx";
import { type PageProps } from "#/types/index.ts";

interface TwoFactorAuthenticationFormProps {
    requiresConfirmation: boolean;
}

export function TwoFactorAuthenticationForm({ requiresConfirmation }: TwoFactorAuthenticationFormProps) {
    const page = usePage<PageProps>();
    const [action, setAction] = useQueryState("action");
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
    const [setupKey, setSetupKey] = useState<string | null>(null);
    const confirmationForm = useForm({
        code: "",
    });
    const twoFactorEnabled = action !== "enabling:2fa" && page.props?.auth?.user?.two_factor_enabled;

    useEffect(() => {
        if (action === "confirming:2fa" && !qrCode) {
            void setAction(null);
        }
    }, [action, qrCode, setAction]);

    async function enableTwoFactorAuthentication() {
        await setAction("enabling:2fa");

        router.post(
            "/user/two-factor-authentication",
            {},
            {
                preserveScroll: true,
                onSuccess() {
                    return Promise.all([showQrCode(), showSetupKey(), showRecoveryCodes()]);
                },
                async onFinish() {
                    await setAction(requiresConfirmation ? "confirming:2fa" : null);
                },
            },
        );
    }

    async function showSetupKey() {
        return axios.get("/user/two-factor-secret-key").then((response) => {
            setSetupKey(response.data.secretKey);
        });
    }

    function confirmTwoFactorAuthentication() {
        confirmationForm.post("/user/confirmed-two-factor-authentication", {
            preserveScroll: true,
            preserveState: true,
            errorBag: "confirmTwoFactorAuthentication",
            async onSuccess() {
                await setAction(null);
                setQrCode(null);
                setSetupKey(null);
            },
        });
    }

    async function showQrCode() {
        return axios.get("/user/two-factor-qr-code").then((response) => {
            setQrCode(response.data.svg);
        });
    }

    async function showRecoveryCodes() {
        return axios.get("/user/two-factor-recovery-codes").then((response) => {
            setRecoveryCodes(response.data);
        });
    }

    async function regenerateRecoveryCodes() {
        return axios.post("/user/two-factor-recovery-codes").then(async () => {
            await showRecoveryCodes();
        });
    }

    async function disableTwoFactorAuthentication() {
        await setAction("disabling:2fa");

        router.delete("/user/two-factor-authentication", {
            preserveScroll: true,
            async onSuccess() {
                await setAction(null);
            },
        });
    }

    const getDescription = () => {
        if ((twoFactorEnabled || action === "confirming:2fa") && qrCode) {
            if (action === "confirming:2fa") {
                return "To finish enabling two-factor authentication, scan the image below with your 2FA authenticator app or manually enter the setup key:";
            }

            return "Two-factor authentication is now enabled. Scan the image below with your 2FA authenticator app or manually enter the setup key:";
        }

        if (recoveryCodes.length > 0) {
            return "Store these recovery codes in a secure password manager. They can be used to recover access to your account if your two factor authentication device is lost.";
        }

        return "Add an extra layer of protection to your account.";
    };

    return (
        <ActionSection
            title="Two-factor Authentication"
            description={getDescription()}
            action={
                twoFactorEnabled || action === "confirming:2fa" ? (
                    <>
                        {recoveryCodes.length > 0 && action !== "confirming:2fa" ? (
                            <ConfirmsPassword onConfirm={regenerateRecoveryCodes}>
                                <Button $color="error" $variant="stroke" className="px-2">
                                    Regenerate recovery codes
                                </Button>
                            </ConfirmsPassword>
                        ) : null}
                        {action === "confirming:2fa" ? (
                            <ConfirmsPassword onConfirm={disableTwoFactorAuthentication}>
                                <Button
                                    $color="neutral"
                                    $variant="stroke"
                                    className="px-2"
                                    disabled={action === "disabling:2fa"}
                                >
                                    Cancel
                                </Button>
                            </ConfirmsPassword>
                        ) : (
                            <ConfirmsPassword onConfirm={disableTwoFactorAuthentication}>
                                <Button
                                    $color="error"
                                    $variant="stroke"
                                    className="px-2"
                                    disabled={action === "disabling:2fa"}
                                >
                                    Disable 2FA
                                </Button>
                            </ConfirmsPassword>
                        )}
                        {action === "confirming:2fa" ? (
                            <ConfirmsPassword onConfirm={confirmTwoFactorAuthentication}>
                                <Button className="px-2">Finish setup</Button>
                            </ConfirmsPassword>
                        ) : null}
                        {recoveryCodes.length === 0 && action !== "confirming:2fa" ? (
                            <ConfirmsPassword onConfirm={showRecoveryCodes}>
                                <Button $color="neutral" $variant="stroke" className="px-2">
                                    Show recovery codes
                                </Button>
                            </ConfirmsPassword>
                        ) : null}
                    </>
                ) : (
                    <ConfirmsPassword onConfirm={enableTwoFactorAuthentication}>
                        <Button
                            $color="neutral"
                            $variant="stroke"
                            className="px-2"
                            disabled={action === "enabling:2fa"}
                        >
                            Enable 2FA
                        </Button>
                    </ConfirmsPassword>
                )
            }
        >
            <div className="flex flex-col gap-4">
                {twoFactorEnabled || action === "confirming:2fa" ? (
                    <>
                        {qrCode ? (
                            <div className="grid grid-cols-12 items-center gap-8">
                                <div className="col-span-12 flex flex-col gap-4 md:col-span-6 md:col-start-4">
                                    <div className="qr-container rounded-12 relative mx-auto inline-block size-48 overflow-hidden p-0.5">
                                        <div
                                            className="rounded-8 relative z-10 bg-[var(--bg-white-0)] p-2 [&>svg]:size-full"
                                            // biome-ignore lint/security/noDangerouslySetInnerHtml: Laravel generates the QR code as SVG
                                            dangerouslySetInnerHTML={{
                                                __html: qrCode,
                                            }}
                                        />
                                    </div>

                                    <div className="text-subheading-2xs before:flex-grow after:flex-grow mx-auto flex h-3 w-full max-w-48 flex-row items-center gap-2.5 self-stretch whitespace-nowrap text-[var(--text-soft-400)] uppercase before:h-px before:w-full before:bg-[var(--stroke-soft-200)] after:h-px after:w-full after:bg-[var(--stroke-soft-200)]">
                                        or
                                    </div>

                                    {setupKey ? (
                                        <div className="rounded-8 mx-auto w-full max-w-56 bg-[var(--bg-weak-50)] p-2">
                                            <p className="text-label-sm text-center text-[var(--text-sub-600)]">
                                                Setup key:
                                            </p>
                                            <p className="text-center text-xs font-semibold">{setupKey}</p>
                                        </div>
                                    ) : null}

                                    {action === "confirming:2fa" ? (
                                        <div className="col-span-12 flex flex-col gap-4 md:col-span-6">
                                            <ol className="flex list-decimal flex-col gap-1.5">
                                                <li className="text-paragraph-sm text-[var(--text-sub-600)]">
                                                    First, download the two-factor authentication app on your phone.
                                                </li>

                                                <li className="text-paragraph-sm text-[var(--text-sub-600)]">
                                                    Scan the image above with the two-factor authentication app on your
                                                    phone.
                                                </li>

                                                <li className="text-paragraph-sm text-[var(--text-sub-600)]">
                                                    Enter the six-digit code from the app.
                                                </li>

                                                <li className="text-paragraph-sm text-[var(--text-sub-600)]">
                                                    Click the button below to finish enabling two factor authentication.
                                                </li>
                                            </ol>

                                            <Field>
                                                <Label>Enter verification code</Label>
                                                <Input
                                                    autoComplete="one-time-code"
                                                    autoFocus
                                                    invalid={!!confirmationForm.errors.code}
                                                    name="code"
                                                    type="numeric"
                                                    onChange={(e) => confirmationForm.setData("code", e.target.value)}
                                                    value={confirmationForm.data.code}
                                                />
                                                {confirmationForm.errors.code && (
                                                    <ErrorMessage>{confirmationForm.errors.code}</ErrorMessage>
                                                )}
                                            </Field>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        ) : null}

                        {recoveryCodes.length && action !== "confirming:2fa" ? (
                            <div className="grid max-w-xl gap-1 rounded-lg bg-[var(--bg-surface-700)] px-4 py-4 font-mono text-sm text-white">
                                {recoveryCodes.map((code) => (
                                    <div key={code}>{code}</div>
                                ))}
                            </div>
                        ) : null}
                    </>
                ) : null}
            </div>
        </ActionSection>
    );
}
