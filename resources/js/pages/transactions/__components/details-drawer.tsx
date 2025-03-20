import NumberFlow from "@number-flow/react";

import * as Divider from "#/components/ui/divider.tsx";
import * as Drawer from "#/components/ui/drawer.tsx";
import { useTransactionsParams } from "#/hooks/use-transactions-params.ts";
import { useTranslation } from "#/hooks/use-translation.ts";
import { decimalFlowFormatter } from "#/utils/currency-formatter.ts";

type TransactionDetailsDrawerProps = {
    transaction?: Resources.Transaction | null;
};

export function TransactionDetailsDrawer({ transaction }: TransactionDetailsDrawerProps) {
    const { setParams } = useTransactionsParams();
    const { language } = useTranslation();
    const { value, format } = decimalFlowFormatter({
        amount: transaction?.amount ?? 0,
        currency: transaction?.currency,
        language,
    });

    return (
        <Drawer.Root onOpenChange={() => setParams({ transactionId: null })} open={!!transaction}>
            <Drawer.Content>
                <Drawer.Header>
                    <Drawer.Title>Transaction Details</Drawer.Title>
                </Drawer.Header>

                <Drawer.Body>
                    <Divider.Root $type="solid-text">amount & account</Divider.Root>

                    <div className="p-5">
                        <div className="text-title-h4">
                            <NumberFlow animated={false} format={format} value={value} />
                        </div>
                        <div className="mt-1 text-paragraph-sm text-(--text-sub-600)">Mercury Checking •• 1038</div>
                    </div>
                </Drawer.Body>
            </Drawer.Content>
        </Drawer.Root>
    );
}
