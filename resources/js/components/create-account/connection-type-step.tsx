import * as LabelPrimivites from "@radix-ui/react-label";
import type * as v from "valibot";
import KeyboardIcon from "virtual:icons/ri/keyboard-line";
import LinkIcon from "virtual:icons/ri/link";

import { useCreateAccountParams } from "#/hooks/use-create-account-params.ts";
import { useUser } from "#/hooks/use-user.ts";
import { ConnectionTypeEnum } from "#/schemas/account.ts";
import { cn } from "#/utils/cn.ts";
import * as Radio from "../ui/radio.tsx";

const connectionTypes = {
    [ConnectionTypeEnum.enum.Connect]: {
        icon: LinkIcon,
        title: "Connect your bank",
        description: "Connect your account using one of our supported providers",
        color: "bg-blue-50 text-blue-500 dark:bg-blue-400/20 dark:text-blue-400",
    },
    [ConnectionTypeEnum.enum.Manual]: {
        icon: KeyboardIcon,
        title: "Manual",
        description: "Manually add your account information",
        color: "bg-neutral-50 text-neutral-500 dark:bg-neutral-400/20 dark:text-neutral-400",
    },
};

export function ConnectionTypeStep() {
    const { type, connectionType, setParams } = useCreateAccountParams();
    const user = useUser();

    console.info(user);

    const handleChange = async (value: v.InferOutput<typeof ConnectionTypeEnum>) => {
        await setParams({ connectionType: value });
    };

    return (
        <Radio.Group
            className="flex flex-col gap-3"
            name="connection_type"
            onValueChange={handleChange}
            required
            value={connectionType ?? undefined}
        >
            {ConnectionTypeEnum.options
                .filter((option) =>
                    type !== "depository" && type !== "credit_card" ? option === ConnectionTypeEnum.enum.Manual : true,
                )
                .filter((option) => {
                    if (option === ConnectionTypeEnum.enum.Connect) {
                        return user.isSubscribed;
                    }
                    return true;
                })
                .map((option) => {
                    const Icon = connectionTypes[option].icon;
                    return (
                        <LabelPrimivites.Root
                            className="flex cursor-pointer items-center gap-2 rounded-10 border border-(--stroke-soft-200) p-2 transition duration-200 ease-out has-focus-visible:border-primary has-focus-visible:shadow-button-primary-focus has-focus-visible:ring has-focus-visible:ring-primary has-aria-[checked=true]:border-primary has-aria-[checked=true]:bg-(--bg-weak-50) has-aria-[checked=true]:ring has-aria-[checked=true]:ring-primary"
                            htmlFor={option}
                            key={option}
                        >
                            <Radio.Item className="sr-only absolute size-px" id={option} value={option} />

                            <div className="flex items-center justify-start gap-3">
                                <span
                                    className={cn(
                                        "inline-flex size-10 items-center justify-center rounded-full",
                                        connectionTypes[option].color,
                                    )}
                                >
                                    <Icon className="size-5" />
                                </span>

                                <div className="flex-1">
                                    <div className="flex items-center gap-1">
                                        <span className="text-paragraph-sm text-(--text-strong-950)">
                                            {connectionTypes[option].title}
                                        </span>
                                    </div>
                                    <div className="mt-1 line-clamp-1 text-paragraph-xs text-(--text-sub-600)">
                                        {connectionTypes[option].description}
                                    </div>
                                </div>
                            </div>
                        </LabelPrimivites.Root>
                    );
                })}
        </Radio.Group>
    );
}
