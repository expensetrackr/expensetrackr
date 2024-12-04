import { router, useForm, usePage } from "@inertiajs/react";
import { useRef, useState } from "react";
import DeleteBinIcon from "virtual:icons/ri/delete-bin-line";
import ImageEditIcon from "virtual:icons/ri/image-edit-line";
import PencilIcon from "virtual:icons/ri/pencil-line";

import { Avatar } from "#/components/avatar.tsx";
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from "#/components/dropdown.tsx";
import { Field, Hint, Label } from "#/components/form/fieldset.tsx";
import { Input } from "#/components/form/input.tsx";
import { FormSection } from "#/components/form-section.tsx";
import { type InertiaSharedProps } from "#/types/index.ts";

export function UpdateProfilePictureForm() {
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const photoRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const page = usePage<InertiaSharedProps>();
    const user = page.props.auth.user;
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
                onSubmit={updateProfilePhoto}
                ref={formRef}
            >
                <Field>
                    <Label className="sr-only">Profile photo</Label>
                    <Input
                        className="!sr-only"
                        disabled={form.processing}
                        invalid={!!form.errors.photo}
                        name="photo"
                        onChange={handlePhotoChange}
                        ref={photoRef}
                        type="file"
                    />

                    <div className="flex flex-col gap-5">
                        <div className="flex items-center gap-5">
                            <div className="relative size-40">
                                <Avatar
                                    alt={user?.name}
                                    className="size-40"
                                    imageProps={{
                                        className: "size-40 object-top object-cover",
                                    }}
                                    src={photoPreview || user?.profile_photo_url}
                                    user={user}
                                />

                                <Dropdown>
                                    <DropdownButton
                                        $color="neutral"
                                        $size="xs"
                                        $variant="stroke"
                                        className="absolute bottom-2 left-2 px-2 py-1"
                                    >
                                        <PencilIcon />
                                        <span>Edit</span>
                                    </DropdownButton>

                                    <DropdownMenu anchor="bottom end" className="min-w-32">
                                        <DropdownItem
                                            onClick={() => photoRef.current?.click()}
                                            onFocus={() => photoRef.current?.focus()}
                                        >
                                            <ImageEditIcon />
                                            <span>Change photo</span>
                                        </DropdownItem>

                                        {user?.profile_photo_path ? (
                                            <DropdownItem onClick={deletePhoto}>
                                                <DeleteBinIcon />
                                                <span>Remove photo</span>
                                            </DropdownItem>
                                        ) : null}
                                    </DropdownMenu>
                                </Dropdown>
                            </div>
                        </div>
                    </div>

                    {form.errors.photo && <Hint invalid>{form.errors.photo}</Hint>}
                </Field>
            </form>
        </FormSection>
    );
}
