declare namespace App.Data {
    export type AccountData = {
        id: string;
        name: string;
        currency: string;
        type: App.Enums.AccountType;
        subtype: App.Enums.AccountSubtype;
        institution: App.Data.InstitutionData;
        balance: App.Data.BalanceData;
        enrollmentId: string | null;
        institutionCode: string | null;
        expiresAt: string | null;
    };
    export type BalanceData = {
        currency: string;
        amount: number;
    };
    export type CreateBankConnectionAccountData = {
        institutionId: string;
        institutionLogoUrl: string | null;
        institutionName: string;
        name: string;
        accountId: string;
        currency: string;
        balance: number;
        enabled: boolean;
        type: App.Enums.AccountType;
        subtype: App.Enums.AccountSubtype;
        tokenExpiresAt: string | null;
    };
    export type CreateBankConnectionData = {
        providerConnectionId: string | null;
        providerType: App.Enums.ProviderType;
        accessToken: string;
        accounts: Array<App.Data.CreateBankConnectionAccountData>;
    };
    export type InertiaAuthData = {
        user: App.Data.UserData | null;
        currentWorkspace: App.Data.WorkspaceData | any | null;
        workspaces: Array<App.Data.WorkspaceData> | any | null;
    };
    export type InstitutionData = {
        id: string;
        name: string;
        logo: string | null;
        provider: App.Enums.ProviderType;
    };
    export type LanguageData = {
        code: string;
        name: string;
    };
    export type SearchableInstitutionData = {
        id: string;
        name: string;
        logo: string;
        countries: Array<string>;
        popularity: number;
        provider: App.Enums.ProviderType;
    };
    export type SessionData = {
        ip_address: string;
        is_current_device: boolean;
        device: App.Data.UserAgentData;
        last_active: string;
    };
    export type SharedInertiaData = {
        auth: App.Data.InertiaAuthData | null;
        workspaces: App.Data.WorkspacesPermissionsData | null;
        ziggy: App.Data.Ziggy.ZiggyData | null;
        toast: App.Data.ToastData | null;
        language: App.Enums.Language;
        languages: Array<App.Data.LanguageData> | null;
        translations: Record<string, string>;
        socialstream: App.Data.SocialstreamData;
        errors: { [key: string]: string } | null;
    };
    export type SocialstreamData = {
        providers: Array<App.Data.Socialstream.ProviderData>;
        show: boolean;
        connectedAccounts: Array<App.Data.Socialstream.ConnectedAccount>;
        hasPassword: boolean;
    };
    export type ToastData = {
        type: App.Enums.ToastType;
        title: string;
        description: string | null;
        duration: number | null;
    };
    export type UserAgentData = {
        browser: string;
        desktop: boolean;
        mobile: boolean;
        tablet: boolean;
        platform: string;
    };
    export type UserData = {
        id: number;
        name: string;
        email: string;
        profile_photo_path: string | null;
        profile_photo_url: string | null;
        two_factor_enabled: boolean;
    };
    export type WorkspaceData = {
        id: number;
        name: string;
        personal_workspace: boolean;
    };
    export type WorkspaceInvitationData = {
        id: number;
        workspace_id: number;
        email: string;
        role: string;
    };
    export type WorkspacePermissionsData = {
        canAddWorkspaceMembers: boolean;
        canDeleteWorkspace: boolean;
        canRemoveWorkspaceMembers: boolean;
        canUpdateWorkspace: boolean;
        canUpdateWorkspaceMembers: boolean;
    };
    export type WorkspacesPermissionsData = {
        canCreateWorkspaces: boolean;
        canManageTwoFactorAuthentication: boolean;
        canUpdatePassword: boolean;
        canUpdateProfileInformation: boolean;
        hasEmailVerification: boolean;
        hasAccountDeletionFeatures: boolean;
        hasApiFeatures: boolean;
        hasWorkspaceFeatures: boolean;
        hasTermsAndPrivacyPolicyFeature: boolean;
        managesProfilePhotos: boolean;
    };
}
declare namespace App.Data.Socialstream {
    export type ConnectedAccount = {
        id: number;
        provider: string;
        avatar_path: string;
        created_at: string;
    };
    export type ProviderData = {
        id: App.Enums.Socialstream.Provider;
        name: string;
        buttonLabel: string | null;
    };
}
declare namespace App.Data.Teller {
    export type TellerAccountBalanceData = {
        accountId: string;
        ledger: string | null;
        available: string | null;
    };
    export type TellerAccountData = {
        currency: string;
        enrollmentId: string;
        id: string;
        institution: App.Data.Teller.TellerInstitutionData;
        lastFour: string;
        name: string;
        type: App.Enums.Teller.AccountType;
        status: App.Enums.Teller.AccountStatus;
        subtype: App.Enums.Teller.AccountSubtype;
        balances: App.Data.Teller.TellerAccountBalanceData | null;
    };
    export type TellerInstitutionData = {
        id: string;
        name: string;
    };
}
declare namespace App.Data.Ziggy {
    export type RouteData = {
        uri: string;
        methods: Array<string>;
        parameters: Array<string> | null;
        bindings: { [key: string]: string } | null;
    };
    export type ZiggyData = {
        url: string;
        port: number | null;
        defaults: { [key: string]: any };
        routes: { [key: string]: App.Data.Ziggy.RouteData };
        location: string | null;
    };
}
declare namespace App.Enums {
    export type AccountSubtype =
        | "none"
        | "checking"
        | "savings"
        | "brokerage"
        | "pension"
        | "retirement"
        | "401k"
        | "traditional_401k"
        | "roth_401k"
        | "529_plan"
        | "hsa"
        | "mutual_fund"
        | "traditional_ira"
        | "roth_ira"
        | "angel";
    export type AccountType =
        | "depository"
        | "investment"
        | "crypto"
        | "other_asset"
        | "credit_card"
        | "loan"
        | "other_liability";
    export type Language = "en" | "es";
    export type MediaService = "product_media";
    export type ProviderType = "teller" | "mx";
    export type RateType = "fixed" | "variable" | "adjustable";
    export type ToastType = "error" | "warning" | "success" | "info";
}
declare namespace App.Enums.Socialstream {
    export type Provider = "google";
}
declare namespace App.Enums.Teller {
    export type AccountStatus = "open" | "closed";
    export type AccountSubtype =
        | "checking"
        | "savings"
        | "money_market"
        | "certificate_of_deposit"
        | "treasury"
        | "sweep"
        | "credit_card";
    export type AccountType = "depository" | "credit";
    export type EnvironmentType = "sandbox" | "development" | "production";
}
