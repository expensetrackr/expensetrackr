import { getInputProps, getTextareaProps, type useForm, useInputControl } from "@conform-to/react";

import { useCreateAccountStates } from "#/hooks/use-create-account-states.ts";
import { accountTypeEnum, depositorySubtypeEnum, investmentSubtypeEnum } from "#/schemas/account.ts";
import { type DetailsStepValues } from "#/utils/steppers/create-account.steps.ts";
import { Select } from "../form/select.tsx";
import { TextField } from "../form/text-field.tsx";
import { Textarea } from "../form/textarea.tsx";
import * as Label from "../ui/label.tsx";

const subtypeOptions = {
    [accountTypeEnum.enum.depository]: depositorySubtypeEnum.options,
    [accountTypeEnum.enum.investment]: investmentSubtypeEnum.options,
};

type DetailsStepProps = {
    fields: ReturnType<typeof useForm<DetailsStepValues>>[1];
};

export function DetailsStep({ fields }: DetailsStepProps) {
    const subtypeControl = useInputControl(fields.subtype);
    const { state } = useCreateAccountStates();

    return (
        <>
            <input {...getInputProps(fields.type, { type: "hidden", value: false })} value={state.type || ""} />

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

            {state.type && subtypeOptions[state.type as keyof typeof subtypeOptions] ? (
                <Select
                    defaultValue={fields.subtype.initialValue}
                    error={fields.subtype.errors}
                    id={fields.subtype.id}
                    label="Subtype"
                    name={fields.subtype.name}
                    onValueChange={subtypeControl.change}
                    options={subtypeOptions[state.type as keyof typeof subtypeOptions].map((subtype) => ({
                        label: subtype,
                        value: subtype,
                    }))}
                    placeholder="Select a subtype"
                    position="item-aligned"
                    value={subtypeControl.value}
                />
            ) : null}
        </>
    );
}
