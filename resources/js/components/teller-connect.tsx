import { useScript } from "@uidotdev/usehooks";
import * as React from "react";
import { toast } from "sonner";

import { useConnectParams } from "#/hooks/use-connect-params.ts";
import { ConnectAccountStepper } from "#/utils/steppers/create-account.steps.ts";
import { BankConnectionButton } from "./bank-connection-button.tsx";

type TellerConnectProps = {
    id: string;
    onSelect: (institutionId: string) => void;
};

export function TellerConnect({ id, onSelect }: TellerConnectProps) {
    const [institution, setInstitution] = React.useState<string | undefined>();
    const { setParams } = useConnectParams();
    const stepper = ConnectAccountStepper.useStepper();
    useScript("https://cdn.teller.io/connect/connect.js");

    React.useEffect(() => {
        if (institution) {
            const teller = window.TellerConnect.setup({
                applicationId: ENV.TELLER_APP_ID,
                environment: ENV.TELLER_ENVIRONMENT,
                institution,
                async onSuccess(enrollment) {
                    await setParams({
                        step: "bank-accounts-selection",
                        provider: "teller",
                        token: enrollment.accessToken,
                        enrollment_id: enrollment.enrollment.id,
                    });

                    stepper.goTo("bank-accounts-selection");
                },
                async onExit() {
                    await setParams({
                        step: "institution-selection",
                    });

                    stepper.goTo("institution-selection");
                },
                async onFailure(failure) {
                    await setParams({
                        step: "institution-selection",
                    });

                    stepper.goTo("institution-selection");

                    toast.error("Failed to connect to bank", {
                        description: failure.message,
                    });
                },
            });

            teller.open();
        }
    }, [institution]);

    return (
        <BankConnectionButton
            id={id}
            onClick={() => {
                onSelect(id);
                setInstitution(id);
            }}
        />
    );
}
