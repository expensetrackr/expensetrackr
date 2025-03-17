import { router, useForm } from "@inertiajs/react";
import * as React from "react";
import ImageCounterClockwiseIcon from "virtual:icons/hugeicons/image-counter-clockwise";
import ImageDelete02Icon from "virtual:icons/hugeicons/image-delete-02";
import PencilEdit02Icon from "virtual:icons/hugeicons/pencil-edit-02";

import { FormSection } from "#/components/form-section.tsx";
import * as Avatar from "#/components/ui/avatar.tsx";
import * as Button from "#/components/ui/button.tsx";
import * as Dropdown from "#/components/ui/dropdown.tsx";
import * as Hint from "#/components/ui/hint.tsx";
import * as Label from "#/components/ui/label.tsx";
import { useUser } from "#/hooks/use-user.ts";

export function UpdateProfilePictureForm() {
    const [photoPreview, setPhotoPreview] = React.useState<string | null>(null);
    const photoRef = React.useRef<HTMLInputElement>(null);
    const formRef = React.useRef<HTMLFormElement>(null);
    const user = useUser();
    const form = useForm({
        _method: "PUT",
        photo: null as File | null,
    });

    function clearPhotoFileInput() {
        if (photoRef.current?.value) {
            photoRef.current.value = "";
            form.setData("photo", null);
        }
    }

    function updateProfilePhoto(e: React.FormEvent) {
        if (form.processing) return;

        e.preventDefault();

        form.post(route("user-profile-information.update"), {
            errorBag: "updateProfileInformation",
            preserveScroll: true,
            onSuccess: () => clearPhotoFileInput(),
        });
    }

    function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];

        if (!file) return;

        form.setData("photo", file);

        setTimeout(() => formRef.current?.requestSubmit(), 1000);
    }

    function deletePhoto() {
        router.delete(route("current-user-photo.destroy"), {
            preserveScroll: true,
            onSuccess: () => {
                setPhotoPreview(null);
                clearPhotoFileInput();
            },
        });
    }

    return (
        <FormSection
            description="Make your account more personal by adding a profile photo. Max file size is 5MB."
            title="Profile photo"
        >
            <form
                className="flex w-full flex-col items-center gap-4 sm:flex-row"
                encType="multipart/form-data"
                onSubmit={updateProfilePhoto}
                ref={formRef}
            >
                <div className="flex flex-col gap-1">
                    <Label.Root className="sr-only">Profile photo</Label.Root>
                    <input
                        className="!sr-only"
                        disabled={form.processing}
                        name="photo"
                        onChange={handlePhotoChange}
                        ref={photoRef}
                        type="file"
                    />

                    <div className="flex flex-col gap-5">
                        <div className="flex items-center gap-5">
                            <div className="relative size-24">
                                <Avatar.Root>
                                    <Avatar.Image
                                        alt={user?.name}
                                        src={(photoPreview || user?.profilePhotoUrl) ?? undefined}
                                    />
                                </Avatar.Root>

                                <Dropdown.Root>
                                    <Dropdown.Trigger asChild className="absolute right-px bottom-px">
                                        <Button.Root $size="xs" $style="stroke" $type="neutral">
                                            <Button.Icon as={PencilEdit02Icon} className="size-4" />
                                            <span>Edit</span>
                                        </Button.Root>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content className="w-full min-w-48">
                                        <Dropdown.Item
                                            onClick={() => photoRef.current?.click()}
                                            //onFocus={() => photoRef.current?.focus()}
                                        >
                                            <ImageCounterClockwiseIcon />
                                            <span>Change photo</span>
                                        </Dropdown.Item>

                                        {user?.profilePhotoPath ? (
                                            <Dropdown.Item onClick={deletePhoto}>
                                                <ImageDelete02Icon />
                                                <span>Remove photo</span>
                                            </Dropdown.Item>
                                        ) : null}
                                    </Dropdown.Content>
                                </Dropdown.Root>
                            </div>
                        </div>
                    </div>

                    {form.errors.photo && (
                        <Hint.Root $error>
                            <Hint.Icon />
                            {form.errors.photo}
                        </Hint.Root>
                    )}
                </div>
            </form>
        </FormSection>
    );
}
