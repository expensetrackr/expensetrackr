export interface TellerUser {
    id: string;
}

export interface TellerInstitution {
    id: string;
    name: string;
}

export interface TellerEnrollment {
    id: string;
    institution: TellerInstitution;
}

export interface TellerConnectEnrollment {
    accessToken: string;
    user: TellerUser;
    enrollment: TellerEnrollment;
    signatures?: string[];
}

export interface TellerConnectFailure {
    type: "payee" | "payment";
    code: "timeout" | "error";
    message: string;
}

export type TellerConnectOnSuccess = (enrollment: TellerConnectEnrollment) => void;

export type TellerConnectOnInit = () => void;

export type TellerConnectOnExit = () => void;

export type TellerConnectOnFailure = (failure: TellerConnectFailure) => void;

export type TellerConnectOnEvent = (name: string, data: object) => void;

export interface TellerConnectOptions {
    // Required options
    applicationId: string;
    onSuccess: TellerConnectOnSuccess;

    // Additional options
    environment?: "sandbox" | "development" | "production";
    institution?: string;
    selectAccount?: "disabled" | "single" | "multiple";
    enrollmentId?: string;
    connectToken?: string;
    nonce?: string;
    onInit?: TellerConnectOnInit;
    onExit?: TellerConnectOnExit;
    onFailure?: TellerConnectOnFailure;

    // Undocumented options
    appearance?: "dark" | "light" | "system";
    products?: ("balance" | "identity" | "transactions" | "verify")[];
    accountFilter?: object;
    onEvent?: TellerConnectOnEvent;
}

export interface TellerConnectInstance {
    open: () => void;
    destroy: () => void;
}

export interface TellerConnect extends TellerConnectInstance {
    setup: (config: TellerConnectOptions) => TellerConnectInstance;
}

declare global {
    interface Window {
        TellerConnect: TellerConnect;
    }
}
