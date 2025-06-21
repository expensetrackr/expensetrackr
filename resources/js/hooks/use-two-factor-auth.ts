import axios, { AxiosError } from "axios";
import { parseAsStringEnum, useQueryState } from "nuqs";
import { useState, useEffect, useCallback } from "react";

import { routes } from "#/routes.ts";
import { Action } from "#/utils/action.ts";

interface EnableResponse {
    qrCode: string;
    secret: string;
}

interface ConfirmResponse {
    status: string;
    recovery_codes?: string[];
    message?: string;
}

interface RecoveryCodesResponse {
    recovery_codes: string[];
}

function getAxiosErrorMessage(error: unknown, defaultMessage: string): string {
    if (error instanceof AxiosError && error.response?.data?.message) {
        return String(error.response.data.message);
    }

    return defaultMessage;
}

export interface TwoFactorAuth {
    confirmed: boolean;
    qrCodeSvg: string;
    secretKey: string;
    recoveryCodesList: string[];
    error: string;
    showingRecoveryCodes: boolean;
    setShowingRecoveryCodes: (showing: boolean) => void;
    enable: () => Promise<void>;
    confirm: (passcode: string) => Promise<void>;
    regenerateRecoveryCodes: () => Promise<void>;
    disable: () => Promise<void>;
}

export function useTwoFactorAuth(initialConfirmed: boolean, initialRecoveryCodes: string[]): TwoFactorAuth {
    const [action, setAction] = useQueryState("action", parseAsStringEnum<Action>(Object.values(Action)));
    const [confirmed, setConfirmed] = useState(initialConfirmed);
    const [qrCodeSvg, setQrCodeSvg] = useState("");
    const [secretKey, setSecretKey] = useState("");
    const [recoveryCodesList, setRecoveryCodesList] = useState(initialRecoveryCodes ?? []);
    const [error, setError] = useState("");
    const [showingRecoveryCodes, setShowingRecoveryCodes] = useState(false);

    const enable = useCallback(async () => {
        await setAction(Action.TwoFactorEnable);

        try {
            const response = await axios.post<EnableResponse>(routes.twoFactor.enable.url());

            await setAction(Action.TwoFactorConfirm);
            setQrCodeSvg(response.data.qrCode);
            setSecretKey(response.data.secret);
        } catch (error) {
            console.error("Error enabling 2FA:", error);
            setError(getAxiosErrorMessage(error, "An error occurred while enabling 2FA."));
        }
    }, [setAction]);

    useEffect(() => {
        if (action === Action.TwoFactorEnable && !qrCodeSvg) {
            void enable();
        }
    }, [action, qrCodeSvg, enable]);

    const confirm = useCallback(
        async (passcode: string) => {
            if (!passcode || passcode.length !== 6) return;

            const formattedCode = passcode.replace(/\s+/g, "").trim();

            try {
                const response = await axios.post<ConfirmResponse>(routes.twoFactor.confirm.url(), {
                    code: formattedCode,
                });

                if (response.data.recovery_codes) {
                    setRecoveryCodesList(response.data.recovery_codes);
                }

                await setAction(null);
                setConfirmed(true);
                setShowingRecoveryCodes(true);
                setError("");
            } catch (error) {
                setError(getAxiosErrorMessage(error, "Invalid verification code."));
            }
        },
        [setAction],
    );

    const regenerateRecoveryCodes = useCallback(async () => {
        try {
            const response = await axios.post<RecoveryCodesResponse>(routes.twoFactor.regenerateRecoveryCodes.url());

            if (response.data.recovery_codes) {
                setRecoveryCodesList(response.data.recovery_codes);
            }
        } catch (error) {
            console.error("Error regenerating codes:", error);
            setError(getAxiosErrorMessage(error, "An error occurred while regenerating recovery codes."));
        }
    }, []);

    const disable = useCallback(async () => {
        try {
            await setAction(Action.TwoFactorDisable);

            await axios.delete(routes.twoFactor.disable.url());

            setConfirmed(false);
            setShowingRecoveryCodes(false);
            setRecoveryCodesList([]);
            setQrCodeSvg("");
            setSecretKey("");

            await setAction(null);
        } catch (error) {
            console.error("Error disabling 2FA:", error);
            setError(getAxiosErrorMessage(error, "An error occurred while disabling 2FA."));
        }
    }, [setAction]);

    return {
        confirmed,
        qrCodeSvg,
        secretKey,
        recoveryCodesList,
        error,
        showingRecoveryCodes,
        setShowingRecoveryCodes,
        enable,
        confirm,
        regenerateRecoveryCodes,
        disable,
    };
}
