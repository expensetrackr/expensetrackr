import * as React from "react";

import * as Select from "./ui/select.tsx";

type CurrencySelectProps = React.CustomComponentPropsWithRef<typeof Select.Root> & {
    currencies: Array<string>;
};

export function CurrencySelect({ currencies, ...rest }: CurrencySelectProps) {
    const items = React.useMemo(() => currencies, [currencies]);

    return (
        <Select.Root $variant="compactForInput" defaultValue="USD" {...rest}>
            <Select.Trigger>
                <Select.Value>
                    <span className="flex flex-1 items-center gap-2">
                        <svg
                            aria-label={`${rest.value || "USD"} flag`}
                            className="size-5 rounded-full"
                            preserveAspectRatio="xMidYMid meet"
                            role="img"
                        >
                            <use href={`/img/flags.svg#${rest.value || "USD"}`} />
                        </svg>
                        <span>{rest.value || "USD"}</span>
                    </span>
                </Select.Value>
            </Select.Trigger>
            <Select.Content>
                {items.map((item) => (
                    <Select.Item key={item} value={item}>
                        <Select.ItemIcon
                            aria-label={`${item} flag`}
                            as="svg"
                            className="size-5 rounded-full"
                            preserveAspectRatio="xMidYMid meet"
                            role="img"
                        >
                            <use href={`/img/flags.svg#${item}`} />
                        </Select.ItemIcon>
                        {item}
                    </Select.Item>
                ))}
            </Select.Content>
        </Select.Root>
    );
}
