import { Head, useForm } from "@inertiajs/react";
import * as React from "react";
import { toast } from "sonner";
import UserCircleSolidIcon from "virtual:icons/hugeicons/user-circle-solid";

import { Button } from "#/components/button.tsx";
import { FormSection } from "#/components/form-section.tsx";
import { UpdateProfilePictureForm } from "#/components/forms/update-profile-picture-form.tsx";
import { Header } from "#/components/header.tsx";
import { SubmitButton } from "#/components/submit-button.tsx";
import * as Divider from "#/components/ui/divider.tsx";
import { TextField } from "#/components/ui/form/text-field.tsx";
import { useUser } from "#/hooks/use-user.ts";
import { SettingsLayout } from "#/layouts/settings-layout.tsx";
import { routes } from "#/routes.ts";
import { type PageProps } from "#/types/globals.js";

export type UpdateProfileInformationForm = {
    photo: File | null;
    name: string;
    email: string;
};

export default function SettingsShow() {
    const user = useUser();
    const form = useForm<UpdateProfileInformationForm>({
        photo: null as File | null,
        name: user?.name,
        email: user?.email,
    });

    function onSubmit(e: React.FormEvent) {
        e.preventDefault();

        form.put(routes.userProfileInformation.update.url(), {
            errorBag: "updateProfileInformation",
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Profile updated.", {
                    id: "profile-updated",
                    className: "filled",
                });
                toast.dismiss("unsaved-changes");
            },
        });
    }

    /**
     * With this ref, we can access the form state from the previous render.
     */
    const formRef = React.useRef(form);
    React.useEffect(() => {
        if (formRef.current && form.isDirty) {
            toast.info("Unsaved changes", {
                id: "unsaved-changes",
                duration: Infinity,
                position: "bottom-center",
                className: "stroke",
                cancel: (
                    <Button
                        $size="xs"
                        $style="stroke"
                        $type="neutral"
                        className="h-7 text-paragraph-xs lg:text-paragraph-sm"
                        onClick={() => {
                            toast.dismiss("unsaved-changes");
                            formRef.current.reset();
                        }}
                    >
                        Cancel
                    </Button>
                ),
                action: (
                    <SubmitButton
                        $size="xs"
                        className="h-7 text-paragraph-xs lg:text-paragraph-sm"
                        form="update-profile-settings-form"
                        isSubmitting={form.processing}
                        type="submit"
                    >
                        Save
                    </SubmitButton>
                ),
                style: {
                    "--width": "512px",
                },
            });
        }
    }, [form.isDirty, form.processing]);

    return (
        <>
            <Header
                description="Customize and edit essential profile details."
                icon={
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-(--bg-white-0) shadow-xs ring-1 ring-(--stroke-soft-200) ring-inset">
                        <UserCircleSolidIcon className="size-6 text-(--text-sub-600)" />
                    </div>
                }
                title="Profile settings"
            />

            <div className="px-4 lg:px-8">
                <Divider.Root />
            </div>

            <form
                {...routes.userProfileInformation.update.form()}
                className="flex w-full flex-col gap-5 px-4 py-6 lg:px-8"
                encType="multipart/form-data"
                id="update-profile-settings-form"
                onSubmit={onSubmit}
            >
                <UpdateProfilePictureForm form={form} />

                <Divider.Root $type="line-spacing" />

                <FormSection description="Use your real name to build trust with others." title="Full name">
                    <TextField
                        autoComplete="off"
                        disabled={form.processing}
                        error={form.errors.name}
                        label="Full name"
                        labelClassName="sr-only"
                        onChange={(e) => form.setData("name", e.target.value)}
                        placeholder="e.g. John Doe"
                        value={form.data.name}
                    />
                </FormSection>

                <Divider.Root $type="line-spacing" />

                <FormSection
                    description="Your email address is used to log in and receive important notifications."
                    title="Email address"
                >
                    <TextField
                        autoComplete="off"
                        error={form.errors.email}
                        id="email"
                        inputMode="email"
                        label="Email"
                        labelClassName="sr-only"
                        name="email"
                        onChange={(e) => form.setData("email", e.target.value)}
                        placeholder="e.g. john@example.com"
                        value={form.data.email}
                    />
                </FormSection>
            </form>
        </>
    );
}

SettingsShow.layout = (page: React.ReactNode & { props: PageProps }) => (
    <SettingsLayout {...page.props}>
        <Head title="Profile settings" />

        {page}
    </SettingsLayout>
);
