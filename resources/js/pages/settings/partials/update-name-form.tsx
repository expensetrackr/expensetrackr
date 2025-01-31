import { useForm, usePage } from "@inertiajs/react";
import { useDebounce } from "@uidotdev/usehooks";
import * as React from "react";
import { toast } from "sonner";

import { TextField } from "#/components/form/text-field.tsx";
import { FormSection } from "#/components/form-section.tsx";
import { type InertiaSharedProps } from "#/types/index.ts";

export function UpdateNameForm() {
    const page = usePage<InertiaSharedProps>();
    const user = page.props.auth.user;
    const { data, setData, errors, ...form } = useForm({
        _method: "PUT",
        name: user?.name,
        email: user?.email,
    });
    const debouncedName = useDebounce(data.name, 1000);

    const sendRequest = React.useCallback(() => {
        form.post(route("user-profile-information.update"), {
            errorBag: "updateProfileInformation",
            preserveScroll: true,
            onSuccess: () => {
                toast("Profile updated.");
            },
        });
    }, [form]);

    React.useEffect(() => {
        if (user?.name === debouncedName) return;

        sendRequest();
    }, [debouncedName, sendRequest, user?.name]);

    function onSubmit(e: React.FormEvent) {
        e.preventDefault();

        sendRequest();
    }

    return (
        <FormSection description="Use your real name to build trust with others." title="Full name">
            <form className="flex w-full flex-col gap-4" onSubmit={onSubmit}>
                <TextField
                    $error={!!errors.name}
                    autoComplete="name"
                    autoFocus
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
