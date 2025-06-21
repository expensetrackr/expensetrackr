import { parseAsStringEnum, useQueryState } from "nuqs";
import * as React from "react";

import { ActionSection } from "#/components/action-section.tsx";
import { ConfirmsPassword } from "#/components/confirms-password.tsx";
import * as Button from "#/components/ui/button.tsx";
import { TextField } from "#/components/ui/form/text-field.tsx";
import { useTwoFactorAuth } from "#/hooks/use-two-factor-auth.ts";
import { useUser } from "#/hooks/use-user.ts";
import { Action } from "#/utils/action.ts";

interface TwoFactorAuthenticationFormProps {
    requiresConfirmation: boolean;
    recoveryCodes: string[];
}

export function TwoFactorAuthenticationForm({ requiresConfirmation, recoveryCodes }: TwoFactorAuthenticationFormProps) {
    const [action, setAction] = useQueryState("action", parseAsStringEnum<Action>(Object.values(Action)));
    const [passcode, setPasscode] = React.useState("");

    const user = useUser();
    const twoFactorEnabled = action !== Action.TwoFactorEnable && user?.twoFactorEnabled;
    const {
        confirmed,
        qrCodeSvg,
        secretKey,
        recoveryCodesList,
        error,
        showingRecoveryCodes,
        setShowingRecoveryCodes,
        confirm,
        regenerateRecoveryCodes,
        enable,
        disable,
    } = useTwoFactorAuth(requiresConfirmation, recoveryCodes);

    React.useEffect(() => {
        if (action === Action.TwoFactorConfirm && !qrCodeSvg) {
            void setAction(null);
        }
    }, [action, qrCodeSvg, setAction]);

    const handleConfirm = React.useCallback(async () => {
        await confirm(passcode);
        setPasscode("");
    }, [confirm, passcode]);

    const getDescription = () => {
        if ((twoFactorEnabled || action === Action.TwoFactorConfirm) && qrCodeSvg) {
            if (action === Action.TwoFactorConfirm) {
                return "To finish enabling two-factor authentication, scan the image below with your 2FA authenticator app or manually enter the setup key:";
            }

            return "Two-factor authentication is now enabled. Scan the image below with your 2FA authenticator app or manually enter the setup key:";
        }

        if (recoveryCodesList.length > 0) {
            return "Store these recovery codes in a secure password manager. They can be used to recover access to your account if your two factor authentication device is lost.";
        }

        return "Add an extra layer of protection to your account.";
    };

    return (
        <ActionSection
            action={
                twoFactorEnabled || action === Action.TwoFactorConfirm ? (
                    <>
                        {action === Action.TwoFactorConfirm ? (
                            <ConfirmsPassword onConfirm={disable}>
                                <Button.Root $style="stroke" $type="neutral">
                                    Cancel
                                </Button.Root>
                            </ConfirmsPassword>
                        ) : (
                            <ConfirmsPassword onConfirm={disable}>
                                <Button.Root
                                    $style="stroke"
                                    $type="error"
                                    disabled={action === Action.TwoFactorDisable}
                                >
                                    Disable 2FA
                                </Button.Root>
                            </ConfirmsPassword>
                        )}
                        {action === Action.TwoFactorConfirm ? (
                            <ConfirmsPassword onConfirm={handleConfirm}>
                                <Button.Root disabled={!passcode || passcode.length !== 6}>Finish setup</Button.Root>
                            </ConfirmsPassword>
                        ) : null}
                        {confirmed ? (
                            <ConfirmsPassword onConfirm={() => setShowingRecoveryCodes(!showingRecoveryCodes)}>
                                <Button.Root $style="stroke" $type="neutral">
                                    {showingRecoveryCodes ? "Hide recovery codes" : "Show recovery codes"}
                                </Button.Root>
                            </ConfirmsPassword>
                        ) : null}
                    </>
                ) : (
                    <ConfirmsPassword onConfirm={enable}>
                        <Button.Root $style="stroke" $type="neutral" disabled={action === Action.TwoFactorEnable}>
                            Enable 2FA
                        </Button.Root>
                    </ConfirmsPassword>
                )
            }
            description={getDescription()}
            title="Two-factor Authentication"
        >
            <div className="flex flex-col gap-4">
                {twoFactorEnabled || action === Action.TwoFactorConfirm ? (
                    <>
                        {qrCodeSvg ? (
                            <div className="grid grid-cols-12 items-center gap-8">
                                <div className="col-span-12 flex flex-col gap-4 md:col-span-6 md:col-start-4">
                                    <div className="qr-container relative mx-auto inline-block size-48 overflow-hidden rounded-12 p-0.5">
                                        <img
                                            alt="QR Code"
                                            className="relative z-10 rounded-8 bg-(--bg-white-0) p-2 [&>svg]:size-full"
                                            src={`data:image/svg+xml;base64,${qrCodeSvg}`}
                                        />
                                    </div>

                                    <div className="mx-auto flex h-3 w-full max-w-48 flex-row items-center gap-2.5 self-stretch text-subheading-2xs whitespace-nowrap text-(--text-soft-400) uppercase before:h-px before:w-full before:grow before:bg-(--stroke-soft-200) after:h-px after:w-full after:grow after:bg-(--stroke-soft-200)">
                                        or
                                    </div>

                                    {secretKey ? (
                                        <div className="mx-auto w-full max-w-56 rounded-8 bg-(--bg-weak-50) p-2">
                                            <p className="text-center text-label-sm text-(--text-sub-600)">
                                                Setup key:
                                            </p>
                                            <p className="text-xs text-center font-semibold">{secretKey}</p>
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

                                            <TextField
                                                $error={!!error}
                                                autoComplete="one-time-code"
                                                autoFocus
                                                hint={error}
                                                label="Enter verification code"
                                                name="code"
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/[^0-9]/g, "");
                                                    setPasscode(value);
                                                }}
                                                type="numeric"
                                                value={passcode}
                                            />
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        ) : null}

                        {showingRecoveryCodes && recoveryCodesList.length && action !== Action.TwoFactorConfirm ? (
                            <div className="mx-auto grid max-w-xl gap-4">
                                <div className="grid gap-1 rounded-8 bg-(--bg-soft-200) px-4 py-4 font-mono text-paragraph-sm">
                                    {recoveryCodesList.map((code) => (
                                        <div key={code}>{code}</div>
                                    ))}
                                </div>

                                <ConfirmsPassword onConfirm={regenerateRecoveryCodes}>
                                    <Button.Root $style="stroke" $type="error">
                                        Regenerate recovery codes
                                    </Button.Root>
                                </ConfirmsPassword>
                            </div>
                        ) : null}
                    </>
                ) : null}
            </div>
        </ActionSection>
    );
}
