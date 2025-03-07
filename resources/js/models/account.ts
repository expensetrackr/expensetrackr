export const AccountType = {
    Depository: "depository",
    Investment: "investment",
    Crypto: "crypto",
    CreditCard: "credit_card",
    Loan: "loan",
    OtherAsset: "other_asset",
    OtherLiability: "other_liability",
} as const;

export const DepositorySubtype = {
    None: "none",
    Checking: "checking",
    Savings: "savings",
} as const;

export const InvestmentSubtype = {
    Brokerage: "brokerage",
    Pension: "pension",
    Retirement: "retirement",
    Four01k: "401k",
    TraditionalFour01k: "traditional_401k",
    RothFour01k: "roth_401k",
    Five29Plan: "529_plan",
    HealthSavingsAccount: "hsa",
    MutualFund: "mutual_fund",
    TraditionalIRA: "traditional_ira",
    RothIRA: "roth_ira",
    Angel: "angel",
} as const;

export const AccountSubtype = {
    ...DepositorySubtype,
    ...InvestmentSubtype,
} as const;
