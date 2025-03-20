import { useForm } from "@inertiajs/react";
import * as React from "react";
import { toast } from "sonner";

import { TextField } from "#/components/form/text-field.tsx";
import { FormSection } from "#/components/form-section.tsx";
import { useUser } from "#/hooks/use-user.ts";

export function UpdateNameForm() {
    const user = useUser();
    const { data, setData, errors, ...form } = useForm({
        _method: "PUT",
        name: user?.name,
        email: user?.email,
    });

    function onSubmit(e: React.FormEvent) {
        e.preventDefault();

        form.post(route("user-profile-information.update"), {
            errorBag: "updateProfileInformation",
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Profile updated.");
            },
        });
    }

    return (
        <FormSection description="Use your real name to build trust with others." title="Full name">
            <form className="flex w-full flex-col gap-4" onSubmit={onSubmit}>
                <TextField
                    $error={!!errors.name}
                    autoComplete="name"
                    autoFocus
                    data-auto-submit
                    disabled={form.processing}
                    hint={errors.name}
                    label="Full name"
                    name="name"
                    onChange={(e) => setData("name", e.target.value)}
                    placeholder="e.g. John Doe"
                    value={data.name}
                />
            </form>
        </FormSection>
    );
}
