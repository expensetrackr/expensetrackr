import { useTellerConnect } from "./use-teller-connect.ts";

/**
 * Track institution usage by calling the API endpoint
 * Fails silently to avoid disrupting user experience
 */
const trackInstitutionUsage = async (institutionId: string): Promise<void> => {
    try {
        await fetch(`/api/finance/institutions/${institutionId}/track-usage`, {
            method: "POST",
        });
    } catch (error) {
        console.warn("Failed to track institution usage:", error);
    }
};

type ConnectBankProviderProps = {
    id: string;
    name: string;
    provider: App.Enums.Banking.ProviderType;
};

/**
 * Hook for connecting to bank providers with automatic usage tracking
 *
 * Features:
 * - Tracks institution selection for popularity-based sorting
 * - Non-blocking tracking that won't disrupt user experience
 * - Extends provider-specific hooks with tracking capabilities
 *
 * @param props - Configuration including institution id, name, and provider type
 * @returns Extended provider hook with tracking functionality
 */
export function useBankProvider({ provider, id }: ConnectBankProviderProps) {
    switch (provider) {
        case "teller":
            const tellerConnect = useTellerConnect();
            return {
                ...tellerConnect,
                trackUsage: () => trackInstitutionUsage(id),
                setInstitution: async (institutionId: string) => {
                    await trackInstitutionUsage(institutionId);

                    return tellerConnect.setInstitution(institutionId);
                },
            };
        default:
            throw new Error(`Unsupported provider: ${provider}`);
    }
}
