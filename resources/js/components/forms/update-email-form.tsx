import { useForm } from "@inertiajs/react";
import * as React from "react";
import { toast } from "sonner";

import { FormSection } from "#/components/form-section.tsx";
import { TextField } from "#/components/ui/form/text-field.tsx";
import { useUser } from "#/hooks/use-user.ts";
import { routes } from "#/routes.ts";

export function UpdateEmailForm() {
    const user = useUser();
    const { data, setData, errors, ...form } = useForm({
        _method: "PUT",
        name: user?.name,
        email: user?.email,
    });

    function onSubmit(e: React.FormEvent) {
        e.preventDefault();

        form.post(routes.userProfileInformation.update.url(), {
            errorBag: "updateProfileInformation",
            preserveScroll: true,
            onSuccess: () => toast.success("Email updated."),
        });
    }

    return (
        <FormSection
            description="Your email address is used to log in and receive important notifications."
            title="Email address"
        >
            <form
                {...routes.userProfileInformation.update.form()}
                className="flex w-full flex-col gap-4"
                onSubmit={onSubmit}
            >
                <TextField
                    $error={!!errors.email}
                    autoComplete="username"
                    data-auto-submit
                    disabled={form.processing}
                    hint={errors.email}
                    label="Email"
                    name="email"
                    onChange={(e) => setData("email", e.target.value)}
                    placeholder="e.g. john@example.com"
                    type="email"
                    value={data.email}
                />
            </form>
        </FormSection>
    );
}
