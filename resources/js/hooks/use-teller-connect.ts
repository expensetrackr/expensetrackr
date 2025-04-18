import * as React from "react";
import { toast } from "sonner";
import { useScript } from "usehooks-ts";

import { useConnectParams } from "#/hooks/use-connect-params.ts";

type TellerConnectProps = {
    onSelect?(institutionId: string): void;
};

export function useTellerConnect(_props?: TellerConnectProps) {
    const [institution, setInstitution] = React.useState<string | undefined>();
    const { setParams } = useConnectParams();
    useScript("https://cdn.teller.io/connect/connect.js", {
        id: "teller-connect",
    });

    React.useEffect(() => {
        if (institution) {
            const teller = window.TellerConnect.setup({
                applicationId: ENV.TELLER_APP_ID,
                environment: ENV.TELLER_ENVIRONMENT,
                institution,
                async onSuccess(_enrollment) {
                    // await setParams({
                    //     step: "bank-accounts-selection",
                    //     provider: "teller",
                    //     token: enrollment.accessToken,
                    //     enrollment_id: enrollment.enrollment.id,
                    // });
                    // stepper.goTo("bank-accounts-selection");
                },
                async onExit() {
                    await setParams({
                        step: "institution-selection",
                    });

                    // stepper.goTo("institution-selection");
                },
                async onFailure(failure) {
                    await setParams({
                        step: "institution-selection",
                    });

                    // stepper.goTo("institution-selection");

                    toast.error("Failed to connect to bank", {
                        description: failure.message,
                    });
                },
            });

            teller.open();
        }
        // eslint-disable-next-line react-compiler/react-compiler
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [institution]);

    return {
        setInstitution,
    };
    // return (
    //     <BankConnectionButton
    //         id={id}
    //         onClick={() => {
    //             onSelect(id);
    //             setInstitution(id);
    //         }}
    //     />
    // );
}
