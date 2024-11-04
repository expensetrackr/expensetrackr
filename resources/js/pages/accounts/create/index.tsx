import { useForm } from "@inertiajs/react";
import DraftIcon from "virtual:icons/ri/draft-line";

import { Button } from "#/components/button.tsx";
import { Description, ErrorMessage, Field, Label } from "#/components/fieldset.tsx";
import { Input } from "#/components/input.tsx";
import { Select } from "#/components/select.tsx";
import { Text } from "#/components/text.tsx";
import { Textarea } from "#/components/textarea.tsx";
import { CreateLayout } from "#/layouts/create-layout.tsx";

type CreateAccountPageProps = {
    accountTypes: Record<string, string>;
};

export default function CreateAccountPage({ accountTypes }: CreateAccountPageProps) {
    const { errors, data, ...form } = useForm({
        name: "",
        description: "",
        type: "depository",
    });

    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        form.post(route("accounts.store", [1]));
    }

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

                    <form onSubmit={onSubmit} className="flex w-full flex-col gap-5 sm:mx-auto sm:max-w-[352px]">
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
                                name="description"
                                onChange={(e) => form.setData("description", e.target.value)}
                                value={data.description}
                                placeholder="e.g. Savings account for personal expenses"
                            />
                            {errors.description ? (
                                <ErrorMessage>{errors.description}</ErrorMessage>
                            ) : (
                                <Description>This will only be visible to you.</Description>
                            )}
                        </Field>

                        <Field>
                            <Label>Type</Label>
                            <Select
                                invalid={!!errors.type}
                                name="type"
                                onChange={(e) => form.setData("type", e.target.value)}
                                value={data.type}
                            >
                                {Object.entries(accountTypes).map(([key, value]) => (
                                    <option key={key} value={key}>
                                        {value}
                                    </option>
                                ))}
                            </Select>
                            {errors.type && <ErrorMessage>{errors.type}</ErrorMessage>}
                        </Field>

                        <div className="flex justify-end">
                            <Button $size="sm" className="px-4" type="submit">
                                Continue
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </CreateLayout>
    );
}
