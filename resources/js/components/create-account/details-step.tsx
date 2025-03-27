import { getInputProps, getTextareaProps, useInputControl, type useForm } from "@conform-to/react";
import type * as v from "valibot";

import { useCreateAccountParams } from "#/hooks/use-create-account-params.ts";
import { SubtypeOptions } from "#/schemas/account.ts";
import { type DetailsSchema } from "#/utils/steppers/create-account.step.ts";
import { SelectField } from "../form/select-field.tsx";
import { TextField } from "../form/text-field.tsx";
import { Textarea } from "../form/textarea.tsx";
import * as Label from "../ui/label.tsx";

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
                error={fields.name.errors}
                label="Name"
                {...getInputProps(fields.name, { type: "text" })}
                placeholder="e.g. Personal savings"
            />

            <Textarea
                {...getTextareaProps(fields.description)}
                charCounterCurrent={fields.description.value?.length || 0}
                charCounterMax={200}
                error={fields.description.errors}
                hint={"This will only be visible to you."}
                label={
                    <>
                        Description <Label.Sub>(Optional)</Label.Sub>
                    </>
                }
                placeholder="e.g. Savings account for personal expenses"
            ></Textarea>

            {type && SubtypeOptions[type as keyof typeof SubtypeOptions] ? (
                <SelectField
                    defaultValue={fields.subtype.initialValue}
                    error={fields.subtype.errors}
                    id={fields.subtype.id}
                    label="Subtype"
                    name={fields.subtype.name}
                    onValueChange={subtypeControl.change}
                    options={SubtypeOptions[type as keyof typeof SubtypeOptions].map((subtype) => ({
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
