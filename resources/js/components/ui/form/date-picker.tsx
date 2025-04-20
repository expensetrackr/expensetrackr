import { format } from "date-fns/format";
import * as Button from "../button.tsx";
import * as DatepickerPrimivites from "../datepicker.tsx";
import * as Popover from "../popover.tsx";
import { Field, type FieldProps } from "./field.tsx";

export type DatePickerProps = Omit<FieldProps, "children"> &
    DatepickerPrimivites.CalendarProps & {
        value?: string | null;
        placeholder?: string;
        formatStr?: string;
        children?: React.ReactNode;
    };

export function DatePicker({
    className,
    label,
    labelSub,
    labelClassName,
    id,
    error,
    hint,
    value,
    placeholder,
    formatStr = "LLL dd, y",
    children,
    ...props
}: DatePickerProps) {
    return (
        <Field error={error} hint={hint} id={id} label={label} labelClassName={labelClassName} labelSub={labelSub}>
            <Popover.Root>
                <Popover.Trigger asChild>
                    <Button.Root $style="stroke" $type="neutral" id={id}>
                        {value ? format(value, formatStr) : placeholder}
                    </Button.Root>
                </Popover.Trigger>

                <Popover.Content className="p-0" showArrow={false}>
                    <DatepickerPrimivites.Calendar {...props} />

                    {children}
                </Popover.Content>
            </Popover.Root>
        </Field>
    );
}
