import { getFormProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { Head } from "@inertiajs/react";

import { SidebarLayout } from "#/components/sidebar-layout.tsx";
import { CreateAccountSidebar } from "#/layouts/partials/create-account-sidebar.tsx";
import { TypeStep, type TypeStepValues } from "#/pages/accounts/create/partials/type-step.tsx";
import { stepperInstance } from "./partials/stepper.ts";

export default function CreateAccountPage() {
    const stepper = stepperInstance.useStepper();
    const [form, fields] = useForm({
        id: "create-account",
        shouldValidate: "onBlur",
        shouldRevalidate: "onInput",
        constraint: getZodConstraint(stepper.current.schema),
        onValidate({ formData }) {
            return parseWithZod(formData, { schema: stepper.current.schema });
        },
        onSubmit(event, { submission }) {
            event.preventDefault();
            // biome-ignore lint/suspicious/noConsoleLog: <We want to log the form values>
            console.log(`Form values for step ${stepper.current.id}:`, submission);
            if (stepper.isLast) {
                stepper.reset();
            } else {
                stepper.next();
            }
        },
    });

    return (
        <SidebarLayout
            contentChildrenClassName="relative lg:shadow-none lg:ring-0"
            contentClassName="lg:pt-0 lg:pr-0"
            sidebar={<CreateAccountSidebar />}
            sidebarClassName="lg:pl-2 lg:py-2"
        >
            <Head title="Create account" />

            <svg
                className="absolute left-1/2 -translate-x-1/2 text-neutral-500"
                fill="none"
                height="456"
                viewBox="0 0 966 456"
                width="966"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M1.00004 0L1 456M69.8572 0L69.8571 456M138.714 0L138.714 456M207.571 0L207.571 456M276.429 0L276.429 456M345.286 0L345.286 456M414.143 0L414.143 456M483 0L483 456M551.857 0V456M620.714 0L620.714 456M689.571 0V456M758.428 0V456M827.286 0V456M896.143 0V456M965 0V456"
                    stroke="url(#paint0_linear_3974_25638)"
                    strokeOpacity="0.16"
                />
                <defs>
                    <linearGradient
                        gradientUnits="userSpaceOnUse"
                        id="paint0_linear_3974_25638"
                        x1="483"
                        x2="483"
                        y1="0"
                        y2="456"
                    >
                        <stop stopColor="currentColor" />
                        <stop offset="1" stopColor="currentColor" stopOpacity="0" />
                    </linearGradient>
                </defs>
            </svg>

            <form method="post" {...getFormProps(form)} className="relative py-12">
                {stepper.switch({
                    type: () => <TypeStep fields={fields as ReturnType<typeof useForm<TypeStepValues>>[1]} />,
                })}
            </form>
        </SidebarLayout>
    );
}
