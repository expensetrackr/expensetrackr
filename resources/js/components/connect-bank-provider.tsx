import { TellerConnect } from "./teller-connect.tsx";

type ConnectBankProviderProps = {
    id: string;
    name: string;
    provider: App.Enums.ProviderType;
};

export function ConnectBankProvider({ id, provider }: ConnectBankProviderProps) {
    const updateUsage = () => {
        // TODO: Implement
    };

    switch (provider) {
        case "teller":
            return <TellerConnect id={id} onSelect={updateUsage} />;
        default:
            return null;
    }
}
