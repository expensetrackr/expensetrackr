import { getInputProps, getTextareaProps, type useForm, useInputControl } from "@conform-to/react";

import { Field } from "#/components/form/fieldset.tsx";
import { Listbox, ListboxLabel, ListboxOption } from "#/components/form/listbox.tsx";
import { TextField } from "#/components/form/text-field.tsx";
import { Textarea } from "#/components/textarea.tsx";
import * as Hint from "#/components/ui/hint.tsx";
import * as Label from "#/components/ui/label.tsx";
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
            <TextField
                $error={!!fields.name.errors}
                hint={fields.name.errors}
                label="Name"
                {...getInputProps(fields.name, { type: "text" })}
                placeholder="e.g. Personal savings"
            />

            <Textarea
                {...getTextareaProps(fields.description)}
                $error={!!fields.description.errors}
                charCounterCurrent={fields.description.value?.length || 0}
                charCounterMax={200}
                hint={fields.description.errors ?? "This will only be visible to you."}
                label={
                    <>
                        Description <Label.Sub>(Optional)</Label.Sub>
                    </>
                }
                placeholder="e.g. Savings account for personal expenses"
            ></Textarea>

            {type && subtypeOptions[type as keyof typeof subtypeOptions] && (
                <Field>
                    <Label.Root>Subtype</Label.Root>
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
                    {fields.subtype.errors && (
                        <Hint.Root $error>
                            <Hint.Icon $error />
                            {fields.subtype.errors}
                        </Hint.Root>
                    )}
                </Field>
            )}
        </>
    );
}
