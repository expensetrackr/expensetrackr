import ArrowLeftIcon from "virtual:icons/ri/arrow-left-line";
import ArrowRightIcon from "virtual:icons/ri/arrow-right-line";

import { Button } from "../button.tsx";

interface AccountFormProps {
    step: "details" | "balance-and-currency" | "review";
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    children: React.ReactNode;
}

export function AccountForm({ onSubmit, children }: AccountFormProps) {
    return (
        <form onSubmit={onSubmit} className="flex w-full flex-col gap-5 sm:mx-auto sm:max-w-[352px]">
            {children}
        </form>
    );
}

AccountForm.Navigation = function AccountFormNavigation({
    prevStep,
    isSubmitting,
}: {
    prevStep?: string;
    isSubmitting: boolean;
}) {
    return (
        <div className="flex justify-between">
            {prevStep && (
                <Button
                    $color="neutral"
                    $size="sm"
                    $variant="stroke"
                    href={route("accounts.create", { step: prevStep })}
                    className="px-4"
                >
                    <ArrowLeftIcon />
                    <span>Back</span>
                </Button>
            )}
            <Button $size="sm" className="px-4" type="submit" disabled={isSubmitting}>
                <span>Continue</span>
                <ArrowRightIcon />
            </Button>
        </div>
    );
};
