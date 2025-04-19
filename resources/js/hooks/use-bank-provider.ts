import { useTellerConnect } from "./use-teller-connect.ts";

type ConnectBankProviderProps = {
    id: string;
    name: string;
    provider: App.Enums.Banking.ProviderType;
};

export function useBankProvider({ provider }: ConnectBankProviderProps) {
    switch (provider) {
        case "teller":
            return useTellerConnect();
        default:
            throw new Error(`Unsupported provider: ${provider}`);
    }
}
