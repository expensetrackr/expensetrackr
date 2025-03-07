import { getInputProps, getTextareaProps, useInputControl, type useForm } from "@conform-to/react";
import type * as v from "valibot";

import { useCreateAccountParams } from "#/hooks/use-create-account-params.ts";
import { AccountTypeEnum, DepositorySubtypeEnum, InvestmentSubtypeEnum } from "#/schemas/account.ts";
import { type DetailsSchema } from "#/utils/steppers/create-account.steps.ts";
import { Select } from "../form/select.tsx";
import { TextField } from "../form/text-field.tsx";
import { Textarea } from "../form/textarea.tsx";
import * as Label from "../ui/label.tsx";

const subtypeOptions = {
    [AccountTypeEnum.enum.Depository]: DepositorySubtypeEnum.options,
    [AccountTypeEnum.enum.Investment]: InvestmentSubtypeEnum.options,
};

type DetailsStepProps = {
    fields: ReturnType<typeof useForm<v.InferOutput<typeof DetailsSchema>>>[1];
};

export function DetailsStep({ fields }: DetailsStepProps) {
    const { type } = useCreateAccountParams();
    const subtypeControl = useInputControl(fields.subtype);

    return (
        <>
            <input {...getInputProps(fields.type, { type: "hidden", value: false })} value={type || ""} />

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

            {type && subtypeOptions[type as keyof typeof subtypeOptions] ? (
                <Select
                    defaultValue={fields.subtype.initialValue}
                    error={fields.subtype.errors}
                    id={fields.subtype.id}
                    label="Subtype"
                    name={fields.subtype.name}
                    onValueChange={subtypeControl.change}
                    options={subtypeOptions[type as keyof typeof subtypeOptions].map((subtype) => ({
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
