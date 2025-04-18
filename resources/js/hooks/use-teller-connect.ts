import { router } from "@inertiajs/react";
import * as React from "react";
import { toast } from "sonner";
import { useScript } from "usehooks-ts";
import { routes } from "#/routes.ts";
import { useCommandMenuStore } from "#/store/command-menu.ts";
import { useCommandMenuParams } from "./use-command-menu-params.ts";
import { useConnectParams } from "./use-connect-params.ts";

type TellerConnectProps = {
    onSelect?(institutionId: string): void;
};

export function useTellerConnect(_props?: TellerConnectProps) {
    const [institution, setInstitution] = React.useState<string | undefined>();
    const { setParams } = useConnectParams();
    const { setParams: setAppCommandParams } = useCommandMenuParams();
    const { toggleOpen } = useCommandMenuStore();

    useScript("https://cdn.teller.io/connect/connect.js", {
        id: "teller-connect",
    });

    React.useEffect(() => {
        if (institution) {
            const teller = window.TellerConnect.setup({
                applicationId: ENV.TELLER_APP_ID,
                environment: ENV.TELLER_ENVIRONMENT,
                institution,
                async onSuccess(enrollment) {
                    await setParams({
                        provider: "teller",
                        token: enrollment.accessToken,
                        enrollmentId: enrollment.enrollment.id,
                    });

                    router.visit(
                        routes.bankConnections.connect({
                            enrollmentId: enrollment.enrollment.id,
                            provider: "teller",
                            token: enrollment.accessToken,
                        }).url,
                    );
                },
                async onExit() {
                    toggleOpen();
                    await setAppCommandParams({ commandPage: "institution" });
                },
                async onFailure(failure) {
                    toggleOpen();
                    await setAppCommandParams({ commandPage: "institution" });

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
}
