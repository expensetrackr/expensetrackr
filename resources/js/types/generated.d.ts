declare namespace App.Data {
    export type InertiaAuthData = {
        user: App.Data.UserData | null;
        currentWorkspace: App.Data.WorkspaceData | any | null;
        workspaces: Array<App.Data.WorkspaceData> | any | null;
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
        toast: App.Data.Common.ToastData | null;
        language: App.Enums.Language;
        languages: Array<App.Data.Common.LanguageData> | null;
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
declare namespace App.Data.Common {
    export type LanguageData = {
        code: string;
        name: string;
    };
    export type ToastData = {
        type: App.Enums.ToastType;
        message: string;
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
    export type AccountData = {
        currency: string;
        enrollmentId: string;
        id: string;
        institution: any;
        lastFour: string;
        name: string;
        type: App.Enums.Teller.AccountType;
        status: App.Enums.Teller.AccountStatus;
        subtype: App.Enums.Teller.AccountSubtype;
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
}
