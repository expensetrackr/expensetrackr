import { Head, router } from "@inertiajs/react";
import DraftFillIcon from "virtual:icons/ri/draft-fill";

import { AccountForm } from "#/components/form/account-form.tsx";
import { Description, ErrorMessage, Field, Label } from "#/components/form/fieldset.tsx";
import { Input } from "#/components/form/input.tsx";
import { Select } from "#/components/form/select.tsx";
import { Textarea } from "#/components/form/textarea.tsx";
import { Text } from "#/components/text.tsx";
import { useAccountForm } from "#/hooks/use-account-form.ts";
import { CreateLayout } from "#/layouts/create-layout.tsx";
import { type AccountTypes } from "#/models/account.ts";
import { type InertiaSharedProps } from "#/types/index.ts";

type CreateAccountPageProps = {
    accountTypes: Record<string, string>;
    wizard: {
        currentStep: string;
        totalSteps: number;
        completedSteps: Record<string, boolean>;
        data: Record<string, string>;
    };
};

export default function CreateAccountPage({ accountTypes, wizard }: InertiaSharedProps<CreateAccountPageProps>) {
    const form = useAccountForm(wizard.data);

    function onSubmit(e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();

        form.post(route("accounts.store", ["details"]), {
            onSuccess: () => router.visit(route("accounts.create", { step: "balance-and-currency" })),
        });
    }

    return (
        <div className="relative py-12">
            <div className="flex flex-col gap-6 sm:mx-auto sm:max-w-[540px]">
                <div className="flex flex-col items-center gap-2">
                    <div className="rounded-full bg-gradient-to-b from-neutral-500/10 to-transparent p-4 backdrop-blur-md">
                        <div className="rounded-full border border-(--stroke-soft-200) bg-(--bg-white-0) p-4">
                            <DraftFillIcon className="size-8 text-(--icon-sub-600)" />
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                        <h1 className="text-h5">Account details</h1>
                        <Text className="text-center text-paragraph-md">
                            Provide the name, description, and type for your new account to manage your finances
                            effectively.
                        </Text>
                    </div>
                </div>

                <div className="mx-auto w-full max-w-[400px] rounded-20 border border-(--stroke-soft-200) bg-(--bg-white-0) shadow-xs">
                    <div className="p-4">
                        <AccountForm id="details-form" onSubmit={onSubmit}>
                            <Field>
                                <Label>Name</Label>
                                <Input
                                    invalid={!!form.errors.name}
                                    name="name"
                                    onChange={(e) => form.setData("name", e.target.value)}
                                    placeholder="e.g. Personal savings"
                                    value={form.data.name}
                                />
                                {form.errors.name && <ErrorMessage>{form.errors.name}</ErrorMessage>}
                            </Field>

                            <Field>
                                <Label>Description</Label>
                                <Textarea
                                    invalid={!!form.errors.description}
                                    name="description"
                                    onChange={(e) => form.setData("description", e.target.value)}
                                    placeholder="e.g. Savings account for personal expenses"
                                    rows={3}
                                    value={form.data.description ?? ""}
                                />
                                {form.errors.description ? (
                                    <ErrorMessage>{form.errors.description}</ErrorMessage>
                                ) : (
                                    <Description>This will only be visible to you.</Description>
                                )}
                            </Field>

                            <div className="-mx-4 mt-1 border-t border-t-(--stroke-soft-200) pt-3">
                                <div className="px-5">
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
                                </div>
                            </div>
                        </AccountForm>
                    </div>

                    <AccountForm.Navigation isSubmitting={form.processing} onSubmit={onSubmit} />
                </div>
            </div>
        </div>
    );
}

CreateAccountPage.layout = (page: React.ReactNode & { props: InertiaSharedProps }) => (
    <CreateLayout {...page.props}>
        <Head title="Create account" />

        {page}
    </CreateLayout>
);
