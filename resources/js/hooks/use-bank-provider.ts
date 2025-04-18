import { useTellerConnect } from "./use-teller-connect.ts";

type ConnectBankProviderProps = {
    id: string;
    name: string;
    provider: App.Enums.Banking.ProviderType;
};

export function useBankProvider(_props?: ConnectBankProviderProps) {
    return {
        teller: useTellerConnect(),
    };
}
