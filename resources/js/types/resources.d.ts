declare namespace Resources {
    export type BankConnection = {
        id: string;
        institutionName: string;
        institutionLogoUrl: string;
        providerType: string;
        status: string;
    };
    // App\Http\Resources\LanguageResource
    export type Language = any;
    // App\Http\Resources\AccountResource
    export type Account = {
        id: string;
        name: string;
        description?: string;
        currencyCode: string;
        initialBalance: string;
        currentBalance: string;
        isDefault: boolean;
        externalId: string;
        connection: BankConnection;
    };
    // App\Http\Resources\TransactionResource
    export type Transaction = {
        id: string;
        name: string;
        note?: string;
        type: string;
        baseAmount?: string;
        baseCurrency?: string;
        currencyRate?: string;
        amount: string;
        currency: string;
        isRecurring: boolean;
        isManual: boolean;
        datedAt: string;
        category?: {
            id: string;
            name: string;
            slug: string;
            color: string;
        };
    };
}
