import { getInputProps, getTextareaProps, type useForm, useInputControl } from "@conform-to/react";

import { Field, Hint, Label, LabelAsterisk, LabelSub } from "#/components/form/fieldset.tsx";
import { Input } from "#/components/form/old-input.tsx";
import { Listbox, ListboxLabel, ListboxOption } from "#/components/form/listbox.tsx";
import { Textarea } from "#/components/form/textarea.tsx";
import { accountTypeEnum, depositorySubtypeEnum, investmentSubtypeEnum } from "#/schemas/account.ts";
import { useCreateAccountWizardStore } from "#/store/create-account-wizard.ts";
import { type DetailsStepValues } from "./stepper.ts";

const subtypeOptions = {
    [accountTypeEnum.Enum.depository]: depositorySubtypeEnum.options,
    [accountTypeEnum.Enum.investment]: investmentSubtypeEnum.options,
};

type DetailsStepProps = {
    fields: ReturnType<typeof useForm<DetailsStepValues>>[1];
};

export function DetailsStep({ fields }: DetailsStepProps) {
    const subtypeControl = useInputControl(fields.subtype);
    const { type } = useCreateAccountWizardStore();

    return (
        <>
            <Field>
                <Label>
                    Name <LabelAsterisk />
                </Label>
                <Input
                    {...getInputProps(fields.name, { type: "text" })}
                    invalid={!!fields.name.errors}
                    name="name"
                    placeholder="e.g. Personal savings"
                />
                {fields.name.errors && <Hint invalid>{fields.name.errors}</Hint>}
            </Field>

            <Field>
                <Label>
                    Description <LabelSub>(Optional)</LabelSub>
                </Label>
                <Textarea
                    {...getTextareaProps(fields.description)}
                    invalid={!!fields.description.errors}
                    placeholder="e.g. Savings account for personal expenses"
                    rows={3}
                />
                <Hint invalid={!!fields.description.errors}>
                    {fields.description.errors ?? "This will only be visible to you."}
                </Hint>
            </Field>

            {type && subtypeOptions[type as keyof typeof subtypeOptions] && (
                <Field>
                    <Label>Subtype</Label>
                    <Listbox
                        defaultValue={fields.subtype.initialValue}
                        name={fields.subtype.name}
                        onChange={subtypeControl.change}
                        placeholder="Select a subtype"
                    >
                        {subtypeOptions[type as keyof typeof subtypeOptions].map((subtype) => (
                            <ListboxOption key={subtype} value={subtype}>
                                <ListboxLabel>{subtype}</ListboxLabel>
                            </ListboxOption>
                        ))}
                    </Listbox>
                    {fields.subtype.errors && <Hint invalid>{fields.subtype.errors}</Hint>}
                </Field>
            )}
        </>
    );
}
