import { Head, router } from "@inertiajs/react";
import DraftIcon from "virtual:icons/ri/draft-line";

import { Description, ErrorMessage, Field, Label } from "#/components/fieldset.tsx";
import { AccountForm } from "#/components/forms/account-form.tsx";
import { Input } from "#/components/input.tsx";
import { Select } from "#/components/select.tsx";
import { Text } from "#/components/text.tsx";
import { Textarea } from "#/components/textarea.tsx";
import { useAccountForm } from "#/hooks/use-account-form.ts";
import { CreateLayout } from "#/layouts/create-layout.tsx";
import { type AccountTypes } from "#/models/account.ts";

type CreateAccountPageProps = {
    accountTypes: Record<string, string>;
    completedSteps: Record<string, Record<string, string>>;
};

export default function CreateAccountPage({ accountTypes, completedSteps }: CreateAccountPageProps) {
    const form = useAccountForm(completedSteps["details"]);

    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        form.post(route("accounts.store", ["details"]), {
            onSuccess: () => router.visit(route("accounts.create", { step: "balance-and-currency" })),
        });
    }

    return (
        <CreateLayout>
            <Head title="Create account" />

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

                    <AccountForm step="details" onSubmit={onSubmit}>
                        <Field>
                            <Label>Name</Label>
                            <Input
                                invalid={!!form.errors.name}
                                name="name"
                                onChange={(e) => form.setData("name", e.target.value)}
                                value={form.data.name}
                                placeholder="e.g. Personal savings"
                            />
                            {form.errors.name && <ErrorMessage>{form.errors.name}</ErrorMessage>}
                        </Field>

                        <Field>
                            <Label>Description</Label>
                            <Textarea
                                invalid={!!form.errors.description}
                                name="description"
                                onChange={(e) => form.setData("description", e.target.value)}
                                value={form.data.description}
                                placeholder="e.g. Savings account for personal expenses"
                            />
                            {form.errors.description ? (
                                <ErrorMessage>{form.errors.description}</ErrorMessage>
                            ) : (
                                <Description>This will only be visible to you.</Description>
                            )}
                        </Field>

                        <Field>
                            <Label>Type</Label>
                            <Select
                                invalid={!!form.errors.type}
                                name="type"
                                onChange={(e) => form.setData("type", e.target.value as AccountTypes)}
                                value={form.data.type}
                            >
                                {Object.entries(accountTypes).map(([key, value]) => (
                                    <option key={key} value={key}>
                                        {value}
                                    </option>
                                ))}
                            </Select>
                            {form.errors.type && <ErrorMessage>{form.errors.type}</ErrorMessage>}
                        </Field>

                        <AccountForm.Navigation isSubmitting={form.processing} />
                    </AccountForm>
                </div>
            </div>
        </CreateLayout>
    );
}
