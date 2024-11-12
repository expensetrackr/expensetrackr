export interface Account {
    id: number;
    name: string;
    description: string | null;
    type: AccountTypes;
    initial_balance: number;
    currency_code: string;
}

export interface AccountFormData {
    name: string;
    description: string;
    type: AccountTypes;
    initial_balance: number;
    currency_code: string;
}

export const AccountType = {
    DEPOSITORY: "depository",
    CREDIT: "credit",
    INVESTMENT: "investment",
    LOAN: "loan",
    OTHER: "other",
} as const;

export type AccountTypes = (typeof AccountType)[keyof typeof AccountType];
