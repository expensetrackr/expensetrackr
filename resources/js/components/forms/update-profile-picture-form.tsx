import { type InertiaFormProps } from "@inertiajs/react";
import * as React from "react";
import ImageCounterClockwiseIcon from "virtual:icons/hugeicons/image-counter-clockwise";

import { FormSection } from "#/components/form-section.tsx";
import * as Avatar from "#/components/ui/avatar.tsx";
import * as Button from "#/components/ui/button.tsx";
import * as Hint from "#/components/ui/hint.tsx";
import * as Label from "#/components/ui/label.tsx";
import { useUser } from "#/hooks/use-user.ts";

type UpdateProfilePictureFormProps = {
    form: InertiaFormProps<Forms.UpdateProfileInformationForm>;
};

export function UpdateProfilePictureForm({ form }: UpdateProfilePictureFormProps) {
    const photoRef = React.useRef<HTMLInputElement>(null);
    const user = useUser();

    function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];

        if (!file) return;

        form.setData("photo", file);
    }

    return (
        <FormSection
            description="Make your account more personal by adding a profile photo. Max file size is 5MB."
            title="Profile photo"
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
                        <Avatar.Root $size="56">
                            {user?.profilePhotoUrl ? <Avatar.Image alt={user.name} src={user.profilePhotoUrl} /> : null}
                        </Avatar.Root>

                        <Button.Root
                            $size="sm"
                            $style="stroke"
                            $type="neutral"
                            onClick={() => photoRef.current?.click()}
                            onFocus={() => photoRef.current?.focus()}
                        >
                            <Button.Icon as={ImageCounterClockwiseIcon} />
                            <span>Change photo</span>
                        </Button.Root>
                    </div>
                </div>

                {form.errors.photo && (
                    <Hint.Root $error>
                        <Hint.Icon />
                        {form.errors.photo}
                    </Hint.Root>
                )}
            </div>
        </FormSection>
    );
}
