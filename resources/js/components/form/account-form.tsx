import { Link } from "@inertiajs/react";
import { cx } from "#/utils/cva.ts";
import * as Button from "../ui/button.tsx";

interface AccountFormProps extends React.FormHTMLAttributes<HTMLFormElement> {}

export function AccountForm({ children, ...props }: AccountFormProps) {
    return (
        <form {...props} className={cx("flex flex-col gap-3", props.className)}>
            {children}
        </form>
    );
}

AccountForm.Navigation = function AccountFormNavigation({
    prevStep,
    isSubmitting,
    onSubmit,
}: {
    prevStep?: string;
    isSubmitting: boolean;
    onSubmit: (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => void;
}) {
    return (
        <div className="flex items-center gap-3 border-t border-t-(--stroke-soft-200) px-5 py-4">
            {prevStep && (
                <Button.Root $size="sm" $style="stroke" $type="neutral" asChild className="w-full">
                    <Link href={route("accounts.create", { step: prevStep })}>Back</Link>
                </Button.Root>
            )}
            <Button.Root $size="sm" className="w-full" disabled={isSubmitting} onClick={onSubmit}>
                Continue
            </Button.Root>
        </div>
    );
};
