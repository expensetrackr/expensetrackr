import { router, usePage } from "@inertiajs/react";
import GlobalIcon from "virtual:icons/ri/global-line";

import { type InertiaSharedProps } from "#/types/index.ts";
import * as Select from "./ui/select.tsx";

export function LanguageSelect(props: React.CustomComponentPropsWithRef<typeof Select.Root>) {
    const page = usePage<InertiaSharedProps>().props;

    const handleChange = (value: string) => {
        router.post(route("language.store"), { language: value });
    };

    return (
        <Select.Root $variant="inline" defaultValue={page.language} onValueChange={handleChange} {...props}>
            <Select.Trigger>
                <Select.TriggerIcon as={GlobalIcon} />
                <Select.Value placeholder="Select Language" />
            </Select.Trigger>
            <Select.Content>
                {page.languages.map((lang) => (
                    <Select.Item key={lang.code} value={lang.code}>
                        {lang.name}
                    </Select.Item>
                ))}
            </Select.Content>
        </Select.Root>
    );
}
