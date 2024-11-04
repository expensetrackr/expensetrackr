import { useForm } from "@inertiajs/react";
import DraftIcon from "virtual:icons/ri/draft-line";

import { ErrorMessage, Field, Label } from "#/components/fieldset.tsx";
import { Input } from "#/components/input.tsx";
import { Text } from "#/components/text.tsx";
import { Textarea } from "#/components/textarea.tsx";
import { CreateLayout } from "#/layouts/create-layout.tsx";

export default function CreateAccountPage() {
    const { errors, data, ...form } = useForm({
        name: "",
        description: "",
        currency_code: "",
        initial_balance: "",
        type: "",
        is_default: true,
    });

    return (
        <CreateLayout>
            <div className="relative py-12">
                <div className="flex flex-col gap-6 sm:mx-auto sm:max-w-[540px]">
                    <div className="flex flex-col items-center gap-2">
                        <div className="rounded-full bg-gradient-to-b from-neutral-500/10 to-transparent p-4 backdrop-blur-md">
                            <div className="rounded-full border border-[var(--stroke-soft-200)] bg-[var(--bg-white-0)] p-4">
                                <DraftIcon className="size-8 text-[var(--icon-sub-600)]" />
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-1">
                            <h1 className="text-h5">Account details</h1>
                            <Text className="text-paragraph-md text-center">
                                Provide the name, description, and type for your new account to manage your finances
                                effectively.
                            </Text>
                        </div>
                    </div>

                    <form className="flex w-full flex-col gap-5 sm:mx-auto sm:max-w-[352px]">
                        <Field>
                            <Label>Name</Label>
                            <Input
                                invalid={!!errors.name}
                                name="email"
                                type="email"
                                onChange={(e) => form.setData("name", e.target.value)}
                                value={data.name}
                                placeholder="e.g. Personal savings"
                            />
                            {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
                        </Field>

                        <Field>
                            <Label>Description</Label>
                            <Textarea
                                invalid={!!errors.description}
                                onChange={(e) => form.setData("description", e.target.value)}
                                value={data.description}
                                placeholder="e.g. Savings account for personal expenses"
                            />
                            {errors.description && <ErrorMessage>{errors.description}</ErrorMessage>}
                        </Field>
                    </form>
                </div>
            </div>
        </CreateLayout>
    );
}
