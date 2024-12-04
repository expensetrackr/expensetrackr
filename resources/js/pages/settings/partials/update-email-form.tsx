import { useForm, usePage } from "@inertiajs/react";
import { useDebounce } from "@uidotdev/usehooks";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";

import { Field, Hint, Label } from "#/components/form/fieldset.tsx";
import { Input } from "#/components/form/input.tsx";
import { FormSection } from "#/components/form-section.tsx";
import { type InertiaSharedProps } from "#/types/index.ts";

export function UpdateEmailForm() {
    const page = usePage<InertiaSharedProps>();
    const user = page.props.auth.user;
    const { data, setData, errors, ...form } = useForm({
        _method: "PUT",
        name: user?.name,
        email: user?.email,
    });
    const debouncedEmail = useDebounce(data.email, 1000);

    const sendRequest = useCallback(() => {
        form.post(route("user-profile-information.update"), {
            errorBag: "updateProfileInformation",
            preserveScroll: true,
            onSuccess: () => toast("Email updated."),
        });
    }, [form]);

    useEffect(() => {
        if (user?.email === debouncedEmail) return;

        sendRequest();
    }, [debouncedEmail, form, sendRequest, user?.email]);

    function onSubmit(e: React.FormEvent) {
        e.preventDefault();

        sendRequest();
    }

    return (
        <FormSection
            description="Your email address is used to log in and receive important notifications."
            title="Email address"
        >
            <form className="flex w-full flex-col gap-4" onSubmit={onSubmit}>
                <Field>
                    <Label className="sr-only">Email address</Label>
                    <Input
                        autoComplete="email"
                        disabled={form.processing}
                        invalid={!!errors.email}
                        name="name"
                        onChange={(e) => setData("email", e.target.value)}
                        placeholder="e.g. john@example.com"
                        type="email"
                        value={data.email}
                    />
                    {errors.email && <Hint invalid>{errors.email}</Hint>}
                </Field>
            </form>
        </FormSection>
    );
}
