import { type useForm, useInputControl } from "@conform-to/react";
import * as LabelPrimivites from "@radix-ui/react-label";
import BoxesDuotone from "virtual:icons/lucide/package-search";
import ChartLineIcon from "virtual:icons/mdi/finance";
import BankDuotoneIcon from "virtual:icons/ph/bank-duotone";
import BankCardDuotoneIcon from "virtual:icons/ph/credit-card-duotone";
import HandCoinsDuotone from "virtual:icons/ph/hand-coins-duotone";
import CryptoDuotone from "virtual:icons/tabler/currency-bitcoin";
import ReceiptDuotone from "virtual:icons/tabler/receipt-2";
import { type z } from "zod";

import { Field } from "#/components/field.tsx";
import * as Radio from "#/components/ui/radio.tsx";
import { accountTypeEnum } from "#/schemas/account.ts";
import { useCreateAccountWizardStore } from "#/store/create-account-wizard.ts";
import { cn } from "#/utils/cn.ts";
import { type typeStepSchema } from "./stepper.ts";

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
    const typeControl = useInputControl(fields.type);
    const { setType } = useCreateAccountWizardStore();

    function handleChange(value: z.infer<typeof accountTypeEnum>) {
        setType(value);
        typeControl.change(value);
    }

    return (
        <Field hiddenLabel id={fields.type.id} label="Account type">
            <Radio.Group
                className="flex flex-col gap-3"
                defaultValue={fields.type.initialValue}
                name={fields.type.name}
                onBlur={typeControl.blur}
                onFocus={typeControl.focus}
                onValueChange={handleChange}
            >
                {accountTypeEnum.options.map((option) => {
                    const Icon = accountTypes[option].icon;
                    return (
                        <LabelPrimivites.Root
                            className="flex cursor-pointer items-center gap-2 rounded-10 border border-(--stroke-soft-200) p-2 transition duration-200 ease-out has-focus-visible:border-primary has-focus-visible:ring has-focus-visible:shadow-button-primary-focus has-focus-visible:ring-primary has-aria-[checked=true]:border-primary has-aria-[checked=true]:bg-(--bg-weak-50) has-aria-[checked=true]:ring has-aria-[checked=true]:ring-primary"
                            htmlFor={option}
                            key={option}
                        >
                            <Radio.Item className="sr-only absolute size-px" id={option} value={option} />

                            <div className="flex items-center justify-start gap-3">
                                <span
                                    className={cn(
                                        "inline-flex size-10 items-center justify-center rounded-full",
                                        accountTypes[option].color,
                                    )}
                                >
                                    <Icon className="!size-6" />
                                </span>

                                <div>
                                    <div className="flex flex-1 items-center gap-1">
                                        <span className="text-paragraph-sm text-(--text-strong-950)">
                                            {accountTypes[option].title}
                                        </span>
                                    </div>
                                    <div className="mt-1 line-clamp-1 text-paragraph-xs text-(--text-sub-600)">
                                        {accountTypes[option].description}
                                    </div>
                                </div>
                            </div>
                        </LabelPrimivites.Root>
                    );
                })}
            </Radio.Group>
        </Field>
    );
}
