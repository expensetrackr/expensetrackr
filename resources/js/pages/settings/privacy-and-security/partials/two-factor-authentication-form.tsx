import { router, useForm, usePage } from "@inertiajs/react";
import axios from "axios";
import { parseAsStringEnum, useQueryState } from "nuqs";
import { useEffect, useState } from "react";

import { ActionSection } from "#/components/action-section.tsx";
import { Button } from "#/components/button.tsx";
import { ConfirmsPassword } from "#/components/confirms-password.tsx";
import { ErrorMessage, Field, Label } from "#/components/form/fieldset.tsx";
import { Input } from "#/components/form/input.tsx";
import { type PageProps } from "#/types/index.ts";
import { Action } from "#/utils/action.ts";

interface TwoFactorAuthenticationFormProps {
    requiresConfirmation: boolean;
}

export function TwoFactorAuthenticationForm({ requiresConfirmation }: TwoFactorAuthenticationFormProps) {
    const page = usePage<PageProps>();
    const [action, setAction] = useQueryState("action", parseAsStringEnum<Action>(Object.values(Action)));
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
    const [setupKey, setSetupKey] = useState<string | null>(null);
    const confirmationForm = useForm({
        code: "",
    });
    const twoFactorEnabled = action !== Action.TwoFactorEnable && page.props?.auth?.user?.two_factor_enabled;

    useEffect(() => {
        if (action === Action.TwoFactorConfirm && !qrCode) {
            void setAction(null);
        }
    }, [action, qrCode, setAction]);

    async function enableTwoFactorAuthentication() {
        await setAction(Action.TwoFactorEnable);

        router.post(
            "/user/two-factor-authentication",
            {},
            {
                preserveScroll: true,
                onSuccess() {
                    return Promise.all([showQrCode(), showSetupKey(), showRecoveryCodes()]);
                },
                async onFinish() {
                    await setAction(requiresConfirmation ? Action.TwoFactorConfirm : null);
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
        await setAction(Action.TwoFactorDisable);

        router.delete("/user/two-factor-authentication", {
            preserveScroll: true,
            async onSuccess() {
                await setAction(null);
            },
        });
    }

    const getDescription = () => {
        if ((twoFactorEnabled || action === Action.TwoFactorConfirm) && qrCode) {
            if (action === Action.TwoFactorConfirm) {
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
            action={
                twoFactorEnabled || action === Action.TwoFactorConfirm ? (
                    <>
                        {recoveryCodes.length > 0 && action !== Action.TwoFactorConfirm ? (
                            <ConfirmsPassword onConfirm={regenerateRecoveryCodes}>
                                <Button $color="error" $variant="stroke">
                                    Regenerate recovery codes
                                </Button>
                            </ConfirmsPassword>
                        ) : null}
                        {action === Action.TwoFactorConfirm ? (
                            <ConfirmsPassword onConfirm={disableTwoFactorAuthentication}>
                                <Button $color="neutral" $variant="stroke">
                                    Cancel
                                </Button>
                            </ConfirmsPassword>
                        ) : (
                            <ConfirmsPassword onConfirm={disableTwoFactorAuthentication}>
                                <Button $color="error" $variant="stroke" disabled={action === Action.TwoFactorDisable}>
                                    Disable 2FA
                                </Button>
                            </ConfirmsPassword>
                        )}
                        {action === Action.TwoFactorConfirm ? (
                            <ConfirmsPassword onConfirm={confirmTwoFactorAuthentication}>
                                <Button>Finish setup</Button>
                            </ConfirmsPassword>
                        ) : null}
                        {recoveryCodes.length === 0 && action !== Action.TwoFactorConfirm ? (
                            <ConfirmsPassword onConfirm={showRecoveryCodes}>
                                <Button $color="neutral" $variant="stroke">
                                    Show recovery codes
                                </Button>
                            </ConfirmsPassword>
                        ) : null}
                    </>
                ) : (
                    <ConfirmsPassword onConfirm={enableTwoFactorAuthentication}>
                        <Button $color="neutral" $variant="stroke" disabled={action === Action.TwoFactorEnable}>
                            Enable 2FA
                        </Button>
                    </ConfirmsPassword>
                )
            }
            description={getDescription()}
            title="Two-factor Authentication"
        >
            <div className="flex flex-col gap-4">
                {twoFactorEnabled || action === Action.TwoFactorConfirm ? (
                    <>
                        {qrCode ? (
                            <div className="grid grid-cols-12 items-center gap-8">
                                <div className="col-span-12 flex flex-col gap-4 md:col-span-6 md:col-start-4">
                                    <div className="qr-container relative mx-auto inline-block size-48 overflow-hidden rounded-12 p-0.5">
                                        <div
                                            className="relative z-10 rounded-8 bg-(--bg-white-0) p-2 [&>svg]:size-full"
                                            // biome-ignore lint/security/noDangerouslySetInnerHtml: Laravel generates the QR code as SVG
                                            dangerouslySetInnerHTML={{
                                                __html: qrCode,
                                            }}
                                        />
                                    </div>

                                    <div className="mx-auto flex h-3 w-full max-w-48 flex-row items-center gap-2.5 self-stretch text-subheading-2xs whitespace-nowrap text-(--text-soft-400) uppercase before:h-px before:w-full before:flex-grow before:bg-(--stroke-soft-200) after:h-px after:w-full after:flex-grow after:bg-(--stroke-soft-200)">
                                        or
                                    </div>

                                    {setupKey ? (
                                        <div className="mx-auto w-full max-w-56 rounded-8 bg-(--bg-weak-50) p-2">
                                            <p className="text-center text-label-sm text-(--text-sub-600)">
                                                Setup key:
                                            </p>
                                            <p className="text-xs text-center font-semibold">{setupKey}</p>
                                        </div>
                                    ) : null}

                                    {action === Action.TwoFactorConfirm ? (
                                        <div className="col-span-12 flex flex-col gap-4 md:col-span-6">
                                            <ol className="flex list-decimal flex-col gap-1.5">
                                                <li className="text-paragraph-sm text-(--text-sub-600)">
                                                    First, download the two-factor authentication app on your phone.
                                                </li>

                                                <li className="text-paragraph-sm text-(--text-sub-600)">
                                                    Scan the image above with the two-factor authentication app on your
                                                    phone.
                                                </li>

                                                <li className="text-paragraph-sm text-(--text-sub-600)">
                                                    Enter the six-digit code from the app.
                                                </li>

                                                <li className="text-paragraph-sm text-(--text-sub-600)">
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
                                                    onChange={(e) => confirmationForm.setData("code", e.target.value)}
                                                    type="numeric"
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

                        {recoveryCodes.length && action !== Action.TwoFactorConfirm ? (
                            <div className="rounded-lg text-sm grid max-w-xl gap-1 bg-(--bg-surface-700) px-4 py-4 font-mono text-white">
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
