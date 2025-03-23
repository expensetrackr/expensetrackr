declare namespace Resources {
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
        connection?: BankConnection;
        transactions?: Array<Transaction>;
    };
    export type BankConnection = {
        id: string;
        institutionName: string;
        institutionLogoUrl: string;
        providerType: string;
        status: string;
    };
    // App\Http\Resources\CategoryResource
    export type Category = {
        id: string;
        name: string;
        slug: string;
        color: string;
    };
    // App\Http\Resources\LanguageResource
    export type Language = any;
    // App\Http\Resources\MerchantResource
    export type Merchant = {
        id: string;
        name: string;
        category?: string;
        website?: string;
        icon?: string;
        address?: {
            line1?: string;
            city?: string;
            state?: string;
            postalCode?: string;
            country?: string;
        };
    };
    // App\Http\Resources\TransactionResource
    export type Transaction = {
        id: string;
        name: string;
        note?: string;
        type?: string;
        baseAmount?: string;
        baseCurrency?: string;
        currencyRate?: string;
        amount: string;
        currency: string;
        isRecurring?: boolean;
        isManual?: boolean;
        datedAt: string;
        category?: {
            id: string;
            name: string;
            slug: string;
            color: string;
        };
        account?: Account;
        merchant?: Merchant;
    };
}
