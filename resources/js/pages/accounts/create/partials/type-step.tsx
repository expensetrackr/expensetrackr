import { type useForm, useInputControl } from "@conform-to/react";
import * as Headless from "@headlessui/react";
import BoxesDuotone from "virtual:icons/lucide/package-search";
import ChartLineIcon from "virtual:icons/mdi/finance";
import BankDuotoneIcon from "virtual:icons/ph/bank-duotone";
import BankCardDuotoneIcon from "virtual:icons/ph/credit-card-duotone";
import HandCoinsDuotone from "virtual:icons/ph/hand-coins-duotone";
import ListSettings from "virtual:icons/ri/list-settings-fill";
import CryptoDuotone from "virtual:icons/tabler/currency-bitcoin";
import ReceiptDuotone from "virtual:icons/tabler/receipt-2";
import { z } from "zod";

import { Button } from "#/components/button.tsx";
import { ContentDivider } from "#/components/content-divider.tsx";
import { ErrorMessage, Field } from "#/components/form/fieldset.tsx";
import { accountTypeEnum } from "#/schemas/account.ts";
import { cx } from "#/utils/cva.ts";
import { Card } from "./card.tsx";
import { stepperInstance } from "./stepper.ts";

export const typeStepSchema = z.object({
    type: accountTypeEnum,
});

export type TypeStepValues = z.infer<typeof typeStepSchema>;

const accountTypes = {
    [accountTypeEnum.enum.depository]: {
        icon: BankDuotoneIcon,
        title: "Depository",
        description: "Checking, savings, or money market accounts",
        color: "bg-blue-50 text-blue-500 dark:bg-blue-400/20 dark:text-blue-400",
    },
    [accountTypeEnum.enum.investment]: {
        icon: ChartLineIcon,
        title: "Investment",
        description: "Stocks, bonds, mutual funds, and other investment accounts",
        color: "bg-teal-50 text-teal-500 dark:bg-teal-400/20 dark:text-teal-400",
    },
    [accountTypeEnum.enum.crypto]: {
        icon: CryptoDuotone,
        title: "Crypto",
        description: "Cryptocurrency and digital asset accounts",
        color: "bg-yellow-50 text-yellow-500 dark:bg-yellow-400/20 dark:text-yellow-400",
    },
    [accountTypeEnum.enum.credit_card]: {
        icon: BankCardDuotoneIcon,
        title: "Credit card",
        description: "Track credit card balances and payments",
        color: "bg-purple-50 text-purple-500 dark:bg-purple-400/20 dark:text-purple-400",
    },
    [accountTypeEnum.enum.loan]: {
        icon: HandCoinsDuotone,
        title: "Loan",
        description: "Personal, auto, student, or mortgage loans",
        color: "bg-sky-50 text-sky-500 dark:bg-sky-400/20 dark:text-sky-400",
    },
    [accountTypeEnum.enum.other_asset]: {
        icon: BoxesDuotone,
        title: "Other asset",
        description: "Vehicles, property, or other valuable assets",
        color: "bg-teal-50 text-teal-500 dark:bg-teal-400/20 dark:text-teal-400",
    },
    [accountTypeEnum.enum.other_liability]: {
        icon: ReceiptDuotone,
        title: "Other liability",
        description: "Any other debts or financial obligations",
        color: "bg-pink-50 text-pink-500 dark:bg-pink-400/20 dark:text-pink-400",
    },
};

export function TypeStep({ fields }: { fields: ReturnType<typeof useForm<TypeStepValues>>[1] }) {
    const stepper = stepperInstance.useStepper();
    const typeControl = useInputControl(fields.type);

    return (
        <Card
            description="Choose the type of account you want to add. You can add more accounts later."
            icon={ListSettings}
            title="Select your account type"
        >
            <ContentDivider className="px-0">supported account types</ContentDivider>

            <Field className="mb-4 flex flex-col gap-1">
                <Headless.RadioGroup
                    className="flex flex-col gap-2"
                    name={fields.type.name}
                    onBlur={typeControl.blur}
                    onChange={typeControl.change}
                    onFocus={typeControl.focus}
                    value={typeControl.value}
                >
                    {accountTypeEnum.options.map((option) => {
                        const Icon = accountTypes[option].icon;
                        return (
                            <Headless.Radio
                                $color="neutral"
                                $size="none"
                                $variant="stroke"
                                as={Button}
                                className="w-full items-center justify-start gap-3 rounded-10 border-transparent p-2 aria-checked:bg-(--bg-weak-50) data-focus:border-(--stroke-strong-950)"
                                key={option}
                                value={option}
                            >
                                <span
                                    className={cx(
                                        "inline-flex size-10 items-center justify-center rounded-full",
                                        accountTypes[option].color,
                                    )}
                                >
                                    <Icon className="!size-6" />
                                </span>

                                <span className="inline-flex flex-1 flex-col items-start justify-start gap-1">
                                    <span className="text-label-sm text-(--text-strong-950)">
                                        {accountTypes[option].title}
                                    </span>
                                    <span className="text-start text-paragraph-xs font-normal text-(--text-sub-600)">
                                        {accountTypes[option].description}
                                    </span>
                                </span>
                            </Headless.Radio>
                        );
                    })}
                </Headless.RadioGroup>
                {fields.type.errors && <ErrorMessage id={fields.type.errorId}>{fields.type.errors}</ErrorMessage>}
            </Field>

            <div className="flex items-center gap-3 border-t border-t-(--stroke-soft-200) pt-4">
                {!stepper.isLast && !stepper.isFirst && (
                    <Button
                        $color="neutral"
                        $size="sm"
                        $variant="stroke"
                        className="w-full"
                        disabled={stepper.isFirst}
                        onClick={stepper.prev}
                    >
                        Back
                    </Button>
                )}
                <Button $size="sm" className="w-full" type="submit">
                    Continue
                </Button>
            </div>
        </Card>
    );
}
