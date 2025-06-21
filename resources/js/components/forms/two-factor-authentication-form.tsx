import { router, useForm } from "@inertiajs/react";
import axios from "axios";
import { parseAsStringEnum, useQueryState } from "nuqs";
import * as React from "react";

import { ActionSection } from "#/components/action-section.tsx";
import { ConfirmsPassword } from "#/components/confirms-password.tsx";
import * as Button from "#/components/ui/button.tsx";
import { TextField } from "#/components/ui/form/text-field.tsx";
import { useUser } from "#/hooks/use-user.ts";
import { routes } from "#/routes.ts";
import { Action } from "#/utils/action.ts";

interface TwoFactorAuthenticationFormProps {
    requiresConfirmation: boolean;
}

const twoFactorApi = {
    getSecretKey: () => axios.get<{ secretKey: string }>(routes.twoFactor.secretKey.url()),
    getQrCode: () => axios.get<{ svg: string }>(routes.twoFactor.qrCode.url()),
    getRecoveryCodes: () => axios.get<string[]>(routes.twoFactor.recoveryCodes.url()),
    regenerateRecoveryCodes: () => axios.post(routes.twoFactor.recoveryCodes.url()),
};

function useTwoFactorAuthentication({ requiresConfirmation }: TwoFactorAuthenticationFormProps) {
    const user = useUser();
    const [action, setAction] = useQueryState("action", parseAsStringEnum<Action>(Object.values(Action)));

    const [qrCode, setQrCode] = React.useState<string | null>(null);
    const [setupKey, setSetupKey] = React.useState<string | null>(null);
    const [recoveryCodes, setRecoveryCodes] = React.useState<string[]>([]);
    const [loading, setLoading] = React.useState({
        enabling: false,
        disabling: false,
        regenerating: false,
        showingRecoveryCodes: false,
    });

    const confirmationForm = useForm({ code: "" });

    const twoFactorEnabled = !action && user?.twoFactorEnabled;
    const isConfirming = action === Action.TwoFactorConfirm;

    const showQrCode = React.useCallback(async () => {
        const response = await twoFactorApi.getQrCode();
        setQrCode(response.data.svg);
    }, []);

    const showSetupKey = React.useCallback(async () => {
        const response = await twoFactorApi.getSecretKey();
        setSetupKey(response.data.secretKey);
    }, []);

    const showRecoveryCodes = React.useCallback(async () => {
        setLoading((prev) => ({ ...prev, showingRecoveryCodes: true }));
        const response = await twoFactorApi.getRecoveryCodes();
        setRecoveryCodes(response.data);
        setLoading((prev) => ({ ...prev, showingRecoveryCodes: false }));
    }, []);

    const enableTwoFactorAuthentication = React.useCallback(() => {
        setLoading((prev) => ({ ...prev, enabling: true }));
        router.post(
            routes.twoFactor.enable.url(),
            {},
            {
                preserveScroll: true,
                async onSuccess() {
                    await Promise.all([showQrCode(), showSetupKey(), showRecoveryCodes()]);
                    await setAction(requiresConfirmation ? Action.TwoFactorConfirm : null);
                },
                onFinish() {
                    setLoading((prev) => ({ ...prev, enabling: false }));
                },
            },
        );
    }, [requiresConfirmation, setAction, showQrCode, showRecoveryCodes, showSetupKey]);

    const confirmTwoFactorAuthentication = React.useCallback(() => {
        confirmationForm.post(routes.twoFactor.confirm.url(), {
            preserveScroll: true,
            preserveState: true,
            errorBag: "confirmTwoFactorAuthentication",
            async onSuccess() {
                await setAction(null);
                setQrCode(null);
                setSetupKey(null);
            },
        });
    }, [confirmationForm, setAction]);

    const hideRecoveryCodes = React.useCallback(() => {
        setRecoveryCodes([]);
    }, []);

    const regenerateRecoveryCodes = React.useCallback(async () => {
        setLoading((prev) => ({ ...prev, regenerating: true }));
        await twoFactorApi.regenerateRecoveryCodes();
        await showRecoveryCodes();
        setLoading((prev) => ({ ...prev, regenerating: false }));
    }, [showRecoveryCodes]);

    const disableTwoFactorAuthentication = React.useCallback(() => {
        setLoading((prev) => ({ ...prev, disabling: true }));
        router.delete(routes.twoFactor.disable.url(), {
            preserveScroll: true,
            async onSuccess() {
                await setAction(null);
            },
            onFinish() {
                setLoading((prev) => ({ ...prev, disabling: false }));
            },
        });
    }, [setAction]);

    const cancelConfirmation = React.useCallback(() => {
        router.delete(routes.twoFactor.disable.url(), {
            preserveScroll: true,
            async onSuccess() {
                await setAction(null);
                setQrCode(null);
                setSetupKey(null);
            },
        });
    }, [setAction]);

    React.useEffect(() => {
        if (action === Action.TwoFactorConfirm && !qrCode && !user.twoFactorEnabled) {
            void setAction(null);
        }
    }, [action, qrCode, setAction, user.twoFactorEnabled]);

    const description = React.useMemo(() => {
        if (isConfirming) {
            return "To finish enabling two-factor authentication, scan the image below with your 2FA authenticator app or manually enter the setup key:";
        }
        if (twoFactorEnabled && recoveryCodes.length === 0) {
            return "Two-factor authentication is now enabled. Scan the image below with your 2FA authenticator app or manually enter the setup key:";
        }
        if (recoveryCodes.length > 0) {
            return "Store these recovery codes in a secure password manager. They can be used to recover access to your account if your two factor authentication device is lost.";
        }
        return "Add an extra layer of protection to your account.";
    }, [isConfirming, twoFactorEnabled, recoveryCodes.length]);

    return {
        twoFactorEnabled,
        isConfirming,
        qrCode,
        setupKey,
        recoveryCodes,
        confirmationForm,
        loading,
        description,
        enableTwoFactorAuthentication,
        confirmTwoFactorAuthentication,
        disableTwoFactorAuthentication,
        showRecoveryCodes,
        hideRecoveryCodes,
        regenerateRecoveryCodes,
        cancelConfirmation,
    };
}

const QRCodeSetup = ({
    qrCode,
    setupKey,
    isConfirming,
    confirmationForm,
}: Pick<
    ReturnType<typeof useTwoFactorAuthentication>,
    "qrCode" | "setupKey" | "isConfirming" | "confirmationForm"
>) => (
    <div className="grid grid-cols-12 items-center gap-8">
        <div className="col-span-12 flex flex-col gap-4 md:col-span-6 md:col-start-4">
            <div className="qr-container relative mx-auto inline-block size-48 overflow-hidden rounded-12 p-0.5">
                <div
                    className="relative z-10 rounded-8 bg-(--bg-white-0) p-2 [&>svg]:size-full"
                    // biome-ignore lint/security/noDangerouslySetInnerHtml: Laravel generates the QR code as SVG
                    dangerouslySetInnerHTML={{ __html: qrCode! }}
                />
            </div>

            <div className="mx-auto flex h-3 w-full max-w-48 flex-row items-center gap-2.5 self-stretch text-subheading-2xs whitespace-nowrap text-(--text-soft-400) uppercase before:h-px before:w-full before:grow before:bg-(--stroke-soft-200) after:h-px after:w-full after:grow after:bg-(--stroke-soft-200)">
                or
            </div>

            {setupKey && (
                <div className="mx-auto w-full max-w-56 rounded-8 bg-(--bg-weak-50) p-2">
                    <p className="text-center text-label-sm text-(--text-sub-600)">Setup key:</p>
                    <p className="text-xs text-center font-semibold">{setupKey}</p>
                </div>
            )}

            {isConfirming && (
                <div className="col-span-12 flex flex-col gap-4 md:col-span-6">
                    <ol className="flex list-decimal flex-col gap-1.5">
                        <li className="text-paragraph-sm text-(--text-sub-600)">
                            First, download the two-factor authentication app on your phone.
                        </li>
                        <li className="text-paragraph-sm text-(--text-sub-600)">
                            Scan the image above with the two-factor authentication app on your phone.
                        </li>
                        <li className="text-paragraph-sm text-(--text-sub-600)">
                            Enter the six-digit code from the app.
                        </li>
                        <li className="text-paragraph-sm text-(--text-sub-600)">
                            Click the button below to finish enabling two factor authentication.
                        </li>
                    </ol>

                    <TextField
                        $error={!!confirmationForm.errors.code}
                        autoComplete="one-time-code"
                        autoFocus
                        hint={confirmationForm.errors.code}
                        label="Enter verification code"
                        name="code"
                        onChange={(e) => confirmationForm.setData("code", e.target.value)}
                        type="numeric"
                        value={confirmationForm.data.code}
                    />
                </div>
            )}
        </div>
    </div>
);

const RecoveryCodesDisplay = ({
    recoveryCodes,
    onRegenerate,
    isRegenerating,
}: {
    recoveryCodes: string[];
    onRegenerate: () => void;
    isRegenerating: boolean;
}) => (
    <div className="mx-auto grid max-w-xl gap-4">
        <div className="grid gap-1 rounded-8 bg-(--bg-soft-200) px-4 py-4 font-mono text-paragraph-sm text-(--text-sub-600)">
            {recoveryCodes.map((code) => (
                <div key={code}>{code}</div>
            ))}
        </div>

        <ConfirmsPassword onConfirm={onRegenerate}>
            <Button.Root $style="stroke" $type="error" disabled={isRegenerating}>
                Regenerate recovery codes
            </Button.Root>
        </ConfirmsPassword>
    </div>
);

export function TwoFactorAuthenticationForm({ requiresConfirmation }: TwoFactorAuthenticationFormProps) {
    const {
        twoFactorEnabled,
        isConfirming,
        qrCode,
        setupKey,
        recoveryCodes,
        confirmationForm,
        loading,
        description,
        enableTwoFactorAuthentication,
        confirmTwoFactorAuthentication,
        disableTwoFactorAuthentication,
        showRecoveryCodes,
        hideRecoveryCodes,
        regenerateRecoveryCodes,
        cancelConfirmation,
    } = useTwoFactorAuthentication({ requiresConfirmation });

    const renderActionButtons = () => {
        if (isConfirming) {
            return (
                <>
                    <ConfirmsPassword onConfirm={cancelConfirmation}>
                        <Button.Root $style="stroke" $type="neutral">
                            Cancel
                        </Button.Root>
                    </ConfirmsPassword>
                    <ConfirmsPassword onConfirm={confirmTwoFactorAuthentication}>
                        <Button.Root disabled={confirmationForm.processing}>Finish setup</Button.Root>
                    </ConfirmsPassword>
                </>
            );
        }

        if (twoFactorEnabled) {
            return (
                <>
                    <ConfirmsPassword onConfirm={disableTwoFactorAuthentication}>
                        <Button.Root $style="stroke" $type="error" disabled={loading.disabling}>
                            Disable 2FA
                        </Button.Root>
                    </ConfirmsPassword>
                    <ConfirmsPassword onConfirm={recoveryCodes.length > 0 ? hideRecoveryCodes : showRecoveryCodes}>
                        <Button.Root $style="stroke" $type="neutral" disabled={loading.showingRecoveryCodes}>
                            {recoveryCodes.length > 0 ? "Hide recovery codes" : "Show recovery codes"}
                        </Button.Root>
                    </ConfirmsPassword>
                </>
            );
        }

        return (
            <ConfirmsPassword onConfirm={enableTwoFactorAuthentication}>
                <Button.Root $style="stroke" $type="neutral" disabled={loading.enabling}>
                    Enable 2FA
                </Button.Root>
            </ConfirmsPassword>
        );
    };

    return (
        <ActionSection action={renderActionButtons()} description={description} title="Two-factor Authentication">
            <div className="flex flex-col gap-4">
                {(isConfirming || twoFactorEnabled) && qrCode && (
                    <QRCodeSetup
                        confirmationForm={confirmationForm}
                        isConfirming={isConfirming}
                        qrCode={qrCode}
                        setupKey={setupKey}
                    />
                )}

                {recoveryCodes.length > 0 && !isConfirming && (
                    <RecoveryCodesDisplay
                        isRegenerating={loading.regenerating}
                        onRegenerate={regenerateRecoveryCodes}
                        recoveryCodes={recoveryCodes}
                    />
                )}
            </div>
        </ActionSection>
    );
}
