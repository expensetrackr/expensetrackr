declare namespace App.Data.Auth {
    export type InertiaAuthData = {
        user: App.Data.Auth.UserData | null;
        currentWorkspace: App.Data.Workspace.WorkspaceData | any | null;
        workspaces: Array<App.Data.Workspace.WorkspaceData> | any | null;
    };
    export type SessionData = {
        ipAddress: string;
        isCurrentDevice: boolean;
        device: App.Data.Auth.UserAgentData;
        lastActive: string;
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
        profilePhotoPath: string | null;
        profilePhotoUrl: string | null;
        twoFactorEnabled: boolean;
    };
}
declare namespace App.Data.Banking.Account {
    export type BalanceData = {
        currency: string;
        amount: number;
    };
    export type BankAccountData = {
        id: string;
        name: string;
        currency: string;
        type: App.Enums.AccountType;
        subtype: App.Enums.AccountSubtype;
        institution: App.Data.Banking.Institution.InstitutionData;
        balance: App.Data.Banking.Account.BalanceData;
        enrollmentId: string | null;
        institutionCode: string | null;
        expiresAt: string | null;
    };
    export type CreateAccountData = {
        bankConnectionId: number | null;
        name: string;
        currencyCode: string;
        initialBalance: number;
        isDefault: boolean | null;
        externalId: string | null;
        type: App.Enums.AccountType;
        subtype: App.Enums.AccountSubtype | null;
    };
}
declare namespace App.Data.Banking.Connection {
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
        accounts: Array<App.Data.Banking.Connection.CreateBankConnectionAccountData>;
    };
}
declare namespace App.Data.Banking.Institution {
    export type InstitutionData = {
        id: string;
        name: string;
        logo: string | null;
        provider: App.Enums.ProviderType;
    };
    export type SearchableInstitutionData = {
        id: string;
        name: string;
        logo: string;
        countries: Array<string>;
        popularity: number;
        provider: App.Enums.ProviderType;
    };
}
declare namespace App.Data.FinanceCore {
    export type AccountData = {
        id: string;
        name: string;
        currency: string;
        type: App.Enums.AccountType;
        subtype: App.Enums.AccountSubtype;
        institution: App.Data.FinanceCore.InstitutionData;
        balance: App.Data.FinanceCore.BalanceData;
        enrollmentId: string | null;
        institutionCode: string | null;
        expiresAt: string | null;
    };
    export type BalanceData = {
        currency: string;
        amount: number;
    };
    export type InstitutionData = {
        id: string;
        name: string;
        logo: string | null;
        provider: App.Enums.ProviderType;
    };
}
declare namespace App.Data.Shared {
    export type LanguageData = {
        code: string;
        name: string;
    };
    export type SharedInertiaData = {
        auth: App.Data.Auth.InertiaAuthData | null;
        workspaces: App.Data.Workspace.WorkspacesPermissionsData | null;
        ziggy: App.Data.Ziggy.ZiggyData | null;
        toast: App.Data.Shared.ToastData | null;
        language: App.Enums.Language;
        languages: Array<App.Data.Shared.LanguageData> | null;
        translations: Record<string, string>;
        socialstream: App.Data.Socialstream.SocialstreamData;
        errors: { [key: string]: string } | null;
    };
    export type ToastData = {
        type: App.Enums.ToastType;
        title: string;
        description: string | null;
        duration: number | null;
    };
}
declare namespace App.Data.Socialstream {
    export type ConnectedAccount = {
        id: number;
        provider: string;
        avatarPath: string;
        createdAt: string;
    };
    export type ProviderData = {
        id: App.Enums.Socialstream.Provider;
        name: string;
        buttonLabel: string | null;
    };
    export type SocialstreamData = {
        providers: Array<App.Data.Socialstream.ProviderData>;
        show: boolean;
        connectedAccounts: Array<App.Data.Socialstream.ConnectedAccount>;
        hasPassword: boolean;
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
declare namespace App.Data.Workspace {
    export type WorkspaceData = {
        id: number;
        name: string;
        personalWorkspace: boolean;
        owner: App.Data.Auth.UserData;
        invitations: Array<App.Data.Workspace.WorkspaceInvitationData>;
        members: Array<App.Data.Workspace.WorkspaceMemberData>;
        settings: App.Data.Workspace.WorkspaceSettingsData;
    };
    export type WorkspaceInvitationData = {
        id: number;
        workspaceId: number;
        email: string;
        role: string;
    };
    export type WorkspaceMemberData = {
        membership: App.Data.Workspace.WorkspaceMembershipData;
        id: number;
        name: string;
        email: string;
        profilePhotoPath: string | null;
        profilePhotoUrl: string | null;
        twoFactorEnabled: boolean;
    };
    export type WorkspaceMembershipData = {
        role: string;
    };
    export type WorkspacePermissionsData = {
        canAddWorkspaceMembers: boolean;
        canDeleteWorkspace: boolean;
        canRemoveWorkspaceMembers: boolean;
        canUpdateWorkspace: boolean;
        canUpdateWorkspaceMembers: boolean;
    };
    export type WorkspaceSettingsData = {
        id: string;
        isDataEnrichmentEnabled: boolean;
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
    export type ConnectionStatus = "connected" | "disconnected" | "unknown";
    export type Language = "en" | "es";
    export type MediaService = "product_media";
    export type ProviderType = "teller" | "mx";
    export type RateType = "fixed" | "variable" | "adjustable";
    export type ToastType = "error" | "warning" | "success" | "info";
    export type TransactionStatus = "posted" | "pending" | "excluded" | "completed";
    export type TransactionType = "income" | "expense" | "transfer";
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
    export type TransactionStatus = "posted" | "pending";
}
