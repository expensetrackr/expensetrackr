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
        isSubscribed: boolean | null;
    };
}
declare namespace App.Data.Banking {
    export type TellerAccountBalanceData = {
        accountId: string;
        ledger: string | null;
        available: string | null;
    };
    export type TellerAccountData = {
        currency: string;
        enrollmentId: string;
        id: string;
        institution: App.Data.Banking.TellerInstitutionData;
        name: string;
        type: App.Enums.Banking.TellerAccountType;
        status: App.Enums.Banking.TellerAccountStatus;
        subtype: App.Enums.Banking.TellerAccountSubtype;
        balances: App.Data.Banking.TellerAccountBalanceData | null;
    };
    export type TellerInstitutionData = {
        id: string;
        name: string;
    };
    export type TellerLinksData = {
        self: string;
    };
    export type TellerTransactionData = {
        accountId: string;
        amount: string;
        date: string;
        description: string;
        details: App.Data.Banking.TellerTransactionDetailsData;
        status: App.Enums.Banking.TellerTransactionStatus;
        id: string;
        links: App.Data.Banking.TellerTransactionLinksData;
        runningBalance: string | null;
        type: string;
    };
    export type TellerTransactionDetailsData = {
        processingStatus: string;
        category: string | null;
        counterparty: App.Data.Banking.TransactionDetailsCounterpartyData;
    };
    export type TellerTransactionLinksData = {
        account: string;
        self: string;
    };
    export type TransactionDetailsCounterpartyData = {
        name: string | null;
        type: string | null;
    };
}
declare namespace App.Data.Currency {
    export type ArgentinaDolarItemData = {
        valueAvg: number;
        valueSell: number;
        valueBuy: number;
    };
    export type ArgentinaResponseData = {
        oficial: App.Data.Currency.ArgentinaDolarItemData;
        blue: App.Data.Currency.ArgentinaDolarItemData;
        oficialEuro: App.Data.Currency.ArgentinaDolarItemData;
        blueEuro: App.Data.Currency.ArgentinaDolarItemData;
    };
    export type CodesResponseData = {
        result: string;
        documentation: string;
        termsOfUse: string;
        supportedCodes: [string, string][];
    };
    export type LatestResponseData = {
        result: string;
        documentation: string;
        termsOfUse: string;
        timeLastUpdateUnix: number;
        timeLastUpdateUtc: string;
        timeNextUpdateUnix: number;
        timeNextUpdateUtc: string;
        baseCode: string;
        conversionRates: { [key: string]: number | string };
    };
    export type VenezuelaResponseData = {
        status: number;
        total: number;
        result: Array<App.Data.Currency.VenezuelaResponseItemData>;
    };
    export type VenezuelaResponseItemData = {
        id: number;
        binance: string;
        dolartoday: string;
        localbitcoindt: string;
        yadio: string;
        airtm: string;
        akb: string | null;
        cambiosrya: string;
        mkambio: string;
        bcv: string;
        promediototalmk: string;
        promediovip: string;
        fecha: string;
        hora: string;
        horaEpv: string;
        fechaEpv: string;
        promEpv: string;
    };
}
declare namespace App.Data.Finance {
    export type AccountCreateData = {
        bankConnectionId: number | null;
        name: string;
        currencyCode: string;
        initialBalance: number;
        isDefault: boolean | null;
        externalId: string | null;
        type: App.Enums.Finance.AccountType;
        subtype: App.Enums.Finance.AccountSubtype | null;
    };
    export type AccountData = {
        id: number;
        name: string;
        currentBalance: string;
        type: App.Enums.Finance.AccountType;
        weight: number;
    };
    export type AccountGroupData = {
        key: string;
        name: string;
        classification: string;
        total: string;
        weight: number;
        color: string;
        accounts: { [key: number]: App.Data.Finance.AccountData };
    };
    export type BalanceData = {
        currency: string;
        amount: number;
    };
    export type BalanceSheetData = {
        assets: App.Data.Finance.ClassificationGroupData;
        liabilities: App.Data.Finance.ClassificationGroupData;
    };
    export type BankAccountData = {
        id: string;
        name: string;
        currency: string;
        type: App.Enums.Finance.AccountType;
        subtype: App.Enums.Finance.AccountSubtype;
        institution: App.Data.Finance.InstitutionData;
        balance: App.Data.Finance.BalanceData;
        enrollmentId: string | null;
        institutionCode: string | null;
        expiresAt: string | null;
    };
    export type BankConnectionAccountCreateData = {
        institutionId: string;
        institutionLogoUrl: string | null;
        institutionName: string;
        name: string;
        accountId: string;
        currency: string;
        balance: number;
        enabled: boolean;
        type: App.Enums.Finance.AccountType;
        subtype: App.Enums.Finance.AccountSubtype;
        tokenExpiresAt: string | null;
    };
    export type BankConnectionCreateData = {
        providerConnectionId: string | null;
        providerType: App.Enums.Banking.ProviderType;
        accessToken: string;
        accounts: Array<App.Data.Finance.BankConnectionAccountCreateData>;
    };
    export type ChartBalanceData = {
        date: string | null;
        balance: string;
        cashBalance: string;
        holdingsBalance: string;
    };
    export type ChartSeriesData = {
        startDate: string;
        endDate: string;
        interval: string;
        trend: App.Data.Finance.TrendData;
        values: { [key: number]: App.Data.Finance.SeriesValueData };
    };
    export type ClassificationGroupData = {
        key: string;
        displayName: string;
        icon: string;
        accountGroups: { [key: number]: App.Data.Finance.AccountGroupData };
    };
    export type InstitutionData = {
        id: string;
        name: string;
        logo: string | null;
        provider: App.Enums.Banking.ProviderType;
    };
    export type InstitutionSearchData = {
        id: string;
        name: string;
        logo: string;
        countries: Array<string>;
        popularity: number;
        provider: App.Enums.Banking.ProviderType;
    };
    export type SeriesValueData = {
        date: string;
        dateFormatted: string;
        trend: App.Data.Finance.TrendData;
    };
    export type TransactionData = {
        id: string;
        name: string;
        note: string | null;
        status: App.Enums.Finance.TransactionStatus;
        categorySlug: string;
        baseAmount: string | null;
        baseCurrency: string | null;
        currencyRate: string | null;
        amount: string;
        currency: string;
        datedAt: any;
    };
    export type TrendData = {
        current: string;
        previous: string | null;
        favorableDirection: string;
    };
}
declare namespace App.Data.Shared {
    export type LanguageData = {
        code: string;
        name: string;
    };
    export type PermissionsData = {
        canCreateAccounts: boolean;
        canCreateCategories: boolean;
        canCreateTransactions: boolean;
    };
    export type SharedInertiaData = {
        auth: App.Data.Auth.InertiaAuthData | null;
        workspaces: App.Data.Workspace.WorkspacesPermissionsData | null;
        toast: App.Data.Shared.ToastData | null;
        language: App.Enums.Shared.Language;
        languages: Array<App.Data.Shared.LanguageData> | null;
        translations: Record<string, string>;
        socialstream: App.Data.Socialstream.SocialstreamData;
        permissions: App.Data.Shared.PermissionsData;
        errors: { [key: string]: string } | null;
    };
    export type ToastData = {
        type: App.Enums.Shared.ToastType;
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
        id: App.Enums.Shared.SocialstreamProvider;
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
declare namespace App.Data.Synth {
    export type SynthEnrichAddressData = {
        line1: string | null;
        city: string | null;
        state: string | null;
        postalCode: string | null;
        country: string | null;
    };
    export type SynthEnrichData = {
        merchant: string;
        merchantId: string;
        category: string | null;
        website: string | null;
        icon: string | null;
        address: App.Data.Synth.SynthEnrichAddressData | null;
    };
}
declare namespace App.Data.Workspace {
    export type WorkspaceData = {
        id: string;
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
        isSubscribed: boolean | null;
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
declare namespace App.Enums.Banking {
    export type ConnectionStatus = "connected" | "disconnected" | "unknown";
    export type ProviderType = "teller" | "mx";
    export type TellerAccountStatus = "open" | "closed";
    export type TellerAccountSubtype =
        | "checking"
        | "savings"
        | "money_market"
        | "certificate_of_deposit"
        | "treasury"
        | "sweep"
        | "credit_card";
    export type TellerAccountType = "depository" | "credit";
    export type TellerEnvironment = "sandbox" | "development" | "production";
    export type TellerTransactionStatus = "posted" | "pending";
}
declare namespace App.Enums.Finance {
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
    export type CategoryClassification = "income" | "expense" | "transfer" | "other";
    export type RateType = "fixed" | "variable" | "adjustable";
    export type TransactionRecurringInterval = "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
    export type TransactionStatus = "posted" | "pending" | "excluded" | "completed";
    export type TransactionType = "income" | "expense" | "transfer";
}
declare namespace App.Enums.Shared {
    export type Language = "en" | "es";
    export type MediaService = "product_media";
    export type SocialstreamProvider = "google";
    export type ToastType = "error" | "warning" | "success" | "info";
}
